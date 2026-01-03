import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllVideos } from './all-videos';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('AllVideos', () => {
  let component: AllVideos;
  let fixture: ComponentFixture<AllVideos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllVideos],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ section: 'following' })
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: () => Promise.resolve(true)
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllVideos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

