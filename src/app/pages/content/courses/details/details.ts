import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../../components/ui/button/button';
import { PageHeader } from '../../../../components/page-header/page-header';
import { PaymentModalComponent, PaymentDetails, PaymentItem } from '../../../../components/ui/payment-modal/payment-modal.component';
import { PaymentService } from '../../../../services/payment.service';

import { CourseModel, CourseResponse } from '../../../../models/course.model';
import { ToastService } from '../../../../services/toast.service';
import { CourseService } from '../../../../services/course.service';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent, PaymentModalComponent],
  templateUrl: './details.html',
  styleUrl: './details.scss'
})
export class CourseDetails implements OnInit {
  courseId: number | null = null;
  course: CourseModel | undefined;
  apiCourse: CourseResponse | undefined;
  showPaymentModal: boolean = false;
  paymentDetails: PaymentDetails | null = null;
  isLoading: boolean = false;
  useApi: boolean = true; // Toggle between API and mock data

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private courseService: CourseService,
    private paymentService: PaymentService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.courseId = +id;
        this.loadCourse();
      }
    });
  }

  loadCourse() {
    if (!this.courseId) return;

    if (this.useApi) {
      this.isLoading = true;
      this.courseService.getCourseById(this.courseId).subscribe({
        next: (response) => {
          this.apiCourse = response;
          // Convert API response to CourseModel for display compatibility
          this.course = this.convertToCourseModel(response);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading course:', error);
          this.toastService.show('Failed to load course. Using fallback data.', 'warning');
          // Fallback to mock data
          this.isLoading = false;
        }
      });
    } 
  }

  // Convert API CourseResponse to CourseModel for display compatibility
  private convertToCourseModel(course: CourseResponse): CourseModel {
    return {
      id: course.id,
      title: course.title,
      image: course.thumbnailUrl || '/assets/images/placeholder.jpg',
      price: course.price || 0,
      level: course.level || 'Beginner',
      views: 0,
      enrolled: 0,
      category: this.getCategoryName(course.categoryId),
      description: course.description,
      duration: course.durationHours ? `${course.durationHours} hours` : undefined,
      createdDate: course.createdAt ? new Date(course.createdAt).toLocaleDateString() : undefined
    };
  }

  private getCategoryName(categoryId?: number): string {
    const categoryMap: { [key: number]: string } = {
      1: 'Development',
      2: 'Design',
      3: 'Business'
    };
    return categoryMap[categoryId || 1] || 'Other';
  }

  goBack() {
    this.location.back();
  }

  enroll() {
    if (!this.course) return;

    // Create payment items from course
    const items: PaymentItem[] = [
      {
        id: this.course.id.toString(),
        name: this.course.title,
        type: 'course',
        price: this.course.price,
        quantity: 1
      }
    ];

    // Calculate payment details
    this.paymentDetails = this.paymentService.calculatePaymentDetails(items, 0, 0);
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  handlePaystackPayment(details: PaymentDetails): void {
    this.paymentService.initializePaystack(details, (response) => {
      console.log('Payment successful:', response);
      this.showPaymentModal = false;
      // Redirect to course or show success message
      alert('Payment successful! You have been enrolled in the course.');
      // Optionally redirect to course content
      // this.router.navigate(['/account/courses']);
    });
  }

  handleStripePayment(details: PaymentDetails): void {
    this.paymentService.initializeStripe(details).then(() => {
      // Stripe will redirect to checkout
      // After successful payment, user will be redirected back
    });
  }
}
