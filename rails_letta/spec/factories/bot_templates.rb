# frozen_string_literal: true

FactoryBot.define do
  factory :bot_template do
    sequence(:name) { |n| "Bot Template #{n}" }
    system_prompt { "You are a helpful assistant" }
    status { "active" }
    organization
    tools { [] }
    theme_config { {} }
    source_ids { [] }
  end
end
