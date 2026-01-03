import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-banner',
  standalone:true,
  imports: [],
  templateUrl: './landing-banner.html',
  styleUrl: './landing-banner.scss',
})
export class LandingBanner {

   onStartLearning() {
    console.log('Start Learning clicked');
    // Navigate to learning page or show modal
  }

  onExploreSkills() {
    console.log('Explore Skills clicked');
    // Navigate to skills page
  }

}
