import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeader } from '../../../../components/page-header/page-header';
import { ButtonComponent } from '../../../../components/ui/button/button';
import { CourseService } from '../../../../services/course.service';
import { CourseModel, CourseResponse } from '../../../../models/course.model';
import { ToastService } from '../../../../services/toast.service';


import { ImageErrorDirective } from '../../../../directives/image-error.directive';

@Component({
    selector: 'app-my-courses',
    standalone: true,
    imports: [
        CommonModule,
        PageHeader,
        ButtonComponent,
        ImageErrorDirective
    ],
    templateUrl: './my-courses.html',
    styleUrl: './my-courses.scss'
})
export class MyCoursesComponent implements OnInit {
    courses: CourseModel[] = [];
    isLoading: boolean = false;

    constructor(
        private router: Router,
        private courseService: CourseService,
        private toastService: ToastService
    ) { }

    ngOnInit() {
        this.loadMyCourses();
    }

    loadMyCourses() {
        this.isLoading = true;
        this.courseService.getMyCourses().subscribe({
            next: (courses) => {
                this.courses = this.convertToCourseModel(courses);
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading my courses:', error);
                this.toastService.show('Failed to load your courses', 'error');
                this.isLoading = false;
            }
        });
    }

    // Convert API CourseResponse to CourseModel
    private convertToCourseModel(courses: CourseResponse[]): CourseModel[] {
        return courses.map((course) => ({
            id: course.id,
            title: course.title,
            image: course.thumbnailUrl || '/assets/images/placeholder.jpg',
            price: course.price || 0,
            level: course.level || 'Beginner',
            views: course.views || 0,
            enrolled: course.enrollmentCount || 0,
            category: course.category?.name || this.getCategoryName(course.categoryId),
            description: course.description,
            creator: course.creatorName,
            creatorId: course.creatorId,
            duration: course.durationHours ? `${course.durationHours} hours` : undefined,
            createdDate: course.createdAt ? new Date(course.createdAt).toLocaleDateString() : undefined
        }));
    }

    private getCategoryName(categoryId?: number): string {
        const categoryMap: { [key: number]: string } = {
            1: 'Development',
            2: 'Design',
            3: 'Business'
        };
        return categoryMap[categoryId || 1] || 'Other';
    }

    createCourse() {
        this.router.navigate(['/content/courses/create']);
    }

    viewCourse(id: number) {
        this.router.navigate(['/content/courses', id]);
    }

    editCourse(id: number) {
        this.router.navigate(['/content/courses/edit', id]);
    }

    deleteCourse(id: number) {
        if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            this.courseService.deleteCourse(id).subscribe({
                next: () => {
                    this.toastService.show('Course deleted successfully', 'success');
                    this.loadMyCourses();
                },
                error: (error) => {
                    console.error('Error deleting course:', error);
                    this.toastService.show('Failed to delete course', 'error');
                }
            });
        }
    }

    goBack() {
        this.router.navigate(['/content/courses']);
    }
}
