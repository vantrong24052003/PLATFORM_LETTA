# frozen_string_literal: true

class Letta::BotTemplates::Update < ApplicationService
  def call
    template = params[:bot_template]
    template.update(params.except(:bot_template))

    { success: true, data: template }
  rescue ActiveRecord::RecordInvalid => e
    { success: false, errors: template.errors }
  end
end
