import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VideoViewerService } from '../../../services/video-viewer.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

export interface VideoCardData {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  views: string;
  timeAgo: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

@Component({
  selector: 'app-video-card',
  imports: [CommonModule,NgbDropdownModule],
  templateUrl: './video-card.html',
  styleUrl: './video-card.scss',
})
export class VideoCard {
  @Input() data!: VideoCardData;
  @Input() allVideos: VideoCardData[] = [];
  @Input() videoIndex: number = 0;
  @Output() click = new EventEmitter<any>();
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  isHovered = false;
  isLoading = false;
  isVideoReady = false;
  showDropdown = false;

  constructor(
    private router: Router,
    private videoViewerService: VideoViewerService
  ) {}

  onMouseEnter(): void {
    this.isHovered = true;
    this.isLoading = true;
    this.isVideoReady = false;

    if (this.videoElement && this.videoElement.nativeElement) {
      const video = this.videoElement.nativeElement;
      
      // Load and play the video
      video.load();
      
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isLoading = false;
            this.isVideoReady = true;
          })
          .catch((error) => {
            console.error('Error playing video:', error);
            this.isLoading = false;
          });
      }
    }
  }

  onMouseLeave(): void {
    this.isHovered = false;
    this.isLoading = false;
    this.isVideoReady = false;

    if (this.videoElement && this.videoElement.nativeElement) {
      const video = this.videoElement.nativeElement;
      video.pause();
      video.currentTime = 0;
    }
  }

  onVideoLoadedData(): void {
    this.isLoading = false;
    this.isVideoReady = true;
  }

  onVideoLoadStart(): void {
    this.isLoading = true;
  }

  onVideoClick(){
    // Navigate to video viewer
    const videosToPass = this.allVideos.length > 0 ? this.allVideos : [this.data];
    const indexToPass = this.allVideos.length > 0 ? this.videoIndex : 0;
    
    this.videoViewerService.setVideos(videosToPass, indexToPass);
    this.router.navigate(['/video-viewer'], {
      state: {
        videos: videosToPass,
        index: indexToPass
      }
    });
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.dropdown');
    
    if (!clickedInside && this.showDropdown) {
      this.showDropdown = false;
    }
  }

  onDropdownAction(action: string, event: Event): void {
    event.stopPropagation();
    this.showDropdown = false;
    
    switch (action) {
      case 'save':
        console.log('Save video:', this.data.id);
        // TODO: Implement save functionality
        break;
      case 'share':
        console.log('Share video:', this.data.id);
        // TODO: Implement share functionality
        break;
      case 'notInterested':
        console.log('Not interested in video:', this.data.id);
        // TODO: Implement not interested functionality
        break;
      case 'report':
        console.log('Report video:', this.data.id);
        // TODO: Implement report functionality
        break;
    }
  }
}

