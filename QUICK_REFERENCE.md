# 🚀 Quick Reference - Backend Integration

## API Base URL
```
Production: https://www.eduskillng.ng/api/v1
```

## Enable Real API
**File:** `src/app/services/auth.ts`  
**Line:** 35

```typescript
private useMockAuth = false; // Set to false to use real API ✅
```

## Making API Calls

### Import ApiService
```typescript
import { ApiService } from './services/api.service';

constructor(private apiService: ApiService) {}
```

### GET Request
```typescript
this.apiService.get<Type>('/endpoint', { params }).subscribe(...)
```

### POST Request
```typescript
this.apiService.post<Type>('/endpoint', data).subscribe(...)
```

### PUT Request
```typescript
this.apiService.put<Type>('/endpoint', data).subscribe(...)
```

### DELETE Request
```typescript
this.apiService.delete<Type>('/endpoint').subscribe(...)
```

### File Upload
```typescript
const formData = new FormData();
formData.append('file', file);
this.apiService.upload<Type>('/upload', formData).subscribe(...)
```

## Authentication

### Login
```typescript
this.authService.login(email, password, rememberMe).subscribe(...)
```

### Register
```typescript
this.authService.createUser(signUpDto).subscribe(...)
```

### Logout
```typescript
this.authService.logout();
```

### Check Auth Status
```typescript
if (this.authService.isAuthenticated()) { ... }
```

### Get Current User
```typescript
const user = this.authService.getCurrentUser();
```

## Route Protection

```typescript
import { authGuard, guestGuard, roleGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard] // Only non-authenticated
  },
  {
    path: 'dashboard',
    canActivate: [authGuard] // Requires auth
  },
  {
    path: 'admin',
    canActivate: [roleGuard(['admin'])] // Requires role
  }
];
```

## Build Commands

### Development
```bash
npm start
```

### Production Build
```bash
npm run build -- --configuration production
```

## Environment Variables

**Development:** `src/environments/environment.ts`  
**Production:** `src/environments/environment.prod.ts`

```typescript
{
  production: boolean,
  apiUrl: string,
  apiTimeout: number
}
```

## Automatic Features

✅ Auth headers added automatically  
✅ Error handling with toast notifications  
✅ Auto-logout on 401 errors  
✅ 30-second request timeout  
✅ Token management  

## Troubleshooting

### CORS Error
→ Check backend CORS configuration

### 401 Unauthorized
→ Check token validity  
→ Verify Authorization header

### Timeout
→ Increase `apiTimeout` in environment file

### Type Errors
→ Verify API response matches interfaces

---

**Full Documentation:** See `API_INTEGRATION.md` and `SETUP_COMPLETE.md`
