import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { Observable, map, catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TranscriptionService {
  private transcription = 'transcription';

  constructor(private apiService: ApiService, private http: HttpClient) {}

  public saveSubscriptionInfo(param: object): Observable<any> {
    return this.apiService.post(`${this.transcription}/create`, param).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  public deleteSubscription(param: any): Observable<any> {
    return this.apiService.delete(`${this.transcription}/delete`, param).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  public getAllSubscription(param?: object): Observable<any> {
    return this.apiService.post(`${this.transcription}/getAll`, param).pipe(
      map((data) => data),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
