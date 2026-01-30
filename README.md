# KGiTON SDK for Node.js

<p align="center">
  <img src="src/assets/logo/logo.png" alt="KGiTON Logo" width="200"/>
</p>

<p align="center">
  <strong>Official Node.js SDK untuk KGiTON Core API</strong>
</p>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#authentication">Authentication</a> •
  <a href="#modules">Modules</a> •
  <a href="#examples">Examples</a>
</p>

---

## 🏆 Features

- ✅ **Full TypeScript Support** - Complete type definitions for all API responses
- ✅ **Multiple Auth Methods** - Support for API Key and Bearer Token authentication
- ✅ **Auto Retry** - Automatic retry with exponential backoff for failed requests
- ✅ **Error Handling** - Comprehensive error types for better error handling
- ✅ **Modular Design** - Separate modules for License, User, Topup, and Auth
- ✅ **Debug Mode** - Optional debug logging for development
- ✅ **Bonus Tokens** - Earn bonus tokens based on purchase amount

### 🎁 Bonus Token Tiers

| Token Range | Bonus |
|-------------|-------|
| 100 - 499 | 0 |
| 500 - 999 | +25 |
| 1,000 - 4,999 | +100 |
| 5,000 - 9,999 | +750 |
| 10,000+ | +2,000 |

## 📦 Installation

> ⚠️ **Note:** SDK ini tidak dipublikasikan ke npm registry. Instalasi dilakukan langsung dari repository GitHub.

### Menggunakan HTTPS

```bash
npm install git+https://github.com/kgiton/nodejs-kgiton-sdk.git
# atau
yarn add git+https://github.com/kgiton/nodejs-kgiton-sdk.git
```

### Menggunakan SSH

```bash
npm install git+ssh://git@github.com:kgiton/nodejs-kgiton-sdk.git
```

### Menggunakan Tag/Version Tertentu

```bash
# Install specific version tag
npm install git+https://github.com/kgiton/nodejs-kgiton-sdk.git#v1.0.0

# Install specific branch
npm install git+https://github.com/kgiton/nodejs-kgiton-sdk.git#main
```

### Atau tambahkan di package.json

```json
{
  "dependencies": {
    "@kgiton/sdk": "git+https://github.com/kgiton/nodejs-kgiton-sdk.git"
  }
}
```

## 🏁 Quick Start

### Using API Key (Recommended for Backend)

```typescript
import { KGiTON } from '@kgiton/sdk';

// Initialize SDK with API Key
const kgiton = new KGiTON({
  baseUrl: 'https://api.kgiton.com',
  apiKey: 'kgiton_your_api_key_here',
});

// Validate a license key
const validation = await kgiton.license.validate('ABCDE-12345-FGHIJ-67890-KLMNO');
console.log('Valid:', validation.valid);
console.log('Token balance:', validation.token_balance);

// Use 1 token
const result = await kgiton.user.useToken('ABCDE-12345-FGHIJ-67890-KLMNO', {
  purpose: 'Weight measurement',
  metadata: { productId: '123', weight: 2.5 }
});
console.log('Remaining tokens:', result.new_balance);
```

### Using Access Token (For User Sessions)

```typescript
import { KGiTON } from '@kgiton/sdk';

// Initialize SDK
const kgiton = new KGiTON({
  baseUrl: 'https://api.kgiton.com',
});

// Login to get access token
const { access_token, user } = await kgiton.auth.login({
  email: 'user@example.com',
  password: 'password123'
});
// Access token is automatically set after login

// Get user profile
const profile = await kgiton.user.getProfile();
console.log('Welcome,', profile.name);
```

## 🔐 Authentication

### API Key Authentication

Best for server-to-server communication. Get your API key from the KGiTON dashboard.

```typescript
const kgiton = new KGiTON({
  baseUrl: 'https://api.kgiton.com',
  apiKey: process.env.KGITON_API_KEY,
});
```

### Bearer Token Authentication

Best for user-facing applications with login sessions.

```typescript
const kgiton = new KGiTON({
  baseUrl: 'https://api.kgiton.com',
  accessToken: 'jwt_token_here',
});

// Or set it after login
await kgiton.auth.login({ email, password });
// Token is automatically set
```

## 📚 Modules

### License Module

```typescript
// Validate license key
const validation = await kgiton.license.validate('LICENSE-KEY');

// Get license details
const license = await kgiton.license.getByKey('LICENSE-KEY');

// Check if license has sufficient tokens
const hasSufficientTokens = await kgiton.license.hasSufficientTokens('LICENSE-KEY', 5);

// Check if license is active
const isActive = await kgiton.license.isActive('LICENSE-KEY');

// Get trial info
const trialInfo = await kgiton.license.getTrialInfo('LICENSE-KEY');

// Get token balance
const { balance, pricePerToken } = await kgiton.license.getTokenBalance('LICENSE-KEY');
```

### User Module

```typescript
// Get user profile with all license keys
const profile = await kgiton.user.getProfile();

// Get total token balance across all licenses
const balance = await kgiton.user.getTokenBalance();
console.log('Total tokens:', balance.total_balance);

// Use 1 token from a license key
const result = await kgiton.user.useToken('LICENSE-KEY', {
  purpose: 'API Request',
  metadata: { endpoint: '/api/data' }
});

// Assign a new license key to user
const license = await kgiton.user.assignLicense('NEW-LICENSE-KEY');

// Regenerate API key
const { api_key } = await kgiton.user.regenerateApiKey();

// Revoke API key
await kgiton.user.revokeApiKey();

// Get available license key with sufficient tokens
const availableLicense = await kgiton.user.getAvailableLicenseKey(5);
```

### Topup Module

```typescript
import { PaymentMethod } from '@kgiton/sdk';

// Get bonus tiers configuration
const tiers = await kgiton.topup.getBonusTiers();
tiers.forEach(tier => console.log(`${tier.min_tokens}+ tokens: +${tier.bonus_tokens} bonus`));

// Get available payment methods
const methods = await kgiton.topup.getPaymentMethods();

// Request top-up with checkout page (recommended)
// Example: 1000 tokens + 100 bonus = 1100 total
const checkout = await kgiton.topup.requestCheckout('LICENSE-KEY', 1000);
console.log('Tokens:', checkout.tokens_requested);
console.log('Bonus:', checkout.bonus_tokens);     // +100
console.log('Total:', checkout.total_tokens);     // 1100
console.log('Pay at:', checkout.payment_url);

// Request top-up with Virtual Account
const va = await kgiton.topup.requestVA('LICENSE-KEY', 1000, PaymentMethod.VA_BRI);
console.log('VA Number:', va.virtual_account?.number);
console.log('Bonus:', va.bonus_tokens);

// Check transaction status
const status = await kgiton.topup.checkStatus('transaction-id');

// Get transaction history
const history = await kgiton.topup.getHistory();

// Cancel pending transaction
await kgiton.topup.cancel('transaction-id');

// Wait for transaction to complete (polling)
const finalStatus = await kgiton.topup.waitForCompletion('transaction-id', {
  timeout: 300000, // 5 minutes
  interval: 5000   // check every 5 seconds
});
```

### Auth Module

```typescript
// Login
const { access_token, user } = await kgiton.auth.login({
  email: 'user@example.com',
  password: 'password123'
});

// Register
const result = await kgiton.auth.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword123',
  phone_number: '08123456789'
});

// Forgot password
await kgiton.auth.forgotPassword('user@example.com');

// Logout (clear local auth state)
kgiton.auth.logout();
```

## ⚙️ Configuration

```typescript
const kgiton = new KGiTON({
  // Required
  baseUrl: 'https://api.kgiton.com',
  
  // Authentication (choose one)
  apiKey: 'kgiton_xxx',        // For API Key auth
  accessToken: 'jwt_xxx',       // For Bearer token auth
  
  // Optional
  timeout: 30000,               // Request timeout (default: 30s)
  debug: true,                  // Enable debug logging
  retryAttempts: 3,             // Number of retry attempts
  retryDelay: 1000,             // Delay between retries (ms)
  
  // Custom headers
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

## 🛡️ Error Handling

```typescript
import { 
  KGiTONError, 
  AuthenticationError, 
  InsufficientTokenError,
  NotFoundError 
} from '@kgiton/sdk';

try {
  await kgiton.user.useToken('LICENSE-KEY');
} catch (error) {
  if (error instanceof InsufficientTokenError) {
    console.log('Not enough tokens! Please top up.');
  } else if (error instanceof AuthenticationError) {
    console.log('Invalid or expired authentication.');
  } else if (error instanceof NotFoundError) {
    console.log('License key not found.');
  } else if (error instanceof KGiTONError) {
    console.log(`Error ${error.code}: ${error.message}`);
  }
}
```

### Error Types

| Error Class | Status Code | Description |
|-------------|-------------|-------------|
| `AuthenticationError` | 401 | Invalid or missing authentication |
| `AuthorizationError` | 403 | Access denied |
| `NotFoundError` | 404 | Resource not found |
| `ValidationError` | 400 | Invalid request data |
| `InsufficientTokenError` | 400 | Not enough token balance |
| `RateLimitError` | 429 | Too many requests |
| `NetworkError` | - | Network connectivity issues |

## 📖 Examples

### Integration with Express.js

```typescript
import express from 'express';
import { KGiTON, InsufficientTokenError } from '@kgiton/sdk';

const app = express();
const kgiton = new KGiTON({
  baseUrl: process.env.KGITON_API_URL!,
  apiKey: process.env.KGITON_API_KEY!,
});

// Middleware to check and use token
async function useKGiTONToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const licenseKey = req.headers['x-license-key'] as string;
  
  if (!licenseKey) {
    return res.status(400).json({ error: 'License key required' });
  }
  
  try {
    const result = await kgiton.user.useToken(licenseKey, {
      purpose: 'API Request',
      metadata: { 
        endpoint: req.path, 
        method: req.method 
      }
    });
    
    req.tokenBalance = result.new_balance;
    next();
  } catch (error) {
    if (error instanceof InsufficientTokenError) {
      return res.status(402).json({ error: 'Insufficient tokens', balance: 0 });
    }
    next(error);
  }
}

// Protected route
app.get('/api/weight', useKGiTONToken, (req, res) => {
  res.json({ 
    weight: 2.5, 
    remainingTokens: req.tokenBalance 
  });
});

app.listen(3000);
```

### Integration with Hapi.js

```typescript
import Hapi from '@hapi/hapi';
import { KGiTON } from '@kgiton/sdk';

const kgiton = new KGiTON({
  baseUrl: process.env.KGITON_API_URL!,
  apiKey: process.env.KGITON_API_KEY!,
});

const server = Hapi.server({ port: 3000 });

server.ext('onPreHandler', async (request, h) => {
  const licenseKey = request.headers['x-license-key'];
  
  if (licenseKey && await kgiton.license.isActive(licenseKey)) {
    request.app.licenseValid = true;
  }
  
  return h.continue;
});

await server.start();
```

## 🔄 Migrating from Direct API Calls

**Before (direct fetch/axios):**
```typescript
const response = await fetch(`${API_URL}/api/user/license-keys/${licenseKey}/use-token`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  }
});
const data = await response.json();
```

**After (with SDK):**
```typescript
const result = await kgiton.user.useToken(licenseKey);
```

## 📝 TypeScript Support

Full TypeScript support with complete type definitions:

```typescript
import { 
  KGiTON, 
  LicenseKey, 
  UserProfile, 
  PaymentMethod,
  TransactionStatus 
} from '@kgiton/sdk';

const kgiton = new KGiTON({ baseUrl: '...' });

// Fully typed responses
const license: LicenseKey = await kgiton.license.getByKey('...');
const profile: UserProfile = await kgiton.user.getProfile();
```

## 📄 License

Proprietary © 2026 PT KGiTON. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## � Documentation

Lihat dokumentasi lengkap di folder `docs/`:

- [Index & Overview](./docs/00_INDEX.md)
- [Getting Started](./docs/01_GETTING_STARTED.md)
- [Authentication](./docs/02_AUTHENTICATION.md)
- [License Module](./docs/03_LICENSE_MODULE.md)
- [User Module](./docs/04_USER_MODULE.md)
- [Topup Module](./docs/05_TOPUP_MODULE.md)
- [Payment Module](./docs/06_PAYMENT_MODULE.md)
- [Error Handling](./docs/07_ERROR_HANDLING.md)
- [API Reference](./docs/08_API_REFERENCE.md)

## 🔗 Links

- [API Documentation](https://api.kgiton.com/api-docs)
- [GitHub](https://github.com/kgiton/nodejs-kgiton-sdk)
