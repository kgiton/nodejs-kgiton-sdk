# 🚀 Getting Started

Panduan ini akan membantu Anda memulai integrasi @kgiton/sdk ke dalam aplikasi Node.js.

---

## 📋 Prerequisites

- ✅ Node.js >= 16.0.0
- ✅ npm atau yarn
- ✅ API Key atau User credentials

---

## 📦 Installation

> ⚠️ **Note:** SDK ini tidak dipublikasikan ke npm registry. Instalasi dilakukan langsung dari repository GitHub.

### Menggunakan npm

```bash
npm install git+https://github.com/kgiton/nodejs-kgiton-sdk.git
```

### Menggunakan yarn

```bash
yarn add git+https://github.com/kgiton/nodejs-kgiton-sdk.git
```

### Menggunakan SSH

```bash
npm install git+ssh://git@github.com:kgiton/nodejs-kgiton-sdk.git
```

### Tambahkan di package.json

```json
{
  "dependencies": {
    "@kgiton/sdk": "git+https://github.com/kgiton/nodejs-kgiton-sdk.git"
  }
}
```

### Install Specific Version

```bash
# Install version tag
npm install git+https://github.com/kgiton/nodejs-kgiton-sdk.git#v1.0.0

# Install specific branch
npm install git+https://github.com/kgiton/nodejs-kgiton-sdk.git#main
```

---

## ⚙️ Basic Setup

### TypeScript

```typescript
import { KGiTON } from '@kgiton/sdk';

// Initialize with API Key (recommended for backend)
const kgiton = new KGiTON({
  baseUrl: 'https://api.kgiton.com',
  apiKey: process.env.KGITON_API_KEY,
});

// Or use factory function
import { createKGiTON } from '@kgiton/sdk';

const kgiton = createKGiTON({
  baseUrl: 'https://api.kgiton.com',
  apiKey: process.env.KGITON_API_KEY,
});
```

### JavaScript (CommonJS)

```javascript
const { KGiTON } = require('@kgiton/sdk');

const kgiton = new KGiTON({
  baseUrl: 'https://api.kgiton.com',
  apiKey: process.env.KGITON_API_KEY,
});
```

### JavaScript (ESM)

```javascript
import { KGiTON } from '@kgiton/sdk';

const kgiton = new KGiTON({
  baseUrl: 'https://api.kgiton.com',
  apiKey: process.env.KGITON_API_KEY,
});
```

---

## 🔧 Configuration Options

```typescript
const kgiton = new KGiTON({
  // Required
  baseUrl: 'https://api.kgiton.com',
  
  // Authentication (pilih salah satu)
  apiKey: 'kgiton_xxxxx',      // Untuk server-to-server
  accessToken: 'jwt_xxxxx',     // Untuk user session
  
  // Optional
  timeout: 30000,               // Request timeout (default: 30s)
  debug: true,                  // Enable debug logging
  retryAttempts: 3,             // Retry attempts (default: 3)
  retryDelay: 1000,             // Retry delay ms (default: 1000)
  
  // Custom headers
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

---

## 🔐 Authentication Methods

### 1. API Key (Recommended for Backend)

API Key adalah metode autentikasi yang direkomendasikan untuk komunikasi server-to-server.

```typescript
const kgiton = new KGiTON({
  baseUrl: 'https://api.kgiton.com',
  apiKey: process.env.KGITON_API_KEY,
});

// Validate license
const result = await kgiton.license.validate('LICENSE-KEY');
```

**Cara mendapatkan API Key:**
1. Login ke dashboard KGiTON
2. Masuk ke Settings > API Keys
3. Generate new API Key
4. Simpan dengan aman (hanya ditampilkan sekali)

### 2. Access Token (For User Sessions)

Access token untuk autentikasi berbasis user session.

```typescript
const kgiton = new KGiTON({
  baseUrl: 'https://api.kgiton.com',
});

// Login untuk mendapatkan token
const { access_token } = await kgiton.auth.login({
  email: 'user@example.com',
  password: 'password123',
});

// Token otomatis di-set setelah login
const profile = await kgiton.user.getProfile();
```

---

## 🏁 Quick Start Examples

### Validasi License Key

```typescript
const validation = await kgiton.license.validate('ABCDE-12345-FGHIJ-67890-KLMNO');

if (validation.valid) {
  console.log('License valid!');
  console.log('Token balance:', validation.token_balance);
  console.log('Status:', validation.status);
} else {
  console.log('License invalid:', validation.message);
}
```

### Gunakan Token

```typescript
const result = await kgiton.user.useToken('LICENSE-KEY', {
  purpose: 'Weight measurement',
  metadata: { weight: 2.5, unit: 'kg' },
});

console.log('Previous balance:', result.previous_balance);
console.log('New balance:', result.new_balance);
console.log('Tokens used:', result.tokens_used);
```

### Request Top-up

```typescript
const checkout = await kgiton.topup.requestCheckout('LICENSE-KEY', 100);

console.log('Pay at:', checkout.payment_url);
console.log('Amount:', checkout.amount);
console.log('Expires:', checkout.expires_at);
```

---

## 📁 Project Structure

```
nodejs-kgiton-sdk/
├── src/
│   ├── index.ts           # Main entry point
│   ├── core/
│   │   └── httpClient.ts  # HTTP client with axios
│   ├── modules/
│   │   ├── auth.ts        # Auth module
│   │   ├── license.ts     # License module
│   │   ├── user.ts        # User module
│   │   ├── topup.ts       # Topup module
│   │   └── payment.ts     # Payment module
│   └── types/
│       └── index.ts       # TypeScript types
├── docs/                   # Documentation
├── package.json
└── tsconfig.json
```

---

## 🧪 Debug Mode

Enable debug mode untuk melihat request/response logs:

```typescript
const kgiton = new KGiTON({
  baseUrl: 'https://api.kgiton.com',
  apiKey: 'xxx',
  debug: true,  // Enable debug logging
});
```

Output:
```
[KGiTON] → GET /api/license/validate/LICENSE-KEY
[KGiTON] ← 200 OK (125ms)
[KGiTON] Response: { valid: true, token_balance: 500 }
```

---

## 📊 Environment Variables

Recommended `.env` configuration:

```env
# KGiTON API Configuration
KGITON_API_URL=https://api.kgiton.com
KGITON_API_KEY=kgiton_xxxxx

# Optional
KGITON_TIMEOUT=30000
KGITON_DEBUG=false
```

Usage:
```typescript
import { KGiTON } from '@kgiton/sdk';

const kgiton = new KGiTON({
  baseUrl: process.env.KGITON_API_URL!,
  apiKey: process.env.KGITON_API_KEY!,
  timeout: parseInt(process.env.KGITON_TIMEOUT || '30000'),
  debug: process.env.KGITON_DEBUG === 'true',
});
```

---

## Next Steps

- [Authentication](./02_AUTHENTICATION.md) - Detail autentikasi
- [License Module](./03_LICENSE_MODULE.md) - Validasi license
- [User Module](./04_USER_MODULE.md) - Manage users & tokens

---

[← Back to Index](./00_INDEX.md) | [Next: Authentication →](./02_AUTHENTICATION.md)
