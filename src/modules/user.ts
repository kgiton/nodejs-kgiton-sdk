/**
 * KGiTON SDK User Module
 * ======================
 * Methods for user management, profile, and token operations
 */

import { HttpClient } from '../core/httpClient';
import {
  UserProfile,
  TokenBalanceResponse,
  UseTokenRequest,
  UseTokenResponse,
  LicenseKey,
  TokenUsageStats,
  LicenseTokenUsageResponse,
} from '../types';

/**
 * User module for KGiTON SDK
 */
export class UserModule {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get current user's profile
   * 
   * @returns User profile with all license keys
   * 
   * @example
   * ```typescript
   * const profile = await sdk.user.getProfile();
   * console.log('User:', profile.name);
   * console.log('License keys:', profile.license_keys.length);
   * ```
   */
  public async getProfile(): Promise<UserProfile> {
    const response = await this.httpClient.get<UserProfile>('/api/user/profile');
    return response.data!;
  }

  /**
   * Get token balance across all license keys
   * 
   * @returns Token balance info for all licenses and total
   * 
   * @example
   * ```typescript
   * const balance = await sdk.user.getTokenBalance();
   * console.log('Total tokens:', balance.total_balance);
   * balance.license_keys.forEach(lk => {
   *   console.log(`${lk.license_key}: ${lk.token_balance} tokens`);
   * });
   * ```
   */
  public async getTokenBalance(): Promise<TokenBalanceResponse> {
    const response = await this.httpClient.get<TokenBalanceResponse>('/api/user/token-balance');
    return response.data!;
  }

  /**
   * Get token usage statistics
   * 
   * @returns Weekly usage data, average daily usage, and estimated days remaining
   * 
   * @example
   * ```typescript
   * const stats = await sdk.user.getTokenUsageStats();
   * console.log('Avg daily:', stats.avg_daily_usage);
   * console.log('Days remaining:', stats.est_days_remaining);
   * ```
   */
  public async getTokenUsageStats(): Promise<TokenUsageStats> {
    const response = await this.httpClient.get<TokenUsageStats>('/api/user/token-usage-stats');
    return response.data!;
  }

  /**
   * Get per-license token usage details with history
   * 
   * @param licenseKey - The license key to get usage for
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20)
   * @returns License usage data with paginated history
   * 
   * @example
   * ```typescript
   * const usage = await sdk.user.getLicenseTokenUsage('ABC-123');
   * console.log('Weekly usage:', usage.data.weekly_usage);
   * usage.data.usage_history.forEach(record => {
   *   console.log(`${record.purpose}: -${record.tokens_used}`);
   * });
   * ```
   */
  public async getLicenseTokenUsage(
    licenseKey: string,
    page: number = 1,
    limit: number = 20
  ): Promise<LicenseTokenUsageResponse> {
    const response = await this.httpClient.get<LicenseTokenUsageResponse>(
      `/api/user/license/${encodeURIComponent(licenseKey)}/usage?page=${page}&limit=${limit}`
    );
    return response.data!;
  }

  /**
   * Use 1 token from a license key
   * 
   * This is the main method for consuming tokens for API usage.
   * Each call automatically deducts 1 token.
   * 
   * @param licenseKey - The license key to use token from
   * @param options - Optional purpose and metadata
   * @returns Token usage result with new balance
   * 
   * @example
   * ```typescript
   * // Simple usage
   * const result = await sdk.user.useToken('ABCDE-12345-FGHIJ-67890-KLMNO');
   * console.log('Remaining balance:', result.new_balance);
   * 
   * // With tracking metadata
   * const result = await sdk.user.useToken('ABCDE-12345', {
   *   purpose: 'Weight measurement',
   *   metadata: { productId: '123', weight: 2.5 }
   * });
   * ```
   */
  public async useToken(licenseKey: string, options?: UseTokenRequest): Promise<UseTokenResponse> {
    const response = await this.httpClient.post<UseTokenResponse>(
      `/api/user/license-keys/${encodeURIComponent(licenseKey)}/use-token`,
      options || {}
    );
    return response.data!;
  }

  /**
   * Assign a new license key to the current user
   * 
   * @param licenseKey - The license key to assign
   * @returns The assigned license key details
   * 
   * @example
   * ```typescript
   * const license = await sdk.user.assignLicense('NEW-LICENSE-KEY');
   * console.log('Assigned:', license.key);
   * ```
   */
  public async assignLicense(licenseKey: string): Promise<LicenseKey> {
    const response = await this.httpClient.post<LicenseKey>('/api/user/assign-license', {
      license_key: licenseKey,
    });
    return response.data!;
  }

  /**
   * Regenerate API key for the current user
   * 
   * WARNING: This invalidates the current API key immediately.
   * 
   * @returns New API key (save this, it won't be shown again in full)
   * 
   * @example
   * ```typescript
   * const { api_key } = await sdk.user.regenerateApiKey();
   * console.log('New API key:', api_key);
   * // Update your configuration with the new key
   * sdk.setApiKey(api_key);
   * ```
   */
  public async regenerateApiKey(): Promise<{ api_key: string; created_at: string }> {
    const response = await this.httpClient.post<{ api_key: string; created_at: string }>(
      '/api/user/regenerate-api-key'
    );
    return response.data!;
  }

  /**
   * Revoke current API key
   * 
   * After revoking, you must regenerate a new API key to use API key authentication.
   * 
   * @example
   * ```typescript
   * await sdk.user.revokeApiKey();
   * console.log('API key revoked');
   * ```
   */
  public async revokeApiKey(): Promise<void> {
    await this.httpClient.post('/api/user/revoke-api-key');
  }

  /**
   * Get total token balance (convenience method)
   * 
   * @returns Total token balance across all license keys
   */
  public async getTotalTokenBalance(): Promise<number> {
    const balance = await this.getTokenBalance();
    return balance.total_balance;
  }

  /**
   * Get all license keys for current user
   * 
   * @returns Array of license keys
   */
  public async getLicenseKeys(): Promise<LicenseKey[]> {
    const profile = await this.getProfile();
    return profile.license_keys;
  }

  /**
   * Check if user has any active license
   * 
   * @returns Boolean indicating if user has at least one active license
   */
  public async hasActiveLicense(): Promise<boolean> {
    const licenses = await this.getLicenseKeys();
    return licenses.some(lk => lk.status === 'active');
  }

  /**
   * Get the first available license key with sufficient tokens
   * 
   * @param requiredTokens - Number of tokens required (default: 1)
   * @returns License key string or null if none available
   */
  public async getAvailableLicenseKey(requiredTokens: number = 1): Promise<string | null> {
    const licenses = await this.getLicenseKeys();
    const available = licenses.find(
      lk => lk.status === 'active' && lk.token_balance >= requiredTokens
    );
    return available?.key || null;
  }
}
