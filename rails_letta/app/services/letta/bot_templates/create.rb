# frozen_string_literal: true

class Letta::BotTemplates::Create < ApplicationService
  def call
    template = BotTemplate.new(params)
    if template.save
      { success: true, data: template }
    else
      { success: false, errors: template.errors }
    end
  end
end
