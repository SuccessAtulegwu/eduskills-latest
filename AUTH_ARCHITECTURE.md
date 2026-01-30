# 🔐 Authentication Architecture - Separation of Concerns

## ✅ **Refactored Structure**

The authentication system has been refactored to follow **separation of concerns** principles:

---

## 📦 **Services Overview**

### **1. AuthService** (`auth.ts`)
**Purpose:** State Management Only

**Responsibilities:**
- ✅ Manage user authentication state (`isAuthenticated$`, `currentUser$`)
- ✅ Get current user from storage (synchronous)
- ✅ Update user data in storage
- ✅ Handle logout and session clearing
- ✅ Role checking utilities (`hasRole()`, `hasAnyRole()`)

**Does NOT:**
- ❌ Make API calls
- ❌ Handle login/registration
- ❌ Manage tokens directly

**Key Methods:**
```typescript
setCurrentUser(user: User | null): void
getCurrentUser(): User | null
isAuthenticated(): boolean
logout(): void
updateUser(user: User): void
hasRole(role: string): boolean
```

---

### **2. AuthApiService** (`auth-api.service.ts`)
**Purpose:** API Communication

**Responsibilities:**
- ✅ Handle all authentication API calls (login, register, password reset, etc.)
- ✅ Manage token storage and refresh
- ✅ Delegate state updates to `AuthService`
- ✅ Handle session timeout monitoring

**Key Methods:**
```typescript
login(credentials: LoginCredentials): Observable<AuthResponse>
register(data: signUpDto): Observable<AuthResponse>
logout(): Observable<any>
refreshToken(): Observable<AuthResponse>
getCurrentUser(): Observable<User>  // Fetch from API
updateProfile(data: Partial<User>): Observable<User>
changePassword(...): Observable<any>
forgotPassword(email: string): Observable<any>
resetPassword(...): Observable<any>
```

---

## 🔄 **Data Flow**

### **Login Flow:**
```
1. User submits login form
   ↓
2. Login Component → authApiService.login(credentials)
   ↓
3. AuthApiService → API call to /auth/login
   ↓
4. API Response (AuthResponse with token + user data)
   ↓
5. AuthApiService → authService.setCurrentUser(user)
   ↓
6. AuthService → Updates BehaviorSubject + SecureStorage
   ↓
7. Components observe authService.currentUser$ / isAuthenticated$
```

### **Logout Flow:**
```
1. User clicks logout
   ↓
2. Component → authService.logout()
   ↓
3. AuthService → Clears storage + state
   ↓
4. AuthService → Navigates to /login
```

---

## 🎯 **Component Usage**

### **Login Component:**
```typescript
constructor(
  private authService: AuthService,        // For state checks
  private authApiService: AuthApiService,  // For login API call
  private roleNavigation: RoleNavigationService
) {}

onSubmit() {
  this.authApiService.login(credentials).subscribe({
    next: (response) => {
      // AuthApiService already updated state via authService
      this.roleNavigation.navigateByRole();
    }
  });
}
```

### **Register Component:**
```typescript
constructor(
  private authService: AuthService,        // For state checks
  private authApiService: AuthApiService   // For register API call
) {}

onSubmit() {
  this.authApiService.register(dto).subscribe({
    next: (response) => {
      // State updated automatically
      this.router.navigate(['/login']);
    }
  });
}
```

### **Header/Layout Components:**
```typescript
constructor(
  private authService: AuthService  // Only need state management
) {}

ngOnInit() {
  // Observe authentication state
  this.authService.isAuthenticated$.subscribe(isAuth => {
    this.isLoggedIn = isAuth;
  });
  
  // Get current user
  this.authService.currentUser$.subscribe(user => {
    this.currentUser = user;
  });
}

logout() {
  this.authService.logout();  // Handles everything
}
```

---

## 🔑 **Key Benefits**

### **1. Single Responsibility**
- `AuthService` = State
- `AuthApiService` = API

### **2. Easier Testing**
- Mock `AuthApiService` for API tests
- Mock `AuthService` for state tests

### **3. Cleaner Components**
- Components only inject what they need
- Most components only need `AuthService` (state)
- Only login/register need `AuthApiService`

### **4. Better Maintainability**
- API changes → Update `AuthApiService`
- State logic changes → Update `AuthService`
- No cross-contamination

---

## 📝 **Migration Notes**

### **What Changed:**
1. ✅ Removed `login()`, `createUser()`, `refreshUserProfile()` from `AuthService`
2. ✅ Removed `currentUserSubject` from `AuthApiService`
3. ✅ `AuthApiService` now delegates state to `AuthService`
4. ✅ Updated `Login` and `Register` components to use `AuthApiService`

### **What Stayed:**
- ✅ All guards still use `AuthService.isAuthenticated()`
- ✅ Role navigation still uses `AuthService.getCurrentUser()`
- ✅ Storage encryption via `SecureStorageService`
- ✅ Session timeout monitoring

---

## 🚀 **Status**

**Build:** ✅ **SUCCESS**  
**Architecture:** ✅ **Clean Separation**  
**Components:** ✅ **Updated**  
**Guards:** ✅ **Compatible**

---

**Last Updated:** 2026-01-28
