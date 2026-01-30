import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeader } from '../../../components/page-header/page-header';
import { ButtonComponent } from '../../../components/ui/button/button';
import { VideoCardData } from '../../../components/ui/video-card/video-card';
import { VideoViewerService } from '../../../services/video-viewer.service';

interface UserProfileData {
    id: string;
    name: string;
    username: string;
    avatar: string;
    coverImage: string;
    bio: string;
    location: string;
    website: string;
    joinedDate: string;
    followers: number;
    following: number;
    friends: number;
    isFollowing?: boolean;
    isFriend?: boolean;
}

interface Video {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    views: number;
    likes: number;
    uploadDate: string;
}

interface UserConnection {
    id: string;
    name: string;
    username: string;
    avatar: string;
    bio: string;
    isFollowing?: boolean;
}

type ProfileTab = 'videos' | 'followers' | 'following' | 'friends';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-profile.html',
    styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private videoViewerService = inject(VideoViewerService);

    protected userId = signal<string>('');
    protected activeTab = signal<ProfileTab>('videos');
    protected userProfile = signal<UserProfileData | null>(null);
    protected videos = signal<Video[]>([]);
    protected followers = signal<UserConnection[]>([]);
    protected following = signal<UserConnection[]>([]);
    protected friends = signal<UserConnection[]>([]);
    protected isLoading = signal<boolean>(true);

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.userId.set(id);
                this.loadUserProfile(id);
            }
        });
    }

    private loadUserProfile(userId: string): void {
        this.isLoading.set(true);

        // Mock data - replace with actual API call
        setTimeout(() => {
            this.userProfile.set({
                id: userId,
                name: 'David Thompson',
                username: '@dthompson',
                avatar: 'https://i.pravatar.cc/150?img=4',
                coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop',
                bio: 'Business Coach | Motivational Speaker | Helping entrepreneurs achieve their dreams 🚀',
                location: 'San Francisco, CA',
                website: 'davidthompson.com',
                joinedDate: 'January 2023',
                followers: 25000,
                following: 1200,
                friends: 450,
                isFollowing: false,
                isFriend: false
            });

            this.videos.set([
                {
                    id: '1',
                    title: '10 Habits of Successful Entrepreneurs',
                    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=225&fit=crop',
                    duration: '12:45',
                    views: 45000,
                    likes: 3200,
                    uploadDate: '2 days ago'
                },
                {
                    id: '2',
                    title: 'How to Build a Million Dollar Business',
                    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
                    duration: '18:30',
                    views: 78000,
                    likes: 5600,
                    uploadDate: '1 week ago'
                },
                {
                    id: '3',
                    title: 'Mastering Time Management',
                    thumbnail: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=225&fit=crop',
                    duration: '15:20',
                    views: 52000,
                    likes: 4100,
                    uploadDate: '2 weeks ago'
                },
                {
                    id: '4',
                    title: 'The Power of Positive Thinking',
                    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop',
                    duration: '10:15',
                    views: 38000,
                    likes: 2900,
                    uploadDate: '3 weeks ago'
                },
                {
                    id: '5',
                    title: 'Building Your Personal Brand',
                    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=225&fit=crop',
                    duration: '14:50',
                    views: 61000,
                    likes: 4800,
                    uploadDate: '1 month ago'
                },
                {
                    id: '6',
                    title: 'Leadership Skills for Success',
                    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=225&fit=crop',
                    duration: '16:40',
                    views: 55000,
                    likes: 4300,
                    uploadDate: '1 month ago'
                }
            ]);

            this.followers.set([
                {
                    id: '1',
                    name: 'Sarah Johnson',
                    username: '@sarahj',
                    avatar: 'https://i.pravatar.cc/150?img=1',
                    bio: 'Digital Marketing Expert',
                    isFollowing: false
                },
                {
                    id: '2',
                    name: 'Michael Chen',
                    username: '@mchen',
                    avatar: 'https://i.pravatar.cc/150?img=2',
                    bio: 'Software Engineer',
                    isFollowing: true
                },
                {
                    id: '3',
                    name: 'Emily Rodriguez',
                    username: '@emilyrod',
                    avatar: 'https://i.pravatar.cc/150?img=3',
                    bio: 'Graphic Designer',
                    isFollowing: false
                }
            ]);

            this.following.set([
                {
                    id: '4',
                    name: 'Lisa Wang',
                    username: '@lisawang',
                    avatar: 'https://i.pravatar.cc/150?img=5',
                    bio: 'Data Scientist',
                    isFollowing: true
                },
                {
                    id: '5',
                    name: 'James Miller',
                    username: '@jmiller',
                    avatar: 'https://i.pravatar.cc/150?img=6',
                    bio: 'Fitness Trainer',
                    isFollowing: true
                }
            ]);

            this.friends.set([
                {
                    id: '6',
                    name: 'Alex Martinez',
                    username: '@alexm',
                    avatar: 'https://i.pravatar.cc/150?img=8',
                    bio: 'Photographer',
                    isFollowing: true
                }
            ]);

            this.isLoading.set(false);
        }, 500);
    }

    protected setActiveTab(tab: ProfileTab): void {
        this.activeTab.set(tab);
    }

    protected onFollowToggle(): void {
        const profile = this.userProfile();
        if (profile) {
            profile.isFollowing = !profile.isFollowing;
            this.userProfile.set({ ...profile });
            console.log(`${profile.isFollowing ? 'Followed' : 'Unfollowed'} ${profile.name}`);
        }
    }

    protected onAddFriend(): void {
        const profile = this.userProfile();
        if (profile) {
            profile.isFriend = !profile.isFriend;
            this.userProfile.set({ ...profile });
            console.log(`${profile.isFriend ? 'Added' : 'Removed'} ${profile.name} as friend`);
        }
    }

    protected onMessage(): void {
        console.log('Send message to', this.userProfile()?.name);
        // Navigate to messages or open message modal
    }

    protected onVideoClick(video: Video): void {
        // Convert the clicked video and all videos to VideoCardData format
        const videoCardData = this.videos().map(v => this.convertToVideoCardData(v));
        const clickedIndex = this.videos().findIndex(v => v.id === video.id);

        // Set videos in the service
        this.videoViewerService.setVideos(videoCardData, clickedIndex);

        // Navigate to video viewer with state
        this.router.navigate(['/video-viewer'], {
            state: {
                videos: videoCardData,
                index: clickedIndex
            }
        });
    }

    private convertToVideoCardData(video: Video): VideoCardData {
        const profile = this.userProfile();
        return {
            id: video.id,
            title: video.title,
            author: profile?.name || 'Unknown',
            authorAvatar: profile?.avatar || '',
            views: this.formatNumber(video.views),
            timeAgo: video.uploadDate,
            videoUrl: this.getVideoUrl(video.id),
            thumbnailUrl: video.thumbnail
        };
    }

    private getVideoUrl(videoId: string): string {
        // Map video IDs to actual video URLs
        // In a real app, this would come from your API
        const videoUrls: { [key: string]: string } = {
            '1': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            '2': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            '3': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            '4': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            '5': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            '6': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
        };
        return videoUrls[videoId] || videoUrls['1'];
    }

    protected onConnectionClick(connection: UserConnection): void {
        this.router.navigate(['/user-profile', connection.id]);
    }

    protected onFollowConnection(connection: UserConnection): void {
        connection.isFollowing = !connection.isFollowing;
        console.log(`${connection.isFollowing ? 'Followed' : 'Unfollowed'} ${connection.name}`);
    }

    protected goBack(): void {
        this.router.navigate(['/discover/following']);
    }

    protected formatNumber(num: number): string {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}
