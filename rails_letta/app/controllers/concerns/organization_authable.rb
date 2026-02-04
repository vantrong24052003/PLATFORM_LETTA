# frozen_string_literal: true

module OrganizationAuthable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_organization!
  end

  private

  def authenticate_organization!
    api_key = request.headers["X-Organization-Key"]

    if api_key.blank?
      render json: { error: "Unauthorized", data: "Missing X-Organization-Key header" }, status: :unauthorized
      return
    end

    @current_organization = Organization.find_by(secret_key: api_key)

    unless @current_organization
      render json: { error: "Unauthorized", data: "Invalid API key" }, status: :unauthorized
    end
  end

  def current_organization
    @current_organization
  end
end
