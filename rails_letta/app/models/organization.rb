# frozen_string_literal: true

class Organization < ApplicationRecord
  has_many :bot_templates
  has_many :agent_mappings
  has_many :agents

  validates :name, presence: true
  validates :secret_key, length: { minimum: 16 }, allow_blank: true
end
