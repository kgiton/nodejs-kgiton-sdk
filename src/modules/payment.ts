/**
 * KGiTON SDK Payment Module
 * =========================
 * Methods for partner payment integration (QRIS, Checkout Page)
 * 
 * This module allows partners to use KGiTON's payment gateway
 * for their own transactions.
 */

import { HttpClient } from '../core/httpClient';
import {
  GeneratePaymentRequest,
  GeneratePaymentResponse,
  GenerateQRISRequest,
  GenerateQRISResponse,
  PaymentStatusResponse,
} from '../types';

/**
 * Payment module for KGiTON SDK
 * 
 * Allows partners to generate payments (QRIS/Checkout Page) using KGiTON's
 * integrated payment gateway (Winpay).
 * 
 * @example
 * ```typescript
 * const kgiton = new KGiTON({
 *   baseUrl: 'https://api.kgiton.com',
 *   apiKey: 'kgiton_your_api_key_here'
 * });
 * 
 * // Generate payment (QRIS or Checkout Page)
 * const payment = await kgiton.payment.generate({
 *   transaction_id: 'TRX-001',
 *   amount: 50000,
 *   license_key: 'LICENSE-KEY',
 *   payment_type: 'qris',
 *   description: 'Payment for items'
 * });
 * 
 * if (payment.qris) {
 *   console.log('QRIS Content:', payment.qris.qr_content);
 * } else {
 *   console.log('Checkout URL:', payment.payment_url);
 * }
 * ```
 */
export class PaymentModule {
  constructor(private httpClient: HttpClient) {}

  // ============================================================================
  // UNIFIED PAYMENT GENERATION (Recommended)
  // ============================================================================

  /**
   * Generate Payment (QRIS or Checkout Page) - Unified Method
   * 
   * This is the recommended method for generating payments. It supports both
   * QRIS and Checkout Page payment types via a single endpoint.
   * 
   * @param request - Payment generation request
   * @returns Payment data including QRIS or checkout URL
   * 
   * @example
   * ```typescript
   * // Generate QRIS payment
   * const qrisPayment = await sdk.payment.generate({
   *   transaction_id: 'TRX-001',
   *   amount: 50000,
   *   license_key: 'YOUR-LICENSE-KEY',
   *   payment_type: 'qris',
   *   description: 'Laundry Payment',
   *   webhook_url: 'https://your-api.com/webhook',
   * });
   * console.log('QRIS:', qrisPayment.qris?.qr_image_url);
   * 
   * // Generate Checkout Page
   * const checkoutPayment = await sdk.payment.generate({
   *   transaction_id: 'TRX-002',
   *   amount: 100000,
   *   license_key: 'YOUR-LICENSE-KEY',
   *   payment_type: 'checkout_page',
   *   back_url: 'https://your-app.com/payment-complete',
   * });
   * console.log('Pay at:', checkoutPayment.payment_url);
   * ```
   */
  public async generate(request: GeneratePaymentRequest): Promise<GeneratePaymentResponse> {
    const response = await this.httpClient.post<GeneratePaymentResponse>(
      '/api/partner/payment/generate',
      request
    );
    return response.data!;
  }

  /**
   * Generate QRIS payment (convenience method)
   * 
   * Shorthand for generate() with payment_type: 'qris'
   * 
   * @param licenseKey - Your KGiTON license key
   * @param transactionId - Unique transaction ID
   * @param amount - Amount in IDR
   * @param options - Optional parameters
   */
  public async generateQRISPayment(
    licenseKey: string,
    transactionId: string,
    amount: number,
    options?: {
      description?: string;
      webhook_url?: string;
      expiry_minutes?: number;
      customer_name?: string;
      customer_phone?: string;
      items?: Array<{ id: string; name: string; price: number; quantity: number }>;
    }
  ): Promise<GeneratePaymentResponse> {
    return this.generate({
      license_key: licenseKey,
      transaction_id: transactionId,
      amount,
      payment_type: 'qris',
      ...options,
    });
  }

  /**
   * Generate Checkout Page payment (convenience method)
   * 
   * Shorthand for generate() with payment_type: 'checkout_page'
   * 
   * @param licenseKey - Your KGiTON license key
   * @param transactionId - Unique transaction ID
   * @param amount - Amount in IDR
   * @param options - Optional parameters
   */
  public async generateCheckoutPage(
    licenseKey: string,
    transactionId: string,
    amount: number,
    options?: {
      description?: string;
      back_url?: string;
      webhook_url?: string;
      expiry_minutes?: number;
      customer_name?: string;
      customer_email?: string;
      customer_phone?: string;
      items?: Array<{ id: string; name: string; price: number; quantity: number }>;
    }
  ): Promise<GeneratePaymentResponse> {
    return this.generate({
      license_key: licenseKey,
      transaction_id: transactionId,
      amount,
      payment_type: 'checkout_page',
      ...options,
    });
  }

  // ============================================================================
  // LEGACY METHODS (Kept for backward compatibility)
  // ============================================================================

  /**
   * Generate QRIS payment code
   * 
   * Creates a QRIS payment that can be scanned by any e-wallet
   * or mobile banking app that supports QRIS.
   * 
   * @param request - QRIS generation request
   * @returns QRIS data including QR content and image URL
   * 
   * @example
   * ```typescript
   * const result = await sdk.payment.generateQRIS({
   *   amount: 25000,
   *   transaction_id: 'ORDER-123',
   *   description: 'Pembelian Sayur 2.5kg'
   * });
   * 
   * // Display QR code to user
   * console.log('Scan to pay:', result.qris.qr_image_url);
   * console.log('Expires at:', result.expires_at);
   * ```
   */
  public async generateQRIS(request: GenerateQRISRequest): Promise<GenerateQRISResponse> {
    const response = await this.httpClient.post<GenerateQRISResponse>(
      '/api/partner/payment/qris',
      request
    );
    return response.data!;
  }

  /**
   * Check payment status
   * 
   * @param transactionId - Partner's transaction ID
   * @returns Current payment status
   * 
   * @example
   * ```typescript
   * const status = await sdk.payment.checkStatus('ORDER-123');
   * 
   * if (status.status === 'paid') {
   *   console.log('Payment received!');
   * } else if (status.status === 'expired') {
   *   console.log('Payment expired, please retry');
   * }
   * ```
   */
  public async checkStatus(transactionId: string): Promise<PaymentStatusResponse> {
    const response = await this.httpClient.get<PaymentStatusResponse>(
      `/api/partner/payment/status/${transactionId}`
    );
    return response.data!;
  }

  /**
   * Generate QRIS with simplified parameters
   * 
   * @param amount - Amount in IDR
   * @param transactionId - Unique transaction ID from partner
   * @param description - Optional payment description
   * @returns QRIS data
   * 
   * @example
   * ```typescript
   * const qris = await sdk.payment.quickQRIS(50000, 'TRX-001', 'Sayur Mayur');
   * ```
   */
  public async quickQRIS(
    amount: number,
    transactionId: string,
    description?: string
  ): Promise<GenerateQRISResponse> {
    return this.generateQRIS({
      amount,
      transaction_id: transactionId,
      description,
    });
  }
}
