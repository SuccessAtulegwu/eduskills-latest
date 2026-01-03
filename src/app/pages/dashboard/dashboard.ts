import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { VideoCard, VideoCardData } from '../../components/ui/video-card/video-card';
import { VideoViewerService } from '../../services/video-viewer.service';
import { StoryCircles } from '../../components/ui/story-circles/story-circles';
import { Subscription } from 'rxjs';
import { LucideAngularModule, MoveRight } from 'lucide-angular';
import { LandingBanner } from '../../components/ui/landing-banner/landing-banner';
import { User } from '../../models/model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, VideoCard, RouterLink, StoryCircles, LucideAngularModule,LandingBanner],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  readonly MoveRight = MoveRight;
  currentUser: User | null = null;
  currentDate = new Date();
  searchQuery: string = '';
  private authSubscription?: Subscription;
  isAuth : boolean = false;
  sectionTitle : string = 'trending';

  followingVideos: VideoCardData[] = [];
  recommendedVideos: VideoCardData[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private videoViewerService: VideoViewerService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuth = isAuth;
      if(isAuth)
        this.sectionTitle = 'recommended';
    });

    this.loadFollowingVideos();
    this.loadRecommendedVideos();
  }

  loadFollowingVideos(): void {
    // Sample data - replace with actual API call
    this.followingVideos = [
      {
        id: '1',
        title: 'Learning How to Prompt AI for Better Results',
        author: 'Admin User',
        authorAvatar: 'https://i.pravatar.cc/150?img=1',
        views: '16',
        timeAgo: '1mo ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop'
      },
      {
        id: '2',
        title: 'Advanced JavaScript Techniques for Modern Web Development',
        author: 'Tech Guru',
        authorAvatar: 'https://i.pravatar.cc/150?img=2',
        views: '1.2k',
        timeAgo: '2 days ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500&h=300&fit=crop'
      },
      {
        id: '3',
        title: 'Complete Python Course - From Beginner to Expert',
        author: 'Code Master',
        authorAvatar: 'https://i.pravatar.cc/150?img=3',
        views: '3.5k',
        timeAgo: '1 week ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&h=300&fit=crop'
      },
      {
        id: '4',
        title: 'UI/UX Design Principles Every Developer Should Know',
        author: 'Design Pro',
        authorAvatar: 'https://i.pravatar.cc/150?img=4',
        views: '890',
        timeAgo: '3 days ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop'
      }
    ];
  }

  loadRecommendedVideos(): void {
    // Sample data - replace with actual API call
    this.recommendedVideos = [
      {
        id: '5',
        title: 'Building Scalable Applications with Angular',
        author: 'Angular Expert',
        authorAvatar: 'https://i.pravatar.cc/150?img=5',
        views: '2.1k',
        timeAgo: '5 days ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop'
      },
      {
        id: '6',
        title: 'Machine Learning Fundamentals - Complete Guide',
        author: 'AI Specialist',
        authorAvatar: 'https://i.pravatar.cc/150?img=6',
        views: '5.7k',
        timeAgo: '2 weeks ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop'
      },
      {
        id: '7',
        title: 'React Hooks Deep Dive - Best Practices',
        author: 'React Ninja',
        authorAvatar: 'https://i.pravatar.cc/150?img=7',
        views: '4.2k',
        timeAgo: '1 week ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop'
      },
      {
        id: '8',
        title: 'Cloud Computing with AWS - Complete Tutorial',
        author: 'Cloud Architect',
        authorAvatar: 'https://i.pravatar.cc/150?img=8',
        views: '6.3k',
        timeAgo: '4 days ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop'
      },
      {
        id: '9',
        title: 'Data Structures and Algorithms Made Easy',
        author: 'Algorithm Master',
        authorAvatar: 'https://i.pravatar.cc/150?img=9',
        views: '8.9k',
        timeAgo: '3 weeks ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=500&h=300&fit=crop'
      },
      {
        id: '10',
        title: 'Cybersecurity Essentials for Developers',
        author: 'Security Expert',
        authorAvatar: 'https://i.pravatar.cc/150?img=10',
        views: '3.4k',
        timeAgo: '6 days ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=300&fit=crop'
      }
    ];
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // TODO: Implement search functionality
      // this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  openVideoViewer(videos: VideoCardData[], index: number): void {
    this.videoViewerService.setVideos(videos, index);
    this.router.navigate(['/video-viewer'], {
      state: {
        videos: videos,
        index: index
      }
    });
  }
}
