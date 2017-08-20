class ReservationsController < ApplicationController
  before_action :set_reservation, only: [:show, :edit, :update, :destroy]

  # GET /reservations
  # GET /reservations.json
  def index
    @reservations = Reservation.all
  end

  # GET /reservations/1
  # GET /reservations/1.json
  def show
  end

  # GET /reservations/new
  def new
    @reservedDates = get_reserved_dates
    @reservedDates[Date.today.month] ||= []
    #set to always availalable for testing 
    @availableToday = session[:availableToday]= !@reservedDates[Date.today.month].include?(Date.today.day)

    @reservation = Reservation.new    
  end

  # GET /reservations/1/edit
  def edit
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
    @reservation = Reservation.new(reservation_params)
    @reserveLater = !reservation_params["start_date(1i)"].nil?
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

  # PATCH/PUT /reservations/1
  # PATCH/PUT /reservations/1.json
  def update
    respond_to do |format|
      if @reservation.update(reservation_params)
        format.html { redirect_to @reservation, notice: 'Reservation was successfully updated.' }
        format.json { render :show, status: :ok, location: @reservation }
      else
        format.html { render :edit }
        format.json { render json: @reservation.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /reservations/1
  # DELETE /reservations/1.json
  def destroy
    @reservation.destroy
    respond_to do |format|
      format.html { redirect_to reservations_url, notice: 'Reservation was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  # get all reserved dates from database
  def get_reserved_dates
    reserved_dates = {}
    if(Reservation.count != 0 )
      Reservation.pluck(:start_date).each {|date|
          (date..date + 2.days).each {|d| 
              reserved_dates[d.month] ||= []
              reserved_dates[d.month].push(d.day).uniq!
          }
      }
    end
    #reserve all prior days in month
    reserved_dates[Date.today.month] ||= []
    (reserved_dates[Date.today.month] += (1..Date.yesterday.day).to_a).uniq!
    reserved_dates
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_reservation
      @reservation = Reservation.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def reservation_params
      params.require(:reservation).permit(:email, :tos, :start_date, :ladder, :light, :stripe, :address, :instructions, :delivery_time)
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
