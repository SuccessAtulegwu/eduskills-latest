import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoViewer } from './video-viewer';
import { ActivatedRoute, Router } from '@angular/router';

describe('VideoViewer', () => {
  let component: VideoViewer;
  let fixture: ComponentFixture<VideoViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoViewer],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        },
        {
          provide: Router,
          useValue: {
            getCurrentNavigation: () => null,
            navigate: () => Promise.resolve(true)
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

