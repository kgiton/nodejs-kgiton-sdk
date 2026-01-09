/**
 * KGiTON SDK License Module
 * =========================
 * Methods for license key validation and management
 */

import { HttpClient } from '../core/httpClient';
import {
  LicenseKey,
  LicenseValidation,
  LicenseOwnershipValidation,
} from '../types';

/**
 * License module for KGiTON SDK
 */
export class LicenseModule {
  constructor(private httpClient: HttpClient) {}

  /**
   * Validate a license key
   * 
   * @param licenseKey - The license key to validate
   * @returns License validation result
   * 
   * @example
   * ```typescript
   * const result = await sdk.license.validate('ABCDE-12345-FGHIJ-67890-KLMNO');
   * if (result.valid) {
   *   console.log('License is valid!');
   *   console.log('Token balance:', result.token_balance);
   * }
   * ```
   */
  public async validate(licenseKey: string): Promise<LicenseValidation> {
    const response = await this.httpClient.get<LicenseValidation>(
      `/api/license/validate/${encodeURIComponent(licenseKey)}`
    );
    return response.data!;
  }

  /**
   * Get license key details by key string
   * 
   * @param licenseKey - The license key
   * @returns Full license key details
   * 
   * @example
   * ```typescript
   * const license = await sdk.license.getByKey('ABCDE-12345-FGHIJ-67890-KLMNO');
   * console.log('Device:', license.device_name);
   * console.log('Balance:', license.token_balance);
   * ```
   */
  public async getByKey(licenseKey: string): Promise<LicenseKey> {
    const response = await this.httpClient.get<LicenseKey>(
      `/api/license/key/${encodeURIComponent(licenseKey)}`
    );
    return response.data!;
  }

  /**
   * Get license key details by ID
   * 
   * @param licenseId - The license UUID
   * @returns Full license key details
   */
  public async getById(licenseId: string): Promise<LicenseKey> {
    const response = await this.httpClient.get<LicenseKey>(
      `/api/admin/license-keys/${encodeURIComponent(licenseId)}`
    );
    return response.data!;
  }

  /**
   * Check if license has sufficient tokens
   * 
   * @param licenseKey - The license key
   * @param requiredTokens - Number of tokens required (default: 1)
   * @returns Boolean indicating if sufficient tokens are available
   * 
   * @example
   * ```typescript
   * if (await sdk.license.hasSufficientTokens('ABCDE-12345', 5)) {
   *   // Proceed with operation
   * } else {
   *   console.log('Please top up your tokens');
   * }
   * ```
   */
  public async hasSufficientTokens(licenseKey: string, requiredTokens: number = 1): Promise<boolean> {
    try {
      const validation = await this.validate(licenseKey);
      return validation.is_valid && validation.token_balance >= requiredTokens;
    } catch {
      return false;
    }
  }

  /**
   * Check if license is active
   * 
   * @param licenseKey - The license key
   * @returns Boolean indicating if license is active
   */
  public async isActive(licenseKey: string): Promise<boolean> {
    try {
      const validation = await this.validate(licenseKey);
      return validation.is_valid && validation.status === 'active';
    } catch {
      return false;
    }
  }

  /**
   * Validate license ownership (ONE METHOD TO RULE THEM ALL)
   * 
   * Validates license AND checks if it's owned by the current API key user.
   * Perfect for partner systems (e.g., HUBA) that need to verify license ownership.
   * 
   * This method makes a SINGLE API call to /api/license/validate-ownership/:license_key
   * which is much more efficient than the old approach of making 2 separate calls.
   * 
   * @param licenseKey - The license key to validate
   * @param throwOnNotOwner - If true, throws error when user doesn't own the license (default: false)
   * @returns License ownership validation data
   * @throws Error if license doesn't exist, not assigned, or not owned (when throwOnNotOwner=true)
   * 
   * @example
   * ```typescript
   * // Simple check
   * const result = await sdk.license.validateOwnership('ABCDE-12345');
   * if (result.is_owner) {
   *   console.log('You own this license!');
   * } else {
   *   console.log('This license belongs to someone else');
   * }
   * 
   * // Throw error if not owner (useful for registration flows)
   * try {
   *   const result = await sdk.license.validateOwnership('ABCDE-12345', true);
   *   // If we reach here, license is owned by current user
   *   console.log('License validated and owned!');
   * } catch (error) {
   *   console.error('License validation failed:', error.message);
   * }
   * ```
   */
  public async validateOwnership(
    licenseKey: string,
    throwOnNotOwner: boolean = false
  ): Promise<LicenseOwnershipValidation> {
    // Single API call to validate ownership
    const response = await this.httpClient.get<LicenseOwnershipValidation>(
      `/api/license/validate-ownership/${encodeURIComponent(licenseKey)}`
    );

    const result = response.data!;

    // Handle not found case
    if (!result.exists) {
      if (throwOnNotOwner) {
        throw new Error('License key not found');
      }
      return result;
    }

    // Handle not assigned case
    if (!result.is_assigned) {
      if (throwOnNotOwner) {
        throw new Error('License key is not assigned to any user');
      }
      return result;
    }

    // Handle not owner case
    if (!result.is_owner) {
      if (throwOnNotOwner) {
        throw new Error(
          `License key is not assigned to you. It belongs to another user. ` +
          `(Your ID: ${result.owner_user_id}, Assigned to: ${result.assigned_to_user_id})`
        );
      }
      return result;
    }

    return result;
  }

  /**
   * Check if license is in trial mode
   * 
   * @param licenseKey - The license key
   * @returns Trial status and expiry info
   */
  public async getTrialInfo(licenseKey: string): Promise<{ isTrial: boolean; expiresAt?: string }> {
    try {
      const validation = await this.validate(licenseKey);
      return {
        isTrial: validation.status === 'trial',
        expiresAt: validation.trial_expires_at,
      };
    } catch {
      return { isTrial: false };
    }
  }

  /**
   * Get token balance for a license key
   * 
   * @param licenseKey - The license key
   * @returns Token balance and price per token
   */
  public async getTokenBalance(licenseKey: string): Promise<{ balance: number; pricePerToken: number }> {
    const validation = await this.validate(licenseKey);
    return {
      balance: validation.token_balance,
      pricePerToken: validation.price_per_token,
    };
  }
}
