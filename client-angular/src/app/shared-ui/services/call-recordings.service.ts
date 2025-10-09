import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallRecordingsService {
  baseUrl: string = environment.baseUrl;
  callRecording = 'call-recording';
  constructor(private apiService: ApiService) { }

  public saveCallRecording(param: object): Observable<any> {
    return this.apiService.post(`${this.callRecording}/save`, param)
  }

  public getAllcallRecording(param?:object): Observable<any> {
    return this.apiService.post(`${this.callRecording}/getAll`,param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public statusUpdate(payload: { id: number; is_active: any }): Observable<any> {
    return this.apiService.post(`${this.callRecording}/statusUpdate`, payload).pipe(
      map((data) => {
        return data;
      })
    );
  }

  // public deleteCallRecording(id: { param: any }): Observable<any> {
  public deleteCallRecording(param: any): Observable<any> {
    return this.apiService.delete(`${this.callRecording}/delete`, param)
  }

  public getCallRecordingInfoById(param: object): Observable<any> {
    return this.apiService.post(`${this.callRecording}/getById`, param)
  }
}
