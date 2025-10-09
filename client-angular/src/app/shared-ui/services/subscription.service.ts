import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { Observable, map, catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private sub = 'subscription';

  constructor(private apiService: ApiService, private http: HttpClient) { }

  public saveSubscriptionInfo(param: object): Observable<any> {
    return this.apiService.post(`${this.sub}/create`, param).pipe(
      catchError((error) => {
        console.error('Error saving subscription info:', error);
        return throwError(() => error);
      })
    );
  }

  public updateSubscription(param: object): Observable<any> {
    return this.apiService.post(`${this.sub}/save`, param).pipe(
      catchError((error) => {
        console.error('Error updating subscription:', error);
        return throwError(() => error);
      })
    );
  }

  public statusUpdate(payload: { id: number; is_active: any }): Observable<any> {
    return this.apiService.post(`${this.sub}/statusUpdate`, payload).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public deleteSubscription(param: any): Observable<any> {
    return this.apiService.delete(`${this.sub}/delete`, param).pipe(
      catchError((error) => {
        console.error('Error deleting subscription:', error);
        return throwError(() => error);
      })
    );
  }

  public getAllSubscription(param?:object): Observable<any> {
    return this.apiService.post(`${this.sub}/getAll`,param).pipe(
      map((data) => data),
      catchError((error) => {
        console.error('Error fetching subscriptions:', error);
        return throwError(() => error);
      })
    );
  }

  public getSubscriptionById(param: object): Observable<any> {
    return this.apiService.post(`${this.sub}/getById`, param).pipe(
      catchError((error) => {
        console.error('Error fetching subscription by ID:', error);
        return throwError(() => error);
      })
    );
  }

  public orderSubcriptionPlan(param: object): Observable<any> {
    return this.apiService.post(`${this.sub}/orderSubcriptionPlan`, param).pipe(
      catchError((error) => {
        console.error('Error updating subscription:', error);
        return throwError(() => error);
      })
    );
  }
  public getUserPlanDetails(param: object): Observable<any> {
    return this.apiService.post(`${this.sub}/getUserPlanDetails`, param).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
