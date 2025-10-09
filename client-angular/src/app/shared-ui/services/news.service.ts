import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  baseUrl: string = environment.baseUrl;
  news = 'news';
  constructor(private apiService: ApiService) { }

  public getAll(param:object): Observable<any> {
    return this.apiService.post(`${this.news}/getAll`,param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public getAllNews(param?:object): Observable<any> {
    return this.apiService.post(`${this.news}/getNews`,param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public statusUpdate(payload: { id: number; is_active: any }): Observable<any> {
    return this.apiService.post(`${this.news}/statusUpdate`, payload).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public saveNewsInfo(formData: FormData): Observable<any> {
    return this.apiService.post(`${this.news}/save`, formData);
  }


  public deleteNews(param: any): Observable<any> {
    return this.apiService.delete(`${this.news}/delete`, param)
  }

  public getNewsInfoById(param: any): Observable<any> {
    return this.apiService.post(`${this.news}/getById`, param)
  }

}
