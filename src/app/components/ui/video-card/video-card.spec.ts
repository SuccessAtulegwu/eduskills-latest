import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoCard } from './video-card';

describe('VideoCard', () => {
  let component: VideoCard;
  let fixture: ComponentFixture<VideoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCard);
    component = fixture.componentInstance;
    component.data = {
      id: '1',
      title: 'Test Video',
      author: 'Test Author',
      authorAvatar: 'test.jpg',
      views: '100',
      timeAgo: '1 day ago',
      videoUrl: 'test.mp4'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

