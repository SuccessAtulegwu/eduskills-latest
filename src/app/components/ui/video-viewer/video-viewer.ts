import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoCardData } from '../video-card/video-card';
import { VideoViewerService } from '../../../services/video-viewer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-video-viewer',
  imports: [CommonModule],
  templateUrl: './video-viewer.html',
  styleUrl: './video-viewer.scss',
})
export class VideoViewer implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  currentVideoIndex = 0;
  videos: VideoCardData[] = [];
  currentVideo!: VideoCardData;
  
  isPlaying = true;
  isMuted = false;
  showControls = true;
  controlsTimeout: any;
  isLoading = true;
  isBuffering = false;

  // Touch/swipe handling
  private touchStartY = 0;
  private touchEndY = 0;
  private minSwipeDistance = 50;

  // Reactions state
  isLiked = false;
  isDisliked = false;
  isSaved = false;
  likes = 0;
  dislikes = 0;
  comments = 0;
  shares = 0;

  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videoViewerService: VideoViewerService,
    private location:Location
  ) {}

  ngOnInit(): void {
    // Try multiple methods to get video data
    let state: any;
    let foundData = false;
    
    // Method 1: getCurrentNavigation (works during navigation)
    const navigation = this.router.getCurrentNavigation();
    console.log('Method 1 - getCurrentNavigation:', navigation);
    
    if (navigation?.extras?.state) {
      state = navigation.extras.state;
      console.log('State from navigation:', state);
      foundData = true;
    }
    
    // Method 2: history.state (works after navigation completes)
    if (!foundData && window.history.state) {
      state = window.history.state;
      console.log('Method 2 - State from history:', state);
      if (state && state.videos && state.videos.length > 0) {
        foundData = true;
      }
    }
    
    // Method 3: Service (backup method)
    if (!foundData) {
      const serviceState = this.videoViewerService.getVideos();
      console.log('Method 3 - State from service:', serviceState);
      if (serviceState && serviceState.videos && serviceState.videos.length > 0) {
        state = serviceState;
        foundData = true;
      }
    }
    
    if (foundData && state && state.videos && state.videos.length > 0) {
      this.videos = state.videos;
      this.currentVideoIndex = state.index !== undefined ? state.index : (state.currentIndex || 0);
      console.log('✅ Loaded videos from state:', this.videos.length, 'Starting at index:', this.currentVideoIndex);
    } else {
      // Load sample videos if none provided
      console.log('⚠️ No videos in state, loading sample videos');
      this.loadSampleVideos();
      this.currentVideoIndex = 0;
    }

    this.currentVideo = this.videos[this.currentVideoIndex];
    this.initializeReactionCounts();
    console.log('Current video:', this.currentVideo);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.videoViewerService.clearVideos();
  }

  ngAfterViewInit(): void {
    if (this.videoElement && this.videoElement.nativeElement) {
      const video = this.videoElement.nativeElement;
      
      // Set up video event listeners
      video.addEventListener('loadstart', () => this.onVideoLoadStart());
      video.addEventListener('loadeddata', () => this.onVideoLoaded());
      video.addEventListener('canplay', () => this.onVideoCanPlay());
      video.addEventListener('playing', () => this.onVideoPlaying());
      video.addEventListener('waiting', () => this.onVideoWaiting());
      video.addEventListener('stalled', () => this.onVideoStalled());
      
      video.play().catch(error => {
        console.error('Error auto-playing video:', error);
        this.isLoading = false;
        this.isPlaying = false;
      });
    }
  }

  onVideoLoadStart(): void {
    this.isLoading = true;
    this.isBuffering = true;
    console.log('Video load started');
  }

  onVideoLoaded(): void {
    console.log('Video data loaded');
  }

  onVideoCanPlay(): void {
    this.isLoading = false;
    this.isBuffering = false;
    console.log('Video can play');
  }

  onVideoPlaying(): void {
    this.isLoading = false;
    this.isBuffering = false;
    this.isPlaying = true;
    console.log('Video is playing');
  }

  onVideoWaiting(): void {
    this.isBuffering = true;
    console.log('Video is buffering');
  }

  onVideoStalled(): void {
    this.isBuffering = true;
    console.log('Video stalled');
  }

  loadSampleVideos(): void {
    this.videos = [
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
        title: 'Advanced JavaScript Techniques',
        author: 'Tech Guru',
        authorAvatar: 'https://i.pravatar.cc/150?img=2',
        views: '1.2k',
        timeAgo: '2 days ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500&h=300&fit=crop'
      },
      {
        id: '3',
        title: 'Complete Python Course',
        author: 'Code Master',
        authorAvatar: 'https://i.pravatar.cc/150?img=3',
        views: '3.5k',
        timeAgo: '1 week ago',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&h=300&fit=crop'
      }
    ];
  }

  initializeReactionCounts(): void {
    // Generate random counts for demo
    this.likes = Math.floor(Math.random() * 10000);
    this.dislikes = Math.floor(Math.random() * 500);
    this.comments = Math.floor(Math.random() * 1000);
    this.shares = Math.floor(Math.random() * 500);
  }

  // Touch event handlers
  onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchMove(event: TouchEvent): void {
    this.touchEndY = event.touches[0].clientY;
  }

  onTouchEnd(): void {
    const swipeDistance = this.touchStartY - this.touchEndY;

    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped up - next video
        this.nextVideo();
      } else {
        // Swiped down - previous video
        this.previousVideo();
      }
    }
  }

  // Mouse wheel for desktop
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    
    if (event.deltaY > 0) {
      this.nextVideo();
    } else if (event.deltaY < 0) {
      this.previousVideo();
    }
  }

  // Keyboard navigation
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.previousVideo();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.nextVideo();
        break;
      case ' ':
        event.preventDefault();
        this.togglePlayPause();
        break;
      case 'Escape':
        this.closeViewer();
        break;
    }
  }

  nextVideo(): void {
    if (this.currentVideoIndex < this.videos.length - 1) {
      this.currentVideoIndex++;
      this.loadVideo();
    }
  }

  previousVideo(): void {
    if (this.currentVideoIndex > 0) {
      this.currentVideoIndex--;
      this.loadVideo();
    }
  }

  loadVideo(): void {
    this.currentVideo = this.videos[this.currentVideoIndex];
    this.initializeReactionCounts();
    this.isLiked = false;
    this.isDisliked = false;
    this.isSaved = false;
    this.isLoading = true;
    this.isBuffering = true;

    setTimeout(() => {
      if (this.videoElement && this.videoElement.nativeElement) {
        const video = this.videoElement.nativeElement;
        video.load();
        video.play().catch(error => {
          console.error('Error playing video:', error);
          this.isLoading = false;
          this.isBuffering = false;
        });
        this.isPlaying = true;
      }
    }, 100);
  }

  togglePlayPause(): void {
    if (this.videoElement && this.videoElement.nativeElement) {
      if (this.isPlaying) {
        this.videoElement.nativeElement.pause();
      } else {
        this.videoElement.nativeElement.play();
      }
      this.isPlaying = !this.isPlaying;
    }
  }

  toggleMute(): void {
    if (this.videoElement && this.videoElement.nativeElement) {
      this.videoElement.nativeElement.muted = !this.videoElement.nativeElement.muted;
      this.isMuted = this.videoElement.nativeElement.muted;
    }
  }

  onVideoClick(): void {
    this.togglePlayPause();
    this.showControlsTemporarily();
  }

  showControlsTemporarily(): void {
    this.showControls = true;
    clearTimeout(this.controlsTimeout);
    this.controlsTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.showControls = false;
      }
    }, 3000);
  }

  // Reaction handlers
  toggleLike(): void {
    if (this.isLiked) {
      this.isLiked = false;
      this.likes--;
    } else {
      this.isLiked = true;
      this.likes++;
      if (this.isDisliked) {
        this.isDisliked = false;
        this.dislikes--;
      }
    }
  }

  toggleDislike(): void {
    if (this.isDisliked) {
      this.isDisliked = false;
      this.dislikes--;
    } else {
      this.isDisliked = true;
      this.dislikes++;
      if (this.isLiked) {
        this.isLiked = false;
        this.likes--;
      }
    }
  }

  toggleSave(): void {
    this.isSaved = !this.isSaved;
  }

  openComments(): void {
    console.log('Open comments');
    // TODO: Implement comments modal
  }

  shareVideo(): void {
    console.log('Share video');
    this.shares++;
    // TODO: Implement share functionality
  }

  followAuthor(): void {
    console.log('Follow author:', this.currentVideo.author);
    // TODO: Implement follow functionality
  }

  closeViewer(): void {
    this.location.back();
  }

  formatCount(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }
}

