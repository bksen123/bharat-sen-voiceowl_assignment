import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactusService {

  baseUrl: string = environment.baseUrl;
   users = 'applicationContactUs';
   constructor(private apiService: ApiService) {}
 
   public saveContactUsInfo(param: object): Observable<any> {
     return this.apiService.post(`${this.users}/save`, param)
   }
   
   public getAllContactUsList(param?:object): Observable<any> {
    console.log('param in service', param);
     return this.apiService.post(`${this.users}/getAll`,param).pipe(
      map((data) => {
        return data;
      })
    );
   }
}
