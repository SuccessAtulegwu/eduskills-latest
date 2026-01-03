import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Home, FolderOpen, GraduationCap, Zap, Briefcase, 
  TrendingUp, Users, ShoppingBag, Briefcase as BriefcaseIcon,
  PlayCircle, Rss, Compass, UserPlus, CreditCard, 
  Wallet, Calendar, User, Upload, Wrench, 
  ClipboardList, BarChart, BookOpen, FileCheck, 
  Send, Bell, FileText, HelpCircle, LogOut, 
  LogIn, UserCheck
} from 'lucide-angular';

export interface MenuItem {
  id: string;
  label: string;
  icon: any; // Lucide icon type
  route?: string;
  badge?: {
    value: string | number;
    class: string;
  };
  children?: MenuItem[];
  tooltip?: string;
  roles?: string[]; // Optional: For role-based menu filtering
  visible?: boolean; // Optional: For dynamic visibility control
  requiresAuth?: boolean; // Show only when authenticated
  hideWhenAuth?: boolean; // Hide when authenticated (for login/register)
  isPublic?: boolean; // Show to everyone regardless of auth status
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private defaultMenuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      route: '/home',
      tooltip: 'Dashboard',
      visible: true,
      isPublic: true // Accessible to everyone
    },
    {
      id: 'content',
      label: 'CONTENT',
      icon: '',//FolderOpen,
      visible: true,
      isPublic: true, // Show to everyone
      children: [
        {
          id: 'academics',
          label: 'Academics',
          icon: GraduationCap,
          route: '/content/academics',
          visible: true,
          isPublic: true
        },
        {
          id: 'skills',
          label: 'Skills',
          icon: Zap,
          route: '/content/skills',
          visible: true,
          isPublic: true
        },
        {
          id: 'career',
          label: 'Career',
          icon: TrendingUp,
          route: '/content/career',
          visible: true,
          isPublic: true
        },
        {
          id: 'learning',
          label: 'Learning Path',
          icon: BookOpen,
          route: '/content/learning-path',
          tooltip: 'Watch Videos',
          visible: true,
          isPublic: true
        }, 
        {
          id: 'professional',
          label: 'Find Professionals',
          icon: Users,
          route: '/content/find-professionals',
          tooltip: 'Watch Videos',
          visible: true,
          isPublic: true
        },
        {
          id: 'marketplace',
          label: 'Marketplace',
          icon: ShoppingBag,
          route: '/content/market-place',
          tooltip: 'Marketplace',
          visible: true,
          isPublic: true
        },
        {
          id: 'jobs',
          label: 'Job & Internship',
          icon: BriefcaseIcon,
          route: '/content/intenship',
          tooltip: 'Job Listings',
          visible: true,
          isPublic: true
        },
        {
          id: 'courses',
          label: 'Courses',
          icon: PlayCircle,
          route: '/content/courses',
          tooltip: 'Watch Videos',
          visible: true,
          isPublic: true
        },
      ]
    },
    {
      id: 'discover',
      label: 'DISCOVER',
      icon: '',// Compass,
      visible: true,
      isPublic: true,
      children: [
        {
          id: 'feed',
          label: 'Feed',
          icon: Rss,
          route: '/discover/feed',
          visible: true,
          isPublic: true
        },
        {
          id: 'explore',
          label: 'Explore',
          icon: Compass,
          route: '/discover/explore',
          visible: true,
          isPublic: true
        },
        {
          id: 'following',
          label: 'Following',
          icon: UserPlus,
          route: '/discover/following',
          visible: true,
          requiresAuth: true // Only for authenticated users
        }
      ]
    },
    {
      id: 'account',
      label: 'MY ACCOUNT',
      icon: '',// User,
      visible: true,
      requiresAuth: true, // Only show when authenticated
      children: [
        {
          id: 'subscriptions',
          label: 'My Subscriptions',
          icon: CreditCard,
          route: '/account/subscriptions',
          visible: true,
          requiresAuth: true
        },
        {
          id: 'payments',
          label: 'My Payments',
          icon: Wallet,
          route: '/account/payments',
          visible: true,
          requiresAuth: true
        },
        {
          id: 'booking',
          label: 'My Bookings',
          icon: Calendar,
          route: '/account/bookings',
          visible: true,
          requiresAuth: true
        },
         {
          id: 'profile',
          label: 'My Profile',
          icon: User,
          route: '/account/profile',
          visible: true,
          requiresAuth: true
        },
         {
          id: 'upload',
          label: 'Upload Videos',
          icon: Upload,
          route: '/account/upload',
          visible: true,
          requiresAuth: true
        },
         {
          id: 'creator',
          label: 'Creator Tools',
          icon: Wrench,
          route: '/account/creator',
          visible: true,
          requiresAuth: true
        },
         {
          id: 'quizes',
          label: 'My Quizes',
          icon: ClipboardList,
          route: '/account/quizes',
          visible: true,
          requiresAuth: true
        },
        {
          id: 'progress',
          label: 'My Progress',
          icon: BarChart,
          route: '/account/progress',
          visible: true,
          requiresAuth: true
        },
        {
          id: 'my-courses',
          label: 'My Courses',
          icon: BookOpen,
          route: '/account/courses',
          visible: true,
          requiresAuth: true
        },
        {
          id: 'enrollments',
          label: 'My Enrollments',
          icon: FileCheck,
          route: '/account/enrollments',
          visible: true,
          requiresAuth: true
        },
        {
          id: 'applications',
          label: 'My Applications',
          icon: Send,
          route: '/account/applications',
          visible: true,
          requiresAuth: true
        },
         {
          id: 'jobs',
          label: 'Jobs  Alerts',
          icon: Bell,
          route: '/account/job-alerts',
          visible: true,
          requiresAuth: true
        },
         {
          id: 'cv',
          label: 'CV Templates',
          icon: FileText,
          route: '/account/cv-templates',
          visible: true,
          requiresAuth: true
        },
         {
          id: 'support',
          label: 'Support Tickets',
          icon: HelpCircle,
          route: '/account/support',
          visible: true,
          requiresAuth: true
        },
        
      ]
    },
     {
      id: 'auth-actions',
      label: 'ACCOUNT',
      icon: '',// UserCheck,
      visible: true,
      isPublic: true, // Show section to everyone
      children: [
        {
          id: 'logout',
          label: 'Logout',
          icon: LogOut,
          route: '/logout',
          visible: true,
          requiresAuth: true // Only show when authenticated
        },
        {
          id: 'login',
          label: 'Login',
          icon: LogIn,
          route: '/login',
          visible: true,
          hideWhenAuth: true // Hide when authenticated
        },
        {
          id: 'register',
          label: 'Register',
          icon: UserCheck,
          route: '/register',
          visible: true,
          hideWhenAuth: true // Hide when authenticated
        },
      ]
    },
  ];

  private menuItemsSubject = new BehaviorSubject<MenuItem[]>(this.defaultMenuItems);
  public menuItems$: Observable<MenuItem[]> = this.menuItemsSubject.asObservable();

  constructor() { }

  /**
   * Get current menu items
   */
  getMenuItems(): MenuItem[] {
    return this.menuItemsSubject.value;
  }

  /**
   * Set new menu items
   */
  setMenuItems(items: MenuItem[]): void {
    this.menuItemsSubject.next(items);
  }

  /**
   * Update a specific menu item
   */
  updateMenuItem(itemId: string, updates: Partial<MenuItem>): void {
    const items = this.getMenuItems();
    const updatedItems = this.updateMenuItemRecursive(items, itemId, updates);
    this.setMenuItems(updatedItems);
  }

  /**
   * Update badge for a specific menu item
   */
  updateBadge(itemId: string, value: string | number, badgeClass: string = 'bg-primary'): void {
    this.updateMenuItem(itemId, {
      badge: { value, class: badgeClass }
    });
  }

  /**
   * Remove badge from a menu item
   */
  removeBadge(itemId: string): void {
    this.updateMenuItem(itemId, { badge: undefined });
  }

  /**
   * Toggle visibility of a menu item
   */
  toggleVisibility(itemId: string, visible: boolean): void {
    this.updateMenuItem(itemId, { visible });
  }

  /**
   * Filter menu items by user roles
   */
  filterByRoles(userRoles: string[]): void {
    const items = this.defaultMenuItems;
    const filteredItems = this.filterMenuItemsByRoles(items, userRoles);
    this.setMenuItems(filteredItems);
  }

  /**
   * Reset menu items to default
   */
  resetToDefault(): void {
    this.setMenuItems([...this.defaultMenuItems]);
  }

  /**
   * Filter menu items based on authentication status
   */
  filterByAuthStatus(isAuthenticated: boolean): void {
    const filteredItems = this.filterMenuItemsByAuth(this.defaultMenuItems, isAuthenticated);
    this.setMenuItems(filteredItems);
  }

  /**
   * Get menu items filtered by authentication status
   */
  getMenuItemsByAuthStatus(isAuthenticated: boolean): MenuItem[] {
    return this.filterMenuItemsByAuth(this.defaultMenuItems, isAuthenticated);
  }

  // Private helper methods

  private updateMenuItemRecursive(
    items: MenuItem[],
    itemId: string,
    updates: Partial<MenuItem>
  ): MenuItem[] {
    return items.map(item => {
      if (item.id === itemId) {
        return { ...item, ...updates };
      }
      if (item.children) {
        return {
          ...item,
          children: this.updateMenuItemRecursive(item.children, itemId, updates)
        };
      }
      return item;
    });
  }

  private filterMenuItemsByRoles(items: MenuItem[], userRoles: string[]): MenuItem[] {
    return items
      .filter(item => {
        // If no roles specified, item is visible to all
        if (!item.roles || item.roles.length === 0) {
          return true;
        }
        // Check if user has any of the required roles
        return item.roles.some(role => userRoles.includes(role));
      })
      .map(item => {
        if (item.children) {
          return {
            ...item,
            children: this.filterMenuItemsByRoles(item.children, userRoles)
          };
        }
        return item;
      });
  }

  private filterMenuItemsByAuth(items: MenuItem[], isAuthenticated: boolean): MenuItem[] {
    return items
      .filter(item => {
        // If item is public, always show
        if (item.isPublic) {
          return true;
        }
        // If item requires auth and user is not authenticated, hide
        if (item.requiresAuth && !isAuthenticated) {
          return false;
        }
        // If item should be hidden when authenticated and user is authenticated, hide
        if (item.hideWhenAuth && isAuthenticated) {
          return false;
        }
        // Show item by default
        return true;
      })
      .map(item => {
        // Filter children recursively
        if (item.children) {
          const filteredChildren = this.filterMenuItemsByAuth(item.children, isAuthenticated);
          // Only include parent if it has visible children or has a route itself
          if (filteredChildren.length > 0 || item.route) {
            return {
              ...item,
              children: filteredChildren
            };
          }
          // If parent has no visible children and no route, exclude it
          return null;
        }
        return item;
      })
      .filter((item): item is MenuItem => item !== null); // Remove null items
  }
}

