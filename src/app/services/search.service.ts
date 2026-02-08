import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private readonly endpoint = '/Search';

    constructor(private api: ApiService) { }

    search(q: string): Observable<any> {
        return this.api.get(`${this.endpoint}/Search`, { q });
    }
}
