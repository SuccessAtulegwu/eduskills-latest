import { Injectable } from '@angular/core';

export interface JobModel {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string; // 'FullTime', 'PartTime', 'Contract', 'Internship'
    description: string;
    expirationDate: string;
    isExpired: boolean;
    isAvailable: boolean; // For "Job No Longer Available" header
    views: number;
    applications: number;
    logoColor: string; // class for the logo placeholder
}

@Injectable({
    providedIn: 'root'
})
export class JobService {

    private jobs: JobModel[] = [
        {
            id: 1,
            title: 'Senior Software Developer',
            company: 'Ihsan Soft Solutions Ltd',
            location: 'Abuja, Nigeria',
            type: 'FullTime',
            description: 'We are in need of qualified senior software developer. The ideal candidate will have strong experience in Angular and Node.js.',
            expirationDate: 'Nov 28, 2025',
            isExpired: true,
            isAvailable: false,
            views: 19,
            applications: 1,
            logoColor: 'bg-secondary'
        },
        {
            id: 2,
            title: 'UI/UX Designer',
            company: 'Creative Studio',
            location: 'Lagos, Nigeria',
            type: 'Contract',
            description: 'Looking for a creative mind to design beautiful interfaces for our mobile and web applications.',
            expirationDate: 'Dec 15, 2025',
            isExpired: false,
            isAvailable: true,
            views: 45,
            applications: 12,
            logoColor: 'bg-primary'
        },
        {
            id: 3,
            title: 'Frontend Engineer',
            company: 'Tech Innovators',
            location: 'Remote',
            type: 'FullTime',
            description: 'Join our team to build scalable frontend applications using Angular regarding our new fintech product.',
            expirationDate: 'Jan 10, 2026',
            isExpired: false,
            isAvailable: true,
            views: 120,
            applications: 35,
            logoColor: 'bg-danger'
        },
        {
            id: 4,
            title: 'Marketing Specialist',
            company: 'Growth Hackers',
            location: 'Abuja, Nigeria',
            type: 'PartTime',
            description: 'Help us grow our brand presence across social media channels and manage ad campaigns.',
            expirationDate: 'Nov 01, 2025',
            isExpired: true,
            isAvailable: true,
            views: 8,
            applications: 2,
            logoColor: 'bg-success'
        },
        {
            id: 5,
            title: 'Backend Developer',
            company: 'System Corp',
            location: 'Kano, Nigeria',
            type: 'FullTime',
            description: 'Experienced backend developer needed for API development and database optimization.',
            expirationDate: 'Feb 20, 2026',
            isExpired: false,
            isAvailable: true,
            views: 65,
            applications: 8,
            logoColor: 'bg-info'
        }
    ];

    constructor() { }

    getJobs(): JobModel[] {
        return this.jobs;
    }

    getJobById(id: number): JobModel | undefined {
        return this.jobs.find(job => job.id === id);
    }
}
