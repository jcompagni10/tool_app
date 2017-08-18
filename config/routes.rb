Rails.application.routes.draw do
  resources :reservations

  root 'reservations#new'
  get 'showResDate', to: 'reservations#showResDate'
  get 'hideResDate', to: 'reservations#hideResDate'

end
