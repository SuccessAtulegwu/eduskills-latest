import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { VideoUploadDto, UpdateWatchPositionDto } from '../models/api.models';
import { VideoResponse } from '../models/model';

@Injectable({
    providedIn: 'root'
})
export class VideosService {
    private readonly endpoint = '/Videos';

    constructor(private api: ApiService) { }

    getVideos(category?: string): Observable<VideoResponse[]> {
        return this.api.get<VideoResponse[]>(`${this.endpoint}/GetVideos`, { category });
    }

    getVideo(id: string): Observable<VideoResponse> {
        return this.api.get<VideoResponse>(`${this.endpoint}/GetVideo/${id}`);
    }

    getTrending(): Observable<VideoResponse[]> {
        return this.api.get<VideoResponse[]>(`${this.endpoint}/GetTrending/trending`);
    }

    uploadVideo(body: VideoUploadDto, videoFile: File): Observable<any> {
        const formData = new FormData();
        Object.keys(body).forEach(key => {
            if ((body as any)[key] !== undefined) {
                formData.append(key, (body as any)[key]);
            }
        });
        formData.append('VideoFile', videoFile);
        return this.api.upload(`${this.endpoint}/UploadVideo`, formData);
    }

    likeVideo(id: string): Observable<any> {
        return this.api.post(`${this.endpoint}/LikeVideo/${id}/like`, {});
    }

    getWatchPosition(id: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetWatchPosition/${id}/watch-position`);
    }

    updateWatchPosition(id: string, body: UpdateWatchPositionDto): Observable<any> {
        return this.api.post(`${this.endpoint}/UpdateWatchPosition/${id}/watch-position`, body);
    }

    getWatchHistory(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetWatchHistory/watch-history`);
    }
}
