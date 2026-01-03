import { Component } from '@angular/core';
import { VideoCard, VideoCardData } from '../../../components/ui/video-card/video-card';
import { VideoViewerService } from '../../../services/video-viewer.service';
import { Router } from '@angular/router';
import { AccountTypeOption, AccountTypeSelectorComponent } from '../../../components/account-type-selector/account-type-selector.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../components/page-header/page-header';
import { ToggleButton } from '../../../components/ui/toggle-button/toggle-button';

@Component({
  selector: 'app-career',
  imports: [CommonModule, FormsModule, AccountTypeSelectorComponent, PageHeader, ToggleButton, VideoCard],
  templateUrl: './career.html',
  styleUrl: './career.scss',
})
export class Career {
 selectedDuration: string = 'all';
  selectedSort: string = 'newest';
  shortLessonsOnly: boolean = false;
   eduVideos: VideoCardData[] = [];

  durationOptions: AccountTypeOption[] = [
    { title: 'All Durations', value: 'all', description: '', icon: '' },
    { title: 'Under 5 min', value: 'short', description: '', icon: '' },
    { title: '5-20 min', value: 'medium', description: '', icon: '' },
    { title: 'Over 20 min', value: 'long', description: '', icon: '' }
  ];

  sortOptions: AccountTypeOption[] = [
    { title: 'Newest First', value: 'newest', description: '', icon: '' },
    { title: 'Oldest First', value: 'oldest', description: '', icon: '' },
    { title: 'Most Popular', value: 'popular', description: '', icon: '' }
  ];

  constructor(private router:Router,
    private videoViewerService: VideoViewerService
  ) {
    
  }

  ngOnInit(): void {
    this.loadEduVideos();
  }

  onUploadVideo() {
    this.router.navigate(['/account/upload'])
  }

   loadEduVideos(): void {
    // Sample data - replace with actual API call
    this.eduVideos = [
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
