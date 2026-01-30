# 👤 User Module

## Overview

User Module menyediakan methods untuk mengelola user profile, menggunakan token, dan manage license keys.

---

## Methods

### getProfile

Dapatkan profile user yang sedang login.

```typescript
const profile = await kgiton.user.getProfile();

console.log('User ID:', profile.id);
console.log('Name:', profile.name);
console.log('Email:', profile.email);
console.log('Role:', profile.role);
console.log('API Key:', profile.api_key);
console.log('Referral Code:', profile.referral_code);
console.log('License Keys:', profile.license_keys.length);

// List all license keys
for (const license of profile.license_keys) {
  console.log(`  - ${license.key}: ${license.token_balance} tokens`);
}
```

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

---

### getTokenBalance

Dapatkan total saldo token dari semua license keys.

```typescript
const balance = await kgiton.user.getTokenBalance();

console.log('Total Balance:', balance.total_balance);
console.log('License Keys:');
for (const lk of balance.license_keys) {
  console.log(`  ${lk.license_key}: ${lk.token_balance} tokens`);
}
```

**Response:**

```typescript
interface TokenBalanceResponse {
  license_keys: LicenseTokenBalance[];
  total_balance: number;
}

interface LicenseTokenBalance {
  id: string;
  license_key: string;
  token_balance: number;
  price_per_token: number;
  status: 'active' | 'inactive' | 'trial';
}
```

---

### useToken

Gunakan token dari license key.

```typescript
const result = await kgiton.user.useToken('LICENSE-KEY', {
  purpose: 'Weight measurement',
  metadata: {
    product_id: 'PROD-001',
    weight: 2.5,
    unit: 'kg',
    timestamp: new Date().toISOString(),
  },
});

console.log('Previous Balance:', result.previous_balance);
console.log('New Balance:', result.new_balance);
console.log('Tokens Used:', result.tokens_used);
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `licenseKey` | `string` | Yes | License key |
| `options.purpose` | `string` | No | Purpose description |
| `options.metadata` | `object` | No | Additional metadata |

**Response:**

```typescript
interface UseTokenResponse {
  license_key: string;
  previous_balance: number;
  new_balance: number;
  tokens_used: number;
}
```

---

### assignLicense

Assign license key baru ke user.

```typescript
const license = await kgiton.user.assignLicense('NEW-LICENSE-KEY');

console.log('License assigned!');
console.log('Key:', license.key);
console.log('Token Balance:', license.token_balance);
```

---

### regenerateApiKey

Generate API key baru untuk user.

```typescript
const result = await kgiton.user.regenerateApiKey();

console.log('New API Key:', result.api_key);
// ⚠️ Store this securely - only shown once!
```

---

### revokeApiKey

Revoke (hapus) API key user.

```typescript
await kgiton.user.revokeApiKey();
console.log('API Key revoked');
// API key tidak lagi valid untuk autentikasi
```

---

### getTokenUsageStats

Dapatkan statistik penggunaan token (weekly usage, average, dll).

```typescript
const stats = await kgiton.user.getTokenUsageStats();

console.log('Weekly Usage:', stats.weekly_usage);
console.log('Weekly Labels:', stats.weekly_labels);
console.log('Total This Week:', stats.total_this_week);
console.log('Avg Daily Usage:', stats.avg_daily_usage);
console.log('Est Days Remaining:', stats.est_days_remaining);
```

**Response:**

```typescript
interface TokenUsageStats {
  weekly_usage: number[];        // [12, 19, 8, 15, 22, 10, 5]
  weekly_labels: string[];       // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  total_this_week: number;       // Total usage minggu ini
  avg_daily_usage: number;       // Rata-rata harian
  est_days_remaining: number;    // Estimasi hari tersisa
}
```

---

### getLicenseTokenUsage

Dapatkan riwayat penggunaan token untuk license tertentu.

```typescript
const usage = await kgiton.user.getLicenseTokenUsage('LICENSE-KEY', 1, 20);

console.log('License:', usage.data.license_key);
console.log('Current Balance:', usage.data.current_balance);
console.log('Weekly Usage:', usage.data.weekly_usage);
console.log('Avg Daily:', usage.data.avg_daily_usage);

// Usage history
for (const record of usage.data.usage_history) {
  console.log(`${record.purpose}: -${record.tokens_used} (${record.created_at})`);
}

// Pagination
console.log(`Page ${usage.pagination.page} of ${usage.pagination.totalPages}`);
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `licenseKey` | `string` | Yes | License key |
| `page` | `number` | No | Page number (default: 1) |
| `limit` | `number` | No | Items per page (default: 20) |

**Response:**

```typescript
interface LicenseTokenUsageResponse {
  success: boolean;
  data: {
    license_key: string;
    current_balance: number;
    weekly_usage: number;
    avg_daily_usage: number;
    usage_history: TokenUsageRecord[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TokenUsageRecord {
  id: string;
  tokens_used: number;
  previous_balance: number;
  new_balance: number;
  purpose: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
```

---

### getAvailableLicenseKey

Dapatkan license key dengan token cukup untuk operasi.

```typescript
// Get any license with at least 1 token
const license = await kgiton.user.getAvailableLicenseKey();

// Get license with at least 5 tokens
const license5 = await kgiton.user.getAvailableLicenseKey(5);

if (license) {
  console.log('Using license:', license.key);
} else {
  console.log('No license with sufficient tokens');
}
```

---

## Token Usage Patterns

### Basic Token Usage

```typescript
// Simple usage (1 token)
await kgiton.user.useToken('LICENSE-KEY');

// With purpose
await kgiton.user.useToken('LICENSE-KEY', {
  purpose: 'API Request',
});

// With metadata
await kgiton.user.useToken('LICENSE-KEY', {
  purpose: 'Weight measurement',
  metadata: {
    weight: 2.5,
    product: 'Apples',
    transaction_id: 'TXN-001',
  },
});
```

### Auto-select License Key

```typescript
async function useTokenAuto(purpose: string, metadata?: Record<string, unknown>) {
  // Get available license key
  const license = await kgiton.user.getAvailableLicenseKey();
  
  if (!license) {
    throw new Error('No license with sufficient tokens');
  }
  
  // Use token
  return kgiton.user.useToken(license.key, { purpose, metadata });
}

// Usage
const result = await useTokenAuto('API Request', { endpoint: '/api/data' });
```

### Batch Token Usage

```typescript
async function useBatchTokens(licenseKey: string, count: number, purpose: string) {
  const results = [];
  
  for (let i = 0; i < count; i++) {
    const result = await kgiton.user.useToken(licenseKey, {
      purpose: `${purpose} (${i + 1}/${count})`,
    });
    results.push(result);
    
    // Check if running low
    if (result.new_balance < 10) {
      console.warn('Warning: Token balance running low!');
    }
  }
  
  return results;
}
```

---

## API Key Management

### Generate New API Key

```typescript
// User wants to rotate API key
const { api_key } = await kgiton.user.regenerateApiKey();

// Update in environment/config
console.log('Update your .env file:');
console.log(`KGITON_API_KEY=${api_key}`);

// Old API key is now invalid
```

### Secure API Key Workflow

```typescript
async function rotateApiKey() {
  // 1. Generate new key
  const { api_key } = await kgiton.user.regenerateApiKey();
  
  // 2. Store securely (e.g., secrets manager)
  await secretsManager.put('KGITON_API_KEY', api_key);
  
  // 3. Update SDK instance
  kgiton.setApiKey(api_key);
  
  // 4. Notify team (optional)
  await notifyTeam('API key rotated');
  
  return api_key;
}
```

---

## Common Use Cases

### Express.js Middleware

```typescript
import express from 'express';
import { KGiTON, InsufficientTokenError } from '@kgiton/sdk';

const kgiton = new KGiTON({
  baseUrl: process.env.KGITON_API_URL!,
  apiKey: process.env.KGITON_API_KEY!,
});

// Middleware to use token for each request
async function useKgitonToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const licenseKey = req.headers['x-license-key'] as string;
  
  if (!licenseKey) {
    return res.status(400).json({ error: 'License key required' });
  }
  
  try {
    const result = await kgiton.user.useToken(licenseKey, {
      purpose: 'API Request',
      metadata: { path: req.path, method: req.method },
    });
    
    // Attach to request for later use
    req.tokenBalance = result.new_balance;
    
    next();
  } catch (error) {
    if (error instanceof InsufficientTokenError) {
      return res.status(402).json({ 
        error: 'Insufficient tokens',
        balance: 0,
      });
    }
    next(error);
  }
}

// Usage
app.get('/api/data', useKgitonToken, (req, res) => {
  res.json({ 
    data: 'your data',
    remaining_tokens: req.tokenBalance,
  });
});
```

### Hapi.js Plugin

```typescript
import Hapi from '@hapi/hapi';
import { KGiTON } from '@kgiton/sdk';

const kgitonPlugin: Hapi.Plugin<{}> = {
  name: 'kgiton',
  register: async (server) => {
    const kgiton = new KGiTON({
      baseUrl: process.env.KGITON_API_URL!,
      apiKey: process.env.KGITON_API_KEY!,
    });
    
    // Decorate server
    server.decorate('server', 'kgiton', kgiton);
    
    // Pre-handler to use token
    server.ext('onPreHandler', async (request, h) => {
      const licenseKey = request.headers['x-license-key'];
      
      if (licenseKey && request.route.settings.plugins?.kgiton?.useToken) {
        await kgiton.user.useToken(licenseKey);
      }
      
      return h.continue;
    });
  },
};
```

---

## Error Handling

```typescript
import { 
  InsufficientTokenError, 
  NotFoundError,
  AuthenticationError,
} from '@kgiton/sdk';

try {
  await kgiton.user.useToken('LICENSE-KEY');
} catch (error) {
  if (error instanceof InsufficientTokenError) {
    console.log('Not enough tokens! Please top up.');
  } else if (error instanceof NotFoundError) {
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

```typescript
// Via main instance
await kgiton.useToken('LICENSE-KEY', { purpose: 'API' });

// Equivalent to
await kgiton.user.useToken('LICENSE-KEY', { purpose: 'API' });
```

---

[← Back to Index](./00_INDEX.md) | [Next: Topup Module →](./05_TOPUP_MODULE.md)
