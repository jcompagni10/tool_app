Rails.application.routes.draw do
  resources :reservations

  root 'reservations#new'
end
