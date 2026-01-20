class ApplicationController < ActionController::Base
  include Renderable

  allow_browser versions: :modern

  stale_when_importmap_changes
end
