# frozen_string_literal: true

class AgentMapping < ApplicationRecord
  belongs_to :bot_template
  belongs_to :agent

  validates :organization_id, presence: true
  validates :user_id, presence: true
  validates :agent_id, presence: true, uniqueness: true

  scope :by_user, ->(user_id) { where(user_id:) }
end
