# frozen_string_literal: true

Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :letta do
    resources :agents, only: %i[index create]
    resources :messages, only: [ :create ]
    resources :streaming_messages, only: [ :create ]
    resources :bot_templates, only: %i[index show create update destroy]
  end
end
