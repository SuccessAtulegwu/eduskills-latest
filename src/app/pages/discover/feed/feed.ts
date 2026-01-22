import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../components/ui/button/button';
import { VideoViewerService } from '../../../services/video-viewer.service';

export interface FeedVideo {
  id: string;
  title: string;
  description: string;
  author: string;
  authorAvatar: string;
  videoUrl: string;
  thumbnailUrl: string;
  views: string;
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
  isLiked: boolean;
  isDisliked: boolean;
  isFavorited: boolean;
  isPlaying?: boolean;
}

@Component({
  selector: 'app-feed',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class Feed implements OnInit, AfterViewInit {
  @ViewChild('feedScroll') feedScroll!: ElementRef<HTMLDivElement>;

  videos: FeedVideo[] = [];
  currentVideoIndex: number = 0;
  isScrolling: boolean = false;
  videoPausedStates: Map<number, boolean> = new Map();

  constructor(
    private router: Router,
    private videoViewerService: VideoViewerService
  ) { }

  ngOnInit(): void {
    this.loadVideos();
  }

  ngAfterViewInit(): void {
    // Auto-play first video after view initializes
    setTimeout(() => {
      this.playVideoAtIndex(0);
    }, 500);
  }

  loadVideos(): void {
    // Mock video data - replace with actual API call
    this.videos = [
      {
        id: '1',
        title: 'Introduction to Angular Components',
        description: 'Learn the basics of Angular components and how to create reusable UI elements. This tutorial covers component architecture, data binding, and best practices.',
        author: 'Sarah Johnson',
        authorAvatar: 'https://i.pravatar.cc/150?img=1',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://picsum.photos/400/600?random=1',
        views: '12.5K',
        likes: 1250,
        comments: 89,
        shares: 45,
        timeAgo: '2 days ago',
        isLiked: false,
        isDisliked: false,
        isFavorited: false
      },
      {
        id: '2',
        title: 'Advanced TypeScript Techniques',
        description: 'Dive deep into TypeScript with advanced patterns, generics, and type manipulation. Perfect for developers looking to level up their skills.',
        author: 'Michael Chen',
        authorAvatar: 'https://i.pravatar.cc/150?img=2',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://picsum.photos/400/600?random=2',
        views: '8.3K',
        likes: 830,
        comments: 62,
        shares: 31,
        timeAgo: '5 days ago',
        isLiked: false,
        isDisliked: false,
        isFavorited: false
      },
      {
        id: '3',
        title: 'Responsive Design Masterclass',
        description: 'Master responsive web design with modern CSS techniques, flexbox, grid, and media queries. Build beautiful layouts that work on any device.',
        author: 'Emily Rodriguez',
        authorAvatar: 'https://i.pravatar.cc/150?img=3',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://picsum.photos/400/600?random=3',
        views: '15.7K',
        likes: 1570,
        comments: 124,
        shares: 78,
        timeAgo: '1 week ago',
        isLiked: false,
        isDisliked: false,
        isFavorited: false
      },
      {
        id: '4',
        title: 'State Management with RxJS',
        description: 'Learn reactive programming with RxJS. Understand observables, operators, and how to manage complex application state effectively.',
        author: 'David Kim',
        authorAvatar: 'https://i.pravatar.cc/150?img=4',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://picsum.photos/400/600?random=4',
        views: '9.2K',
        likes: 920,
        comments: 71,
        shares: 42,
        timeAgo: '3 days ago',
        isLiked: false,
        isDisliked: false,
        isFavorited: false
      },
      {
        id: '5',
        title: 'Building REST APIs with Node.js',
        description: 'Create powerful REST APIs using Node.js and Express. Learn about routing, middleware, authentication, and database integration.',
        author: 'Jessica Taylor',
        authorAvatar: 'https://i.pravatar.cc/150?img=5',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnailUrl: 'https://picsum.photos/400/600?random=5',
        views: '11.4K',
        likes: 1140,
        comments: 95,
        shares: 56,
        timeAgo: '4 days ago',
        isLiked: false,
        isDisliked: false,
        isFavorited: false
      }
    ];
  }

  onScroll(event: any): void {
    if (this.isScrolling) return;

    const container = event.target;
    const scrollTop = container.scrollTop;
    const videoHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / videoHeight);

    if (newIndex !== this.currentVideoIndex && newIndex >= 0 && newIndex < this.videos.length) {
      this.pauseCurrentVideo();
      this.currentVideoIndex = newIndex;
      this.playVideoAtIndex(newIndex);
    }
  }

  playVideoAtIndex(index: number): void {
    const videoElement = document.getElementById(`video-${index}`) as HTMLVideoElement;
    if (videoElement && !this.videoPausedStates.get(index)) {
      videoElement.play().catch(err => console.log('Autoplay prevented:', err));
      if (this.videos[index]) {
        this.videos[index].isPlaying = true;
      }
    }
  }

  pauseCurrentVideo(): void {
    const videoElement = document.getElementById(`video-${this.currentVideoIndex}`) as HTMLVideoElement;
    if (videoElement) {
      videoElement.pause();
      if (this.videos[this.currentVideoIndex]) {
        this.videos[this.currentVideoIndex].isPlaying = false;
      }
    }
  }

  togglePlayPause(video: FeedVideo, index: number, event: Event): void {
    event.stopPropagation();
    const videoElement = document.getElementById(`video-${index}`) as HTMLVideoElement;

    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
        video.isPlaying = true;
        this.videoPausedStates.set(index, false);
      } else {
        videoElement.pause();
        video.isPlaying = false;
        this.videoPausedStates.set(index, true);
      }
    }
  }

  scrollToVideo(direction: 'up' | 'down'): void {
    const newIndex = direction === 'down'
      ? Math.min(this.currentVideoIndex + 1, this.videos.length - 1)
      : Math.max(this.currentVideoIndex - 1, 0);

    if (newIndex !== this.currentVideoIndex) {
      // Pause current video
      this.pauseCurrentVideo();

      // Update index immediately
      this.currentVideoIndex = newIndex;

      this.isScrolling = true;
      const container = this.feedScroll.nativeElement;
      container.scrollTo({
        top: newIndex * container.clientHeight,
        behavior: 'smooth'
      });

      // Play new video after scroll
      setTimeout(() => {
        this.playVideoAtIndex(newIndex);
        this.isScrolling = false;
      }, 500);
    }
  }

  toggleLike(video: FeedVideo, event: Event): void {
    event.stopPropagation();
    if (video.isLiked) {
      video.isLiked = false;
      video.likes--;
    } else {
      video.isLiked = true;
      video.likes++;
      if (video.isDisliked) {
        video.isDisliked = false;
      }
    }
  }

  toggleDislike(video: FeedVideo, event: Event): void {
    event.stopPropagation();
    if (video.isDisliked) {
      video.isDisliked = false;
    } else {
      video.isDisliked = true;
      if (video.isLiked) {
        video.isLiked = false;
        video.likes--;
      }
    }
  }

  toggleFavorite(video: FeedVideo, event: Event): void {
    event.stopPropagation();
    video.isFavorited = !video.isFavorited;
  }

  openComments(video: FeedVideo, event: Event): void {
    event.stopPropagation();
    console.log('Open comments for video:', video.id);
    // TODO: Implement comments modal/panel
  }


  shareVideo(video: FeedVideo, event: Event): void {
    event.stopPropagation();
    console.log('Share video:', video.id);
    // TODO: Implement share functionality
  }

  openFullscreen(video: FeedVideo, index: number, event: Event): void {
    event.stopPropagation();

    // Convert FeedVideo to VideoCardData format
    const videosForViewer = this.videos.map(v => ({
      id: v.id,
      title: v.title,
      author: v.author,
      authorAvatar: v.authorAvatar,
      views: v.views,
      timeAgo: v.timeAgo,
      videoUrl: v.videoUrl,
      thumbnailUrl: v.thumbnailUrl
    }));

    // Set videos in service
    this.videoViewerService.setVideos(videosForViewer, index);

    // Navigate to video viewer
    this.router.navigate(['/video-viewer'], {
      state: {
        videos: videosForViewer,
        index: index
      }
    });
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
