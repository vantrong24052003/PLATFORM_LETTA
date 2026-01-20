class ApplicationController < ActionController::Base
  include Renderable

  allow_browser versions: :modern
  skip_before_action :verify_authenticity_token

  stale_when_importmap_changes
end
