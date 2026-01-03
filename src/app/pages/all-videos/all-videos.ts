import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoCard, VideoCardData } from '../../components/ui/video-card/video-card';
import { VideoViewerService } from '../../services/video-viewer.service';
import { LucideAngularModule,MoveLeft } from 'lucide-angular/src/icons';

@Component({
  selector: 'app-all-videos',
  imports: [CommonModule, VideoCard, LucideAngularModule],
  templateUrl: './all-videos.html',
  styleUrl: './all-videos.scss',
})
export class AllVideos implements OnInit {
  videos: VideoCardData[] = [];
  sectionTitle: string = 'All Videos';
  MoveLeft = MoveLeft;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videoViewerService: VideoViewerService
  ) {}

  ngOnInit(): void {
    // Get section type from route params
    this.route.queryParams.subscribe(params => {
      const section = params['section'];
      this.loadVideos(section);
    });
  }

  loadVideos(section: string): void {
    this.isLoading = true;
    
    if (section === 'following') {
      this.sectionTitle = 'Following';
      this.videos = this.getFollowingVideos();
    } else if (section === 'recommended') {
      this.sectionTitle = 'Recommended for You';
      this.videos = this.getRecommendedVideos();
    }else if(section === 'trending'){
      this.sectionTitle = 'Trending Now';
      this.videos = this.getRecommendedVideos();
    }else {
      // Load all videos
      this.sectionTitle = 'All Videos';
      this.videos = [...this.getFollowingVideos(), ...this.getRecommendedVideos()];
    }
    
    this.isLoading = false;
  }

  getFollowingVideos(): VideoCardData[] {
    // In production, this would be an API call
    return [
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
      },
      {
        id: '11',
        title: 'Docker and Kubernetes Tutorial',
        author: 'DevOps Engineer',
        authorAvatar: 'https://i.pravatar.cc/150?img=11',
        views: '2.8k',
        timeAgo: '5 days ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=500&h=300&fit=crop'
      },
      {
        id: '12',
        title: 'TypeScript Advanced Patterns',
        author: 'TS Expert',
        authorAvatar: 'https://i.pravatar.cc/150?img=12',
        views: '1.9k',
        timeAgo: '1 week ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=500&h=300&fit=crop'
      }
    ];
  }

  getRecommendedVideos(): VideoCardData[] {
    // In production, this would be an API call
    return [
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
      },
      {
        id: '13',
        title: 'GraphQL vs REST API',
        author: 'API Developer',
        authorAvatar: 'https://i.pravatar.cc/150?img=13',
        views: '4.1k',
        timeAgo: '1 week ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop'
      },
      {
        id: '14',
        title: 'Mobile App Development with Flutter',
        author: 'Flutter Dev',
        authorAvatar: 'https://i.pravatar.cc/150?img=14',
        views: '5.2k',
        timeAgo: '4 days ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop'
      }
    ];
  }

  openVideoViewer(index: number): void {
    this.videoViewerService.setVideos(this.videos, index);
    this.router.navigate(['/video-viewer'], {
      state: {
        videos: this.videos,
        index: index
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

