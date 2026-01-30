# 🚀 Production Deployment Checklist

## Pre-Deployment

### 1. Enable Real API
- [ ] Open `src/app/services/auth.ts`
- [ ] Set `useMockAuth = false` (line 35)
- [ ] Save the file

### 2. Test Locally
- [ ] Run `npm start`
- [ ] Test login functionality
- [ ] Test registration
- [ ] Verify API calls in Network tab
- [ ] Check for console errors

### 3. Environment Configuration
- [ ] Verify `src/environments/environment.prod.ts` has correct API URL
- [ ] Confirm `apiUrl: 'https://www.eduskillng.ng/api/v1'`
- [ ] Check timeout settings are appropriate

### 4. Build for Production
- [ ] Run `npm run build -- --configuration production`
- [ ] Verify build completes without errors
- [ ] Check `dist/` folder is created
- [ ] Verify bundle sizes are acceptable

---

## Backend Requirements

### API Endpoints Required
- [ ] `POST /auth/login` - User authentication
- [ ] `POST /auth/register` - User registration
- [ ] `POST /auth/logout` - User logout
- [ ] `GET /auth/me` - Get current user profile

### CORS Configuration
- [ ] Backend allows requests from your domain
- [ ] Headers include:
  - `Access-Control-Allow-Origin`
  - `Access-Control-Allow-Methods`
  - `Access-Control-Allow-Headers`
  - `Access-Control-Allow-Credentials`

### Expected Response Format
- [ ] Responses follow format:
```json
{
  "success": true,
  "data": { ... },
  "message": "..."
}
```

### Authentication
- [ ] Backend accepts `Authorization: Bearer {token}` header
- [ ] Token is returned on login/register
- [ ] Token validation is working
- [ ] 401 responses for invalid/expired tokens

---

## Security Checklist

### Frontend
- [ ] HTTPS enabled on hosting
- [ ] Environment variables not exposed
- [ ] No sensitive data in localStorage
- [ ] XSS protection enabled
- [ ] CSP headers configured

### Backend
- [ ] HTTPS/SSL certificate installed
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection
- [ ] Password hashing (bcrypt/argon2)
- [ ] JWT tokens properly signed
- [ ] Token expiration configured

---

## Deployment Steps

### Option 1: Netlify

1. **Build the app**
```bash
npm run build -- --configuration production
```

2. **Deploy to Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist/edu-skill/browser
```

3. **Configure redirects**
- [ ] Create `_redirects` file in `dist/edu-skill/browser/`
- [ ] Add: `/* /index.html 200`

### Option 2: Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Configure**
- [ ] Set output directory: `dist/edu-skill/browser`
- [ ] Configure environment variables if needed

### Option 3: Firebase Hosting

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Initialize Firebase**
```bash
firebase login
firebase init hosting
```

3. **Deploy**
```bash
npm run build -- --configuration production
firebase deploy --only hosting
```

### Option 4: Custom Server (nginx)

1. **Build the app**
```bash
npm run build -- --configuration production
```

2. **Copy files to server**
```bash
scp -r dist/edu-skill/browser/* user@server:/var/www/html/
```

3. **Configure nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

4. **Restart nginx**
```bash
sudo systemctl restart nginx
```

---

## Post-Deployment

### Testing
- [ ] Visit production URL
- [ ] Test login/registration
- [ ] Verify all routes work
- [ ] Check API calls in Network tab
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Verify error handling
- [ ] Check console for errors

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure analytics (Google Analytics)
- [ ] Monitor API response times
- [ ] Set up uptime monitoring
- [ ] Configure alerts for errors

### Performance
- [ ] Run Lighthouse audit
- [ ] Check page load times
- [ ] Verify bundle sizes
- [ ] Test on slow connections
- [ ] Optimize images if needed

---

## Environment Variables (if needed)

If you need to add more environment variables:

1. **Add to environment files**
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://www.eduskillng.ng/api/v1',
  apiTimeout: 30000,
  googleAnalyticsId: 'UA-XXXXXXXXX-X',
  sentryDsn: 'https://...'
};
```

2. **Use in code**
```typescript
import { environment } from '../environments/environment';

console.log(environment.apiUrl);
```

---

## Rollback Plan

If deployment fails:

1. **Keep previous build**
```bash
# Before deploying, backup current build
cp -r dist dist.backup
```

2. **Quick rollback**
```bash
# Restore previous build
rm -rf dist
mv dist.backup dist
# Redeploy
```

3. **Disable real API**
- Set `useMockAuth = true` in `auth.ts`
- Rebuild and redeploy

---

## Common Issues & Solutions

### Issue: White screen after deployment
**Solution:** 
- Check browser console for errors
- Verify base href in index.html
- Check routing configuration

### Issue: API calls failing
**Solution:**
- Verify CORS configuration
- Check API URL in environment.prod.ts
- Verify SSL certificate

### Issue: 404 on refresh
**Solution:**
- Configure server redirects
- Add `_redirects` file for Netlify
- Update nginx/Apache config

### Issue: Large bundle size
**Solution:**
- Enable lazy loading
- Remove unused dependencies
- Optimize images
- Enable tree shaking

---

## Success Criteria

- [ ] Application loads without errors
- [ ] Users can register
- [ ] Users can login
- [ ] Authentication persists on refresh
- [ ] Protected routes work correctly
- [ ] API calls succeed
- [ ] Error messages display properly
- [ ] Mobile responsive
- [ ] Performance score > 80

---

## Support & Documentation

- **Setup Guide:** `SETUP_COMPLETE.md`
- **API Documentation:** `API_INTEGRATION.md`
- **Quick Reference:** `QUICK_REFERENCE.md`
- **Summary:** `BACKEND_INTEGRATION_SUMMARY.md`

---

**Ready to Deploy?** Follow this checklist step by step! ✅
