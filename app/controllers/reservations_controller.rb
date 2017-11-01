class ReservationsController < ApplicationController
  before_action :set_reservation, only: [:show, :edit, :update, :destroy]

  # GET /reservations/new
  def new
    @reservation = Reservation.new(email:"asdf")  
  end



  # POST /reservations
  # POST /reservations.json
  def create
    if !reservation_params["start_date"].empty?
      start_date = reservation_params["start_date"]
      params[:reservation][:start_date] =  Date.strptime(start_date, "%A, %B %d, %Y")      
    end
    reservation_params["delivery_start_time"].present? ? @delivery = true : @delivery = false
    @reservation = Reservation.new(reservation_params)
    respond_to do |format|
      if @reservation.valid?
        price = getTotal @reservation
        charge = stripeCharge @reservation.stripe, price
        if charge[0]   
          #save charge id from stripe
          @reservation.stripe = charge[1]
          @reservation.save
          format.js{render :renderConfirmation}
          #send conf email to user
          ReservationMailer.reservation_confirmation(@reservation).deliver
        else
          #set flash to errors
          flash.now[:error] = charge[1];
          #reload page
          format.js{render :renderFullForm}

        end

      else
        @errors = true;
        puts @reservation.errors.any?
        puts @reservation.errors.inspect
        format.js{render :renderFullForm}
      
      end
    end
  end



  # get all reserved dates from database
  def getReservedDates
    # reserved_dates = []
    # if(Reservation.count != 0 )
    #   reservations = Reservation.pluck(:start_date)
    #   reservations.each {|date|
    #     #mark days unavailable
    #     (date-3.days..date+3.days).each {|d| 
    #         reserved_dates.push(d.strftime("%d-%m-%Y")).uniq!
    #     }
    #   }
    # end    
    # if (Time.now.hour >= 17)
    #   today = Date.today
    #   reserved_dates.push(today.strftime("%d-%m-%Y")).uniq!
    # end
    # render json: reserved_dates
    render json: [(Date.today + 1.days).in_time_zone("Pacific Time (US & Canada)").to_i * 1000] # JS timestamp is in milliseconds, not seconds
  end

  def tos
    render "terms_of_service"
  end


  private


    # Never trust parameters from the scary internet, only allow the white list through.
    def reservation_params
      params.require(:reservation).permit(:email, :tos, :start_date, :ladder, :light, :stripe, :address, :instructions, :delivery_start_time, :phone)
    end

    def getTotal(reservation)
      #set base price (in cents)
      price = 2000
      #add ladder price (in cents)
      price += reservation.ladder ? 1000 : 0
      #add light price (in cents)
      price += reservation.light ? 1000 : 0
      #add delivery price (in cents)
      price += !reservation.delivery_start_time.nil? ? 800 : 0
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
