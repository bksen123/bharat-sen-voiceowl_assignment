import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  baseUrl: string = environment.baseUrl;
  users = 'users';
  constructor(private apiService: ApiService, private httpService: HttpClient) { }

  public saveUserInfo(param: object): Observable<any> {
    return this.apiService.post(`${this.users}/signup`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public saveMemberInfo(param: object): Observable<any> {
    return this.apiService.post(`${this.users}/save`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public updateUserInfo(param: object): Observable<any> {
    return this.apiService.post(`${this.users}/update`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public userLogin(param: object): Observable<any> {
    return this.apiService.post(`${this.users}/signin`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public getUsersList(param: object): Observable<any> {
    return this.apiService.post(`${this.users}/getUserList`,param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  // getUsersList(page = 1, limit = 10): Observable<any> {
  //   // Create HttpParams
  //   const params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('limit', limit.toString());

  //   // Make the GET request with options
  //   return this.apiService.get(`${this.users}/getUserList`, {
  //     params: params
  //   });
  // }

  // public getUsersList(page?: number, limit? : number): Observable<any> {
  //   return this.apiService.post(`${this.users}/getUserListwithP`);
  // }

  public getMembers(param: object): Observable<any> {
    return this.apiService.post(`${this.users}/getMembers`,param);
  }

  public statusUpdate(payload: { id: number; verified: any }): Observable<any> {
    return this.apiService.post(`${this.users}/statusUpdate`, payload).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public deleteUser(param: any): Observable<any> {
    return this.apiService.delete(`${this.users}/delete`, param).pipe(
      // map((data) => {
      //   return data;
      // }),
      catchError((error: any) => {
        console.error('Error deleting subscription:', error);
        return throwError(() => error);
      })
    );
  }

  public emailAlreadyExists(param: any): any {
    return this.apiService.post(`${this.users}/emailAlreadyExists`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public forgotPassword(param: object): Observable<any> {
    return this.apiService.post(`${this.users}/forgotPassword`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public authentication(param?: object): Observable<any> {
    return this.apiService.post(`${this.users}/authentication`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public logout(param?: object): Observable<any> {
    return this.apiService.get(`${this.users}/logout`).pipe(
      map((data) => {
        return data;
      })
    );
  }





  public searchUserData(param: object): Observable<any> {
    return this.apiService.post(`${this.users}/searchUserData`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public getUserInfo(param: object): Observable<any> {
    return this.apiService.post(`${this.users}/getUserInfo`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public getDashboardCounts(type:object): Observable<any> {
    return this.apiService.post(`${this.users}/dashboard`,type).pipe(
      map((data) => {
        return data;
      })
    );
  }

  public getUserById(param: object) {
    return this.apiService.post(`${this.users}/getUserById`, param).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
