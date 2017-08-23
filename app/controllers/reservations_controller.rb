class ReservationsController < ApplicationController
  before_action :set_reservation, only: [:show, :edit, :update, :destroy]


  # GET /reservations/new
  def new
    @reservedDates = get_reserved_dates
    #set to always availalable for testing 
    @availableToday = session[:availableToday]= true #!@reservedDates.include?(Date.today.strftime("%d-%m-%Y"))

    @reservation = Reservation.new    
  end






  # POST /reservations
  # POST /reservations.json
  def create
    #convert start_date back to ruby date

    start_date = reservation_params["start_date"]
    params[:reservation][:start_date] = Date.strptime(start_date, "%m/%d/%Y")
    
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
      reservations = Reservation.pluck(:start_date)
      reservations.each {|date|
        #mark days unavailable
        (date-2.days..date+2.days).each {|d| 
            reserved_dates.push(d.strftime("%d-%m-%Y")).uniq!
        }
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
