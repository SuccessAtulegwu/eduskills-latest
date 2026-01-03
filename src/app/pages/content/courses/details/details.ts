import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../../components/ui/button/button';
import { PageHeader } from '../../../../components/page-header/page-header';
import { CourseService, CourseModel } from '../course.service';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './details.html',
  styleUrl: './details.scss'
})
export class CourseDetails implements OnInit {
  courseId: number | null = null;
  course: CourseModel | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private courseService: CourseService
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
    console.log('Enroll clicked');
  }
}
