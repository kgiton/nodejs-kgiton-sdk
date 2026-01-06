# 🔐 Authentication

## Overview

KGiTON SDK mendukung dua metode autentikasi:

1. **API Key** - Untuk komunikasi server-to-server (recommended)
2. **Access Token (JWT)** - Untuk user sessions

---

## API Key Authentication

API Key adalah metode autentikasi yang direkomendasikan untuk backend services.

### Setup

```typescript
const kgiton = new KGiTON({
  baseUrl: 'https://api.kgiton.com',
  apiKey: 'kgiton_your_api_key_here',
});
```

### Set API Key Dinamis

```typescript
// Set API key setelah inisialisasi
kgiton.setApiKey('kgiton_new_api_key');

// Atau update config
kgiton.updateConfig({ apiKey: 'kgiton_new_api_key' });
```

### API Key Format

```
kgiton_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- Prefix: `kgiton_`
- Length: 32 karakter random setelah prefix
- Case-sensitive

---

## Bearer Token Authentication

Bearer token untuk user-facing applications.

### Login Flow

```typescript
const kgiton = new KGiTON({
  baseUrl: 'https://api.kgiton.com',
});

// Login
const authResponse = await kgiton.auth.login({
  email: 'user@example.com',
  password: 'secure_password',
});

console.log('User:', authResponse.user.name);
console.log('Token:', authResponse.access_token);
console.log('Expires:', authResponse.expires_at);

// Token otomatis di-set setelah login
// Semua request selanjutnya akan menggunakan token ini
const profile = await kgiton.user.getProfile();
```

### Manual Token Setup

```typescript
// Set token secara manual
kgiton.setAccessToken('jwt_token_here');

// Atau via config
kgiton.updateConfig({ accessToken: 'jwt_token_here' });
```

---

## Auth Module Methods

### login

```typescript
const result = await kgiton.auth.login({
  email: 'user@example.com',
  password: 'password123',
});

// Result structure
{
  access_token: 'eyJhbGciOiJIUzI1NiIs...',
  expires_at: '2026-01-07T12:00:00Z',
  user: {
    id: 'uuid',
    name: 'John Doe',
    email: 'user@example.com',
    role: 'user',
    api_key: 'kgiton_xxx',
    license_keys: [...]
  }
}
```

### register

```typescript
const result = await kgiton.auth.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePassword123',
  phone_number: '08123456789',  // Optional
  referral_code: 'REF123',      // Optional
});

// Result: Same as login response
```

### forgotPassword

```typescript
await kgiton.auth.forgotPassword('user@example.com');
// Email will be sent with reset link
```

### logout

```typescript
// Clear local authentication state
kgiton.auth.logout();

// Atau
kgiton.clearAuth();
```

---

## Token Lifecycle

```
┌─────────────┐
│    Login    │
└──────┬──────┘
       │
       ▼
┌─────────────┐     Token stored in
│ Access Token│────────────────────────→ SDK instance
└──────┬──────┘     (auto-attached to requests)
       │
       │ 24h
       ▼
┌─────────────┐     Need to re-login
│   Expired   │────────────────────────→ 401 Unauthorized
└─────────────┘
```

### Token Expiry Handling

```typescript
try {
  await kgiton.user.getProfile();
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Token expired, need to re-login
    console.log('Token expired, redirecting to login...');
    
    // Re-login
    await kgiton.auth.login({ email, password });
    
    // Retry
    await kgiton.user.getProfile();
  }
}
```

---

## API Key Management

### Regenerate API Key

```typescript
// Regenerate API key (requires access token auth)
const result = await kgiton.user.regenerateApiKey();

console.log('New API Key:', result.api_key);
// Store this securely - only shown once!
```

### Revoke API Key

```typescript
await kgiton.user.revokeApiKey();
// API key is now invalid
```

---

## Security Best Practices

### ✅ Do's

1. **Simpan API Key di environment variables**
   ```typescript
   const kgiton = new KGiTON({
     apiKey: process.env.KGITON_API_KEY,
   });
   ```

2. **Gunakan API Key untuk backend services**
   ```typescript
   // Server-side only
   const kgiton = new KGiTON({ apiKey: 'xxx' });
   ```

3. **Gunakan Access Token untuk user sessions**
   ```typescript
   // Login per user
   await kgiton.auth.login({ email, password });
   ```

4. **Handle token expiry gracefully**
   ```typescript
   try {
     await kgiton.someMethod();
   } catch (e) {
     if (e instanceof AuthenticationError) {
       // Handle re-auth
     }
   }
   ```

### ❌ Don'ts

1. **Jangan hardcode credentials**
   ```typescript
   // ❌ Never do this!
   const kgiton = new KGiTON({
     apiKey: 'kgiton_actual_key_here',
   });
   ```

2. **Jangan expose API Key ke client-side**
   ```typescript
   // ❌ Never send to frontend!
   res.json({ apiKey: process.env.KGITON_API_KEY });
   ```

3. **Jangan share API Key**
   - Setiap environment/service harus punya key sendiri

4. **Jangan commit ke version control**
   ```gitignore
   # .gitignore
   .env
   .env.local
   ```

---

## Authentication Priority

Ketika kedua API Key dan Access Token di-set:

```typescript
const kgiton = new KGiTON({
  apiKey: 'kgiton_xxx',
  accessToken: 'jwt_xxx',
});

// API Key akan digunakan (lebih tinggi prioritas)
```

Priority order:
1. `x-api-key` header (API Key)
2. `Authorization: Bearer` header (Access Token)

---

## Error Handling

```typescript
import { AuthenticationError } from '@kgiton/sdk';

try {
  await kgiton.auth.login({ email, password });
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Invalid credentials
    console.log('Login failed:', error.message);
  }
}
```

---

## Response Types

### AuthResponse

```typescript
interface AuthResponse {
  access_token: string;
  expires_at: string;  // ISO date string
  user: User;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'super_admin';
  api_key?: string;
  phone_number?: string;
  referral_code: string;
  license_keys: LicenseKey[];
}
```

---

[← Back to Index](./00_INDEX.md) | [Next: License Module →](./03_LICENSE_MODULE.md)
