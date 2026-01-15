# 📚 KGiTON Node.js SDK Documentation

## Daftar Isi

| No | Dokumen | Deskripsi |
|----|---------|-----------|
| 01 | [Getting Started](./01_GETTING_STARTED.md) | Instalasi dan setup awal |
| 02 | [Authentication](./02_AUTHENTICATION.md) | API Key dan Bearer Token |
| 03 | [License Module](./03_LICENSE_MODULE.md) | Validasi license dan token balance |
| 04 | [User Module](./04_USER_MODULE.md) | Profile, use token, manage keys |
| 05 | [Topup Module](./05_TOPUP_MODULE.md) | Request topup, payment methods, sync status |
| 06 | [Payment Module](./06_PAYMENT_MODULE.md) | Partner integration, QRIS |
| 07 | [Error Handling](./07_ERROR_HANDLING.md) | Error types dan handling |
| 08 | [API Reference](./08_API_REFERENCE.md) | Complete API reference |
| 09 | [Partner Payment](./09_PARTNER_PAYMENT.md) | Partner QRIS dan Checkout Page |

---

## Overview

KGiTON SDK for Node.js adalah SDK resmi untuk mengintegrasikan KGiTON Core API ke dalam aplikasi backend Node.js/TypeScript.

### Arsitektur SDK

```
┌─────────────────────────────────────────────────────────────┐
│                    @kgiton/sdk (Node.js)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │   Auth Module   │  │ License Module  │                   │
│  │  ─────────────  │  │  ─────────────  │                   │
│  │  • login        │  │  • validate     │                   │
│  │  • register     │  │  • getByKey     │                   │
│  │  • logout       │  │  • getBalance   │                   │
│  │  • forgotPwd    │  │  • isActive     │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │   User Module   │  │  Topup Module   │                   │
│  │  ─────────────  │  │  ─────────────  │                   │
│  │  • getProfile   │  │  • checkout     │                   │
│  │  • useToken     │  │  • requestVA    │                   │
│  │  • assignKey    │  │  • getStatus    │                   │
│  │  • regenApiKey  │  │  • getHistory   │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ Payment Module  │  │   HTTP Client   │                   │
│  │  ─────────────  │  │  ─────────────  │                   │
│  │  • generateQRIS │  │  • axios based  │                   │
│  │  • checkStatus  │  │  • auto retry   │                   │
│  │  • callback     │  │  • debug mode   │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                             │
│  ┌─────────────────┐                                        │
│  │ PartnerPayment  │                                        │
│  │  ─────────────  │                                        │
│  │  • generateQris │                                        │
│  │  • genCheckout  │                                        │
│  │  • generate     │                                        │
│  └─────────────────┘                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    KGiTON Core API
                https://api.kgiton.com
```

### Use Cases

| Use Case | Module | Method |
|----------|--------|--------|
| Validasi license | License | `validate()` |
| Cek saldo token | License | `getTokenBalance()` |
| Gunakan token | User | `useToken()` |
| Top-up token | Topup | `requestCheckout()` |
| Sync status transaksi | Topup | `syncStatus()` |
| Integrasi POS | Payment | `generateQRIS()` |
| Partner Payment QRIS | PartnerPayment | `generateQris()` |
| Partner Checkout Page | PartnerPayment | `generateCheckoutPage()` |

### Requirements

- Node.js >= 16.0.0
- TypeScript >= 4.5 (optional, recommended)

---

## Quick Links

- [README](../README.md) - Overview dan quick start
- [React Native SDK](../../react-native-kgiton-sdk) - Mobile SDK
- [Flutter SDK](../../flutter-kgiton-sdk) - Flutter SDK

---

**PT KGiTON** © 2026
