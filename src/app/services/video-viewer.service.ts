import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VideoCardData } from '../components/ui/video-card/video-card';

interface VideoViewerState {
  videos: VideoCardData[];
  currentIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class VideoViewerService {
  private videoStateSubject = new BehaviorSubject<VideoViewerState | null>(null);
  public videoState$ = this.videoStateSubject.asObservable();

  setVideos(videos: VideoCardData[], index: number): void {
    this.videoStateSubject.next({
      videos: videos,
      currentIndex: index
    });
  }

  getVideos(): VideoViewerState | null {
    return this.videoStateSubject.value;
  }

  clearVideos(): void {
    this.videoStateSubject.next(null);
  }
}

