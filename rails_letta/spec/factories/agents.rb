# frozen_string_literal: true

FactoryBot.define do
  factory :agent do
    sequence(:name) { |n| "Agent #{n}" }
    sequence(:id) { |n| "agent_#{SecureRandom.uuid}" }
    system { "You are a helpful assistant" }
    organization
    is_deleted { false }
    message_buffer_autoclear { true }
    created_at { Time.current }
    updated_at { Time.current }
  end
end
