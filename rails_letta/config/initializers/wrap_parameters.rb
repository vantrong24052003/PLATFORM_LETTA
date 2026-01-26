# frozen_string_literal: true

# Disable parameter wrapping globally for API
ActiveSupport.on_load(:action_controller) do
  wrap_parameters format: []
end
