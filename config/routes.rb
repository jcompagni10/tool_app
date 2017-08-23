Rails.application.routes.draw do
  resources :reservations

  root 'reservations#new'
  get 'getReservedDates', to: 'reservations#getReservedDates'

end
