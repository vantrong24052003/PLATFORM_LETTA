# frozen_string_literal: true

class EnvValidator
  EXAMPLE_FILE = ".env.example".freeze

  def validate!
    required_keys = required_keys_list
    return if required_keys.empty?

    missing_keys = required_keys.reject { |key| env_present?(key) }
    return if missing_keys.empty?

    missing = missing_keys.join(", ")
    message = "Missing required environment variables: #{missing}"
    Rails.logger&.error(message)
    raise message
  end

  private

  def required_keys_list
    return production_keys if Rails.env.production?
    read_keys_from_example
  end

  def production_keys
    %w[
      SUPABASE_URL
      SUPABASE_KEY
      GEMINI_API_KEY
      RAILS_MAX_THREADS
      DB_HOST
      DB_PORT
      DB_USERNAME
      DB_PASSWORD
      DB_NAME_PROD
      DB_NAME_CACHE
      DB_NAME_QUEUE
      DB_NAME_CABLE
    ].freeze
  end

  def read_keys_from_example
    path = Rails.root.join(EXAMPLE_FILE)
    parse_env_keys(File.read(path))
  rescue Errno::ENOENT
    []
  end

  def env_present?(key)
    !ENV[key].nil? && !ENV[key].strip.empty?
  end

  def parse_env_keys(content)
    content.split("\n")
           .map(&:strip)
           .reject { |line| line.empty? || line.start_with?("#") }
           .filter_map { |line| line.match(/^([A-Z_][A-Z0-9_]*)=/)&.[](1) }
  end
end

Rails.application.config.after_initialize do
  EnvValidator.new.validate!
end
