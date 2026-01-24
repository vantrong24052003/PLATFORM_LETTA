# frozen_string_literal: true

class BotTemplate < ApplicationRecord
  has_many :agent_mappings, dependent: :destroy

  validates :organization_id, presence: true
  validates :name, presence: true
  validates :system_prompt, presence: true
  validates :status, inclusion: { in: %w[active inactive] }

  scope :active, -> { where(status: "active") }
  scope :by_org, ->(org_id) { where(organization_id: org_id) }
end
