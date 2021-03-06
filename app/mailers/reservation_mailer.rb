class ReservationMailer < ApplicationMailer
  default from: "Drill Me Now <drillmenowsf@gmail.com>"

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.reservation_mailer.reservation_confirmation.subject
  #
  def reservation_confirmation(reservation)
    @reservation = reservation

    mail to: reservation.email, bcc: "drillmenowsf@gmail.com", subject: "Reservation Confirmation"
  end

end
