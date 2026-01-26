# frozen_string_literal: true

class ApplicationService
  attr_reader :params

  def initialize(params)
    @params = params
  end
end
