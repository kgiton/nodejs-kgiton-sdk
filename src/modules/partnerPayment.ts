/**
 * KGiTON SDK Partner Payment Module
 * ==================================
 * Methods for partner payment generation (QRIS and Checkout Page)
 */

import { HttpClient } from '../core/httpClient';
import {
  PartnerPaymentRequest,
  PartnerPaymentResponse,
  PartnerPaymentType,
  PartnerPaymentItem,
} from '../types';

/**
 * Partner Payment module for KGiTON SDK
 * 
 * Allows partners to generate payments for their own transactions
 * using KGiTON's payment gateway.
 * 
 * This module requires API key authentication (x-api-key header).
 * 
 * Payment Types:
 * - QRIS: Generate QRIS QR code for payment (expires in 30 minutes by default)
 * - Checkout Page: Generate URL to Winpay checkout page (expires in 120 minutes by default)
 */
export class PartnerPaymentModule {
  constructor(private httpClient: HttpClient) {}

  /**
   * Generate payment (QRIS or Checkout Page)
   * 
   * Creates a payment request for partner transactions using KGiTON's
   * payment gateway. This will deduct 1 token from the license key balance.
   * 
   * @param request - Partner payment request
   * @returns Payment information including URL or QRIS data
   * 
   * @example
   * ```typescript
   * const payment = await sdk.partnerPayment.generate({
   *   transaction_id: 'TRX-2026-001',
   *   amount: 50000,
   *   license_key: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
   *   payment_type: PartnerPaymentType.QRIS,
   *   webhook_url: 'https://api.partner.com/webhook/payment',
   * });
   * console.log('QRIS URL:', payment.qris?.qr_image_url);
   * ```
   */
  public async generate(request: PartnerPaymentRequest): Promise<PartnerPaymentResponse> {
    const response = await this.httpClient.post<PartnerPaymentResponse>(
      '/api/partner/payment/generate',
      request
    );
    return response.data!;
  }

  /**
   * Generate QRIS payment
   * 
   * Shorthand for generating a QRIS payment.
   * 
   * @param options - QRIS payment options
   * @returns Payment information with QRIS data
   * 
   * @example
   * ```typescript
   * const payment = await sdk.partnerPayment.generateQris({
   *   transactionId: 'TRX-2026-001',
   *   amount: 50000,
   *   licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
   *   description: 'Laundry Payment',
   *   webhookUrl: 'https://api.partner.com/webhook/payment',
   * });
   * console.log('Scan this QR:', payment.qris?.qr_image_url);
   * ```
   */
  public async generateQris(options: {
    transactionId: string;
    amount: number;
    licenseKey: string;
    description?: string;
    expiryMinutes?: number;
    webhookUrl?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  }): Promise<PartnerPaymentResponse> {
    return this.generate({
      transaction_id: options.transactionId,
      amount: options.amount,
      license_key: options.licenseKey,
      payment_type: PartnerPaymentType.QRIS,
      description: options.description,
      expiry_minutes: options.expiryMinutes ?? 30,
      webhook_url: options.webhookUrl,
      customer_name: options.customerName,
      customer_email: options.customerEmail,
      customer_phone: options.customerPhone,
    });
  }

  /**
   * Generate Checkout Page payment
   * 
   * Shorthand for generating a checkout page payment.
   * 
   * @param options - Checkout page payment options
   * @returns Payment information with checkout URL
   * 
   * @example
   * ```typescript
   * const payment = await sdk.partnerPayment.generateCheckoutPage({
   *   transactionId: 'TRX-2026-001',
   *   amount: 150000,
   *   licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
   *   description: 'Invoice Payment',
   *   backUrl: 'https://myapp.com/payment/complete',
   *   webhookUrl: 'https://api.partner.com/webhook/payment',
   *   items: [
   *     { id: '1', name: 'Laundry 5kg', price: 100000, quantity: 1 },
   *     { id: '2', name: 'Extra Parfum', price: 50000, quantity: 1 },
   *   ],
   * });
   * console.log('Pay at:', payment.payment_url);
   * ```
   */
  public async generateCheckoutPage(options: {
    transactionId: string;
    amount: number;
    licenseKey: string;
    description?: string;
    backUrl?: string;
    expiryMinutes?: number;
    webhookUrl?: string;
    items?: PartnerPaymentItem[];
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  }): Promise<PartnerPaymentResponse> {
    return this.generate({
      transaction_id: options.transactionId,
      amount: options.amount,
      license_key: options.licenseKey,
      payment_type: PartnerPaymentType.CHECKOUT_PAGE,
      description: options.description,
      back_url: options.backUrl,
      expiry_minutes: options.expiryMinutes ?? 120,
      webhook_url: options.webhookUrl,
      items: options.items,
      customer_name: options.customerName,
      customer_email: options.customerEmail,
      customer_phone: options.customerPhone,
    });
  }
}
