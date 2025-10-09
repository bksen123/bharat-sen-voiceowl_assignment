import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  baseUrl: string = environment.baseUrl;
  events = 'events';
  constructor(private apiService: ApiService) {}

  public saveUpdateEvent(param: object): Observable<any> {
    return this.apiService.post(`${this.events}/save`, param);
  }

  public statusUpdate(payload: {
    id: number;
    is_active: any;
  }): Observable<any> {
    return this.apiService.post(`${this.events}/statusUpdate`, payload).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public updateEventInfo(param: object): Observable<any> {
    return this.apiService.post(`${this.events}/save`, param);
  }

  public getAllEvents(param: object): Observable<any> {
    return this.apiService.post(`${this.events}/getAll`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public getEvents(param?: object): Observable<any> {
    return this.apiService.post('url', param).pipe(map(() => {}));

    // return this.apiService.post(`${this.events}/getEvents`,param).pipe(
    //   map((data) => {
    //     return data;
    //   })
    // );
  }

  public getEventInfoById(param: object): Observable<any> {
    return this.apiService.post(`${this.events}/getEventById`, param);
  }

  public deleteEvent(param: object): Observable<any> {
    return this.apiService.delete(`${this.events}/delete`, param).pipe(
      catchError((error) => {
        console.error('Error deleting subscription:', error);
        return throwError(() => error);
      })
    );
  }

  public joinEventByUser(param: object): Observable<any> {
    return this.apiService.post(`${this.events}/joinEventByUser`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
