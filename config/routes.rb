Rails.application.routes.draw do
  resources :reservations

  root 'reservations#new'
  get 'getReservedDates', to: 'reservations#getReservedDates'
  get 'terms_of_service', to: 'reservations#tos'

end
