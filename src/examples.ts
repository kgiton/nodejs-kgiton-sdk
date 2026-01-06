/**
 * KGiTON SDK Examples
 * ===================
 * Comprehensive examples showing how to use the KGiTON SDK
 */

import { KGiTON, PaymentMethod, InsufficientTokenError, AuthenticationError } from './';

// ============================================================================
// BASIC SETUP
// ============================================================================

/**
 * Example 1: Initialize with API Key (recommended for backend)
 */
function initWithApiKey() {
  const sdk = new KGiTON({
    baseUrl: 'https://api.kgiton.com',
    apiKey: process.env.KGITON_API_KEY!,
    timeout: 30000,
    debug: true, // Enable for development
  });
  return sdk;
}

/**
 * Example 2: Initialize with access token (for user sessions)
 */
function initWithAccessToken(token: string) {
  const sdk = new KGiTON({
    baseUrl: 'https://api.kgiton.com',
    accessToken: token,
  });
  return sdk;
}

// ============================================================================
// LICENSE OPERATIONS
// ============================================================================

/**
 * Example 3: Validate a license key
 */
async function validateLicenseExample(sdk: KGiTON) {
  const licenseKey = 'ABCDE-12345-FGHIJ-67890-KLMNO';
  
  try {
    const validation = await sdk.license.validate(licenseKey);
    
    console.log('License Validation Result:');
    console.log('- Valid:', validation.valid);
    console.log('- Status:', validation.status);
    console.log('- Token Balance:', validation.token_balance);
    console.log('- Price per Token:', validation.price_per_token);
    
    if (validation.valid) {
      console.log('✅ License is valid and ready to use');
    } else {
      console.log('❌ License is not valid:', validation.message);
    }
    
    return validation;
  } catch (error) {
    console.error('Failed to validate license:', error);
    throw error;
  }
}

/**
 * Example 4: Check if license has enough tokens before action
 */
async function checkTokensBeforeAction(sdk: KGiTON, licenseKey: string, requiredTokens: number) {
  const hasEnough = await sdk.license.hasSufficientTokens(licenseKey, requiredTokens);
  
  if (!hasEnough) {
    console.log(`Not enough tokens. Need ${requiredTokens} tokens.`);
    console.log('Please top up your balance.');
    return false;
  }
  
  console.log(`✅ Has enough tokens (${requiredTokens} required)`);
  return true;
}

// ============================================================================
// TOKEN OPERATIONS
// ============================================================================

/**
 * Example 5: Use a token for an action
 */
async function useTokenExample(sdk: KGiTON) {
  const licenseKey = 'ABCDE-12345-FGHIJ-67890-KLMNO';
  
  try {
    // Simple usage - just deduct 1 token
    const result = await sdk.user.useToken(licenseKey);
    
    console.log('Token Used Successfully:');
    console.log('- Previous Balance:', result.previous_balance);
    console.log('- New Balance:', result.new_balance);
    console.log('- Tokens Used:', result.tokens_used);
    
    return result;
  } catch (error) {
    if (error instanceof InsufficientTokenError) {
      console.log('❌ Not enough tokens! Please top up.');
    } else {
      console.error('Error using token:', error);
    }
    throw error;
  }
}

/**
 * Example 6: Use token with tracking metadata
 */
async function useTokenWithMetadata(sdk: KGiTON) {
  const licenseKey = 'ABCDE-12345-FGHIJ-67890-KLMNO';
  
  const result = await sdk.user.useToken(licenseKey, {
    purpose: 'Weight measurement - Sayur',
    metadata: {
      product_id: 'PROD-001',
      product_name: 'Bayam Segar',
      weight: 2.5,
      unit: 'kg',
      timestamp: new Date().toISOString(),
      operator: 'Kasir 1',
    }
  });
  
  console.log('Token used for:', result.license_key);
  console.log('Remaining balance:', result.new_balance);
  
  return result;
}

// ============================================================================
// TOP-UP OPERATIONS
// ============================================================================

/**
 * Example 7: Get available payment methods
 */
async function getPaymentMethodsExample(sdk: KGiTON) {
  const methods = await sdk.topup.getPaymentMethods();
  
  console.log('Available Payment Methods:');
  methods.forEach(m => {
    const status = m.enabled ? '✅' : '❌';
    console.log(`${status} ${m.name} (${m.type})`);
  });
  
  return methods;
}

/**
 * Example 8: Request top-up with checkout page
 */
async function requestTopupCheckout(sdk: KGiTON) {
  const licenseKey = 'ABCDE-12345-FGHIJ-67890-KLMNO';
  const tokenCount = 1000;
  
  const result = await sdk.topup.requestCheckout(licenseKey, tokenCount);
  
  console.log('Top-up Request Created:');
  console.log('- Transaction ID:', result.transaction_id);
  console.log('- Tokens Requested:', result.tokens_requested);
  console.log('- Amount to Pay:', `Rp ${result.amount_to_pay.toLocaleString()}`);
  console.log('- Payment URL:', result.payment_url);
  console.log('- Expires At:', result.expires_at);
  
  // Redirect user to payment URL
  console.log('\n➡️  Please pay at:', result.payment_url);
  
  return result;
}

/**
 * Example 9: Request top-up with Virtual Account
 */
async function requestTopupVA(sdk: KGiTON) {
  const licenseKey = 'ABCDE-12345-FGHIJ-67890-KLMNO';
  const tokenCount = 500;
  
  const result = await sdk.topup.requestVA(licenseKey, tokenCount, PaymentMethod.VA_BRI);
  
  console.log('Virtual Account Created:');
  console.log('- Bank:', result.virtual_account?.bank);
  console.log('- VA Number:', result.virtual_account?.number);
  console.log('- Account Name:', result.virtual_account?.name);
  console.log('- Amount:', `Rp ${result.amount_to_pay.toLocaleString()}`);
  console.log('- Expires:', result.expires_at);
  
  return result;
}

/**
 * Example 10: Wait for payment completion
 */
async function waitForPayment(sdk: KGiTON, transactionId: string) {
  console.log('Waiting for payment...');
  
  const result = await sdk.topup.waitForCompletion(transactionId, {
    timeout: 300000, // 5 minutes
    interval: 5000,  // Check every 5 seconds
  });
  
  if (result.status === 'success') {
    console.log('✅ Payment successful!');
    console.log('Tokens added:', result.tokens_added);
  } else if (result.status === 'pending') {
    console.log('⏳ Payment still pending (timeout reached)');
  } else {
    console.log('❌ Payment failed or expired:', result.status);
  }
  
  return result;
}

// ============================================================================
// USER OPERATIONS
// ============================================================================

/**
 * Example 11: Get user profile
 */
async function getUserProfileExample(sdk: KGiTON) {
  const profile = await sdk.user.getProfile();
  
  console.log('User Profile:');
  console.log('- Name:', profile.name);
  console.log('- Email:', profile.email);
  console.log('- Role:', profile.role);
  console.log('- License Keys:', profile.license_keys.length);
  
  profile.license_keys.forEach((lk, i) => {
    console.log(`  ${i + 1}. ${lk.key} - ${lk.token_balance} tokens (${lk.status})`);
  });
  
  return profile;
}

/**
 * Example 12: Get total balance and find available license
 */
async function getBalanceAndAvailableLicense(sdk: KGiTON) {
  const totalBalance = await sdk.user.getTotalTokenBalance();
  console.log('Total Token Balance:', totalBalance);
  
  const availableLicense = await sdk.user.getAvailableLicenseKey(10);
  
  if (availableLicense) {
    console.log('Available license with 10+ tokens:', availableLicense);
  } else {
    console.log('No license with 10+ tokens available');
  }
  
  return { totalBalance, availableLicense };
}

// ============================================================================
// AUTH OPERATIONS
// ============================================================================

/**
 * Example 13: Login and use SDK
 */
async function loginExample() {
  const sdk = new KGiTON({
    baseUrl: 'https://api.kgiton.com',
  });
  
  try {
    const { access_token, user } = await sdk.auth.login({
      email: 'user@example.com',
      password: 'password123',
    });
    // Access token is automatically set
    
    console.log('✅ Logged in as:', user.name);
    console.log('Token:', access_token.substring(0, 20) + '...');
    
    // Now you can use other SDK methods
    const profile = await sdk.user.getProfile();
    console.log('Profile loaded:', profile.email);
    
    return sdk;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.log('❌ Invalid email or password');
    }
    throw error;
  }
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Example 14: Comprehensive error handling
 */
async function errorHandlingExample(sdk: KGiTON) {
  const licenseKey = 'INVALID-KEY';
  
  try {
    await sdk.user.useToken(licenseKey);
  } catch (error) {
    if (error instanceof InsufficientTokenError) {
      // Handle insufficient tokens
      console.log('Action: Redirect to top-up page');
    } else if (error instanceof AuthenticationError) {
      // Handle auth error
      console.log('Action: Redirect to login page');
    } else if (error instanceof Error) {
      // Handle other errors
      console.log('Error:', error.message);
    }
  }
}

// ============================================================================
// INTEGRATION EXAMPLE (Express.js)
// ============================================================================

/**
 * Example 15: Express middleware for token validation
 */
function createExpressMiddleware(sdk: KGiTON) {
  return async (req: any, res: any, next: any) => {
    const licenseKey = req.headers['x-license-key'];
    
    if (!licenseKey) {
      return res.status(400).json({ error: 'License key required' });
    }
    
    try {
      // Validate and use token
      const result = await sdk.user.useToken(licenseKey, {
        purpose: 'API Request',
        metadata: {
          endpoint: req.path,
          method: req.method,
          ip: req.ip,
        }
      });
      
      // Attach balance info to request
      req.kgiton = {
        licenseKey,
        remainingTokens: result.new_balance,
      };
      
      next();
    } catch (error) {
      if (error instanceof InsufficientTokenError) {
        return res.status(402).json({ 
          error: 'Payment required', 
          message: 'Insufficient tokens. Please top up.' 
        });
      }
      next(error);
    }
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  initWithApiKey,
  initWithAccessToken,
  validateLicenseExample,
  checkTokensBeforeAction,
  useTokenExample,
  useTokenWithMetadata,
  getPaymentMethodsExample,
  requestTopupCheckout,
  requestTopupVA,
  waitForPayment,
  getUserProfileExample,
  getBalanceAndAvailableLicense,
  loginExample,
  errorHandlingExample,
  createExpressMiddleware,
};
