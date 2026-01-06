/**
 * KGiTON SDK Auth Module
 * ======================
 * Methods for authentication (login, register, etc.)
 */

import { HttpClient } from '../core/httpClient';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types';

/**
 * Auth module for KGiTON SDK
 */
export class AuthModule {
  constructor(private httpClient: HttpClient) {}

  /**
   * Login with email and password
   * 
   * After successful login, the access token is automatically set for subsequent requests.
   * 
   * @param credentials - Login credentials
   * @returns Login response with access token and user info
   * 
   * @example
   * ```typescript
   * const { access_token, user } = await sdk.auth.login({
   *   email: 'user@example.com',
   *   password: 'password123'
   * });
   * console.log('Logged in as:', user.name);
   * // Access token is automatically set for subsequent requests
   * ```
   */
  public async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.httpClient.post<LoginResponse>('/api/auth/login', credentials);
    
    if (response.data?.access_token) {
      this.httpClient.setAccessToken(response.data.access_token);
    }
    
    return response.data!;
  }

  /**
   * Register a new user account
   * 
   * @param data - Registration data
   * @returns Registration response
   * 
   * @example
   * ```typescript
   * const result = await sdk.auth.register({
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   password: 'securePassword123',
   *   phone_number: '08123456789'
   * });
   * console.log('Registered:', result.user.email);
   * ```
   */
  public async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.httpClient.post<RegisterResponse>('/api/auth/register', data);
    return response.data!;
  }

  /**
   * Request password reset email
   * 
   * @param email - Email address
   * 
   * @example
   * ```typescript
   * await sdk.auth.forgotPassword('user@example.com');
   * console.log('Password reset email sent');
   * ```
   */
  public async forgotPassword(email: string): Promise<void> {
    await this.httpClient.post('/api/auth/forgot-password', { email });
  }

  /**
   * Logout (clear authentication)
   * 
   * Note: This only clears the local authentication state.
   * For server-side session invalidation, implement accordingly.
   */
  public logout(): void {
    this.httpClient.clearAuth();
  }

  /**
   * Set access token manually
   * 
   * Useful when you have a token from elsewhere (e.g., stored in session)
   * 
   * @param token - Access token
   */
  public setAccessToken(token: string): void {
    this.httpClient.setAccessToken(token);
  }

  /**
   * Set API key manually
   * 
   * @param apiKey - API key
   */
  public setApiKey(apiKey: string): void {
    this.httpClient.setApiKey(apiKey);
  }
}
