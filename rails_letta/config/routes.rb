Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :letta do
    resources :agents, only: [ :create ]
    resources :messages, only: [ :create ]
    resources :streaming_messages, only: [ :create ]
  end
end
