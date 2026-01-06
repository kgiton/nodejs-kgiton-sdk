# 🚨 Error Handling

## Overview

Node.js SDK menyediakan custom error classes untuk penanganan error yang spesifik dan mudah dipahami.

---

## Error Classes

### KGiTONError (Base Class)

Base class untuk semua error SDK.

```typescript
import { KGiTONError } from '@kgiton/sdk';

try {
  await kgiton.license.validate('invalid');
} catch (error) {
  if (error instanceof KGiTONError) {
    console.log('SDK Error:', error.message);
    console.log('Status Code:', error.statusCode);
    console.log('Error Code:', error.code);
  }
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string` | Human-readable error message |
| `statusCode` | `number` | HTTP status code |
| `code` | `string` | Error code identifier |
| `details` | `object` | Additional error details |

---

### AuthenticationError

Error autentikasi (401).

```typescript
import { AuthenticationError } from '@kgiton/sdk';

try {
  await kgiton.user.getProfile();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log('Authentication failed');
    console.log('Please check your API key or access token');
    
    // Possible causes:
    // - Invalid API key
    // - Expired access token
    // - Missing authorization header
  }
}
```

---

### NotFoundError

Resource tidak ditemukan (404).

```typescript
import { NotFoundError } from '@kgiton/sdk';

try {
  await kgiton.license.getByKey('INVALID-LICENSE-KEY');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('License key not found');
    console.log('Resource:', error.details?.resource);
  }
}
```

---

### ValidationError

Validation error (400).

```typescript
import { ValidationError } from '@kgiton/sdk';

try {
  await kgiton.topup.requestCheckout('LICENSE-KEY', -100);  // Invalid amount
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Validation failed:', error.message);
    console.log('Field errors:', error.details?.errors);
    
    // Example output:
    // Field errors: { amount: ['Amount must be positive'] }
  }
}
```

---

### InsufficientTokenError

Token tidak cukup (402).

```typescript
import { InsufficientTokenError } from '@kgiton/sdk';

try {
  await kgiton.user.useToken('LICENSE-KEY');
} catch (error) {
  if (error instanceof InsufficientTokenError) {
    console.log('Not enough tokens!');
    console.log('Current balance:', error.details?.balance);
    console.log('Required:', error.details?.required);
    
    // Suggest top-up
    console.log('Please top up your tokens');
  }
}
```

---

### RateLimitError

Rate limit exceeded (429).

```typescript
import { RateLimitError } from '@kgiton/sdk';

try {
  await kgiton.license.validate('LICENSE-KEY');
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log('Rate limit exceeded');
    console.log('Retry after:', error.details?.retryAfter, 'seconds');
    
    // Wait and retry
    await sleep(error.details?.retryAfter * 1000);
    await kgiton.license.validate('LICENSE-KEY');
  }
}
```

---

### NetworkError

Network/connection error.

```typescript
import { NetworkError } from '@kgiton/sdk';

try {
  await kgiton.user.getProfile();
} catch (error) {
  if (error instanceof NetworkError) {
    console.log('Network error:', error.message);
    console.log('Possible causes:');
    console.log('- No internet connection');
    console.log('- Server unreachable');
    console.log('- DNS resolution failed');
  }
}
```

---

### ServerError

Server error (500).

```typescript
import { ServerError } from '@kgiton/sdk';

try {
  await kgiton.user.getProfile();
} catch (error) {
  if (error instanceof ServerError) {
    console.log('Server error:', error.message);
    console.log('Please try again later');
    console.log('Request ID:', error.details?.requestId);
  }
}
```

---

## Error Handling Patterns

### Comprehensive Error Handler

```typescript
import { 
  KGiTONError,
  AuthenticationError, 
  NotFoundError, 
  ValidationError,
  InsufficientTokenError,
  RateLimitError,
  NetworkError,
  ServerError,
} from '@kgiton/sdk';

async function handleKGiTONError(error: unknown): Promise<ErrorResponse> {
  // Not a KGiTON error
  if (!(error instanceof KGiTONError)) {
    console.error('Unknown error:', error);
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
      retry: false,
    };
  }
  
  // Handle specific errors
  if (error instanceof AuthenticationError) {
    return {
      code: 'AUTH_FAILED',
      message: 'Authentication failed. Please check your credentials.',
      retry: false,
    };
  }
  
  if (error instanceof NotFoundError) {
    return {
      code: 'NOT_FOUND',
      message: error.message,
      retry: false,
    };
  }
  
  if (error instanceof ValidationError) {
    return {
      code: 'VALIDATION_ERROR',
      message: error.message,
      details: error.details?.errors,
      retry: false,
    };
  }
  
  if (error instanceof InsufficientTokenError) {
    return {
      code: 'INSUFFICIENT_TOKENS',
      message: 'Not enough tokens. Please top up.',
      balance: error.details?.balance,
      retry: false,
    };
  }
  
  if (error instanceof RateLimitError) {
    return {
      code: 'RATE_LIMITED',
      message: 'Too many requests. Please wait.',
      retryAfter: error.details?.retryAfter,
      retry: true,
    };
  }
  
  if (error instanceof NetworkError) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection.',
      retry: true,
    };
  }
  
  if (error instanceof ServerError) {
    return {
      code: 'SERVER_ERROR',
      message: 'Server error. Please try again later.',
      requestId: error.details?.requestId,
      retry: true,
    };
  }
  
  // Generic KGiTON error
  return {
    code: 'SDK_ERROR',
    message: error.message,
    statusCode: error.statusCode,
    retry: false,
  };
}
```

### Retry with Exponential Backoff

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
  } = {}
): Promise<T> {
  const { 
    maxRetries = 3, 
    initialDelay = 1000, 
    maxDelay = 10000 
  } = options;
  
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry certain errors
      if (
        error instanceof AuthenticationError ||
        error instanceof NotFoundError ||
        error instanceof ValidationError ||
        error instanceof InsufficientTokenError
      ) {
        throw error;
      }
      
      // Handle rate limit
      if (error instanceof RateLimitError) {
        const waitTime = error.details?.retryAfter * 1000 || initialDelay;
        await sleep(waitTime);
        continue;
      }
      
      // Exponential backoff for retryable errors
      if (
        error instanceof NetworkError ||
        error instanceof ServerError
      ) {
        const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
        console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
        await sleep(delay);
        continue;
      }
      
      // Unknown error - don't retry
      throw error;
    }
  }
  
  throw lastError!;
}

// Usage
const result = await withRetry(() => kgiton.license.validate('LICENSE-KEY'));
```

### Express.js Error Middleware

```typescript
import express from 'express';
import { 
  KGiTONError,
  AuthenticationError, 
  NotFoundError, 
  ValidationError,
  InsufficientTokenError,
} from '@kgiton/sdk';

function kgitonErrorHandler(
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Not a KGiTON error
  if (!(error instanceof KGiTONError)) {
    return next(error);
  }
  
  // Log error
  console.error('[KGiTON Error]', {
    code: error.code,
    message: error.message,
    statusCode: error.statusCode,
    path: req.path,
  });
  
  // Map to HTTP response
  let statusCode = error.statusCode || 500;
  let response: Record<string, unknown> = {
    error: true,
    code: error.code,
    message: error.message,
  };
  
  if (error instanceof ValidationError) {
    response.errors = error.details?.errors;
  }
  
  if (error instanceof InsufficientTokenError) {
    response.balance = error.details?.balance;
    response.topup_url = '/api/topup';
  }
  
  res.status(statusCode).json(response);
}

// Usage
app.use(kgitonErrorHandler);
```

---

## Error Logging

### Winston Logger Integration

```typescript
import winston from 'winston';
import { KGiTONError } from '@kgiton/sdk';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

function logKGiTONError(error: KGiTONError, context?: Record<string, unknown>) {
  logger.error('KGiTON SDK Error', {
    code: error.code,
    message: error.message,
    statusCode: error.statusCode,
    details: error.details,
    context,
    stack: error.stack,
  });
}

// Usage
try {
  await kgiton.user.useToken('LICENSE-KEY');
} catch (error) {
  if (error instanceof KGiTONError) {
    logKGiTONError(error, { 
      operation: 'useToken', 
      licenseKey: 'LICENSE-KEY' 
    });
  }
}
```

---

## Type Definitions

```typescript
interface ErrorResponse {
  code: string;
  message: string;
  retry: boolean;
  details?: Record<string, unknown>;
  balance?: number;
  retryAfter?: number;
  statusCode?: number;
  requestId?: string;
}

interface KGiTONErrorDetails {
  errors?: Record<string, string[]>;
  resource?: string;
  balance?: number;
  required?: number;
  retryAfter?: number;
  requestId?: string;
}
```

---

## Best Practices

1. **Always import error classes** - Untuk type-safe error handling
2. **Use instanceof checks** - Untuk identify error types
3. **Log errors with context** - Include request ID, operation, parameters
4. **Implement retry logic** - Untuk network/server errors
5. **Map to user-friendly messages** - Jangan expose internal errors
6. **Handle token insufficiency gracefully** - Redirect ke top-up flow

---

[← Back to Index](./00_INDEX.md) | [Next: API Reference →](./08_API_REFERENCE.md)
