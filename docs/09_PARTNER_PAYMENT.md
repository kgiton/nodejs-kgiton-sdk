# 💳 Partner Payment Module

Partner Payment module memungkinkan partner untuk generate payment (QRIS atau Checkout Page) menggunakan license key mereka.

## 📋 Daftar Isi

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Generate QRIS Payment](#generate-qris-payment)
4. [Generate Checkout Page](#generate-checkout-page)
5. [Webhook Integration](#webhook-integration)
6. [Response Structure](#response-structure)
7. [Error Handling](#error-handling)

---

## Overview

Partner Payment API memungkinkan partner KGiTON untuk:
- Generate QRIS QR code untuk pembayaran
- Generate Checkout Page URL untuk pembayaran
- Menerima callback webhook saat pembayaran berhasil

**Biaya:** Setiap payment generation akan mengurangi 1 token dari license key.

### Payment Types

| Type | Description | Default Expiry |
|------|-------------|----------------|
| `QRIS` | Generate QRIS QR Code | 30 menit |
| `CHECKOUT_PAGE` | Generate URL ke halaman checkout | 120 menit |

---

## Authentication

Partner Payment memerlukan API Key authentication:

```typescript
import { KGiTON } from '@kgiton/sdk';

const sdk = new KGiTON({
  baseUrl: 'https://api.kgiton.com',
  apiKey: 'kgiton_your_api_key_here'
});
```

---

## Generate QRIS Payment

### Menggunakan Method `generateQris()`

```typescript
const payment = await sdk.partnerPayment.generateQris({
  transactionId: 'TRX-2026-001',
  amount: 50000,
  licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
  description: 'Laundry Payment',
  expiryMinutes: 30, // optional, default 30
  webhookUrl: 'https://api.partner.com/webhook/payment',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '081234567890',
});

console.log('QRIS URL:', payment.qris?.qr_image_url);
console.log('QRIS Content:', payment.qris?.qr_content);
console.log('Expires at:', payment.expires_at);
```

### Response

```json
{
  "success": true,
  "payment_id": "PAY-ABC123",
  "transaction_id": "TRX-2026-001",
  "amount": 50000,
  "payment_type": "QRIS",
  "payment_url": null,
  "expires_at": "2026-01-15T10:30:00Z",
  "qris": {
    "qr_content": "00020101021126...",
    "qr_image_url": "https://winpay.id/qr/..."
  }
}
```

---

## Generate Checkout Page

### Menggunakan Method `generateCheckoutPage()`

```typescript
const payment = await sdk.partnerPayment.generateCheckoutPage({
  transactionId: 'TRX-2026-002',
  amount: 150000,
  licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
  description: 'Invoice #12345',
  backUrl: 'https://myapp.com/payment/complete',
  expiryMinutes: 120, // optional, default 120
  webhookUrl: 'https://api.partner.com/webhook/payment',
  items: [
    { id: '1', name: 'Laundry 5kg', price: 100000, quantity: 1 },
    { id: '2', name: 'Extra Parfum', price: 25000, quantity: 2 },
  ],
  customerName: 'Jane Doe',
  customerEmail: 'jane@example.com',
  customerPhone: '081234567890',
});

// Redirect user ke checkout page
console.log('Checkout URL:', payment.payment_url);
```

### Response

```json
{
  "success": true,
  "payment_id": "PAY-DEF456",
  "transaction_id": "TRX-2026-002",
  "amount": 150000,
  "payment_type": "CHECKOUT_PAGE",
  "payment_url": "https://pay.winpay.id/checkout/...",
  "expires_at": "2026-01-15T12:00:00Z",
  "qris": null
}
```

---

## Menggunakan Method `generate()` (Raw)

Untuk kontrol penuh, gunakan method `generate()`:

```typescript
import { PartnerPaymentType } from '@kgiton/sdk';

const payment = await sdk.partnerPayment.generate({
  transaction_id: 'TRX-2026-003',
  amount: 75000,
  license_key: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
  payment_type: PartnerPaymentType.QRIS,
  description: 'Custom payment',
  expiry_minutes: 45,
  webhook_url: 'https://api.partner.com/webhook',
  customer_name: 'John Doe',
  customer_email: 'john@example.com',
  customer_phone: '081234567890',
});
```

---

## Webhook Integration

Saat pembayaran berhasil, KGiTON akan mengirim POST request ke `webhook_url`:

### Webhook Payload

```json
{
  "event": "payment.success",
  "payment_id": "PAY-ABC123",
  "transaction_id": "TRX-2026-001",
  "amount": 50000,
  "payment_type": "QRIS",
  "paid_at": "2026-01-15T10:25:00Z",
  "signature": "sha256_hmac_signature"
}
```

### Verifying Webhook Signature

```typescript
import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Express middleware
app.post('/webhook/payment', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-kgiton-signature'] as string;
  const payload = req.body.toString();
  
  if (!verifyWebhook(payload, signature, 'your_webhook_secret')) {
    return res.status(401).send('Invalid signature');
  }
  
  const data = JSON.parse(payload);
  
  // Process payment success
  console.log('Payment successful:', data.transaction_id);
  
  res.status(200).send('OK');
});
```

---

## Response Structure

### PartnerPaymentResponse

```typescript
interface PartnerPaymentResponse {
  success: boolean;
  payment_id: string;
  transaction_id: string;
  amount: number;
  payment_type: 'QRIS' | 'CHECKOUT_PAGE';
  payment_url: string | null;  // Only for CHECKOUT_PAGE
  expires_at: string;
  qris?: {
    qr_content: string;
    qr_image_url: string;
  } | null;
}
```

---

## Error Handling

```typescript
try {
  const payment = await sdk.partnerPayment.generateQris({
    transactionId: 'TRX-001',
    amount: 50000,
    licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
  });
} catch (error) {
  if (error.code === 'INSUFFICIENT_TOKENS') {
    console.error('Token tidak cukup, silakan top-up');
  } else if (error.code === 'INVALID_LICENSE') {
    console.error('License key tidak valid');
  } else if (error.code === 'LICENSE_EXPIRED') {
    console.error('License key sudah expired');
  } else {
    console.error('Error:', error.message);
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `INSUFFICIENT_TOKENS` | Saldo token tidak cukup (min 1) |
| `INVALID_LICENSE` | License key tidak ditemukan |
| `LICENSE_EXPIRED` | License key sudah expired |
| `INVALID_AMOUNT` | Amount harus >= 1000 |
| `INVALID_PAYMENT_TYPE` | Payment type tidak valid |
| `GATEWAY_ERROR` | Error dari payment gateway |

---

## Complete Example

```typescript
import { KGiTON, PartnerPaymentType } from '@kgiton/sdk';

const sdk = new KGiTON({
  baseUrl: 'https://api.kgiton.com',
  apiKey: 'kgiton_your_api_key'
});

async function createPayment(orderId: string, amount: number) {
  try {
    // For small amounts, use QRIS
    if (amount < 100000) {
      const payment = await sdk.partnerPayment.generateQris({
        transactionId: orderId,
        amount,
        licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
        description: `Order #${orderId}`,
        webhookUrl: 'https://api.myapp.com/webhook/payment',
      });
      
      return {
        type: 'qris',
        qrUrl: payment.qris?.qr_image_url,
        expiresAt: payment.expires_at,
      };
    }
    
    // For larger amounts, use Checkout Page
    const payment = await sdk.partnerPayment.generateCheckoutPage({
      transactionId: orderId,
      amount,
      licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
      description: `Order #${orderId}`,
      backUrl: `https://myapp.com/orders/${orderId}`,
      webhookUrl: 'https://api.myapp.com/webhook/payment',
    });
    
    return {
      type: 'checkout',
      checkoutUrl: payment.payment_url,
      expiresAt: payment.expires_at,
    };
    
  } catch (error) {
    console.error('Payment creation failed:', error.message);
    throw error;
  }
}
```

---

## Lihat Juga

- [Topup Module](./05_TOPUP_MODULE.md) - Top-up token
- [Payment Module](./06_PAYMENT_MODULE.md) - Integrasi pembayaran lainnya
- [Error Handling](./07_ERROR_HANDLING.md) - Error handling lengkap

---

**PT KGiTON** © 2026
