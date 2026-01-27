# frozen_string_literal: true

FactoryBot.define do
  factory :organization do
    sequence(:name) { |n| "Organization #{n}" }
    secret_key { "secret_#{SecureRandom.hex(12)}" }
    privileged_tools { false }
  end
end
