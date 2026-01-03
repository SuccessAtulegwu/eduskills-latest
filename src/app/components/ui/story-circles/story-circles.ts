import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Story {
  id: number;
  name: string;
  image?: string;
  initials?: string;
  bgColor?: string;
  hasStory: boolean;
  isAddButton?: boolean;
}

@Component({
  selector: 'app-story-circles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './story-circles.html',
  styleUrl: './story-circles.scss',
})
export class StoryCircles {
  // Make stories @Input() for dynamic data:
// @Input() stories: Story[] = [];
// @Input() showAddButton = true;
// @Output() storyClicked = new EventEmitter<Story>();
// @Output() addStoryClicked = new EventEmitter<void>();

  showAddButton = true;

  stories: Story[] = [
    {
      id: 1,
      name: 'Musa',
      image: 'https://i.pravatar.cc/150?img=12',
      hasStory: true
    },
    {
      id: 2,
      name: 'Musa',
      image: 'https://i.pravatar.cc/150?img=13',
      hasStory: true
    },
    {
      id: 3,
      name: 'Amatullah',
      image: 'https://i.pravatar.cc/150?img=32',
      hasStory: true
    },
    {
      id: 4,
      name: 'Amatullah',
      image: 'https://i.pravatar.cc/150?img=33',
      hasStory: true
    },
    {
      id: 5,
      name: 'Admin',
      initials: 'AU',
      bgColor: '#e0b0ff',
      hasStory: true
    },
    {
      id: 6,
      name: 'Musa',
      image: 'https://i.pravatar.cc/150?img=14',
      hasStory: true
    },
    {
      id: 7,
      name: 'Admin',
      initials: 'AU',
      bgColor: '#e0b0ff',
      hasStory: true
    }
  ];

  onAddStory() {
    console.log('Add story clicked');
    // Implement add story logic
  }

  onStoryClick(story: Story) {
    console.log('Story clicked:', story);
    // Implement story view logic
  }
}
