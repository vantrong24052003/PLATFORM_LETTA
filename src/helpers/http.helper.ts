import { HttpStatus } from '@/constants/http.constants.js';

const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

const HTTP_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
} as const;

const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
} as const;

const DEFAULT_TIMEOUT = 60000;

interface HttpRequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

class HttpClient {

  static async get(endpoint: string, options: HttpRequestOptions = {}): Promise<any> {
    return this.request(HTTP_METHODS.GET, endpoint, options);
  }

  static async post(endpoint: string, body?: any, options: HttpRequestOptions = {}): Promise<any> {
    return this.request(HTTP_METHODS.POST, endpoint, { ...options, body });
  }

  static async put(endpoint: string, body?: any, options: HttpRequestOptions = {}): Promise<any> {
    return this.request(HTTP_METHODS.PUT, endpoint, { ...options, body });
  }

  static async patch(endpoint: string, body?: any, options: HttpRequestOptions = {}): Promise<any> {
    return this.request(HTTP_METHODS.PATCH, endpoint, { ...options, body });
  }

  static async delete(endpoint: string, options: HttpRequestOptions = {}): Promise<any> {
    return this.request(HTTP_METHODS.DELETE, endpoint, options);
  }

  private static async request(method: string, endpoint: string, options: HttpRequestOptions & { body?: any } = {}): Promise<any> {
    const { headers = {}, timeout = DEFAULT_TIMEOUT, body } = options;

    const isFormData = body instanceof FormData;
    const requestHeaders: Record<string, string> = { ...headers };

    if (!isFormData && !requestHeaders[HTTP_HEADERS.CONTENT_TYPE]) {
      requestHeaders[HTTP_HEADERS.CONTENT_TYPE] = CONTENT_TYPES.JSON;
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout),
    };

    if (body) {
      requestOptions.body = isFormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(endpoint, requestOptions);

      if (!response.ok) {
        const errorBody = await this.parseResponse(response);
        console.error(`[HttpClient] ${method} ${endpoint} failed: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`Request failed: ${response.statusText}`);
      }

      if (method === HTTP_METHODS.DELETE && response.status === HttpStatus.NO_CONTENT) {
        return;
      }

      return await this.parseResponse(response);
    } catch (error) {
      console.error(`[HttpClient] ${method} ${endpoint} error:`, error);
      throw error;
    }
  }

  private static async parseResponse(response: Response): Promise<any> {
    const contentType = response.headers.get(HTTP_HEADERS.CONTENT_TYPE.toLowerCase());

    if (!contentType) {
      return null;
    }

    if (contentType.includes(CONTENT_TYPES.JSON)) {
      try {
        return await response.json();
      } catch (error) {
        console.error('[HttpClient] Failed to parse JSON response:', error);
        return await response.text();
      }
    }

    return await response.text();
  }
}

export default HttpClient;
