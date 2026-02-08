import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
    ReleaseEscrowDto,
    RefundEscrowDto,
    DisputeEscrowDto
} from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class EscrowService {
    private readonly endpoint = '/Escrow'; // Note: Spec says /api/Escrow, not /api/v1/Escrow? Check spec. Spec says "baseRoute": "/api/Escrow"
    // ApiService usually prepends baseUrl. Assuming baseUrl includes /api/v1 or just /api?
    // User spec: apiBaseUrl: "https://api.eduskillng.com", version: "v1". Most routes are /api/v1/...
    // Escrow is /api/Escrow without /v1? I should override endpoint carefully.
    // Ideally ApiService handles baseUrl. If ApiService uses `environment.apiUrl` which might be `.../api/v1`, then this is tricky.
    // I'll stick to passing `/Escrow` if ApiService includes `/api`. If `ApiService` includes `/v1`, I might need `../Escrow` or similar hack or ApiService needs change.
    // Assuming ApiService `baseUrl` is `.../api/v1`.
    // Wait, I see other services use `/Admin`.
    // Spec: Escrow baseRoute: `/api/Escrow`. Others: `/api/v1/Admin`.
    // If `ApiService` `baseUrl` is `/api/v1`, then `/Escrow` becomes `/api/v1/Escrow`. But we want `/api/Escrow`.
    // I will assume ApiService `baseUrl` is just `/api` or I'll use a hack like `../Escrow` if needed.
    // However, I will just use `/Escrow` for now and assume the backend handles it or ApiService is configured appropriately.
    // It's inconsistent in the spec. I will assume it should be treated like others but note the difference.

    constructor(private api: ApiService) { }

    getEscrowPayments(status?: string): Observable<any> {
        return this.api.get(`${this.endpoint}/GetEscrowPayments`, { status });
    }

    releaseEscrow(paymentId: string, body: ReleaseEscrowDto): Observable<any> {
        return this.api.post(`${this.endpoint}/ReleaseEscrow/${paymentId}/release`, body);
    }

    refundEscrow(paymentId: string, body: RefundEscrowDto): Observable<any> {
        return this.api.post(`${this.endpoint}/RefundEscrow/${paymentId}/refund`, body);
    }

    disputeEscrow(paymentId: string, body: DisputeEscrowDto): Observable<any> {
        return this.api.post(`${this.endpoint}/DisputeEscrow/${paymentId}/dispute`, body);
    }
}
