# 📚 API Reference

## KGiTON Class

Main SDK class yang menyediakan akses ke semua modules.

### Constructor

```typescript
new KGiTON(config: KGiTONConfig)
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `config.baseUrl` | `string` | Yes | - | Base URL API |
| `config.apiKey` | `string` | No | - | API Key untuk autentikasi |
| `config.accessToken` | `string` | No | - | Access Token untuk autentikasi |
| `config.timeout` | `number` | No | `30000` | Request timeout (ms) |
| `config.retryAttempts` | `number` | No | `3` | Retry attempts |
| `config.retryDelay` | `number` | No | `1000` | Retry delay (ms) |
| `config.debug` | `boolean` | No | `false` | Enable debug logging |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `auth` | `AuthModule` | Authentication module |
| `license` | `LicenseModule` | License management module |
| `user` | `UserModule` | User management module |
| `topup` | `TopupModule` | Top-up module |
| `payment` | `PaymentModule` | Payment module |

### Methods

#### setApiKey

```typescript
kgiton.setApiKey(apiKey: string): void
```

Set atau update API key.

#### setAccessToken

```typescript
kgiton.setAccessToken(accessToken: string): void
```

Set atau update access token.

#### getTokenBalance (shortcut)

```typescript
kgiton.getTokenBalance(licenseKey: string): Promise<TokenBalance>
```

Shortcut untuk `kgiton.license.getTokenBalance()`.

#### validateLicense (shortcut)

```typescript
kgiton.validateLicense(licenseKey: string): Promise<LicenseValidation>
```

Shortcut untuk `kgiton.license.validate()`.

#### useToken (shortcut)

```typescript
kgiton.useToken(licenseKey: string, options?: UseTokenOptions): Promise<UseTokenResponse>
```

Shortcut untuk `kgiton.user.useToken()`.

#### requestTopup (shortcut)

```typescript
kgiton.requestTopup(licenseKey: string, tokenCount: number): Promise<CheckoutResponse>
```

Shortcut untuk `kgiton.topup.requestCheckout()`.

---

## AuthModule

### login

```typescript
auth.login(email: string, password: string): Promise<LoginResponse>
```

Login user dan dapatkan access token.

**Response:**

```typescript
interface LoginResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  user: UserProfile;
}
```

### logout

```typescript
auth.logout(): Promise<void>
```

Logout dan invalidate token.

### register

```typescript
auth.register(data: RegisterData): Promise<UserProfile>
```

Register user baru.

**Parameters:**

```typescript
interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number?: string;
  referral_code?: string;
}
```

### forgotPassword

```typescript
auth.forgotPassword(email: string): Promise<void>
```

Request password reset email.

### resetPassword

```typescript
auth.resetPassword(token: string, password: string, passwordConfirmation: string): Promise<void>
```

Reset password dengan token dari email.

### refreshToken

```typescript
auth.refreshToken(): Promise<string>
```

Refresh access token.

---

## LicenseModule

### validate

```typescript
license.validate(licenseKey: string): Promise<LicenseValidation>
```

Validate license key.

**Response:**

```typescript
interface LicenseValidation {
  valid: boolean;
  license_key: string;
  status: 'active' | 'inactive' | 'trial';
  token_balance: number;
  price_per_token: number;
  device_name?: string;
  trial_expires_at?: string;
  message?: string;
}
```

### getByKey

```typescript
license.getByKey(licenseKey: string): Promise<LicenseKey>
```

Get license details by key.

### getById

```typescript
license.getById(id: string): Promise<LicenseKey>
```

Get license details by UUID.

### hasSufficientTokens

```typescript
license.hasSufficientTokens(licenseKey: string, amount?: number): Promise<boolean>
```

Check if license has sufficient tokens.

### isActive

```typescript
license.isActive(licenseKey: string): Promise<boolean>
```

Check if license is active.

### getTrialInfo

```typescript
license.getTrialInfo(licenseKey: string): Promise<TrialInfo>
```

Get trial information.

**Response:**

```typescript
interface TrialInfo {
  isTrial: boolean;
  expiresAt: string | null;
}
```

### getTokenBalance

```typescript
license.getTokenBalance(licenseKey: string): Promise<{ balance: number; pricePerToken: number }>
```

Get token balance and price.

---

## UserModule

### getProfile

```typescript
user.getProfile(): Promise<UserProfile>
```

Get current user profile.

**Response:**

```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'super_admin';
  api_key?: string;
  phone_number?: string;
  referral_code: string;
  referred_by: string | null;
  license_keys: LicenseKey[];
  created_at: string;
  updated_at: string;
}
```

### getTokenBalance

```typescript
user.getTokenBalance(): Promise<TokenBalanceResponse>
```

Get total token balance from all licenses.

### useToken

```typescript
user.useToken(licenseKey: string, options?: UseTokenOptions): Promise<UseTokenResponse>
```

Use token from license.

**Parameters:**

```typescript
interface UseTokenOptions {
  purpose?: string;
  metadata?: Record<string, unknown>;
}
```

**Response:**

```typescript
interface UseTokenResponse {
  license_key: string;
  previous_balance: number;
  new_balance: number;
  tokens_used: number;
}
```

### assignLicense

```typescript
user.assignLicense(licenseKey: string): Promise<LicenseKey>
```

Assign new license key to user.

### regenerateApiKey

```typescript
user.regenerateApiKey(): Promise<{ api_key: string }>
```

Generate new API key.

### revokeApiKey

```typescript
user.revokeApiKey(): Promise<void>
```

Revoke current API key.

### getAvailableLicenseKey

```typescript
user.getAvailableLicenseKey(minTokens?: number): Promise<LicenseKey | null>
```

Get license key with sufficient tokens.

### getTokenUsageStats

```typescript
user.getTokenUsageStats(): Promise<TokenUsageStats>
```

Get token usage statistics across all user's licenses.

**Response:**

```typescript
interface TokenUsageStats {
  weeklyUsage: number;
  avgDailyUsage: number;
  estimatedDaysRemaining: number | null;
  usageHistory: TokenUsageRecord[];
}

interface TokenUsageRecord {
  date: string;
  tokensUsed: number;
}
```

### getLicenseTokenUsage

```typescript
user.getLicenseTokenUsage(
  licenseKey: string, 
  page?: number, 
  limit?: number
): Promise<LicenseTokenUsageResponse>
```

Get token usage history for a specific license.

**Response:**

```typescript
interface LicenseTokenUsageResponse {
  licenseKey: string;
  records: LicenseTokenUsage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface LicenseTokenUsage {
  id: string;
  tokensUsed: number;
  purpose?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
```

---

## TopupModule

### getPaymentMethods

```typescript
topup.getPaymentMethods(): Promise<PaymentMethodInfo[]>
```

Get available payment methods.

### requestCheckout

```typescript
topup.requestCheckout(licenseKey: string, tokenCount: number): Promise<CheckoutResponse>
```

Request top-up with checkout page.

**Response:**

```typescript
interface CheckoutResponse {
  transaction_id: string;
  amount: number;
  tokens: number;
  payment_url: string;
  expires_at: string;
}
```

### requestVA

```typescript
topup.requestVA(licenseKey: string, tokenCount: number, method: PaymentMethod): Promise<VAResponse>
```

Request top-up with Virtual Account.

**Response:**

```typescript
interface VAResponse {
  transaction_id: string;
  amount: number;
  tokens: number;
  virtual_account?: {
    number: string;
    bank: string;
    name: string;
  };
  expires_at: string;
}
```

### checkStatus

```typescript
topup.checkStatus(transactionId: string): Promise<Transaction>
```

Check transaction status.

### getHistory

```typescript
topup.getHistory(options?: HistoryOptions): Promise<PaginatedResponse<Transaction>>
```

Get transaction history.

**Parameters:**

```typescript
interface HistoryOptions {
  page?: number;
  limit?: number;
  licenseKey?: string;
}
```

### cancel

```typescript
topup.cancel(transactionId: string): Promise<void>
```

Cancel pending transaction.

### waitForCompletion

```typescript
topup.waitForCompletion(transactionId: string, options?: WaitOptions): Promise<Transaction>
```

Wait for transaction to complete.

---

## PaymentModule

### generateQRIS

```typescript
payment.generateQRIS(data: QRISRequest): Promise<QRISResponse>
```

Generate QRIS for payment.

**Parameters:**

```typescript
interface QRISRequest {
  license_key: string;
  amount: number;
  reference_id?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}
```

**Response:**

```typescript
interface QRISResponse {
  transaction_id: string;
  qris_string: string;
  qris_image_url: string;
  amount: number;
  expires_at: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
}
```

### checkPaymentStatus

```typescript
payment.checkPaymentStatus(transactionId: string): Promise<PaymentStatus>
```

Check payment status.

### waitForPayment

```typescript
payment.waitForPayment(transactionId: string, options?: WaitOptions): Promise<PaymentStatus>
```

Wait for payment to complete.

### cancelPayment

```typescript
payment.cancelPayment(transactionId: string): Promise<void>
```

Cancel payment.

---

## Enums

### PaymentMethod

```typescript
enum PaymentMethod {
  CHECKOUT_PAGE = 'checkout_page',
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
  QRIS = 'qris',
}
```

---

## Error Classes

| Class | Status Code | Description |
|-------|-------------|-------------|
| `KGiTONError` | - | Base error class |
| `AuthenticationError` | 401 | Authentication failed |
| `NotFoundError` | 404 | Resource not found |
| `ValidationError` | 400 | Validation error |
| `InsufficientTokenError` | 402 | Insufficient tokens |
| `RateLimitError` | 429 | Rate limit exceeded |
| `NetworkError` | - | Network/connection error |
| `ServerError` | 500 | Server error |

---

## Type Definitions

### LicenseKey

```typescript
interface LicenseKey {
  id: string;
  key: string;
  price_per_token: number;
  token_balance: number;
  status: 'active' | 'inactive' | 'trial';
  assigned_to: string | null;
  trial_expires_at: string | null;
  device_name?: string;
  device_serial_number?: string;
  device_model?: string;
  device_notes?: string;
  purchase_type?: 'buy' | 'rent';
  purchase_price?: number;
  rental_price_monthly?: number;
  subscription_status?: string;
  subscription_next_due_date?: string;
  subscription_expires_at?: string;
  created_at: string;
  updated_at: string;
}
```

### Transaction

```typescript
interface Transaction {
  id: string;
  user_id: string;
  license_key: string;
  amount: number;
  tokens_added: number;
  status: 'success' | 'pending' | 'expired' | 'failed' | 'cancelled';
  payment_method?: string;
  payment_reference?: string;
  gateway_provider?: string;
  gateway_transaction_id?: string;
  gateway_va_number?: string;
  gateway_payment_url?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}
```

### PaginatedResponse

```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### WaitOptions

```typescript
interface WaitOptions {
  timeout?: number;   // Default: 300000 (5 minutes)
  interval?: number;  // Default: 5000 (5 seconds)
}
```

---

## License

PT KGiTON Proprietary License - See [LICENSE](../LICENSE) for details.

---

[← Back to Index](./00_INDEX.md)
