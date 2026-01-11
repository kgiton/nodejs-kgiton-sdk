"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuthModule: () => AuthModule,
  AuthenticationError: () => AuthenticationError,
  AuthorizationError: () => AuthorizationError,
  HttpClient: () => HttpClient,
  InsufficientTokenError: () => InsufficientTokenError,
  KGiTON: () => KGiTON,
  KGiTONError: () => KGiTONError,
  LicenseModule: () => LicenseModule,
  LicensePurchaseType: () => LicensePurchaseType,
  LicenseStatus: () => LicenseStatus,
  LicenseTransactionStatus: () => LicenseTransactionStatus,
  NetworkError: () => NetworkError,
  NotFoundError: () => NotFoundError,
  PaymentMethod: () => PaymentMethod,
  RateLimitError: () => RateLimitError,
  TopupModule: () => TopupModule,
  TransactionStatus: () => TransactionStatus,
  UserModule: () => UserModule,
  UserRole: () => UserRole,
  ValidationError: () => ValidationError,
  createKGiTON: () => createKGiTON,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

// src/core/httpClient.ts
var import_axios = __toESM(require("axios"));

// src/types/index.ts
var UserRole = /* @__PURE__ */ ((UserRole2) => {
  UserRole2["SUPER_ADMIN"] = "super_admin";
  UserRole2["USER"] = "user";
  return UserRole2;
})(UserRole || {});
var LicenseStatus = /* @__PURE__ */ ((LicenseStatus2) => {
  LicenseStatus2["ACTIVE"] = "active";
  LicenseStatus2["INACTIVE"] = "inactive";
  LicenseStatus2["TRIAL"] = "trial";
  return LicenseStatus2;
})(LicenseStatus || {});
var LicensePurchaseType = /* @__PURE__ */ ((LicensePurchaseType2) => {
  LicensePurchaseType2["BUY"] = "buy";
  LicensePurchaseType2["RENT"] = "rent";
  return LicensePurchaseType2;
})(LicensePurchaseType || {});
var LicenseTransactionStatus = /* @__PURE__ */ ((LicenseTransactionStatus2) => {
  LicenseTransactionStatus2["PENDING"] = "pending";
  LicenseTransactionStatus2["PAID"] = "paid";
  LicenseTransactionStatus2["ACTIVE"] = "active";
  LicenseTransactionStatus2["EXPIRED"] = "expired";
  LicenseTransactionStatus2["CANCELLED"] = "cancelled";
  return LicenseTransactionStatus2;
})(LicenseTransactionStatus || {});
var TransactionStatus = /* @__PURE__ */ ((TransactionStatus2) => {
  TransactionStatus2["SUCCESS"] = "success";
  TransactionStatus2["FAILED"] = "failed";
  TransactionStatus2["PENDING"] = "pending";
  TransactionStatus2["EXPIRED"] = "expired";
  TransactionStatus2["CANCELLED"] = "cancelled";
  return TransactionStatus2;
})(TransactionStatus || {});
var PaymentMethod = /* @__PURE__ */ ((PaymentMethod2) => {
  PaymentMethod2["CHECKOUT_PAGE"] = "checkout_page";
  PaymentMethod2["VA_BRI"] = "va_bri";
  PaymentMethod2["VA_BNI"] = "va_bni";
  PaymentMethod2["VA_BCA"] = "va_bca";
  PaymentMethod2["VA_MANDIRI"] = "va_mandiri";
  PaymentMethod2["VA_PERMATA"] = "va_permata";
  PaymentMethod2["VA_BSI"] = "va_bsi";
  PaymentMethod2["VA_CIMB"] = "va_cimb";
  PaymentMethod2["VA_SINARMAS"] = "va_sinarmas";
  PaymentMethod2["VA_MUAMALAT"] = "va_muamalat";
  PaymentMethod2["VA_INDOMARET"] = "va_indomaret";
  PaymentMethod2["VA_ALFAMART"] = "va_alfamart";
  PaymentMethod2["QRIS"] = "qris";
  return PaymentMethod2;
})(PaymentMethod || {});
var KGiTONError = class extends Error {
  constructor(message, code, statusCode, details) {
    super(message);
    this.name = "KGiTONError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
};
var AuthenticationError = class extends KGiTONError {
  constructor(message = "Authentication failed") {
    super(message, "AUTHENTICATION_ERROR", 401);
  }
};
var AuthorizationError = class extends KGiTONError {
  constructor(message = "Access denied") {
    super(message, "AUTHORIZATION_ERROR", 403);
  }
};
var NotFoundError = class extends KGiTONError {
  constructor(message = "Resource not found") {
    super(message, "NOT_FOUND", 404);
  }
};
var ValidationError = class extends KGiTONError {
  constructor(message = "Validation failed", details) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
};
var InsufficientTokenError = class extends KGiTONError {
  constructor(message = "Insufficient token balance") {
    super(message, "INSUFFICIENT_TOKENS", 400);
  }
};
var RateLimitError = class extends KGiTONError {
  constructor(message = "Rate limit exceeded") {
    super(message, "RATE_LIMIT_EXCEEDED", 429);
  }
};
var NetworkError = class extends KGiTONError {
  constructor(message = "Network error") {
    super(message, "NETWORK_ERROR", 0);
  }
};

// src/core/httpClient.ts
var DEFAULT_CONFIG = {
  baseUrl: "https://api.kgiton.com",
  timeout: 3e4,
  debug: false,
  retryAttempts: 3,
  retryDelay: 1e3
};
var HttpClient = class {
  constructor(config) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.debug = this.config.debug ?? false;
    this.client = import_axios.default.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...this.config.headers
      }
    });
    this.setupInterceptors();
  }
  /**
   * Setup request and response interceptors
   */
  setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        if (this.config.apiKey) {
          config.headers["x-api-key"] = this.config.apiKey;
        } else if (this.config.accessToken) {
          config.headers["Authorization"] = `Bearer ${this.config.accessToken}`;
        }
        if (this.debug) {
          console.log(`[KGiTON SDK] ${config.method?.toUpperCase()} ${config.url}`);
          if (config.data) {
            console.log("[KGiTON SDK] Request body:", JSON.stringify(config.data, null, 2));
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.client.interceptors.response.use(
      (response) => {
        if (this.debug) {
          console.log(`[KGiTON SDK] Response ${response.status}:`, JSON.stringify(response.data, null, 2));
        }
        return response;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }
  /**
   * Convert Axios errors to KGiTON SDK errors
   */
  handleError(error) {
    if (!error.response) {
      return new NetworkError(error.message || "Network request failed");
    }
    const { status, data } = error.response;
    const message = data?.error || data?.message || "An error occurred";
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
        return new KGiTONError(message, "API_ERROR", status, data);
    }
  }
  /**
   * Execute request with retry logic
   */
  async executeWithRetry(requestFn, attempts = this.config.retryAttempts ?? 3) {
    let lastError;
    for (let i = 0; i < attempts; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        if (error instanceof KGiTONError) {
          if (error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429) {
            throw error;
          }
        }
        if (i < attempts - 1) {
          const delay = (this.config.retryDelay ?? 1e3) * Math.pow(2, i);
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
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  /**
   * Update configuration (useful for setting access token after login)
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
  /**
   * Set API Key
   */
  setApiKey(apiKey) {
    this.config.apiKey = apiKey;
  }
  /**
   * Set Access Token
   */
  setAccessToken(accessToken) {
    this.config.accessToken = accessToken;
  }
  /**
   * Clear authentication
   */
  clearAuth() {
    this.config.apiKey = void 0;
    this.config.accessToken = void 0;
  }
  /**
   * GET request
   */
  async get(url, config) {
    return this.executeWithRetry(async () => {
      const response = await this.client.get(url, config);
      return response.data;
    });
  }
  /**
   * POST request
   */
  async post(url, data, config) {
    return this.executeWithRetry(async () => {
      const response = await this.client.post(url, data, config);
      return response.data;
    });
  }
  /**
   * PUT request
   */
  async put(url, data, config) {
    return this.executeWithRetry(async () => {
      const response = await this.client.put(url, data, config);
      return response.data;
    });
  }
  /**
   * PATCH request
   */
  async patch(url, data, config) {
    return this.executeWithRetry(async () => {
      const response = await this.client.patch(url, data, config);
      return response.data;
    });
  }
  /**
   * DELETE request
   */
  async delete(url, config) {
    return this.executeWithRetry(async () => {
      const response = await this.client.delete(url, config);
      return response.data;
    });
  }
};

// src/modules/auth.ts
var AuthModule = class {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }
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
  async login(credentials) {
    const response = await this.httpClient.post("/api/auth/login", credentials);
    if (response.data?.access_token) {
      this.httpClient.setAccessToken(response.data.access_token);
    }
    return response.data;
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
  async register(data) {
    const response = await this.httpClient.post("/api/auth/register", data);
    return response.data;
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
  async forgotPassword(email) {
    await this.httpClient.post("/api/auth/forgot-password", { email });
  }
  /**
   * Logout (clear authentication)
   * 
   * Note: This only clears the local authentication state.
   * For server-side session invalidation, implement accordingly.
   */
  logout() {
    this.httpClient.clearAuth();
  }
  /**
   * Set access token manually
   * 
   * Useful when you have a token from elsewhere (e.g., stored in session)
   * 
   * @param token - Access token
   */
  setAccessToken(token) {
    this.httpClient.setAccessToken(token);
  }
  /**
   * Set API key manually
   * 
   * @param apiKey - API key
   */
  setApiKey(apiKey) {
    this.httpClient.setApiKey(apiKey);
  }
};

// src/modules/license.ts
var LicenseModule = class {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }
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
  async validate(licenseKey) {
    const response = await this.httpClient.get(
      `/api/license/validate/${encodeURIComponent(licenseKey)}`
    );
    return response.data;
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
  async getByKey(licenseKey) {
    const response = await this.httpClient.get(
      `/api/license/key/${encodeURIComponent(licenseKey)}`
    );
    return response.data;
  }
  /**
   * Get license key details by ID
   * 
   * @param licenseId - The license UUID
   * @returns Full license key details
   */
  async getById(licenseId) {
    const response = await this.httpClient.get(
      `/api/admin/license-keys/${encodeURIComponent(licenseId)}`
    );
    return response.data;
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
  async hasSufficientTokens(licenseKey, requiredTokens = 1) {
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
  async isActive(licenseKey) {
    try {
      const validation = await this.validate(licenseKey);
      return validation.is_valid && validation.status === "active";
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
  async validateOwnership(licenseKey, throwOnNotOwner = false) {
    const response = await this.httpClient.get(
      `/api/license/validate-ownership/${encodeURIComponent(licenseKey)}`
    );
    const result = response.data;
    if (!result.exists) {
      if (throwOnNotOwner) {
        throw new Error("License key not found");
      }
      return result;
    }
    if (!result.is_assigned) {
      if (throwOnNotOwner) {
        throw new Error("License key is not assigned to any user");
      }
      return result;
    }
    if (!result.is_owner) {
      if (throwOnNotOwner) {
        throw new Error(
          `License key is not assigned to you. It belongs to another user. (Your ID: ${result.owner_user_id}, Assigned to: ${result.assigned_to_user_id})`
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
  async getTrialInfo(licenseKey) {
    try {
      const validation = await this.validate(licenseKey);
      return {
        isTrial: validation.status === "trial",
        expiresAt: validation.trial_expires_at
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
  async getTokenBalance(licenseKey) {
    const validation = await this.validate(licenseKey);
    return {
      balance: validation.token_balance,
      pricePerToken: validation.price_per_token
    };
  }
};

// src/modules/user.ts
var UserModule = class {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }
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
  async getProfile() {
    const response = await this.httpClient.get("/api/user/profile");
    return response.data;
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
  async getTokenBalance() {
    const response = await this.httpClient.get("/api/user/token-balance");
    return response.data;
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
  async useToken(licenseKey, options) {
    const response = await this.httpClient.post(
      `/api/user/license-keys/${encodeURIComponent(licenseKey)}/use-token`,
      options || {}
    );
    return response.data;
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
  async assignLicense(licenseKey) {
    const response = await this.httpClient.post("/api/user/assign-license", {
      license_key: licenseKey
    });
    return response.data;
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
  async regenerateApiKey() {
    const response = await this.httpClient.post(
      "/api/user/regenerate-api-key"
    );
    return response.data;
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
  async revokeApiKey() {
    await this.httpClient.post("/api/user/revoke-api-key");
  }
  /**
   * Get total token balance (convenience method)
   * 
   * @returns Total token balance across all license keys
   */
  async getTotalTokenBalance() {
    const balance = await this.getTokenBalance();
    return balance.total_balance;
  }
  /**
   * Get all license keys for current user
   * 
   * @returns Array of license keys
   */
  async getLicenseKeys() {
    const profile = await this.getProfile();
    return profile.license_keys;
  }
  /**
   * Check if user has any active license
   * 
   * @returns Boolean indicating if user has at least one active license
   */
  async hasActiveLicense() {
    const licenses = await this.getLicenseKeys();
    return licenses.some((lk) => lk.status === "active");
  }
  /**
   * Get the first available license key with sufficient tokens
   * 
   * @param requiredTokens - Number of tokens required (default: 1)
   * @returns License key string or null if none available
   */
  async getAvailableLicenseKey(requiredTokens = 1) {
    const licenses = await this.getLicenseKeys();
    const available = licenses.find(
      (lk) => lk.status === "active" && lk.token_balance >= requiredTokens
    );
    return available?.key || null;
  }
};

// src/modules/topup.ts
var TopupModule = class {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }
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
  async getPaymentMethods() {
    const response = await this.httpClient.get("/api/topup/payment-methods");
    return response.data;
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
  async request(request) {
    const response = await this.httpClient.post("/api/topup/request", request);
    return response.data;
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
  async requestCheckout(licenseKey, tokenCount) {
    return this.request({
      license_key: licenseKey,
      token_count: tokenCount,
      payment_method: "checkout_page" /* CHECKOUT_PAGE */
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
  async requestVA(licenseKey, tokenCount, bank) {
    return this.request({
      license_key: licenseKey,
      token_count: tokenCount,
      payment_method: bank
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
  async checkStatus(transactionId) {
    const response = await this.httpClient.get(
      `/api/topup/check/${encodeURIComponent(transactionId)}`
    );
    return response.data;
  }
  /**
   * Check transaction status (authenticated)
   * 
   * @param transactionId - Transaction ID to check
   * @returns Transaction status with full details
   */
  async getTransactionStatus(transactionId) {
    const response = await this.httpClient.get(
      `/api/topup/status/${encodeURIComponent(transactionId)}`
    );
    return response.data;
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
  async getHistory() {
    const response = await this.httpClient.get("/api/topup/history");
    return response.data;
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
  async cancel(transactionId) {
    await this.httpClient.post(`/api/topup/cancel/${encodeURIComponent(transactionId)}`);
  }
  /**
   * Calculate amount for token purchase
   * 
   * @param licenseKey - The license key
   * @param tokenCount - Number of tokens
   * @returns Estimated amount
   */
  async calculateAmount(licenseKey, tokenCount) {
    const response = await this.httpClient.get(
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
  async waitForCompletion(transactionId, options = {}) {
    const timeout = options.timeout || 3e5;
    const interval = options.interval || 5e3;
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const status = await this.checkStatus(transactionId);
      if (status.status !== "pending") {
        return status;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return this.checkStatus(transactionId);
  }
};

// src/modules/payment.ts
var PaymentModule = class {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }
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
  async generate(request) {
    const response = await this.httpClient.post(
      "/api/partner/payment/generate",
      request
    );
    return response.data;
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
  async generateQRISPayment(licenseKey, transactionId, amount, options) {
    return this.generate({
      license_key: licenseKey,
      transaction_id: transactionId,
      amount,
      payment_type: "qris",
      ...options
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
  async generateCheckoutPage(licenseKey, transactionId, amount, options) {
    return this.generate({
      license_key: licenseKey,
      transaction_id: transactionId,
      amount,
      payment_type: "checkout_page",
      ...options
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
  async generateQRIS(request) {
    const response = await this.httpClient.post(
      "/api/partner/payment/qris",
      request
    );
    return response.data;
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
  async checkStatus(transactionId) {
    const response = await this.httpClient.get(
      `/api/partner/payment/status/${transactionId}`
    );
    return response.data;
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
  async quickQRIS(amount, transactionId, description) {
    return this.generateQRIS({
      amount,
      transaction_id: transactionId,
      description
    });
  }
};

// src/index.ts
var KGiTON = class {
  /**
   * Create a new KGiTON SDK instance
   * 
   * @param config - SDK configuration
   */
  constructor(config) {
    this.httpClient = new HttpClient(config);
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
  updateConfig(config) {
    this.httpClient.updateConfig(config);
  }
  /**
   * Set API key for authentication
   * 
   * @param apiKey - KGiTON API key
   */
  setApiKey(apiKey) {
    this.httpClient.setApiKey(apiKey);
  }
  /**
   * Set access token for authentication
   * 
   * @param accessToken - JWT access token
   */
  setAccessToken(accessToken) {
    this.httpClient.setAccessToken(accessToken);
  }
  /**
   * Clear all authentication
   */
  clearAuth() {
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
  async validateLicense(licenseKey) {
    return this.license.validate(licenseKey);
  }
  /**
   * Use 1 token from a license key (shortcut)
   * 
   * @param licenseKey - License key
   * @param options - Optional purpose and metadata
   */
  async useToken(licenseKey, options) {
    return this.user.useToken(licenseKey, options);
  }
  /**
   * Get token balance for a license (shortcut)
   * 
   * @param licenseKey - License key
   */
  async getTokenBalance(licenseKey) {
    return this.license.getTokenBalance(licenseKey);
  }
  /**
   * Request top-up with checkout page (shortcut)
   * 
   * @param licenseKey - License key
   * @param tokenCount - Number of tokens
   */
  async requestTopup(licenseKey, tokenCount) {
    return this.topup.requestCheckout(licenseKey, tokenCount);
  }
};
function createKGiTON(config) {
  return new KGiTON(config);
}
var index_default = KGiTON;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthModule,
  AuthenticationError,
  AuthorizationError,
  HttpClient,
  InsufficientTokenError,
  KGiTON,
  KGiTONError,
  LicenseModule,
  LicensePurchaseType,
  LicenseStatus,
  LicenseTransactionStatus,
  NetworkError,
  NotFoundError,
  PaymentMethod,
  RateLimitError,
  TopupModule,
  TransactionStatus,
  UserModule,
  UserRole,
  ValidationError,
  createKGiTON
});
