/**
 * KGiTON SDK - Main Entry Point
 * =============================
 * Official Node.js SDK for KGiTON Core API
 * 
 * @packageDocumentation
 */

import { HttpClient } from './core/httpClient';
import { AuthModule } from './modules/auth';
import { LicenseModule } from './modules/license';
import { UserModule } from './modules/user';
import { TopupModule } from './modules/topup';
import { PaymentModule } from './modules/payment';
import { KGiTONConfig } from './types';

/**
 * Main KGiTON SDK class
 * 
 * This is the primary entry point for interacting with the KGiTON API.
 * 
 * @example
 * ```typescript
 * // Initialize with API Key (recommended for backend-to-backend)
 * const kgiton = new KGiTON({
 *   baseUrl: 'https://api.kgiton.com',
 *   apiKey: 'kgiton_your_api_key_here'
 * });
 * 
 * // Use token from a license
 * const result = await kgiton.user.useToken('LICENSE-KEY');
 * console.log('Remaining tokens:', result.new_balance);
 * ```
 * 
 * @example
 * ```typescript
 * // Initialize with access token (for user sessions)
 * const kgiton = new KGiTON({
 *   baseUrl: 'https://api.kgiton.com',
 *   accessToken: 'user_jwt_token_here'
 * });
 * 
 * // Get user profile
 * const profile = await kgiton.user.getProfile();
 * ```
 */
export class KGiTON {
  private httpClient: HttpClient;
  
  /**
   * Authentication module
   * - Login, register, forgot password
   */
  public readonly auth: AuthModule;
  
  /**
   * License module
   * - Validate license keys
   * - Check token balance
   * - Get license details
   */
  public readonly license: LicenseModule;
  
  /**
   * User module
   * - Get profile
   * - Use tokens
   * - Manage license keys
   * - API key management
   */
  public readonly user: UserModule;
  
  /**
   * Top-up module
   * - Request token top-up
   * - Get payment methods
   * - Check transaction status
   * - Transaction history
   */
  public readonly topup: TopupModule;

  /**
   * Payment module (Partner Integration)
   * - Generate QRIS for partner transactions
   * - Check payment status
   */
  public readonly payment: PaymentModule;

  /**
   * Create a new KGiTON SDK instance
   * 
   * @param config - SDK configuration
   */
  constructor(config: KGiTONConfig) {
    this.httpClient = new HttpClient(config);
    
    // Initialize modules
    this.auth = new AuthModule(this.httpClient);
    this.license = new LicenseModule(this.httpClient);
    this.user = new UserModule(this.httpClient);
    this.topup = new TopupModule(this.httpClient);
    this.payment = new PaymentModule(this.httpClient);
  }

  /**
   * Update SDK configuration
   * 
   * @param config - Partial configuration to update
   */
  public updateConfig(config: Partial<KGiTONConfig>): void {
    this.httpClient.updateConfig(config);
  }

  /**
   * Set API key for authentication
   * 
   * @param apiKey - KGiTON API key
   */
  public setApiKey(apiKey: string): void {
    this.httpClient.setApiKey(apiKey);
  }

  /**
   * Set access token for authentication
   * 
   * @param accessToken - JWT access token
   */
  public setAccessToken(accessToken: string): void {
    this.httpClient.setAccessToken(accessToken);
  }

  /**
   * Clear all authentication
   */
  public clearAuth(): void {
    this.httpClient.clearAuth();
  }

  // ============================================
  // Convenience methods (shortcuts)
  // ============================================

  /**
   * Validate a license key (shortcut)
   * 
   * @param licenseKey - License key to validate
   */
  public async validateLicense(licenseKey: string) {
    return this.license.validate(licenseKey);
  }

  /**
   * Use 1 token from a license key (shortcut)
   * 
   * @param licenseKey - License key
   * @param options - Optional purpose and metadata
   */
  public async useToken(licenseKey: string, options?: { purpose?: string; metadata?: Record<string, unknown> }) {
    return this.user.useToken(licenseKey, options);
  }

  /**
   * Get token balance for a license (shortcut)
   * 
   * @param licenseKey - License key
   */
  public async getTokenBalance(licenseKey: string) {
    return this.license.getTokenBalance(licenseKey);
  }

  /**
   * Request top-up with checkout page (shortcut)
   * 
   * @param licenseKey - License key
   * @param tokenCount - Number of tokens
   */
  public async requestTopup(licenseKey: string, tokenCount: number) {
    return this.topup.requestCheckout(licenseKey, tokenCount);
  }
}

/**
 * Create a KGiTON SDK instance (factory function)
 * 
 * @param config - SDK configuration
 * @returns KGiTON SDK instance
 * 
 * @example
 * ```typescript
 * import { createKGiTON } from '@kgiton/sdk';
 * 
 * const sdk = createKGiTON({
 *   baseUrl: 'https://api.kgiton.com',
 *   apiKey: 'kgiton_xxx'
 * });
 * ```
 */
export function createKGiTON(config: KGiTONConfig): KGiTON {
  return new KGiTON(config);
}

// Export modules for advanced usage
export { HttpClient } from './core/httpClient';
export { AuthModule } from './modules/auth';
export { LicenseModule } from './modules/license';
export { UserModule } from './modules/user';
export { TopupModule } from './modules/topup';

// Export all types
export * from './types';

// Default export
export default KGiTON;
