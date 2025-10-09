/**
 * Name: JwtService
 * @description: This Service will use for jwt related authentication.
 */
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  loggedUserInfo: any = {};
  jwtTokenKey: any = '';
  currentUserKey: any = '';

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    this.getCurrentUser();
  }

  getKeyLS(localStorageKey: any) {
    return window.localStorage.getItem(localStorageKey);
  }

  /** By it we will save jwt token in local storage */
  saveToken(token: string) {
    window.localStorage.setItem(environment.jwtTokenKey, token);
    this.jwtTokenKey = token;
    this.isLoggedInSubject.next(true);
  }

  /** By it we will get jwt token from local storage */
  getToken() {
    return this.jwtTokenKey;
  }

  /** This method will save Current logged user info in local storage
   * @param {*} userDetails is a user information besides password.
   */
  saveCurrentUser(userDetails: any) {
    window.localStorage.setItem(
      environment.currentUserKey,
      CryptoJS.AES.encrypt(userDetails, this.jwtTokenKey).toString()
    );
    this.isLoggedInSubject.next(true);
  }

  /** This method will get current logged user information from local storage*/
  getCurrentUser(): any {
    this.jwtTokenKey = this.getKeyLS(environment.jwtTokenKey);
    this.currentUserKey = this.getKeyLS(environment.currentUserKey);
    if (this.jwtTokenKey && this.currentUserKey) {
      try {
      this.loggedUserInfo = JSON.parse(
        CryptoJS.AES.decrypt(this.currentUserKey, this.jwtTokenKey).toString(
          CryptoJS.enc.Utf8
        )
      );
      this.isLoggedInSubject.next(true);
      return this.loggedUserInfo;
    }catch (err) { this.isLoggedInSubject.next(false);
      return false;
    }
   } else {
    this.isLoggedInSubject.next(false);
      return false;
    }
  }
  /** If user logout mean a while call this function to destroy logged user information*/
  destroyToken() {
    window.localStorage.removeItem(environment.jwtTokenKey);
    window.localStorage.removeItem(environment.currentUserKey);
    this.isLoggedInSubject.next(false);
  }

  setCookie(accessToken: string, cvalue: any) {
    const d = new Date();
    d.setTime(
      d.getTime() + environment.cookieExpirationTime * 24 * 60 * 60 * 1000
    );
    const expires = 'expires=' + d.toUTCString();
    document.cookie =
      accessToken +
      '=' +
      CryptoJS.AES.encrypt(JSON.stringify(cvalue), accessToken).toString() +
      ';' +
      expires +
      ';path=/';
  }

  getCookie(accessToken: any) {
    const name = accessToken + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        const cookieData = JSON.parse(
          CryptoJS.AES.decrypt(
            c.substring(name.length, c.length),
            accessToken
          ).toString(CryptoJS.enc.Utf8)
        );
        return cookieData;
      }
    }
    return '';
  }

  deleteCookie(accessToken: any) {
    document.cookie =
      accessToken + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}
