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

  public saveTranscription(param: object): Observable<any> {
    return this.apiService.post(`${this.transcription}`, param).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

 public getAllTranscription(param?: any): Observable<any> {
    return this.apiService.get(`${this.transcription}?page=${param.page}&limit=${param.limit}`).pipe(
      map((data) => data),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  public deleteTranscription(param: any): Observable<any> {
    return this.apiService.delete(`${this.transcription}?_id=${param._id}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

 
}
