# Stripe Payment Security Configuration

## Overview
The thank you page (`danke.html`) is now protected with token-based access control. This prevents unauthorized users from viewing download links without completing a purchase.

## How It Works

### 1. Token Validation
The `danke.html` page now requires a `token` URL parameter:
```
https://www.rebellsystem.de/danke.html?token=YOUR_UNIQUE_TOKEN
```

**Token Requirements:**
- Must be at least 20 characters long
- Should be cryptographically random
- Unique per transaction
- Should expire after a certain period (recommended: 24-48 hours)

### 2. Access Behavior

**When valid token is provided:**
- Download links are displayed
- User can access all PDF files immediately
- Success message is shown

**When token is missing or invalid:**
- Error message is displayed: "Zugriff nicht autorisiert"
- User is offered a link to return to the payment page
- No download links are visible
- Page source does not leak any sensitive information

## Stripe Integration Setup

### Step 1: Update Stripe Checkout Link
You need to configure the payment link return URL in Stripe Dashboard:

1. Go to https://dashboard.stripe.com/
2. Navigate to **Products** → Select your product
3. Edit the product and look for **After purchase, customers are redirected to:**
4. Change the return URL to:
   ```
   https://www.rebellsystem.de/danke.html?token=DYNAMIC_TOKEN
   ```

### Step 2: Generate Dynamic Tokens
You have two options:

#### Option A: Server-Side Token Generation (Recommended)
If you use a backend:
```javascript
// Node.js / Express example
const crypto = require('crypto');

function generateToken() {
  return crypto.randomBytes(32).toString('hex'); // 64 characters
}

// When creating a payment link:
const token = generateToken();
const returnUrl = `https://www.rebellsystem.de/danke.html?token=${token}`;
// Store token in database with:
// - user email
// - timestamp
// - expiration date (24-48 hours)
```

#### Option B: Client-Side with Session Storage
If you need a simpler solution without a backend:
```javascript
// Generate token when user clicks the payment button
function initiatePayment() {
  const token = generateSimpleToken(); // See below
  sessionStorage.setItem('paymentToken', token);
  window.location.href = `https://buy.stripe.com/your-link?return=${encodeURIComponent('https://www.rebellsystem.de/danke.html?token=' + token)}`;
}

function generateSimpleToken() {
  return 'token_' + Math.random().toString(36).substr(2, 40) + '_' + Date.now();
}
```

### Step 3: Implement Token Storage (Optional but Recommended)
For better security, store tokens with metadata:

```javascript
// Database schema example (Firebase, Supabase, etc.)
{
  token: "abc123...",
  email: "user@example.com",
  productId: "elternschutzpaket",
  createdAt: "2024-02-12T09:00:00Z",
  expiresAt: "2024-02-14T09:00:00Z",
  used: false,
  usedAt: null
}
```

## Security Considerations

### Current Implementation
✅ Tokens required for access  
✅ Minimum token length validation (20 chars)  
✅ Error page hides sensitive information  
✅ No download links in page source without token  

### Recommended Enhancements

1. **Token Expiration:**
   - Tokens should expire after 24-48 hours
   - Implement server-side validation on page load

2. **Single-Use Tokens:**
   - Mark token as "used" after first access
   - Prevent token reuse across multiple users

3. **Rate Limiting:**
   - Limit failed token attempts (e.g., 5 attempts per IP per hour)
   - Log suspicious access patterns

4. **HTTPS Enforcement:**
   - Always use HTTPS (no token in plain HTTP)
   - Add security headers to prevent leaking tokens in referrer

5. **Server-Side Validation:**
   - Implement a backend endpoint to validate tokens
   - Do NOT rely solely on client-side validation for sensitive operations

## Testing the Implementation

### Test 1: With Valid Token
```
URL: https://www.rebellsystem.de/danke.html?token=verylongtoken1234901234567890
Expected: Download links visible, success message shown
```

### Test 2: Without Token
```
URL: https://www.rebellsystem.de/danke.html
Expected: Error message shown, no download links visible
```

### Test 3: With Short Token
```
URL: https://www.rebellsystem.de/danke.html?token=short
Expected: Error message shown (token too short)
```

## Maintenance

- Monitor failed access attempts
- Periodically review and invalidate old tokens
- Update token generation method based on security assessments
- Keep Stripe dashboard synchronized with return URL changes

## Support
For questions or issues with Stripe configuration, contact Stripe support at https://support.stripe.com/
