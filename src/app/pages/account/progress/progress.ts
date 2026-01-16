import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../components/page-header/page-header';
import { InputComponent } from '../../../components/ui/input/input';
import { AccountTypeSelectorComponent } from '../../../components/account-type-selector/account-type-selector.component';


export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: string;
  appliedDate: Date;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'rejected' | 'accepted' | 'withdrawn';
  applicationMethod: 'direct' | 'referral' | 'recruiter';
  jobDescription: string;
  requirements: string[];
  applicationNotes?: string;
  interviewDate?: Date;
  rejectionReason?: string;
  responseDate?: Date;
}

@Component({
  selector: 'app-progress',
  imports: [CommonModule, FormsModule, PageHeader, InputComponent, AccountTypeSelectorComponent,],
  templateUrl: './progress.html',
  styleUrl: './progress.scss',
})
export class Progress implements OnInit {
  applications: JobApplication[] = [];
  filteredApplications: JobApplication[] = [];
  selectedStatus: string = 'all';
  searchQuery: string = '';

  // Statistics
  totalApplications: number = 0;
  pendingApplications: number = 0;
  reviewingApplications: number = 0;
  shortlistedApplications: number = 0;
  interviewApplications: number = 0;
  acceptedApplications: number = 0;
  rejectedApplications: number = 0;

  // Modal
  showModal: boolean = false;
  selectedApplication: JobApplication | null = null;

  statusOptions = [
    { title: 'All Applications', description: 'Show all applications', value: 'all', icon: 'bi-briefcase-fill' },
    { title: 'Pending', description: 'Applications pending review', value: 'pending', icon: 'bi-clock-fill' },
    { title: 'Reviewing', description: 'Under review', value: 'reviewing', icon: 'bi-eye-fill' },
    { title: 'Shortlisted', description: 'Shortlisted candidates', value: 'shortlisted', icon: 'bi-star-fill' },
    { title: 'Interview', description: 'Interview scheduled', value: 'interview', icon: 'bi-calendar-check' },
    { title: 'Accepted', description: 'Job offers accepted', value: 'accepted', icon: 'bi-check-circle-fill' },
    { title: 'Rejected', description: 'Applications rejected', value: 'rejected', icon: 'bi-x-circle-fill' }
  ];

  ngOnInit(): void {
    this.loadApplications();
    this.calculateStatistics();
    this.filteredApplications = [...this.applications];
  }

  loadApplications(): void {
    // Sample job applications data
    this.applications = [
      {
        id: 'app1',
        jobTitle: 'Senior Frontend Developer',
        company: 'Tech Solutions Inc.',
        companyLogo: 'https://via.placeholder.com/40',
        location: 'Lagos, Nigeria',
        jobType: 'full-time',
        salary: '₦500,000 - 800,000',
        appliedDate: new Date('2024-01-15'),
        status: 'shortlisted',
        applicationMethod: 'direct',
        jobDescription: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building user-facing web applications using React, TypeScript, and modern frontend technologies.',
        requirements: [
          '5+ years of experience in frontend development',
          'Strong knowledge of React and TypeScript',
          'Experience with state management libraries',
          'Knowledge of modern CSS frameworks'
        ],
        applicationNotes: 'Applied through company website. Attached portfolio and GitHub profile.',
        responseDate: new Date('2024-01-20')
      },
      {
        id: 'app2',
        jobTitle: 'Full Stack Developer',
        company: 'Digital Innovations Ltd',
        companyLogo: 'https://via.placeholder.com/40',
        location: 'Abuja, Nigeria',
        jobType: 'full-time',
        salary: '₦400,000 - 600,000',
        appliedDate: new Date('2024-01-10'),
        status: 'interview',
        applicationMethod: 'direct',
        jobDescription: 'Join our dynamic team as a Full Stack Developer. You will work on both frontend and backend systems, building scalable web applications.',
        requirements: [
          '3+ years of full-stack development experience',
          'Proficiency in Node.js and React',
          'Database design and optimization',
          'RESTful API development'
        ],
        applicationNotes: 'Referred by a friend. Interview scheduled for next week.',
        interviewDate: new Date('2024-01-25T10:00:00'),
        responseDate: new Date('2024-01-18')
      },
      {
        id: 'app3',
        jobTitle: 'UI/UX Designer',
        company: 'Creative Studio',
        companyLogo: 'https://via.placeholder.com/40',
        location: 'Remote',
        jobType: 'contract',
        salary: '₦300,000 - 500,000',
        appliedDate: new Date('2024-01-08'),
        status: 'pending',
        applicationMethod: 'direct',
        jobDescription: 'We need a talented UI/UX Designer to create beautiful and intuitive user interfaces for our digital products.',
        requirements: [
          'Portfolio demonstrating UI/UX design skills',
          'Proficiency in Figma or Adobe XD',
          'Understanding of user-centered design principles',
          'Experience with design systems'
        ],
        applicationNotes: 'Submitted portfolio with 10+ project examples.'
      },
      {
        id: 'app4',
        jobTitle: 'DevOps Engineer',
        company: 'Cloud Systems NG',
        companyLogo: 'https://via.placeholder.com/40',
        location: 'Lagos, Nigeria',
        jobType: 'full-time',
        salary: '₦600,000 - 900,000',
        appliedDate: new Date('2024-01-05'),
        status: 'reviewing',
        applicationMethod: 'recruiter',
        jobDescription: 'Seeking a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines.',
        requirements: [
          'Experience with AWS or Azure',
          'Knowledge of Docker and Kubernetes',
          'CI/CD pipeline setup and maintenance',
          'Infrastructure as Code (Terraform)'
        ],
        applicationNotes: 'Recruiter reached out via LinkedIn. Application submitted.',
        responseDate: new Date('2024-01-12')
      },
      {
        id: 'app5',
        jobTitle: 'Junior Software Developer',
        company: 'StartupHub',
        companyLogo: 'https://via.placeholder.com/40',
        location: 'Port Harcourt, Nigeria',
        jobType: 'full-time',
        salary: '₦200,000 - 350,000',
        appliedDate: new Date('2024-01-03'),
        status: 'rejected',
        applicationMethod: 'direct',
        jobDescription: 'Entry-level position for recent graduates or developers with 1-2 years of experience.',
        requirements: [
          'Bachelor\'s degree in Computer Science or related field',
          'Knowledge of JavaScript and Python',
          'Willingness to learn and grow',
          'Good communication skills'
        ],
        applicationNotes: 'Applied as entry-level candidate. Received rejection email.',
        rejectionReason: 'We are looking for candidates with more experience in our tech stack.',
        responseDate: new Date('2024-01-10')
      },
      {
        id: 'app6',
        jobTitle: 'Product Manager',
        company: 'InnovateTech',
        companyLogo: 'https://via.placeholder.com/40',
        location: 'Lagos, Nigeria',
        jobType: 'full-time',
        salary: '₦700,000 - 1,000,000',
        appliedDate: new Date('2023-12-28'),
        status: 'accepted',
        applicationMethod: 'referral',
        jobDescription: 'Lead product development initiatives and work closely with engineering and design teams.',
        requirements: [
          '5+ years of product management experience',
          'Strong analytical and communication skills',
          'Experience with agile methodologies',
          'Technical background preferred'
        ],
        applicationNotes: 'Referred by former colleague. Went through 3 rounds of interviews.',
        interviewDate: new Date('2024-01-05T14:00:00'),
        responseDate: new Date('2024-01-15')
      },
      {
        id: 'app7',
        jobTitle: 'Data Scientist',
        company: 'Analytics Pro',
        companyLogo: 'https://via.placeholder.com/40',
        location: 'Remote',
        jobType: 'contract',
        salary: '₦500,000 - 750,000',
        appliedDate: new Date('2024-01-12'),
        status: 'reviewing',
        applicationMethod: 'direct',
        jobDescription: 'Analyze large datasets and build machine learning models to drive business insights.',
        requirements: [
          'Master\'s degree in Data Science or related field',
          'Experience with Python and R',
          'Knowledge of machine learning algorithms',
          'Experience with SQL and data visualization'
        ],
        applicationNotes: 'Submitted detailed portfolio with ML project examples.'
      },
      {
        id: 'app8',
        jobTitle: 'Backend Developer',
        company: 'API Solutions',
        companyLogo: 'https://via.placeholder.com/40',
        location: 'Abuja, Nigeria',
        jobType: 'full-time',
        salary: '₦450,000 - 650,000',
        appliedDate: new Date('2024-01-18'),
        status: 'pending',
        applicationMethod: 'direct',
        jobDescription: 'Build robust backend systems and APIs for our platform.',
        requirements: [
          '4+ years of backend development experience',
          'Proficiency in Node.js or Python',
          'Database design and optimization',
          'API design and documentation'
        ],
        applicationNotes: 'Just applied yesterday. Waiting for response.'
      }
    ];
  }

  calculateStatistics(): void {
    this.totalApplications = this.applications.length;
    this.pendingApplications = this.applications.filter(a => a.status === 'pending').length;
    this.reviewingApplications = this.applications.filter(a => a.status === 'reviewing').length;
    this.shortlistedApplications = this.applications.filter(a => a.status === 'shortlisted').length;
    this.interviewApplications = this.applications.filter(a => a.status === 'interview').length;
    this.acceptedApplications = this.applications.filter(a => a.status === 'accepted').length;
    this.rejectedApplications = this.applications.filter(a => a.status === 'rejected').length;
  }

  filterApplications(): void {
    let filtered = [...this.applications];

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(a => a.status === this.selectedStatus);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.jobTitle.toLowerCase().includes(query) ||
        a.company.toLowerCase().includes(query) ||
        a.location.toLowerCase().includes(query) ||
        a.jobType.toLowerCase().includes(query)
      );
    }

    this.filteredApplications = filtered;
  }

  onStatusChange(): void {
    this.filterApplications();
  }

  onSearchChange(): void {
    this.filterApplications();
  }

  onClear(): void {
    this.searchQuery = '';
    this.selectedStatus = 'all';
    this.filteredApplications = [...this.applications];
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'pending': return 'text-warning bg-warning-subtle border-warning-subtle';
      case 'reviewing': return 'text-info bg-info-subtle border-info-subtle';
      case 'shortlisted': return 'text-primary bg-primary-subtle border-primary-subtle';
      case 'interview': return 'text-success bg-success-subtle border-success-subtle';
      case 'accepted': return 'text-success bg-success-subtle border-success-subtle';
      case 'rejected': return 'text-danger bg-danger-subtle border-danger-subtle';
      case 'withdrawn': return 'text-secondary bg-secondary-subtle border-secondary-subtle';
      default: return 'text-secondary bg-secondary-subtle border-secondary-subtle';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'pending': return 'bi-clock-fill';
      case 'reviewing': return 'bi-eye-fill';
      case 'shortlisted': return 'bi-star-fill';
      case 'interview': return 'bi-calendar-check';
      case 'accepted': return 'bi-check-circle-fill';
      case 'rejected': return 'bi-x-circle-fill';
      case 'withdrawn': return 'bi-arrow-left-circle-fill';
      default: return 'bi-question-circle-fill';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'pending': return 'Pending';
      case 'reviewing': return 'Reviewing';
      case 'shortlisted': return 'Shortlisted';
      case 'interview': return 'Interview';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      case 'withdrawn': return 'Withdrawn';
      default: return status;
    }
  }

  getJobTypeClass(type: string): string {
    switch(type) {
      case 'full-time': return 'bg-primary-subtle text-primary';
      case 'part-time': return 'bg-info-subtle text-info';
      case 'contract': return 'bg-warning-subtle text-warning';
      case 'internship': return 'bg-success-subtle text-success';
      default: return 'bg-secondary-subtle text-secondary';
    }
  }

  getApplicationMethodIcon(method: string): string {
    switch(method) {
      case 'direct': return 'bi-globe';
      case 'referral': return 'bi-people-fill';
      case 'recruiter': return 'bi-person-badge';
      default: return 'bi-briefcase';
    }
  }

  getDaysSinceApplication(date: Date): number {
    const now = new Date();
    const applied = new Date(date);
    const diffTime = now.getTime() - applied.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysUntilInterview(date: Date): number {
    const now = new Date();
    const interview = new Date(date);
    const diffTime = interview.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  viewApplication(application: JobApplication): void {
    this.selectedApplication = application;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedApplication = null;
  }

  withdrawApplication(application: JobApplication): void {
    if (confirm('Are you sure you want to withdraw this application?')) {
      application.status = 'withdrawn';
      this.calculateStatistics();
      this.filterApplications();
      this.closeModal();
    }
  }
}
