# frozen_string_literal: true

if Rails.env.production? || Rails.env.staging?
  Dotenv::Rails.load = false
end
