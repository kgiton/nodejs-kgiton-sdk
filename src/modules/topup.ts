/**
 * KGiTON SDK Topup Module
 * =======================
 * Methods for token top-up, payment methods, and transaction history
 */

import { HttpClient } from '../core/httpClient';
import {
  TopupRequest,
  TopupResponse,
  PaymentMethodInfo,
  Transaction,
  TransactionStatusResponse,
  PaymentMethod,
} from '../types';

/**
 * Topup module for KGiTON SDK
 */
export class TopupModule {
  constructor(private httpClient: HttpClient) {}

  /**
   * Get available payment methods
   * 
   * @returns List of available payment methods
   * 
   * @example
   * ```typescript
   * const methods = await sdk.topup.getPaymentMethods();
   * methods.forEach(m => {
   *   console.log(`${m.name}: ${m.type}`);
   * });
   * ```
   */
  public async getPaymentMethods(): Promise<PaymentMethodInfo[]> {
    const response = await this.httpClient.get<PaymentMethodInfo[]>('/api/topup/payment-methods');
    return response.data!;
  }

  /**
   * Request token top-up
   * 
   * @param request - Top-up request details
   * @returns Payment information including URL or VA number
   * 
   * @example
   * ```typescript
   * // Using checkout page (recommended)
   * const result = await sdk.topup.request({
   *   license_key: 'ABCDE-12345-FGHIJ-67890-KLMNO',
   *   token_count: 1000,
   *   payment_method: PaymentMethod.CHECKOUT_PAGE
   * });
   * console.log('Pay at:', result.payment_url);
   * 
   * // Using Virtual Account
   * const result = await sdk.topup.request({
   *   license_key: 'ABCDE-12345-FGHIJ-67890-KLMNO',
   *   token_count: 1000,
   *   payment_method: PaymentMethod.VA_BRI
   * });
   * console.log('VA Number:', result.virtual_account?.number);
   * ```
   */
  public async request(request: TopupRequest): Promise<TopupResponse> {
    const response = await this.httpClient.post<TopupResponse>('/api/topup/request', request);
    return response.data!;
  }

  /**
   * Shorthand for requesting top-up with checkout page
   * 
   * @param licenseKey - The license key to top up
   * @param tokenCount - Number of tokens to purchase
   * @returns Payment URL for checkout
   * 
   * @example
   * ```typescript
   * const { payment_url, amount_to_pay } = await sdk.topup.requestCheckout('ABCDE-12345', 1000);
   * console.log(`Pay Rp ${amount_to_pay} at: ${payment_url}`);
   * ```
   */
  public async requestCheckout(licenseKey: string, tokenCount: number): Promise<TopupResponse> {
    return this.request({
      license_key: licenseKey,
      token_count: tokenCount,
      payment_method: PaymentMethod.CHECKOUT_PAGE,
    });
  }

  /**
   * Shorthand for requesting top-up with Virtual Account
   * 
   * @param licenseKey - The license key to top up
   * @param tokenCount - Number of tokens to purchase
   * @param bank - Bank for VA (e.g., VA_BRI, VA_BCA)
   * @returns VA information
   * 
   * @example
   * ```typescript
   * const result = await sdk.topup.requestVA('ABCDE-12345', 1000, PaymentMethod.VA_BRI);
   * console.log('Bank:', result.virtual_account?.bank);
   * console.log('VA Number:', result.virtual_account?.number);
   * console.log('Amount:', result.amount_to_pay);
   * ```
   */
  public async requestVA(
    licenseKey: string, 
    tokenCount: number, 
    bank: PaymentMethod
  ): Promise<TopupResponse> {
    return this.request({
      license_key: licenseKey,
      token_count: tokenCount,
      payment_method: bank,
    });
  }

  /**
   * Check transaction status (public - no auth required)
   * 
   * @param transactionId - Transaction ID to check
   * @returns Transaction status
   * 
   * @example
   * ```typescript
   * const status = await sdk.topup.checkStatus('transaction-uuid');
   * if (status.status === 'success') {
   *   console.log('Payment complete! Tokens added:', status.tokens_added);
   * }
   * ```
   */
  public async checkStatus(transactionId: string): Promise<TransactionStatusResponse> {
    const response = await this.httpClient.get<TransactionStatusResponse>(
      `/api/topup/check/${encodeURIComponent(transactionId)}`
    );
    return response.data!;
  }

  /**
   * Check transaction status (authenticated)
   * 
   * @param transactionId - Transaction ID to check
   * @returns Transaction status with full details
   */
  public async getTransactionStatus(transactionId: string): Promise<TransactionStatusResponse> {
    const response = await this.httpClient.get<TransactionStatusResponse>(
      `/api/topup/status/${encodeURIComponent(transactionId)}`
    );
    return response.data!;
  }

  /**
   * Get transaction history
   * 
   * @returns List of all transactions
   * 
   * @example
   * ```typescript
   * const history = await sdk.topup.getHistory();
   * history.forEach(tx => {
   *   console.log(`${tx.created_at}: ${tx.tokens_added} tokens - ${tx.status}`);
   * });
   * ```
   */
  public async getHistory(): Promise<Transaction[]> {
    const response = await this.httpClient.get<Transaction[]>('/api/topup/history');
    return response.data!;
  }

  /**
   * Cancel a pending transaction
   * 
   * @param transactionId - Transaction ID to cancel
   * 
   * @example
   * ```typescript
   * await sdk.topup.cancel('transaction-uuid');
   * console.log('Transaction cancelled');
   * ```
   */
  public async cancel(transactionId: string): Promise<void> {
    await this.httpClient.post(`/api/topup/cancel/${encodeURIComponent(transactionId)}`);
  }

  /**
   * Calculate amount for token purchase
   * 
   * @param licenseKey - The license key
   * @param tokenCount - Number of tokens
   * @returns Estimated amount
   */
  public async calculateAmount(licenseKey: string, tokenCount: number): Promise<number> {
    // This uses the license validation to get price per token
    const response = await this.httpClient.get<{ price_per_token: number }>(
      `/api/license/validate/${encodeURIComponent(licenseKey)}`
    );
    const pricePerToken = response.data?.price_per_token || 0;
    return pricePerToken * tokenCount;
  }

  /**
   * Wait for transaction to complete (polling)
   * 
   * @param transactionId - Transaction ID to monitor
   * @param options - Polling options
   * @returns Final transaction status
   * 
   * @example
   * ```typescript
   * // Wait for payment (max 5 minutes)
   * const result = await sdk.topup.waitForCompletion('tx-id', {
   *   timeout: 300000,
   *   interval: 5000
   * });
   * if (result.status === 'success') {
   *   console.log('Payment successful!');
   * }
   * ```
   */
  public async waitForCompletion(
    transactionId: string,
    options: { timeout?: number; interval?: number } = {}
  ): Promise<TransactionStatusResponse> {
    const timeout = options.timeout || 300000; // 5 minutes default
    const interval = options.interval || 5000; // 5 seconds default
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const status = await this.checkStatus(transactionId);
      
      if (status.status !== 'pending') {
        return status;
      }

      await new Promise(resolve => setTimeout(resolve, interval));
    }

    // Return final status after timeout
    return this.checkStatus(transactionId);
  }
}
