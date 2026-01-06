# 💵 Payment Module

## Overview

Payment Module menyediakan methods untuk integrasi partner payment, termasuk generate QRIS untuk transaksi POS.

---

## Use Case

Payment Module digunakan untuk:
- **Partner Integration** - Integrasi dengan sistem POS partner
- **QRIS Generation** - Generate QRIS untuk transaksi langsung
- **Transaction Tracking** - Track status pembayaran

---

## Methods

### generateQRIS

Generate QRIS untuk transaksi partner.

```typescript
const qris = await kgiton.payment.generateQRIS({
  license_key: 'LICENSE-KEY',
  amount: 50000,
  reference_id: 'TXN-001',
  description: 'Purchase at Store ABC',
  metadata: {
    store_id: 'STORE-001',
    cashier_id: 'CASHIER-001',
    items: ['Apple', 'Orange'],
  },
});

console.log('Transaction ID:', qris.transaction_id);
console.log('QRIS String:', qris.qris_string);
console.log('QRIS Image URL:', qris.qris_image_url);
console.log('Amount:', qris.amount);
console.log('Expires:', qris.expires_at);
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `license_key` | `string` | Yes | License key |
| `amount` | `number` | Yes | Transaction amount (IDR) |
| `reference_id` | `string` | No | External reference ID |
| `description` | `string` | No | Transaction description |
| `metadata` | `object` | No | Additional metadata |

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

---

### checkPaymentStatus

Cek status pembayaran QRIS.

```typescript
const status = await kgiton.payment.checkPaymentStatus('transaction-id');

console.log('Status:', status.status);
console.log('Amount:', status.amount);
console.log('Paid At:', status.paid_at);

if (status.status === 'paid') {
  console.log('Payment received!');
  // Process order
}
```

**Response:**

```typescript
interface PaymentStatus {
  transaction_id: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  amount: number;
  reference_id?: string;
  paid_at?: string;
  payer_info?: {
    bank?: string;
    account_name?: string;
  };
}
```

---

### waitForPayment

Polling untuk menunggu pembayaran.

```typescript
try {
  const result = await kgiton.payment.waitForPayment('transaction-id', {
    timeout: 120000,  // 2 minutes
    interval: 3000,   // Check every 3 seconds
  });
  
  if (result.status === 'paid') {
    console.log('Payment successful!');
    console.log('Paid at:', result.paid_at);
  }
} catch (error) {
  if (error.message.includes('timeout')) {
    console.log('Payment timeout');
  }
}
```

---

### cancelPayment

Batalkan transaksi pembayaran.

```typescript
await kgiton.payment.cancelPayment('transaction-id');
console.log('Payment cancelled');
```

---

## Partner Payment Flow

```
┌─────────────────────┐
│  Customer Order     │
│  (POS System)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Generate QRIS      │
│  (Partner SDK)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐     Customer scans
│  Display QRIS       │────────────────────→ Mobile Banking
└──────────┬──────────┘
           │
           │ Polling / Webhook
           ▼
┌─────────────────────┐
│  Payment Received   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Complete Order     │
└─────────────────────┘
```

---

## Common Use Cases

### POS Integration

```typescript
import { KGiTON } from '@kgiton/sdk';

class POSPaymentService {
  private kgiton: KGiTON;
  
  constructor() {
    this.kgiton = new KGiTON({
      baseUrl: process.env.KGITON_API_URL!,
      apiKey: process.env.KGITON_API_KEY!,
    });
  }
  
  async createPayment(order: Order): Promise<QRISResponse> {
    // Generate QRIS
    const qris = await this.kgiton.payment.generateQRIS({
      license_key: order.licenseKey,
      amount: order.total,
      reference_id: order.id,
      description: `Order #${order.id}`,
      metadata: {
        store_id: order.storeId,
        items: order.items.map(i => i.name),
      },
    });
    
    return qris;
  }
  
  async waitForPayment(transactionId: string): Promise<PaymentStatus> {
    return this.kgiton.payment.waitForPayment(transactionId, {
      timeout: 120000,  // 2 minutes
      interval: 2000,
    });
  }
  
  async cancelPayment(transactionId: string): Promise<void> {
    await this.kgiton.payment.cancelPayment(transactionId);
  }
}

// Usage
const paymentService = new POSPaymentService();

// Create payment
const qris = await paymentService.createPayment(order);
displayQRIS(qris.qris_image_url);

// Wait for payment
const result = await paymentService.waitForPayment(qris.transaction_id);
if (result.status === 'paid') {
  completeOrder(order);
}
```

### Express.js Payment Endpoint

```typescript
import express from 'express';
import { KGiTON } from '@kgiton/sdk';

const app = express();
const kgiton = new KGiTON({
  baseUrl: process.env.KGITON_API_URL!,
  apiKey: process.env.KGITON_API_KEY!,
});

// Generate QRIS
app.post('/api/payment/qris', async (req, res) => {
  try {
    const { license_key, amount, reference_id, description } = req.body;
    
    const qris = await kgiton.payment.generateQRIS({
      license_key,
      amount,
      reference_id,
      description,
    });
    
    res.json({
      success: true,
      transaction_id: qris.transaction_id,
      qris_image_url: qris.qris_image_url,
      expires_at: qris.expires_at,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Check payment status
app.get('/api/payment/:transactionId/status', async (req, res) => {
  try {
    const status = await kgiton.payment.checkPaymentStatus(req.params.transactionId);
    res.json({ success: true, ...status });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Wait for payment (long polling)
app.get('/api/payment/:transactionId/wait', async (req, res) => {
  try {
    const result = await kgiton.payment.waitForPayment(req.params.transactionId, {
      timeout: 60000,  // 1 minute
      interval: 2000,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    if (error.message.includes('timeout')) {
      res.json({ success: true, status: 'pending', timeout: true });
    } else {
      res.status(400).json({ success: false, error: error.message });
    }
  }
});

// Cancel payment
app.post('/api/payment/:transactionId/cancel', async (req, res) => {
  try {
    await kgiton.payment.cancelPayment(req.params.transactionId);
    res.json({ success: true, message: 'Payment cancelled' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Webhook handler
app.post('/api/webhook/payment', async (req, res) => {
  const { transaction_id, status, amount, paid_at } = req.body;
  
  // Verify webhook signature (implementation depends on gateway)
  // ...
  
  if (status === 'paid') {
    // Update order status
    await updateOrderStatus(transaction_id, 'paid');
  }
  
  res.json({ received: true });
});
```

### WebSocket Payment Updates

```typescript
import WebSocket from 'ws';
import { KGiTON } from '@kgiton/sdk';

const wss = new WebSocket.Server({ port: 8080 });
const kgiton = new KGiTON({
  baseUrl: process.env.KGITON_API_URL!,
  apiKey: process.env.KGITON_API_KEY!,
});

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const data = JSON.parse(message.toString());
    
    if (data.type === 'create_payment') {
      // Generate QRIS
      const qris = await kgiton.payment.generateQRIS(data.payload);
      ws.send(JSON.stringify({ type: 'qris_created', data: qris }));
      
      // Start polling
      try {
        const result = await kgiton.payment.waitForPayment(qris.transaction_id, {
          timeout: 120000,
          interval: 2000,
        });
        ws.send(JSON.stringify({ type: 'payment_status', data: result }));
      } catch {
        ws.send(JSON.stringify({ type: 'payment_timeout' }));
      }
    }
  });
});
```

---

## Payment Status

| Status | Description |
|--------|-------------|
| `pending` | Waiting for payment |
| `paid` | Payment received |
| `expired` | QRIS expired |
| `cancelled` | Payment cancelled |

---

## Error Handling

```typescript
import { ValidationError, NotFoundError } from '@kgiton/sdk';

try {
  await kgiton.payment.generateQRIS({
    license_key: 'INVALID-KEY',
    amount: 100,
  });
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('License key not found');
  } else if (error instanceof ValidationError) {
    console.log('Invalid amount or parameters');
  }
}
```

---

[← Back to Index](./00_INDEX.md) | [Next: Error Handling →](./07_ERROR_HANDLING.md)
