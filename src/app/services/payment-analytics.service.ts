import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentAnalyticsService {
    private readonly endpoint = '/PaymentAnalytics';

    constructor(private api: ApiService) { }

    getAnalyticsSummary(query?: { startDate?: string; endDate?: string }): Observable<any> {
        return this.api.get(`${this.endpoint}/GetAnalyticsSummary`, query);
    }

    getRevenueReport(query?: { startDate?: string; endDate?: string }): Observable<any> {
        return this.api.get(`${this.endpoint}/GetRevenueReport/revenue-report`, query);
    }

    getPaymentTrends(query?: { period?: string; days?: number }): Observable<any> {
        return this.api.get(`${this.endpoint}/GetPaymentTrends/trends`, query);
    }

    getGatewayPerformance(query?: { startDate?: string; endDate?: string }): Observable<any> {
        return this.api.get(`${this.endpoint}/GetGatewayPerformance/gateway-performance`, query);
    }

    getTypeBreakdown(query?: { startDate?: string; endDate?: string }): Observable<any> {
        return this.api.get(`${this.endpoint}/GetTypeBreakdown/type-breakdown`, query);
    }

    getStatistics(query?: { startDate?: string; endDate?: string }): Observable<any> {
        return this.api.get(`${this.endpoint}/GetStatistics/statistics`, query);
    }
}
