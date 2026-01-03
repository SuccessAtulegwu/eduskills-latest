import { Injectable } from '@angular/core';

export interface CourseModel {
    id: number;
    title: string;
    image: string;
    price: number;
    level: string; // 'Beginner', 'Intermediate', 'Advanced'
    views: number;
    enrolled: number;
    category: string;
    description?: string;
    creator?: string;
    duration?: string;
    createdDate?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CourseService {

    private courses: CourseModel[] = [
        {
            id: 1,
            title: 'Learn how to style hair for different nationals',
            image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 4000,
            level: 'Beginner',
            views: 8,
            enrolled: 1,
            category: 'Design',
            creator: 'Amatullah Musa',
            description: 'Learn how to style hair for different nationals. This comprehensive course covers everything from basic braiding to advanced styling techniques suitable for professional salons.',
            duration: '3 hours',
            createdDate: 'Dec 02, 2025'
        },
        {
            id: 2,
            title: 'Tutorial on Research',
            image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 5000,
            level: 'Beginner',
            views: 18,
            enrolled: 1,
            category: 'Education',
            creator: 'John Doe',
            description: 'In-depth tutorial on research methodologies.',
            duration: '4 hours',
            createdDate: 'Jan 15, 2025'
        },
        {
            id: 3,
            title: 'Learning to program a computer system for beginners',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 4000,
            level: 'Beginner',
            views: 22,
            enrolled: 3,
            category: 'Development',
            creator: 'Jane Smith',
            description: 'Start your programming journey here.',
            duration: '10 hours',
            createdDate: 'Feb 20, 2025'
        },
        {
            id: 4,
            title: 'Advanced UI/UX Design Principles',
            image: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 15000,
            level: 'Advanced',
            views: 120,
            enrolled: 45,
            category: 'Design',
            creator: 'Design Master',
            description: 'Master advanced design concepts.',
            duration: '8 hours',
            createdDate: 'Mar 10, 2025'
        },
        {
            id: 5,
            title: 'Financial Accounting Basics',
            image: 'https://images.unsplash.com/photo-1554224155-984067941747?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 3500,
            level: 'Beginner',
            views: 56,
            enrolled: 12,
            category: 'Business',
            creator: 'Finance Guru',
            description: 'Basics of financial accounting.',
            duration: '5 hours',
            createdDate: 'Apr 05, 2025'
        },
        {
            id: 6,
            title: 'Full Stack Web Development with Angular',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            price: 25000,
            level: 'Intermediate',
            views: 340,
            enrolled: 89,
            category: 'Development',
            creator: 'Angular Pro',
            description: 'Become a full stack developer.',
            duration: '20 hours',
            createdDate: 'May 12, 2025'
        }
    ];

    constructor() { }

    getCourses(): CourseModel[] {
        return this.courses;
    }

    getCourseById(id: number): CourseModel | undefined {
        return this.courses.find(course => course.id === id);
    }
}
