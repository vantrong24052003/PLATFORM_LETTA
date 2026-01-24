# frozen_string_literal: true

class Agent < ApplicationRecord
  has_many :agent_mappings

  attribute :name, :string
  attribute :system, :string
  attribute :llm_config
  attribute :embedding_config
  attribute :memory_blocks, default: -> { [] }
  attribute :tools, default: -> { [] }
  attribute :tool_rules, default: -> { [] }
  attribute :include_base_tool_rules, :boolean, default: false

  validates :name, presence: true
end
