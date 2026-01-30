import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Stats {
  totalUsers: number;
  usersGrowth: number;
  totalCourses: number;
  coursesGrowth: number;
  activeEnrollments: number;
  enrollmentsGrowth: number;
  totalRevenue: number;
  revenueGrowth: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedDate: Date;
  status: string;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  students: number;
  status: string;
  icon: string;
  createdDate: Date;
}

interface SystemStatus {
  serverLoad: number;
  storageUsed: number;
  memoryUsage: number;
  databaseLoad: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class AdminDashboard implements OnInit {
  stats: Stats = {
    totalUsers: 12458,
    usersGrowth: 12.5,
    totalCourses: 342,
    coursesGrowth: 8.2,
    activeEnrollments: 8934,
    enrollmentsGrowth: 15.3,
    totalRevenue: 245680,
    revenueGrowth: 18.7
  };

  recentUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'student',
      joinedDate: new Date(2026, 0, 25),
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'teacher',
      joinedDate: new Date(2026, 0, 24),
      status: 'active'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      role: 'student',
      joinedDate: new Date(2026, 0, 23),
      status: 'active'
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah.w@example.com',
      role: 'teacher',
      joinedDate: new Date(2026, 0, 22),
      status: 'active'
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.b@example.com',
      role: 'student',
      joinedDate: new Date(2026, 0, 21),
      status: 'active'
    }
  ];

  recentCourses: Course[] = [
    {
      id: '1',
      title: 'Advanced Web Development',
      instructor: 'Prof. Anderson',
      students: 245,
      status: 'Active',
      icon: 'code-slash',
      createdDate: new Date(2026, 0, 26)
    },
    {
      id: '2',
      title: 'Data Science Fundamentals',
      instructor: 'Dr. Martinez',
      students: 189,
      status: 'Active',
      icon: 'graph-up',
      createdDate: new Date(2026, 0, 25)
    },
    {
      id: '3',
      title: 'Mobile App Development',
      instructor: 'Prof. Taylor',
      students: 156,
      status: 'Active',
      icon: 'phone',
      createdDate: new Date(2026, 0, 24)
    },
    {
      id: '4',
      title: 'Machine Learning Basics',
      instructor: 'Dr. Wilson',
      students: 203,
      status: 'Active',
      icon: 'cpu',
      createdDate: new Date(2026, 0, 23)
    },
    {
      id: '5',
      title: 'UI/UX Design Principles',
      instructor: 'Prof. Garcia',
      students: 178,
      status: 'Active',
      icon: 'palette',
      createdDate: new Date(2026, 0, 22)
    }
  ];

  systemStatus: SystemStatus = {
    serverLoad: 45,
    storageUsed: 67,
    memoryUsage: 52,
    databaseLoad: 38
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialize charts or load data from API
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // TODO: Replace with actual API calls
    // this.apiService.getDashboardStats().subscribe(stats => {
    //   this.stats = stats;
    // });

    console.log('Admin Dashboard loaded');
  }

  // Chart initialization would go here
  // You can use Chart.js, ng2-charts, or any other charting library
}
