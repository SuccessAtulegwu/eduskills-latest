import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingBanner } from './landing-banner';

describe('LandingBanner', () => {
  let component: LandingBanner;
  let fixture: ComponentFixture<LandingBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
