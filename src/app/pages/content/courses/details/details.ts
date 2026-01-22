import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../../components/ui/button/button';
import { PageHeader } from '../../../../components/page-header/page-header';
import { PaymentModalComponent, PaymentDetails, PaymentItem } from '../../../../components/ui/payment-modal/payment-modal.component';
import { PaymentService } from '../../../../services/payment.service';
import { CourseService, CourseModel } from '../course.service';

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
  showPaymentModal: boolean = false;
  paymentDetails: PaymentDetails | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private courseService: CourseService,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.courseId = +id;
        this.course = this.courseService.getCourseById(this.courseId);
      }
    });
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
