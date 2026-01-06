# 💳 Topup Module

## Overview

Topup Module menyediakan methods untuk request top-up token, mendapatkan payment methods, cek status transaksi, dan melihat history.

---

## Payment Methods

```typescript
enum PaymentMethod {
  // Checkout Page (recommended)
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
  
  // Retail
  VA_INDOMARET = 'va_indomaret',
  VA_ALFAMART = 'va_alfamart',
  
  // QRIS
  QRIS = 'qris',
}
```

---

## Methods

### getPaymentMethods

Dapatkan daftar payment methods yang tersedia.

```typescript
const methods = await kgiton.topup.getPaymentMethods();

for (const method of methods) {
  console.log(`${method.code}: ${method.name}`);
  console.log(`  Fee: ${method.fee_type} - ${method.fee_amount}`);
  console.log(`  Min: ${method.min_amount}, Max: ${method.max_amount}`);
}
```

**Response:**

```typescript
interface PaymentMethodInfo {
  code: string;           // e.g., 'va_bri'
  name: string;           // e.g., 'Virtual Account BRI'
  fee_type: 'flat' | 'percentage';
  fee_amount: number;
  min_amount: number;
  max_amount: number;
  is_active: boolean;
}
```

---

### requestCheckout

Request top-up dengan checkout page (recommended).

```typescript
const checkout = await kgiton.topup.requestCheckout('LICENSE-KEY', 100);

console.log('Transaction ID:', checkout.transaction_id);
console.log('Amount:', checkout.amount);
console.log('Tokens:', checkout.tokens);
console.log('Payment URL:', checkout.payment_url);
console.log('Expires:', checkout.expires_at);

// Redirect user to payment URL
// window.location.href = checkout.payment_url;
```

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

---

### requestVA

Request top-up dengan Virtual Account.

```typescript
import { PaymentMethod } from '@kgiton/sdk';

const va = await kgiton.topup.requestVA(
  'LICENSE-KEY', 
  100, 
  PaymentMethod.VA_BRI
);

console.log('Transaction ID:', va.transaction_id);
console.log('Amount:', va.amount);
console.log('VA Number:', va.virtual_account?.number);
console.log('Bank:', va.virtual_account?.bank);
console.log('Expires:', va.expires_at);
```

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

---

### checkStatus

Cek status transaksi.

```typescript
const status = await kgiton.topup.checkStatus('transaction-id');

console.log('Transaction ID:', status.id);
console.log('Status:', status.status);
console.log('Amount:', status.amount);
console.log('Tokens:', status.tokens_added);

switch (status.status) {
  case 'success':
    console.log('Payment successful! Tokens added.');
    break;
  case 'pending':
    console.log('Waiting for payment...');
    break;
  case 'expired':
    console.log('Payment window expired.');
    break;
  case 'failed':
    console.log('Payment failed.');
    break;
}
```

**Response:**

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

---

### getHistory

Dapatkan history transaksi.

```typescript
// Get all transactions
const history = await kgiton.topup.getHistory();

console.log('Total transactions:', history.total);
for (const tx of history.data) {
  console.log(`${tx.id}: ${tx.amount} - ${tx.status}`);
}

// With pagination
const page2 = await kgiton.topup.getHistory({ page: 2, limit: 10 });

// Filter by license key
const licenseHistory = await kgiton.topup.getHistory({
  licenseKey: 'LICENSE-KEY',
});
```

**Response:**

```typescript
interface PaginatedResponse<Transaction> {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

---

### cancel

Batalkan transaksi pending.

```typescript
try {
  await kgiton.topup.cancel('transaction-id');
  console.log('Transaction cancelled');
} catch (error) {
  console.log('Cannot cancel:', error.message);
}
```

---

### waitForCompletion

Polling untuk menunggu transaksi selesai.

```typescript
try {
  const finalStatus = await kgiton.topup.waitForCompletion('transaction-id', {
    timeout: 300000,  // 5 minutes
    interval: 5000,   // Check every 5 seconds
  });
  
  if (finalStatus.status === 'success') {
    console.log('Payment successful!');
    console.log('Tokens added:', finalStatus.tokens_added);
  }
} catch (error) {
  if (error.message.includes('timeout')) {
    console.log('Payment timeout - please check manually');
  }
}
```

---

## Top-up Flow

```
┌─────────────────────┐
│  Request Top-up     │
│  (checkout/VA)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐     User pays via
│  Payment Pending    │────────────────────→ Payment Gateway
└──────────┬──────────┘
           │
           │ Webhook / Polling
           ▼
┌─────────────────────┐
│  Payment Success    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Tokens Added       │
│  to License         │
└─────────────────────┘
```

---

## Common Use Cases

### Simple Checkout Flow

```typescript
async function topupTokens(licenseKey: string, tokenCount: number) {
  // 1. Request checkout
  const checkout = await kgiton.topup.requestCheckout(licenseKey, tokenCount);
  
  console.log('Please pay at:', checkout.payment_url);
  console.log('Amount:', checkout.amount);
  console.log('Expires:', checkout.expires_at);
  
  return checkout;
}
```

### Wait for Payment with Timeout

```typescript
async function topupAndWait(licenseKey: string, tokenCount: number) {
  // 1. Request checkout
  const checkout = await kgiton.topup.requestCheckout(licenseKey, tokenCount);
  
  console.log('Payment URL:', checkout.payment_url);
  
  // 2. Wait for payment (polling)
  try {
    const result = await kgiton.topup.waitForCompletion(checkout.transaction_id, {
      timeout: 5 * 60 * 1000,  // 5 minutes
      interval: 3000,          // Check every 3 seconds
    });
    
    if (result.status === 'success') {
      console.log('Payment successful!');
      console.log('New balance:', result.tokens_added, 'tokens added');
      return result;
    }
  } catch (error) {
    console.log('Payment not completed within timeout');
    console.log('Transaction ID:', checkout.transaction_id);
    console.log('Please check status manually');
  }
}
```

### Handle Multiple Payment Methods

```typescript
import { PaymentMethod } from '@kgiton/sdk';

async function topupWithMethod(
  licenseKey: string, 
  tokenCount: number, 
  method: PaymentMethod
) {
  switch (method) {
    case PaymentMethod.CHECKOUT_PAGE:
      return kgiton.topup.requestCheckout(licenseKey, tokenCount);
      
    case PaymentMethod.VA_BRI:
    case PaymentMethod.VA_BNI:
    case PaymentMethod.VA_BCA:
    case PaymentMethod.VA_MANDIRI:
      return kgiton.topup.requestVA(licenseKey, tokenCount, method);
      
    default:
      throw new Error(`Unsupported payment method: ${method}`);
  }
}
```

### Express.js Top-up Endpoint

```typescript
import express from 'express';
import { KGiTON } from '@kgiton/sdk';

const app = express();
const kgiton = new KGiTON({
  baseUrl: process.env.KGITON_API_URL!,
  apiKey: process.env.KGITON_API_KEY!,
});

// Request top-up
app.post('/api/topup', async (req, res) => {
  try {
    const { licenseKey, tokenCount } = req.body;
    
    const checkout = await kgiton.topup.requestCheckout(licenseKey, tokenCount);
    
    res.json({
      success: true,
      transaction_id: checkout.transaction_id,
      payment_url: checkout.payment_url,
      amount: checkout.amount,
      expires_at: checkout.expires_at,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Check status
app.get('/api/topup/:transactionId/status', async (req, res) => {
  try {
    const status = await kgiton.topup.checkStatus(req.params.transactionId);
    res.json({ success: true, ...status });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Webhook handler
app.post('/api/webhook/payment', async (req, res) => {
  // Payment gateway will call this endpoint
  // Verify signature and process payment
  console.log('Payment webhook:', req.body);
  res.json({ received: true });
});
```

---

## Transaction Status

| Status | Description |
|--------|-------------|
| `pending` | Waiting for payment |
| `success` | Payment completed, tokens added |
| `failed` | Payment failed |
| `expired` | Payment window expired |
| `cancelled` | Transaction cancelled |

---

## Shortcut Methods

```typescript
// Via main instance
await kgiton.requestTopup('LICENSE-KEY', 100);

// Equivalent to
await kgiton.topup.requestCheckout('LICENSE-KEY', 100);
```

---

[← Back to Index](./00_INDEX.md) | [Next: Payment Module →](./06_PAYMENT_MODULE.md)
