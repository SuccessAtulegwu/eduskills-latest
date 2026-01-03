import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryCircles } from './story-circles';

describe('StoryCircles', () => {
  let component: StoryCircles;
  let fixture: ComponentFixture<StoryCircles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryCircles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryCircles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
