/**
 * KGiTON SDK Types
 * ================
 * Core type definitions for the KGiTON SDK
 */

// ============================================
// Configuration Types
// ============================================

/**
 * SDK Configuration options
 */
export interface KGiTONConfig {
  /**
   * Base URL of the KGiTON Core API
   * @default 'https://api.kgiton.com'
   */
  baseUrl: string;

  /**
   * API Key for authentication (recommended for backend-to-backend)
   * Format: kgiton_xxxxx...
   */
  apiKey?: string;

  /**
   * Bearer token for authentication (for logged-in users)
   */
  accessToken?: string;

  /**
   * Request timeout in milliseconds
   * @default 30000 (30 seconds)
   */
  timeout?: number;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;

  /**
   * Custom headers to include in all requests
   */
  headers?: Record<string, string>;

  /**
   * Number of retry attempts for failed requests
   * @default 3
   */
  retryAttempts?: number;

  /**
   * Delay between retry attempts in milliseconds
   * @default 1000
   */
  retryDelay?: number;
}

// ============================================
// Common Types
// ============================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// User & Role Types
// ============================================

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  USER = 'user',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  api_key?: string;
  phone_number?: string;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  license_keys: LicenseKey[];
}

// ============================================
// License Types
// ============================================

export enum LicenseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TRIAL = 'trial',
}

export enum LicensePurchaseType {
  BUY = 'buy',
  RENT = 'rent',
}

export enum LicenseTransactionStatus {
  PENDING = 'pending',
  PAID = 'paid',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

/**
 * License Key with full device and purchase info
 */
export interface LicenseKey {
  id: string;
  key: string;
  
  // Token pricing & balance
  price_per_token: number;
  token_balance: number;
  status: LicenseStatus;
  
  // User assignment
  assigned_to: string | null;
  referred_by_user_id: string | null;
  
  // Trial info
  trial_expires_at: string | null;
  
  // Device info (1 license = 1 device)
  device_name?: string;
  device_serial_number?: string;
  device_model?: string;
  device_notes?: string;
  
  // Purchase info
  purchase_type?: LicensePurchaseType;
  purchase_price?: number;
  rental_price_monthly?: number;
  
  // Subscription tracking (for rent type)
  subscription_status?: LicenseTransactionStatus;
  subscription_next_due_date?: string;
  subscription_expires_at?: string;
  
  // Purchase tracking (for buy type)
  purchase_payment_status?: LicenseTransactionStatus;
  purchase_paid_at?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * License validation result from /api/license/validate/:key endpoint
 */
export interface LicenseValidation {
  license_key: string;
  exists: boolean;
  is_valid: boolean;
  is_assigned: boolean;
  assigned_to_user_id?: string | null; // UUID of user who owns this license
  status: LicenseStatus;
  token_balance: number;
  price_per_token: number;
  device_name?: string;
  device_model?: string;
  purchase_type?: LicensePurchaseType;
  subscription_status?: LicenseTransactionStatus;
  subscription_valid?: boolean;
  subscription_due_date?: string;
  
  // Legacy fields (for backward compatibility)
  valid?: boolean; // Same as is_valid
  trial_expires_at?: string;
  message?: string;
}


/**
 * License ownership validation result
 * Combines license validation with ownership check
 */
export interface LicenseOwnershipValidation {
  license_key: string;
  exists: boolean;
  is_assigned: boolean;
  is_owner: boolean; // True if license is assigned to current API key user
  owner_user_id?: string; // UUID of current user (from API key)
  assigned_to_user_id?: string | null; // UUID from license.assigned_to
  status: LicenseStatus;
  token_balance: number;
  is_valid: boolean; // Has sufficient tokens and active status
}

/**
 * Token balance info for a license key
 */
export interface LicenseTokenBalance {
  id: string;
  license_key: string;
  token_balance: number;
  price_per_token: number;
  status: LicenseStatus;
}

/**
 * Aggregated token balance across all license keys
 */
export interface TokenBalanceResponse {
  license_keys: LicenseTokenBalance[];
  total_balance: number;
}

// ============================================
// Token Usage Types
// ============================================

export interface UseTokenRequest {
  purpose?: string;
  metadata?: Record<string, unknown>;
}

export interface UseTokenResponse {
  license_key: string;
  previous_balance: number;
  new_balance: number;
  tokens_used: number;
}

export interface TokenUsage {
  id: string;
  license_key: string;
  user_id: string;
  previous_balance: number;
  new_balance: number;
  purpose?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// ============================================
// Transaction Types
// ============================================

export enum TransactionStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  // Winpay Checkout Page
  CHECKOUT_PAGE = 'checkout_page',
  // Virtual Account
  VA_BRI = 'va_bri',
  VA_BNI = 'va_bni',
  VA_BCA = 'va_bca',
  VA_MANDIRI = 'va_mandiri',
  VA_PERMATA = 'va_permata',
  VA_BSI = 'va_bsi',
  VA_CIMB = 'va_cimb',
  VA_SINARMAS = 'va_sinarmas',
  VA_MUAMALAT = 'va_muamalat',
  VA_INDOMARET = 'va_indomaret',
  VA_ALFAMART = 'va_alfamart',
  // QRIS
  QRIS = 'qris',
}

/**
 * Token top-up transaction
 */
export interface Transaction {
  id: string;
  user_id: string;
  license_key: string;
  amount: number;
  tokens_added: number;
  status: TransactionStatus;
  payment_reference?: string;
  payment_method?: PaymentMethod;
  
  // Payment gateway fields
  gateway_provider?: string;
  gateway_transaction_id?: string;
  gateway_va_number?: string;
  gateway_channel?: string;
  gateway_payment_url?: string;
  
  expires_at?: string;
  created_at: string;
}

/**
 * License transaction (purchase/subscription)
 */
export interface LicenseTransaction {
  id: string;
  license_key: string;
  user_id: string;
  transaction_type: LicensePurchaseType;
  amount: number;
  status: TransactionStatus;
  payment_method?: PaymentMethod;
  payment_reference?: string;
  
  // For rental: billing period
  billing_period_start?: string;
  billing_period_end?: string;
  
  // Payment gateway fields
  gateway_provider?: string;
  gateway_transaction_id?: string;
  gateway_va_number?: string;
  gateway_channel?: string;
  gateway_payment_url?: string;
  
  expires_at?: string;
  paid_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  license_key_data?: LicenseKey;
  user?: User;
}

// ============================================
// Top-up Types
// ============================================

export interface TopupRequest {
  license_key: string;
  token_count: number;
  payment_method?: PaymentMethod;
  customer_phone?: string;
}

export interface VirtualAccountInfo {
  number: string;
  name: string;
  bank: string;
}

export interface TopupResponse {
  transaction_id: string;
  license_key: string;
  tokens_requested: number;
  amount_to_pay: number;
  price_per_token: number;
  status: string;
  payment_method: string;
  gateway_provider: string;
  payment_url?: string;
  virtual_account?: VirtualAccountInfo;
  expires_at: string;
}

export interface PaymentMethodInfo {
  id: string;
  name: string;
  description: string;
  type: 'checkout' | 'va' | 'qris';
  enabled: boolean;
}

export interface TransactionStatusResponse {
  transaction_id: string;
  amount: number;
  tokens_added: number;
  status: TransactionStatus;
  payment_method?: string;
  created_at: string;
  paid_at?: string;
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone_number?: string;
  referral_code?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

// ============================================
// Error Types
// ============================================

export class KGiTONError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, code: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = 'KGiTONError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class AuthenticationError extends KGiTONError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTHENTICATION_ERROR', 401);
  }
}

export class AuthorizationError extends KGiTONError {
  constructor(message = 'Access denied') {
    super(message, 'AUTHORIZATION_ERROR', 403);
  }
}

export class NotFoundError extends KGiTONError {
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
  }
}

export class ValidationError extends KGiTONError {
  constructor(message = 'Validation failed', details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class InsufficientTokenError extends KGiTONError {
  constructor(message = 'Insufficient token balance') {
    super(message, 'INSUFFICIENT_TOKENS', 400);
  }
}

export class RateLimitError extends KGiTONError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
  }
}

export class NetworkError extends KGiTONError {
  constructor(message = 'Network error') {
    super(message, 'NETWORK_ERROR', 0);
  }
}

// ============================================
// Partner Payment Types
// ============================================

/**
 * Request to generate QRIS payment
 */
export interface GenerateQRISRequest {
  /**
   * Amount in IDR (minimum 1000)
   */
  amount: number;
  
  /**
   * Partner's unique transaction ID
   */
  transaction_id: string;
  
  /**
   * Payment description (shown to customer)
   */
  description?: string;
}

/**
 * QRIS generation response
 */
export interface GenerateQRISResponse {
  /**
   * KGiTON's internal transaction ID
   */
  transaction_id: string;
  
  /**
   * Payment amount in IDR
   */
  amount: number;
  
  /**
   * Payment gateway provider
   */
  gateway_provider: string;
  
  /**
   * Gateway's transaction ID
   */
  gateway_transaction_id: string;
  
  /**
   * QRIS expiry time
   */
  expires_at: string;
  
  /**
   * QRIS data
   */
  qris: {
    /**
     * Raw QRIS string for generating QR code
     */
    qr_content: string;
    
    /**
     * URL to QR code image
     */
    qr_image_url: string;
  };
}

/**
 * Payment status check response
 */
export interface PaymentStatusResponse {
  /**
   * Transaction ID
   */
  transaction_id: string;
  
  /**
   * Current payment status
   */
  status: 'pending' | 'paid' | 'expired' | 'failed';
  
  /**
   * Payment amount
   */
  amount: number;
  
  /**
   * When payment was received (if paid)
   */
  paid_at?: string;
  
  /**
   * Gateway transaction ID
   */
  gateway_transaction_id?: string;
}

// ============================================
// Unified Partner Payment Types (New)
// ============================================

/**
 * Payment type for partner payments
 */
export type PartnerPaymentType = 'qris' | 'checkout_page';

/**
 * Item in a payment request
 */
export interface PaymentItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Unified payment generation request
 * Supports both QRIS and Checkout Page
 */
export interface GeneratePaymentRequest {
  /**
   * Partner's unique transaction ID
   */
  transaction_id: string;
  
  /**
   * Amount in IDR (minimum 1000)
   */
  amount: number;
  
  /**
   * KGiTON license key (required for authentication)
   */
  license_key: string;
  
  /**
   * Payment type: 'qris' or 'checkout_page'
   * @default 'checkout_page'
   */
  payment_type?: PartnerPaymentType;
  
  /**
   * Payment description (shown to customer)
   */
  description?: string;
  
  /**
   * URL to redirect after payment (for checkout_page only)
   */
  back_url?: string;
  
  /**
   * URL to receive payment status callback (POST request)
   * KGiTON will send webhook when payment status changes
   */
  webhook_url?: string;
  
  /**
   * Expiry in minutes
   * @default 30 for QRIS, 120 for checkout_page
   */
  expiry_minutes?: number;
  
  /**
   * List of items for checkout page display
   */
  items?: PaymentItem[];
  
  /**
   * Customer name
   */
  customer_name?: string;
  
  /**
   * Customer email
   */
  customer_email?: string;
  
  /**
   * Customer phone number
   */
  customer_phone?: string;
}

/**
 * QRIS data in payment response
 */
export interface QRISData {
  /**
   * Raw QRIS string for generating QR code
   */
  qr_content: string | null;
  
  /**
   * URL to QR code image
   */
  qr_image_url: string | null;
}

/**
 * Unified payment generation response
 * Contains either QRIS data or checkout URL depending on payment_type
 */
export interface GeneratePaymentResponse {
  /**
   * Whether the request was successful
   */
  success: boolean;
  
  /**
   * Transaction ID (same as request)
   */
  transaction_id: string;
  
  /**
   * Payment type used
   */
  payment_type: PartnerPaymentType;
  
  /**
   * Payment amount in IDR
   */
  amount: number;
  
  /**
   * Payment gateway provider (e.g., 'winpay')
   */
  gateway_provider: string;
  
  /**
   * Gateway's internal transaction ID
   */
  gateway_transaction_id: string;
  
  /**
   * Payment expiry time (ISO 8601)
   */
  expires_at: string;
  
  /**
   * Checkout page URL (only for payment_type: 'checkout_page')
   */
  payment_url?: string;
  
  /**
   * QRIS data (only for payment_type: 'qris')
   */
  qris?: QRISData;
}

/**
 * Webhook payload sent by KGiTON when payment status changes
 */
export interface PaymentWebhookPayload {
  /**
   * Partner's transaction ID
   */
  transaction_id: string;
  
  /**
   * Payment status
   */
  payment_status: 'paid' | 'expired' | 'failed';
  
  /**
   * Payment amount
   */
  amount: number;
  
  /**
   * Payment timestamp (only for paid status)
   */
  paid_at?: string;
  
  /**
   * Payment method used
   */
  payment_type?: PartnerPaymentType;
  
  /**
   * Gateway transaction reference
   */
  gateway_transaction_id?: string;
}
