import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    private readonly endpoint = '/Categories';

    constructor(private api: ApiService) { }

    getCategories(): Observable<any> {
        return this.api.get(`${this.endpoint}/GetCategories`);
    }
}
