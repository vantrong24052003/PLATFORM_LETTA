# frozen_string_literal: true

module Renderable
  extend ActiveSupport::Concern

  included do
    rescue_from StandardError, with: :handle_standard_error
    rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
    rescue_from ActionController::ParameterMissing, with: :handle_bad_request
  end

  def render_success(response: nil, status: :ok)
    render json: { data: response }, status:
  end

  def render_error(error: nil, response: nil, status: :internal_server_error)
    # Debug log
    Rails.logger.error("[Renderable] Error: #{error}, Status: #{status}")

    if response.present?
      render json: { error:, data: response }, status:
    else
      render json: { error: }, status:
    end
  end

  private

  def handle_not_found(e)
    render_error(error: e.message, status: :not_found)
  end

  def handle_bad_request(e)
    render_error(error: e.message, status: :bad_request)
  end

  def handle_standard_error(e)
    render_error(error: e.message)
  end
end
