# 🔑 License Module

## Overview

License Module menyediakan methods untuk validasi license key dan pengecekan token balance.

---

## Methods

### validate

Validasi license key dan dapatkan informasi lengkap.

```typescript
const result = await kgiton.license.validate('ABCDE-12345-FGHIJ-67890-KLMNO');

console.log('Valid:', result.valid);
console.log('Status:', result.status);
console.log('Token Balance:', result.token_balance);
console.log('Price per Token:', result.price_per_token);
console.log('Device:', result.device_name);
```

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

---

### getByKey

Dapatkan detail lengkap license key.

```typescript
const license = await kgiton.license.getByKey('LICENSE-KEY');

console.log('License ID:', license.id);
console.log('Key:', license.key);
console.log('Token Balance:', license.token_balance);
console.log('Status:', license.status);
console.log('Device Name:', license.device_name);
console.log('Device Serial:', license.device_serial_number);
console.log('Purchase Type:', license.purchase_type);
console.log('Assigned To:', license.assigned_to);
```

**Response:**

```typescript
interface LicenseKey {
  id: string;
  key: string;
  price_per_token: number;
  token_balance: number;
  status: 'active' | 'inactive' | 'trial';
  assigned_to: string | null;
  trial_expires_at: string | null;
  
  // Device info
  device_name?: string;
  device_serial_number?: string;
  device_model?: string;
  device_notes?: string;
  
  // Purchase info
  purchase_type?: 'buy' | 'rent';
  purchase_price?: number;
  rental_price_monthly?: number;
  
  // Subscription tracking
  subscription_status?: string;
  subscription_next_due_date?: string;
  subscription_expires_at?: string;
  
  created_at: string;
  updated_at: string;
}
```

---

### getById

Dapatkan license key berdasarkan UUID.

```typescript
const license = await kgiton.license.getById('uuid-here');
```

---

### hasSufficientTokens

Cek apakah license memiliki cukup token.

```typescript
// Check for 1 token (default)
const hasEnough = await kgiton.license.hasSufficientTokens('LICENSE-KEY');

// Check for specific amount
const has5Tokens = await kgiton.license.hasSufficientTokens('LICENSE-KEY', 5);

if (has5Tokens) {
  console.log('Proceeding with operation...');
} else {
  console.log('Please top up your tokens');
}
```

---

### isActive

Cek apakah license aktif.

```typescript
const isActive = await kgiton.license.isActive('LICENSE-KEY');

if (isActive) {
  console.log('License is active');
} else {
  console.log('License is inactive or invalid');
}
```

---

### getTrialInfo

Dapatkan informasi trial license.

```typescript
const trialInfo = await kgiton.license.getTrialInfo('LICENSE-KEY');

if (trialInfo.isTrial) {
  console.log('License is in trial mode');
  console.log('Trial expires:', trialInfo.expiresAt);
  
  const expiresDate = new Date(trialInfo.expiresAt!);
  const daysRemaining = Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  console.log('Days remaining:', daysRemaining);
} else {
  console.log('License is not in trial mode');
}
```

---

### getTokenBalance

Dapatkan saldo token dan harga per token.

```typescript
const { balance, pricePerToken } = await kgiton.license.getTokenBalance('LICENSE-KEY');

console.log('Token Balance:', balance);
console.log('Price per Token:', pricePerToken);
console.log('Total Value:', balance * pricePerToken);
```

---

## License Status

| Status | Description |
|--------|-------------|
| `active` | License aktif dan dapat digunakan |
| `inactive` | License tidak aktif |
| `trial` | License dalam mode trial |

---

## Common Use Cases

### Validate Before Operation

```typescript
async function processWeight(licenseKey: string, weight: number) {
  // Validate license first
  const validation = await kgiton.license.validate(licenseKey);
  
  if (!validation.valid) {
    throw new Error(`Invalid license: ${validation.message}`);
  }
  
  if (validation.token_balance < 1) {
    throw new Error('Insufficient tokens. Please top up.');
  }
  
  // Proceed with operation
  const result = await kgiton.user.useToken(licenseKey, {
    purpose: 'Weight measurement',
    metadata: { weight },
  });
  
  return result;
}
```

### Check Token Balance Before Bulk Operation

```typescript
async function bulkProcess(licenseKey: string, items: number) {
  const hasSufficient = await kgiton.license.hasSufficientTokens(licenseKey, items);
  
  if (!hasSufficient) {
    const { balance } = await kgiton.license.getTokenBalance(licenseKey);
    throw new Error(`Need ${items} tokens, but only have ${balance}`);
  }
  
  // Process each item
  for (let i = 0; i < items; i++) {
    await kgiton.user.useToken(licenseKey);
  }
}
```

### Get License Info with Caching

```typescript
const licenseCache = new Map<string, { data: LicenseKey; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getLicenseWithCache(licenseKey: string): Promise<LicenseKey> {
  const cached = licenseCache.get(licenseKey);
  
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }
  
  const license = await kgiton.license.getByKey(licenseKey);
  
  licenseCache.set(licenseKey, {
    data: license,
    expiry: Date.now() + CACHE_TTL,
  });
  
  return license;
}
```

---

## Error Handling

```typescript
import { NotFoundError, AuthenticationError } from '@kgiton/sdk';

try {
  const license = await kgiton.license.getByKey('INVALID-KEY');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('License key not found');
  } else if (error instanceof AuthenticationError) {
    console.log('Authentication failed');
  } else {
    console.log('Unknown error:', error);
  }
}
```

---

## Shortcut Methods

SDK provides shortcut methods untuk operasi umum:

```typescript
// Via main instance
const balance = await kgiton.getTokenBalance('LICENSE-KEY');
const validation = await kgiton.validateLicense('LICENSE-KEY');

// Equivalent to
const balance = await kgiton.license.getTokenBalance('LICENSE-KEY');
const validation = await kgiton.license.validate('LICENSE-KEY');
```

---

[← Back to Index](./00_INDEX.md) | [Next: User Module →](./04_USER_MODULE.md)
