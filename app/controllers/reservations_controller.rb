class ReservationsController < ApplicationController
  before_action :set_reservation, only: [:show, :edit, :update, :destroy]


  # GET /reservations/new
  def new
    @reservedDates = get_reserved_dates
    #set to always availalable for testing 
    @availableToday = session[:availableToday]= !@reservedDates.include?(Date.today.strftime("%d-%m-%Y"))

    @reservation = Reservation.new    
  end


  #show day-of rental form
  def hideResDate
    @availableToday = session[:availableToday]
    @reservation = Reservation.new
    @reserveLater = false;
    respond_to do |format|
      format.js { render :renderForm }
    end
  end

  #show form for reserve ahead
  def showResDate
    @availableToday = session[:availableToday]
    @reservation = Reservation.new
    @reserveLater = true;
    respond_to do |format|
      format.js { render :renderForm }
    end
  end

  # POST /reservations
  # POST /reservations.json
  def create
    #convert start_date back to ruby date
    if !!reservation_params["reserve_ahead"]
      if !reservation_params["start_date"].empty?
        start_date = reservation_params["start_date"]
        params[:reservation][:start_date] = Date.strptime(start_date, "%m/%d/%Y")
      end
      #set start date to today if not reserving ahead
    else 
      params[:reservation][:start_date] = Date.today
    end

    
    @reservation = Reservation.new(reservation_params)
    @reserveLater = !reservation_params["start_date"].nil?
    respond_to do |format|
      if @reservation.valid?
        price = getTotal @reservation
        charge = stripeCharge @reservation.stripe, price
        if charge[0]   
          #save charge id from stripe
          @reservation.stripe = charge[1]
          @reservation.save
          flash.now[:success] = "Reservation succesful, a confirmation email has been sent to #{@reservation.email}."
          format.js{render :renderForm}
          #send conf email to user
          ReservationMailer.reservation_confirmation(@reservation).deliver
          #send reminder email to drillmenowsf@gmail.com  
          ReservationMailer.reservation_reminder(@reservation).deliver
        else
          #set flash to errors
          flash.now[:error] = charge[1];
          #reload page
          format.js{render :renderForm}

        end

      else
        format.js{render :renderErrors}
      
      end
    end
  end



  # get all reserved dates from database
  def get_reserved_dates
    reserved_dates = []
    if(Reservation.count != 0 )
      reservations = Reservation.pluck(:start_date).sort
      reservations.each_cons (2) {|date, nextDate|
        #check if there is sufficient time between reservations 
        if nextDate - date < 6
           unavailableTil = nextDate - 1.day
        else 
          unavailableTil = date + 2.day
        end
        #mark days unavailable
        (date-2.days..unavailableTil).each {|d| 
            reserved_dates.push(d.strftime("%d-%m-%Y"))
        }
      }


      #handle last reservation
      (reservations.last..reservations.last+2.days).each {|d| 
        reserved_dates.push(d.strftime("%d-%m-%Y"))
      }
      

    end
    reserved_dates
  end




  private
    # Use callbacks to share common setup or constraints between actions.
    def set_reservation
      @reservation = Reservation.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def reservation_params
      params.require(:reservation).permit(:email, :tos, :reserve_ahead, :start_date, :ladder, :light, :stripe, :address, :instructions, :delivery_time)
    end

    def getTotal(reservation)
      #set base price (in cents)
      price = 2000
      #add ladder price (in cents)
      price += reservation.ladder ? 1000 : 0
      #add light price (in cents)
      price += reservation.light ? 1000 : 0
      #add delivery price (in cents)
      price += !reservation.delivery_time.nil? ? 1500 : 0
    end

    def stripeCharge(token, amt)                
      response = [];
      begin 
      resp = Stripe::Charge.create(
          :amount => amt,
          :currency => "usd",
          :source => token, 
          :description => "Drill Me Now Rental"
      )

      #catch card errors
      rescue Stripe::CardError => e
        return [false, e.json_body[:error][:message]] 
      #catch stripe errors
      rescue Stripe::StripeError => e
        return [false, e.json_body[:error][:message]]
      end 

      #success
      return [true, resp.id]
    end
end
