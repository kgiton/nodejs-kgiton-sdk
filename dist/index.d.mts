import { AxiosRequestConfig } from 'axios';

/**
 * KGiTON SDK Types
 * ================
 * Core type definitions for the KGiTON SDK
 */
/**
 * SDK Configuration options
 */
interface KGiTONConfig {
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
/**
 * Standard API response wrapper
 */
interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}
/**
 * Pagination parameters
 */
interface PaginationParams {
    page?: number;
    limit?: number;
}
/**
 * Paginated response
 */
interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    USER = "user"
}
interface User {
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
interface UserProfile extends User {
    license_keys: LicenseKey[];
}
declare enum LicenseStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    TRIAL = "trial"
}
declare enum LicensePurchaseType {
    BUY = "buy",
    RENT = "rent"
}
declare enum LicenseTransactionStatus {
    PENDING = "pending",
    PAID = "paid",
    ACTIVE = "active",
    EXPIRED = "expired",
    CANCELLED = "cancelled"
}
/**
 * License Key with full device and purchase info
 */
interface LicenseKey {
    id: string;
    key: string;
    price_per_token: number;
    token_balance: number;
    status: LicenseStatus;
    assigned_to: string | null;
    referred_by_user_id: string | null;
    trial_expires_at: string | null;
    device_name?: string;
    device_serial_number?: string;
    device_model?: string;
    device_notes?: string;
    purchase_type?: LicensePurchaseType;
    purchase_price?: number;
    rental_price_monthly?: number;
    subscription_status?: LicenseTransactionStatus;
    subscription_next_due_date?: string;
    subscription_expires_at?: string;
    purchase_payment_status?: LicenseTransactionStatus;
    purchase_paid_at?: string;
    created_at: string;
    updated_at: string;
}
/**
 * License validation result from /api/license/validate/:key endpoint
 */
interface LicenseValidation {
    license_key: string;
    exists: boolean;
    is_valid: boolean;
    is_assigned: boolean;
    assigned_to_user_id?: string | null;
    status: LicenseStatus;
    token_balance: number;
    price_per_token: number;
    device_name?: string;
    device_model?: string;
    purchase_type?: LicensePurchaseType;
    subscription_status?: LicenseTransactionStatus;
    subscription_valid?: boolean;
    subscription_due_date?: string;
    valid?: boolean;
    trial_expires_at?: string;
    message?: string;
}
/**
 * License ownership validation result
 * Combines license validation with ownership check
 */
interface LicenseOwnershipValidation {
    license_key: string;
    exists: boolean;
    is_assigned: boolean;
    is_owner: boolean;
    owner_user_id?: string;
    assigned_to_user_id?: string | null;
    status: LicenseStatus;
    token_balance: number;
    is_valid: boolean;
}
/**
 * Token balance info for a license key
 */
interface LicenseTokenBalance {
    id: string;
    license_key: string;
    token_balance: number;
    price_per_token: number;
    status: LicenseStatus;
}
/**
 * Aggregated token balance across all license keys
 */
interface TokenBalanceResponse {
    license_keys: LicenseTokenBalance[];
    total_balance: number;
}
interface UseTokenRequest {
    purpose?: string;
    metadata?: Record<string, unknown>;
}
interface UseTokenResponse {
    license_key: string;
    previous_balance: number;
    new_balance: number;
    tokens_used: number;
}
interface TokenUsage {
    id: string;
    license_key: string;
    user_id: string;
    previous_balance: number;
    new_balance: number;
    purpose?: string;
    metadata?: Record<string, unknown>;
    created_at: string;
}
declare enum TransactionStatus {
    SUCCESS = "success",
    FAILED = "failed",
    PENDING = "pending",
    EXPIRED = "expired",
    CANCELLED = "cancelled"
}
declare enum PaymentMethod {
    CHECKOUT_PAGE = "checkout_page",
    VA_BRI = "va_bri",
    VA_BNI = "va_bni",
    VA_BCA = "va_bca",
    VA_MANDIRI = "va_mandiri",
    VA_PERMATA = "va_permata",
    VA_BSI = "va_bsi",
    VA_CIMB = "va_cimb",
    VA_SINARMAS = "va_sinarmas",
    VA_MUAMALAT = "va_muamalat",
    VA_INDOMARET = "va_indomaret",
    VA_ALFAMART = "va_alfamart",
    QRIS = "qris"
}
/**
 * Token top-up transaction
 */
interface Transaction {
    id: string;
    user_id: string;
    license_key: string;
    amount: number;
    tokens_added: number;
    status: TransactionStatus;
    payment_reference?: string;
    payment_method?: PaymentMethod;
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
interface LicenseTransaction {
    id: string;
    license_key: string;
    user_id: string;
    transaction_type: LicensePurchaseType;
    amount: number;
    status: TransactionStatus;
    payment_method?: PaymentMethod;
    payment_reference?: string;
    billing_period_start?: string;
    billing_period_end?: string;
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
    license_key_data?: LicenseKey;
    user?: User;
}
interface TopupRequest {
    license_key: string;
    token_count: number;
    payment_method?: PaymentMethod;
    customer_phone?: string;
    /** Customer name for payment gateway (for partner integrations) */
    customer_name?: string;
    /** Customer email for payment gateway (for partner integrations) */
    customer_email?: string;
}
interface VirtualAccountInfo {
    number: string;
    name: string;
    bank: string;
}
interface TopupResponse {
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
interface PaymentMethodInfo {
    id: string;
    name: string;
    description: string;
    type: 'checkout' | 'va' | 'qris';
    enabled: boolean;
}
interface TransactionStatusResponse {
    transaction_id: string;
    amount: number;
    tokens_added: number;
    status: TransactionStatus;
    payment_method?: string;
    created_at: string;
    paid_at?: string;
}
interface LoginRequest {
    email: string;
    password: string;
}
interface LoginResponse {
    access_token: string;
    user: User;
}
interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone_number?: string;
    referral_code?: string;
}
interface RegisterResponse {
    message: string;
    user: User;
}
declare class KGiTONError extends Error {
    readonly code: string;
    readonly statusCode: number;
    readonly details?: unknown;
    constructor(message: string, code: string, statusCode: number, details?: unknown);
}
declare class AuthenticationError extends KGiTONError {
    constructor(message?: string);
}
declare class AuthorizationError extends KGiTONError {
    constructor(message?: string);
}
declare class NotFoundError extends KGiTONError {
    constructor(message?: string);
}
declare class ValidationError extends KGiTONError {
    constructor(message?: string, details?: unknown);
}
declare class InsufficientTokenError extends KGiTONError {
    constructor(message?: string);
}
declare class RateLimitError extends KGiTONError {
    constructor(message?: string);
}
declare class NetworkError extends KGiTONError {
    constructor(message?: string);
}
/**
 * Request to generate QRIS payment
 */
interface GenerateQRISRequest {
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
interface GenerateQRISResponse {
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
interface PaymentStatusResponse {
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
/**
 * Payment type for partner payments
 */
type PartnerPaymentType = 'qris' | 'checkout_page';
/**
 * Item in a payment request
 */
interface PaymentItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}
/**
 * Unified payment generation request
 * Supports both QRIS and Checkout Page
 */
interface GeneratePaymentRequest {
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
interface QRISData {
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
interface GeneratePaymentResponse {
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
interface PaymentWebhookPayload {
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

/**
 * KGiTON SDK HTTP Client
 * ======================
 * Axios-based HTTP client with authentication, error handling, and retry logic
 */

/**
 * HTTP Client for KGiTON API
 */
declare class HttpClient {
    private client;
    private config;
    private debug;
    constructor(config: KGiTONConfig);
    /**
     * Setup request and response interceptors
     */
    private setupInterceptors;
    /**
     * Convert Axios errors to KGiTON SDK errors
     */
    private handleError;
    /**
     * Execute request with retry logic
     */
    private executeWithRetry;
    /**
     * Sleep utility
     */
    private sleep;
    /**
     * Update configuration (useful for setting access token after login)
     */
    updateConfig(newConfig: Partial<KGiTONConfig>): void;
    /**
     * Set API Key
     */
    setApiKey(apiKey: string): void;
    /**
     * Set Access Token
     */
    setAccessToken(accessToken: string): void;
    /**
     * Clear authentication
     */
    clearAuth(): void;
    /**
     * GET request
     */
    get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    /**
     * POST request
     */
    post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    /**
     * PUT request
     */
    put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    /**
     * PATCH request
     */
    patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    /**
     * DELETE request
     */
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
}

/**
 * KGiTON SDK Auth Module
 * ======================
 * Methods for authentication (login, register, etc.)
 */

/**
 * Auth module for KGiTON SDK
 */
declare class AuthModule {
    private httpClient;
    constructor(httpClient: HttpClient);
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
    login(credentials: LoginRequest): Promise<LoginResponse>;
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
    register(data: RegisterRequest): Promise<RegisterResponse>;
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
    forgotPassword(email: string): Promise<void>;
    /**
     * Logout (clear authentication)
     *
     * Note: This only clears the local authentication state.
     * For server-side session invalidation, implement accordingly.
     */
    logout(): void;
    /**
     * Set access token manually
     *
     * Useful when you have a token from elsewhere (e.g., stored in session)
     *
     * @param token - Access token
     */
    setAccessToken(token: string): void;
    /**
     * Set API key manually
     *
     * @param apiKey - API key
     */
    setApiKey(apiKey: string): void;
}

/**
 * KGiTON SDK License Module
 * =========================
 * Methods for license key validation and management
 */

/**
 * License module for KGiTON SDK
 */
declare class LicenseModule {
    private httpClient;
    constructor(httpClient: HttpClient);
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
    validate(licenseKey: string): Promise<LicenseValidation>;
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
    getByKey(licenseKey: string): Promise<LicenseKey>;
    /**
     * Get license key details by ID
     *
     * @param licenseId - The license UUID
     * @returns Full license key details
     */
    getById(licenseId: string): Promise<LicenseKey>;
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
    hasSufficientTokens(licenseKey: string, requiredTokens?: number): Promise<boolean>;
    /**
     * Check if license is active
     *
     * @param licenseKey - The license key
     * @returns Boolean indicating if license is active
     */
    isActive(licenseKey: string): Promise<boolean>;
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
    validateOwnership(licenseKey: string, throwOnNotOwner?: boolean): Promise<LicenseOwnershipValidation>;
    /**
     * Check if license is in trial mode
     *
     * @param licenseKey - The license key
     * @returns Trial status and expiry info
     */
    getTrialInfo(licenseKey: string): Promise<{
        isTrial: boolean;
        expiresAt?: string;
    }>;
    /**
     * Get token balance for a license key
     *
     * @param licenseKey - The license key
     * @returns Token balance and price per token
     */
    getTokenBalance(licenseKey: string): Promise<{
        balance: number;
        pricePerToken: number;
    }>;
}

/**
 * KGiTON SDK User Module
 * ======================
 * Methods for user management, profile, and token operations
 */

/**
 * User module for KGiTON SDK
 */
declare class UserModule {
    private httpClient;
    constructor(httpClient: HttpClient);
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
    getProfile(): Promise<UserProfile>;
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
    getTokenBalance(): Promise<TokenBalanceResponse>;
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
    useToken(licenseKey: string, options?: UseTokenRequest): Promise<UseTokenResponse>;
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
    assignLicense(licenseKey: string): Promise<LicenseKey>;
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
    regenerateApiKey(): Promise<{
        api_key: string;
        created_at: string;
    }>;
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
    revokeApiKey(): Promise<void>;
    /**
     * Get total token balance (convenience method)
     *
     * @returns Total token balance across all license keys
     */
    getTotalTokenBalance(): Promise<number>;
    /**
     * Get all license keys for current user
     *
     * @returns Array of license keys
     */
    getLicenseKeys(): Promise<LicenseKey[]>;
    /**
     * Check if user has any active license
     *
     * @returns Boolean indicating if user has at least one active license
     */
    hasActiveLicense(): Promise<boolean>;
    /**
     * Get the first available license key with sufficient tokens
     *
     * @param requiredTokens - Number of tokens required (default: 1)
     * @returns License key string or null if none available
     */
    getAvailableLicenseKey(requiredTokens?: number): Promise<string | null>;
}

/**
 * KGiTON SDK Topup Module
 * =======================
 * Methods for token top-up, payment methods, and transaction history
 */

/**
 * Topup module for KGiTON SDK
 */
declare class TopupModule {
    private httpClient;
    constructor(httpClient: HttpClient);
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
    getPaymentMethods(): Promise<PaymentMethodInfo[]>;
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
    request(request: TopupRequest): Promise<TopupResponse>;
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
    requestCheckout(licenseKey: string, tokenCount: number): Promise<TopupResponse>;
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
    requestVA(licenseKey: string, tokenCount: number, bank: PaymentMethod): Promise<TopupResponse>;
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
    checkStatus(transactionId: string): Promise<TransactionStatusResponse>;
    /**
     * Check transaction status (authenticated)
     *
     * @param transactionId - Transaction ID to check
     * @returns Transaction status with full details
     */
    getTransactionStatus(transactionId: string): Promise<TransactionStatusResponse>;
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
    getHistory(): Promise<Transaction[]>;
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
    cancel(transactionId: string): Promise<void>;
    /**
     * Calculate amount for token purchase
     *
     * @param licenseKey - The license key
     * @param tokenCount - Number of tokens
     * @returns Estimated amount
     */
    calculateAmount(licenseKey: string, tokenCount: number): Promise<number>;
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
    waitForCompletion(transactionId: string, options?: {
        timeout?: number;
        interval?: number;
    }): Promise<TransactionStatusResponse>;
}

/**
 * KGiTON SDK Payment Module
 * =========================
 * Methods for partner payment integration (QRIS, Checkout Page)
 *
 * This module allows partners to use KGiTON's payment gateway
 * for their own transactions.
 */

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
declare class PaymentModule {
    private httpClient;
    constructor(httpClient: HttpClient);
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
    generate(request: GeneratePaymentRequest): Promise<GeneratePaymentResponse>;
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
    generateQRISPayment(licenseKey: string, transactionId: string, amount: number, options?: {
        description?: string;
        webhook_url?: string;
        expiry_minutes?: number;
        customer_name?: string;
        customer_phone?: string;
        items?: Array<{
            id: string;
            name: string;
            price: number;
            quantity: number;
        }>;
    }): Promise<GeneratePaymentResponse>;
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
    generateCheckoutPage(licenseKey: string, transactionId: string, amount: number, options?: {
        description?: string;
        back_url?: string;
        webhook_url?: string;
        expiry_minutes?: number;
        customer_name?: string;
        customer_email?: string;
        customer_phone?: string;
        items?: Array<{
            id: string;
            name: string;
            price: number;
            quantity: number;
        }>;
    }): Promise<GeneratePaymentResponse>;
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
    generateQRIS(request: GenerateQRISRequest): Promise<GenerateQRISResponse>;
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
    checkStatus(transactionId: string): Promise<PaymentStatusResponse>;
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
    quickQRIS(amount: number, transactionId: string, description?: string): Promise<GenerateQRISResponse>;
}

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
declare class KGiTON {
    private httpClient;
    /**
     * Authentication module
     * - Login, register, forgot password
     */
    readonly auth: AuthModule;
    /**
     * License module
     * - Validate license keys
     * - Check token balance
     * - Get license details
     */
    readonly license: LicenseModule;
    /**
     * User module
     * - Get profile
     * - Use tokens
     * - Manage license keys
     * - API key management
     */
    readonly user: UserModule;
    /**
     * Top-up module
     * - Request token top-up
     * - Get payment methods
     * - Check transaction status
     * - Transaction history
     */
    readonly topup: TopupModule;
    /**
     * Payment module (Partner Integration)
     * - Generate QRIS for partner transactions
     * - Check payment status
     */
    readonly payment: PaymentModule;
    /**
     * Create a new KGiTON SDK instance
     *
     * @param config - SDK configuration
     */
    constructor(config: KGiTONConfig);
    /**
     * Update SDK configuration
     *
     * @param config - Partial configuration to update
     */
    updateConfig(config: Partial<KGiTONConfig>): void;
    /**
     * Set API key for authentication
     *
     * @param apiKey - KGiTON API key
     */
    setApiKey(apiKey: string): void;
    /**
     * Set access token for authentication
     *
     * @param accessToken - JWT access token
     */
    setAccessToken(accessToken: string): void;
    /**
     * Clear all authentication
     */
    clearAuth(): void;
    /**
     * Validate a license key (shortcut)
     *
     * @param licenseKey - License key to validate
     */
    validateLicense(licenseKey: string): Promise<LicenseValidation>;
    /**
     * Use 1 token from a license key (shortcut)
     *
     * @param licenseKey - License key
     * @param options - Optional purpose and metadata
     */
    useToken(licenseKey: string, options?: {
        purpose?: string;
        metadata?: Record<string, unknown>;
    }): Promise<UseTokenResponse>;
    /**
     * Get token balance for a license (shortcut)
     *
     * @param licenseKey - License key
     */
    getTokenBalance(licenseKey: string): Promise<{
        balance: number;
        pricePerToken: number;
    }>;
    /**
     * Request top-up with checkout page (shortcut)
     *
     * @param licenseKey - License key
     * @param tokenCount - Number of tokens
     */
    requestTopup(licenseKey: string, tokenCount: number): Promise<TopupResponse>;
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
declare function createKGiTON(config: KGiTONConfig): KGiTON;

export { type ApiResponse, AuthModule, AuthenticationError, AuthorizationError, type GeneratePaymentRequest, type GeneratePaymentResponse, type GenerateQRISRequest, type GenerateQRISResponse, HttpClient, InsufficientTokenError, KGiTON, type KGiTONConfig, KGiTONError, type LicenseKey, LicenseModule, type LicenseOwnershipValidation, LicensePurchaseType, LicenseStatus, type LicenseTokenBalance, type LicenseTransaction, LicenseTransactionStatus, type LicenseValidation, type LoginRequest, type LoginResponse, NetworkError, NotFoundError, type PaginatedResponse, type PaginationParams, type PartnerPaymentType, type PaymentItem, PaymentMethod, type PaymentMethodInfo, type PaymentStatusResponse, type PaymentWebhookPayload, type QRISData, RateLimitError, type RegisterRequest, type RegisterResponse, type TokenBalanceResponse, type TokenUsage, TopupModule, type TopupRequest, type TopupResponse, type Transaction, TransactionStatus, type TransactionStatusResponse, type UseTokenRequest, type UseTokenResponse, type User, UserModule, type UserProfile, UserRole, ValidationError, type VirtualAccountInfo, createKGiTON, KGiTON as default };
