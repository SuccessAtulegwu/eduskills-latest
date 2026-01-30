# Backend API Integration Guide

## Overview

This Angular application is configured to integrate with the EduSkill backend API at `https://www.eduskillng.ng/api/v1`.

## Configuration

### Environment Files

The project uses environment-specific configuration files:

- **Development**: `src/environments/environment.ts`
- **Production**: `src/environments/environment.prod.ts`

Both files contain:
```typescript
{
  production: boolean,
  apiUrl: string,           // Base API URL
  apiTimeout: number,       // Request timeout in milliseconds
  enableDebugTools: boolean,
  logLevel: string
}
```

### API Service

The `ApiService` (`src/app/services/api.service.ts`) provides a centralized way to make HTTP requests:

#### Available Methods

```typescript
// GET request
get<T>(endpoint: string, params?: any): Observable<T>

// POST request
post<T>(endpoint: string, body: any): Observable<T>

// PUT request
put<T>(endpoint: string, body: any): Observable<T>

// PATCH request
patch<T>(endpoint: string, body: any): Observable<T>

// DELETE request
delete<T>(endpoint: string): Observable<T>

// Upload file
upload<T>(endpoint: string, formData: FormData): Observable<T>

// Download file
download(endpoint: string, filename?: string): Observable<Blob>
```

#### Authentication Methods

```typescript
isAuthenticated(): boolean
setAuthToken(token: string): void
getAuthToken(): string | null
clearAuthToken(): void
```

### HTTP Interceptor

The `apiInterceptor` (`src/app/services/api.interceptor.ts`) automatically:

1. **Adds authentication headers** to all requests
2. **Handles request timeouts** (30 seconds by default)
3. **Provides centralized error handling** with user-friendly messages
4. **Shows toast notifications** for errors
5. **Redirects to login** on 401 Unauthorized errors

## Usage Examples

### 1. Creating a Service

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private apiService: ApiService) {}

  // Get all courses
  getCourses(params?: { category?: string; page?: number }): Observable<Course[]> {
    return this.apiService.get<Course[]>('/courses', params);
  }

  // Get single course
  getCourse(id: number): Observable<Course> {
    return this.apiService.get<Course>(`/courses/${id}`);
  }

  // Create course
  createCourse(data: Partial<Course>): Observable<Course> {
    return this.apiService.post<Course>('/courses', data);
  }

  // Update course
  updateCourse(id: number, data: Partial<Course>): Observable<Course> {
    return this.apiService.put<Course>(`/courses/${id}`, data);
  }

  // Delete course
  deleteCourse(id: number): Observable<void> {
    return this.apiService.delete<void>(`/courses/${id}`);
  }
}
```

### 2. Using in Components

```typescript
import { Component, OnInit } from '@angular/core';
import { CourseService, Course } from './course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html'
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  loading = false;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    this.courseService.getCourses({ category: 'development' }).subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.loading = false;
      }
    });
  }
}
```

### 3. File Upload Example

```typescript
uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', 'My File');

  this.apiService.upload('/uploads', formData).subscribe({
    next: (response) => {
      console.log('Upload successful:', response);
    },
    error: (error) => {
      console.error('Upload failed:', error);
    }
  });
}
```

### 4. Authentication Example

```typescript
import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(email: string, password: string) {
    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
```

## API Response Format

The API is expected to return responses in this format:

```typescript
{
  success: boolean,
  message?: string,
  data?: any,
  error?: string,
  errors?: { [key: string]: string[] }
}
```

The `ApiService` automatically extracts the `data` field from successful responses.

## Error Handling

Errors are automatically handled by the interceptor:

| Status Code | Action |
|-------------|--------|
| 0 | Network error - shows "No internet connection" |
| 400 | Bad request - shows error message from API |
| 401 | Unauthorized - clears token and redirects to login |
| 403 | Forbidden - shows "Access forbidden" |
| 404 | Not found - shows error message |
| 422 | Validation error - shows error message |
| 500 | Server error - shows "Server error" |
| 503 | Service unavailable - shows "Service unavailable" |

All errors trigger a toast notification automatically.

## Authentication Flow

1. User logs in via `AuthService.login()`
2. Backend returns `{ user, token }`
3. Token is stored in `localStorage` as `authToken`
4. All subsequent API requests include `Authorization: Bearer {token}` header
5. On 401 error, token is cleared and user is redirected to login

## Building for Production

```bash
# Development build (uses environment.ts)
npm run build

# Production build (uses environment.prod.ts)
npm run build -- --configuration production
```

## Testing API Integration

1. **Start development server**:
   ```bash
   npm start
   ```

2. **Check browser console** for API requests and responses

3. **Monitor Network tab** in browser DevTools to see:
   - Request headers (including Authorization)
   - Response data
   - Error messages

## Security Best Practices

✅ **Implemented:**
- Authentication tokens stored in localStorage
- Automatic token injection via interceptor
- Automatic logout on 401 errors
- HTTPS-only API endpoint

⚠️ **Recommendations:**
- Consider using HttpOnly cookies for tokens (requires backend support)
- Implement token refresh mechanism
- Add CSRF protection if using cookies
- Implement rate limiting on sensitive endpoints

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure the backend has proper CORS headers configured.

### 401 Errors
- Check if token is valid
- Verify token format in Authorization header
- Check token expiration

### Timeout Errors
- Default timeout is 30 seconds
- Adjust `apiTimeout` in environment files if needed
- Check network connection

### Type Errors
- Ensure API response matches TypeScript interfaces
- Check API documentation for correct response format

## Additional Resources

- [Angular HttpClient Documentation](https://angular.io/guide/http)
- [RxJS Documentation](https://rxjs.dev/)
- [API Documentation](https://www.eduskillng.ng/api/docs) (if available)
