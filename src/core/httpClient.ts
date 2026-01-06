/**
 * KGiTON SDK HTTP Client
 * ======================
 * Axios-based HTTP client with authentication, error handling, and retry logic
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import {
  KGiTONConfig,
  ApiResponse,
  KGiTONError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  NetworkError,
} from '../types';

// Default configuration
const DEFAULT_CONFIG: Partial<KGiTONConfig> = {
  baseUrl: 'https://api.kgiton.com',
  timeout: 30000,
  debug: false,
  retryAttempts: 3,
  retryDelay: 1000,
};

/**
 * HTTP Client for KGiTON API
 */
export class HttpClient {
  private client: AxiosInstance;
  private config: KGiTONConfig;
  private debug: boolean;

  constructor(config: KGiTONConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config } as KGiTONConfig;
    this.debug = this.config.debug ?? false;

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...this.config.headers,
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add authentication headers
        if (this.config.apiKey) {
          config.headers['x-api-key'] = this.config.apiKey;
        } else if (this.config.accessToken) {
          config.headers['Authorization'] = `Bearer ${this.config.accessToken}`;
        }

        if (this.debug) {
          console.log(`[KGiTON SDK] ${config.method?.toUpperCase()} ${config.url}`);
          if (config.data) {
            console.log('[KGiTON SDK] Request body:', JSON.stringify(config.data, null, 2));
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        if (this.debug) {
          console.log(`[KGiTON SDK] Response ${response.status}:`, JSON.stringify(response.data, null, 2));
        }
        return response;
      },
      (error: AxiosError<ApiResponse>) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Convert Axios errors to KGiTON SDK errors
   */
  private handleError(error: AxiosError<ApiResponse>): KGiTONError {
    if (!error.response) {
      // Network error
      return new NetworkError(error.message || 'Network request failed');
    }

    const { status, data } = error.response;
    const message = data?.error || data?.message || 'An error occurred';

    switch (status) {
      case 400:
        return new ValidationError(message, data);
      case 401:
        return new AuthenticationError(message);
      case 403:
        return new AuthorizationError(message);
      case 404:
        return new NotFoundError(message);
      case 429:
        return new RateLimitError(message);
      default:
        return new KGiTONError(message, 'API_ERROR', status, data);
    }
  }

  /**
   * Execute request with retry logic
   */
  private async executeWithRetry<T>(
    requestFn: () => Promise<T>,
    attempts: number = this.config.retryAttempts ?? 3
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < attempts; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx except 429)
        if (error instanceof KGiTONError) {
          if (error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429) {
            throw error;
          }
        }

        // Wait before retry
        if (i < attempts - 1) {
          const delay = (this.config.retryDelay ?? 1000) * Math.pow(2, i);
          if (this.debug) {
            console.log(`[KGiTON SDK] Retry attempt ${i + 1}/${attempts} after ${delay}ms`);
          }
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Update configuration (useful for setting access token after login)
   */
  public updateConfig(newConfig: Partial<KGiTONConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Set API Key
   */
  public setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }

  /**
   * Set Access Token
   */
  public setAccessToken(accessToken: string): void {
    this.config.accessToken = accessToken;
  }

  /**
   * Clear authentication
   */
  public clearAuth(): void {
    this.config.apiKey = undefined;
    this.config.accessToken = undefined;
  }

  /**
   * GET request
   */
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.executeWithRetry(async () => {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data;
    });
  }

  /**
   * POST request
   */
  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.executeWithRetry(async () => {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data;
    });
  }

  /**
   * PUT request
   */
  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.executeWithRetry(async () => {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data;
    });
  }

  /**
   * PATCH request
   */
  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.executeWithRetry(async () => {
      const response = await this.client.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    });
  }

  /**
   * DELETE request
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.executeWithRetry(async () => {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data;
    });
  }
}
