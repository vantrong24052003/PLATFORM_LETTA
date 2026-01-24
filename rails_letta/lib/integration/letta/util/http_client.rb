# frozen_string_literal: true

module Integration::Letta::Util
  class HttpClient
    DEFAULT_OPEN_TIMEOUT = 60
    DEFAULT_READ_TIMEOUT = 120

    class << self
      def get(path:, params: nil, headers: {}, open_timeout: DEFAULT_OPEN_TIMEOUT, read_timeout: DEFAULT_READ_TIMEOUT)
        request = build_request(Net::HTTP::Get, build_endpoint(path), params:, headers:)
        send_request(request, open_timeout:, read_timeout:)
      end

      def post(path:, body: nil, params: nil, headers: {}, open_timeout: DEFAULT_OPEN_TIMEOUT, read_timeout: DEFAULT_READ_TIMEOUT)
        request = build_request(Net::HTTP::Post, build_endpoint(path), params:, headers:)
        request.body = format_body(body, headers) if body.present?
        send_request(request, open_timeout:, read_timeout:)
      end

      def put(path:, body: nil, params: nil, headers: {}, open_timeout: DEFAULT_OPEN_TIMEOUT, read_timeout: DEFAULT_READ_TIMEOUT)
        request = build_request(Net::HTTP::Put, build_endpoint(path), params:, headers:)
        request.body = format_body(body, headers) if body.present?
        send_request(request, open_timeout:, read_timeout:)
      end

      def patch(path:, body: nil, params: nil, headers: {}, open_timeout: DEFAULT_OPEN_TIMEOUT, read_timeout: DEFAULT_READ_TIMEOUT)
        request = build_request(Net::HTTP::Patch, build_endpoint(path), params:, headers:)
        request.body = format_body(body, headers) if body.present?
        send_request(request, open_timeout:, read_timeout:)
      end

      def delete(path:, params: nil, headers: {}, open_timeout: DEFAULT_OPEN_TIMEOUT, read_timeout: DEFAULT_READ_TIMEOUT)
        request = build_request(Net::HTTP::Delete, build_endpoint(path), params:, headers:)
        send_request(request, open_timeout:, read_timeout:)
      end

      def post_stream(path:, body: nil, params: nil, headers: {}, open_timeout: DEFAULT_OPEN_TIMEOUT, read_timeout: DEFAULT_READ_TIMEOUT, &block)
        request = build_request(Net::HTTP::Post, build_endpoint(path), params:, headers:)
        request.body = format_body(body, headers) if body.present?
        send_streaming_request(request, open_timeout:, read_timeout:, &block)
      end

      private

      def build_endpoint(path)
        "#{ENV['LETTA_BASE_URL']}#{path}"
      end

      def build_request(request_class, endpoint, params:, headers:)
        uri = build_uri(endpoint, params)
        request = request_class.new(uri)

        set_headers(request, headers)
        request
      end

      def build_uri(endpoint, params)
        uri = URI.parse(endpoint.to_s)
        uri.query = URI.encode_www_form(params) if params.present?
        uri
      end

      def set_headers(request, custom_headers)
        custom_headers.each { |name, value| request[name] = value } if custom_headers.present?
      end

      def format_body(body, headers)
        return body if body.is_a?(String)

        content_type = headers["Content-Type"]
        case content_type
        when /x-www-form-urlencoded/
          URI.encode_www_form(body)
        else
          JSON.generate(body)
        end
      end

      def send_request(request, open_timeout:, read_timeout:)
        http = Net::HTTP.new(request.uri.host, request.uri.port)
        http.use_ssl      = request.uri.scheme == "https"
        http.open_timeout = open_timeout
        http.read_timeout = read_timeout

        response = http.request(request)
        response.value

        parse_response(response)
      rescue Net::HTTPError,
             Net::HTTPRetriableError,
             Net::HTTPClientException,
             Net::HTTPFatalError => e
        handle_http_error(e)
      rescue JSON::ParserError
        response.body
      end

      def parse_response(response)
        return nil if response.body.blank?

        content_type = response.content_type
        case content_type
        when /json/
          JSON.parse(response.body)
        else
          response.body
        end
      end

      def handle_http_error(exception)
        response_body = begin
          exception.response&.body
        rescue StandardError
          "[Stream Body Unavailable]"
        end

        Rails.logger.error("[HttpClient] #{exception.class} #{exception.message} response_body=#{response_body}")
        raise exception
      end

      def send_streaming_request(request, open_timeout:, read_timeout:, &block)
        http = Net::HTTP.new(request.uri.host, request.uri.port)
        http.use_ssl      = request.uri.scheme == "https"
        http.open_timeout = open_timeout
        http.read_timeout = read_timeout

        http.request(request) do |response|
          response.value
          response.read_body do |chunk|
            block.call(chunk) if block_given?
          end
        end
      rescue Net::HTTPError,
             Net::HTTPRetriableError,
             Net::HTTPClientException,
             Net::HTTPFatalError => e
        handle_http_error(e)
      end
    end
  end
end
