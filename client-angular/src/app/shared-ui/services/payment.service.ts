import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
// import { data } from 'jquery';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  baseUrl = environment.baseUrl;
  payment = "payment"

  constructor(
    private apiService: ApiService
  ) { }

  public razorPayCreateOrder(param: object): Observable<any> {
    return this.apiService.post(`${this.payment}/razorPayCreateOrder`, param).pipe(
      map((data:any) => {
        return data
      })
    )
  }

  public razorPayOrdayPayment(param: object): Observable<any> {
    return this.apiService.post(`${this.payment}/razorPayOrdayPayment`, param).pipe(
      map((data:any) => {
        return data;
      })
    )
  }

}
