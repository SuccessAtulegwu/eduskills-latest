import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeader } from '../../../components/page-header/page-header';
import { ButtonComponent } from '../../../components/ui/button/button';
import { Router } from '@angular/router';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  isFollowing?: boolean;
  isFriend?: boolean;
}

type TabType = 'followers' | 'following' | 'friends';

@Component({
  selector: 'app-following',
  imports: [PageHeader, ButtonComponent, CommonModule],
  templateUrl: './following.html',
  styleUrl: './following.scss',
})
export class Following {
  protected activeTab = signal<TabType>('following');

  // Mock data - replace with actual API calls
  protected followers = signal<UserProfile[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      username: '@sarahj',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Digital Marketing Expert | Content Creator',
      followers: 12500,
      following: 450,
      isFollowing: false
    },
    {
      id: '2',
      name: 'Michael Chen',
      username: '@mchen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      bio: 'Software Engineer | Tech Enthusiast',
      followers: 8900,
      following: 320,
      isFollowing: true
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      username: '@emilyrod',
      avatar: 'https://i.pravatar.cc/150?img=3',
      bio: 'Graphic Designer | UI/UX Specialist',
      followers: 15200,
      following: 680,
      isFollowing: false
    }
  ]);

  protected following = signal<UserProfile[]>([
    {
      id: '4',
      name: 'David Thompson',
      username: '@dthompson',
      avatar: 'https://i.pravatar.cc/150?img=4',
      bio: 'Business Coach | Motivational Speaker',
      followers: 25000,
      following: 1200,
      isFollowing: true
    },
    {
      id: '5',
      name: 'Lisa Wang',
      username: '@lisawang',
      avatar: 'https://i.pravatar.cc/150?img=5',
      bio: 'Data Scientist | AI Researcher',
      followers: 18700,
      following: 890,
      isFollowing: true
    },
    {
      id: '6',
      name: 'James Miller',
      username: '@jmiller',
      avatar: 'https://i.pravatar.cc/150?img=6',
      bio: 'Fitness Trainer | Nutrition Expert',
      followers: 32000,
      following: 1500,
      isFollowing: true
    },
    {
      id: '7',
      name: 'Sophia Lee',
      username: '@sophialee',
      avatar: 'https://i.pravatar.cc/150?img=7',
      bio: 'Fashion Blogger | Style Consultant',
      followers: 45000,
      following: 2100,
      isFollowing: true
    }
  ]);

  protected friends = signal<UserProfile[]>([
    {
      id: '8',
      name: 'Alex Martinez',
      username: '@alexm',
      avatar: 'https://i.pravatar.cc/150?img=8',
      bio: 'Photographer | Travel Enthusiast',
      followers: 9800,
      following: 540,
      isFriend: true
    },
    {
      id: '9',
      name: 'Rachel Green',
      username: '@rachelg',
      avatar: 'https://i.pravatar.cc/150?img=9',
      bio: 'Writer | Book Lover',
      followers: 7200,
      following: 380,
      isFriend: true
    }
  ]);

  constructor(private router: Router) { }

  protected setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  protected getCurrentList(): UserProfile[] {
    switch (this.activeTab()) {
      case 'followers':
        return this.followers();
      case 'following':
        return this.following();
      case 'friends':
        return this.friends();
      default:
        return [];
    }
  }

  protected onFollowToggle(user: UserProfile): void {
    // Toggle follow status
    user.isFollowing = !user.isFollowing;
    // In a real app, make API call here
    console.log(`${user.isFollowing ? 'Followed' : 'Unfollowed'} ${user.name}`);
  }

  protected onViewProfile(user: UserProfile): void {
    // Navigate to user profile
    this.router.navigate(['/discover/user-profile', user.id]);
  }

  protected onRemoveFriend(user: UserProfile): void {
    // Remove friend
    console.log('Remove friend:', user.name);
    // In a real app, make API call here
  }

  onExplore() {
    this.router.navigate(['/discover/explore']);
  }
}
