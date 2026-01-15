import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../components/page-header/page-header';
import { InputComponent } from '../../../components/ui/input/input';
import { AccountTypeSelectorComponent } from '../../../components/account-type-selector/account-type-selector.component';
import { ButtonComponent } from '../../../components/ui/button/button';

export interface InstructorCourse {
  id: string;
  title: string;
  category: string;
  price: number;
  status: 'published' | 'draft' | 'under-review';
  duration: string;
  thumbnail: string;
  description: string;
  lessons: number;
  uploadDate: Date;
  lastUpdated: Date;
  enrolledStudents: number;
  totalRevenue: number;
  rating: number;
  reviews: number;
  completionRate: number;
}

@Component({
  selector: 'app-courses',
  imports: [CommonModule, FormsModule, PageHeader, InputComponent, AccountTypeSelectorComponent, ButtonComponent],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {
  courses: InstructorCourse[] = [];
  filteredCourses: InstructorCourse[] = [];
  selectedStatus: string = 'all';
  searchQuery: string = '';
  
  // Statistics
  totalCourses: number = 0;
  publishedCourses: number = 0;
  totalStudents: number = 0;
  totalRevenue: number = 0;

  // Modal
  showModal: boolean = false;
  selectedCourse: InstructorCourse | null = null;

  statusOptions = [
    { title: 'All Courses', description: 'Show all courses', value: 'all', icon: 'bi-collection' },
    { title: 'Published', description: 'Live courses', value: 'published', icon: 'bi-check-circle-fill' },
    { title: 'Draft', description: 'Unpublished courses', value: 'draft', icon: 'bi-pencil-square' },
    { title: 'Under Review', description: 'Pending approval', value: 'under-review', icon: 'bi-hourglass-split' }
  ];

  ngOnInit(): void {
    this.loadCourses();
    this.calculateStatistics();
    this.filteredCourses = [...this.courses];
  }

  loadCourses(): void {
    // Sample data - replace with actual API call
    this.courses = [
      {
        id: '1',
        title: 'Complete Web Development Bootcamp',
        category: 'Web Development',
        price: 299.99,
        status: 'published',
        duration: '52 hours',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
        description: 'Master web development with HTML, CSS, JavaScript, Node.js, React, MongoDB and more! This comprehensive course covers everything from basics to advanced topics.',
        lessons: 156,
        uploadDate: new Date('2023-06-15'),
        lastUpdated: new Date('2024-01-10'),
        enrolledStudents: 2847,
        totalRevenue: 853509,
        rating: 4.8,
        reviews: 1245,
        completionRate: 78
      },
      {
        id: '2',
        title: 'Python for Data Science and Machine Learning',
        category: 'Data Science',
        price: 249.99,
        status: 'published',
        duration: '25 hours',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
        description: 'Learn Python for data analysis, visualization, and machine learning. Includes NumPy, Pandas, Matplotlib, Scikit-learn and more.',
        lessons: 98,
        uploadDate: new Date('2023-08-20'),
        lastUpdated: new Date('2024-01-05'),
        enrolledStudents: 1923,
        totalRevenue: 480577,
        rating: 4.9,
        reviews: 876,
        completionRate: 82
      },
      {
        id: '3',
        title: 'UI/UX Design Masterclass',
        category: 'Design',
        price: 199.99,
        status: 'published',
        duration: '18 hours',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
        description: 'Master UI/UX design with Figma, Adobe XD, and design principles. Create stunning user interfaces and experiences.',
        lessons: 72,
        uploadDate: new Date('2023-09-10'),
        lastUpdated: new Date('2023-12-20'),
        enrolledStudents: 1456,
        totalRevenue: 291185,
        rating: 4.7,
        reviews: 654,
        completionRate: 71
      },
      {
        id: '4',
        title: 'React - The Complete Guide',
        category: 'Web Development',
        price: 279.99,
        status: 'draft',
        duration: '48 hours',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        description: 'Dive deep into React.js and learn Hooks, Redux, Next.js and more! Build modern web applications with confidence.',
        lessons: 142,
        uploadDate: new Date('2024-01-15'),
        lastUpdated: new Date('2024-01-15'),
        enrolledStudents: 0,
        totalRevenue: 0,
        rating: 0,
        reviews: 0,
        completionRate: 0
      },
      {
        id: '5',
        title: 'Digital Marketing Masterclass',
        category: 'Marketing',
        price: 189.99,
        status: 'published',
        duration: '23 hours',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        description: 'Master digital marketing: SEO, social media, email marketing and more. Grow your business online effectively.',
        lessons: 86,
        uploadDate: new Date('2023-07-05'),
        lastUpdated: new Date('2023-11-30'),
        enrolledStudents: 3241,
        totalRevenue: 615628,
        rating: 4.6,
        reviews: 1432,
        completionRate: 68
      },
      {
        id: '6',
        title: 'AWS Certified Solutions Architect',
        category: 'Cloud Computing',
        price: 349.99,
        status: 'published',
        duration: '27 hours',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
        description: 'Pass the AWS Solutions Architect Associate exam with flying colors! Complete preparation course with hands-on labs.',
        lessons: 112,
        uploadDate: new Date('2023-05-20'),
        lastUpdated: new Date('2024-01-08'),
        enrolledStudents: 1687,
        totalRevenue: 590463,
        rating: 4.9,
        reviews: 892,
        completionRate: 85
      },
      {
        id: '7',
        title: 'Mobile App Development with Flutter',
        category: 'Mobile Development',
        price: 259.99,
        status: 'under-review',
        duration: '35 hours',
        thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
        description: 'Build beautiful cross-platform mobile apps with Flutter and Dart. From basics to advanced features.',
        lessons: 128,
        uploadDate: new Date('2024-01-12'),
        lastUpdated: new Date('2024-01-12'),
        enrolledStudents: 0,
        totalRevenue: 0,
        rating: 0,
        reviews: 0,
        completionRate: 0
      },
      {
        id: '8',
        title: 'Docker and Kubernetes: The Complete Guide',
        category: 'DevOps',
        price: 269.99,
        status: 'published',
        duration: '22 hours',
        thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400',
        description: 'Build, test, and deploy Docker applications with Kubernetes. Master container orchestration and DevOps.',
        lessons: 94,
        uploadDate: new Date('2023-10-15'),
        lastUpdated: new Date('2023-12-28'),
        enrolledStudents: 2134,
        totalRevenue: 576077,
        rating: 4.8,
        reviews: 1023,
        completionRate: 76
      }
    ];
  }

  calculateStatistics(): void {
    this.totalCourses = this.courses.length;
    this.publishedCourses = this.courses.filter(c => c.status === 'published').length;
    this.totalStudents = this.courses.reduce((sum, c) => sum + c.enrolledStudents, 0);
    this.totalRevenue = this.courses.reduce((sum, c) => sum + c.totalRevenue, 0);
  }

  filterCourses(): void {
    let filtered = [...this.courses];

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(c => c.status === this.selectedStatus);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
      );
    }

    this.filteredCourses = filtered;
  }

  onStatusChange(): void {
    this.filterCourses();
  }

  onSearchChange(): void {
    this.filterCourses();
  }

  onClear(): void {
    this.searchQuery = '';
    this.selectedStatus = 'all';
    this.filteredCourses = [...this.courses];
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'published': return 'text-success bg-success-subtle border-success-subtle';
      case 'draft': return 'text-secondary bg-secondary-subtle border-secondary-subtle';
      case 'under-review': return 'text-warning bg-warning-subtle border-warning-subtle';
      default: return 'text-secondary bg-secondary-subtle border-secondary-subtle';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'published': return 'bi-check-circle-fill';
      case 'draft': return 'bi-pencil-square';
      case 'under-review': return 'bi-hourglass-split';
      default: return 'bi-question-circle-fill';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'published': return 'Published';
      case 'draft': return 'Draft';
      case 'under-review': return 'Under Review';
      default: return status;
    }
  }

  viewCourse(course: InstructorCourse): void {
    this.selectedCourse = course;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCourse = null;
  }

  editCourse(course: InstructorCourse): void {
    console.log('Edit course:', course.title);
    this.closeModal();
    // Implement navigation to course editor
  }

  publishCourse(course: InstructorCourse): void {
    console.log('Publishing course:', course.title);
    // Implement publish logic
  }

  deleteCourse(course: InstructorCourse): void {
    console.log('Deleting course:', course.title);
    // Implement delete logic
  }

  viewAnalytics(course: InstructorCourse): void {
    console.log('View analytics for:', course.title);
    // Implement analytics view
  }

  createNewCourse(): void {
    console.log('Create new course');
    // Implement navigation to course creation
  }
}
