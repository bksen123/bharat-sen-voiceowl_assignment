import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { JwtService, UsersService } from '..';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private subject = new Subject<any>();
  private progress = new Subject<any>();
  baseUrl: string = environment.baseUrl;
  users = 'users';

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private router: Router,
    private titleService: Title,
    private apiService: ApiService,
    private httpClient: HttpClient,
  ) { }

  patternMatchRegex(inputVal: any, InputType: string) {
    let RegEx: any = '';
    if (InputType === 'email') {
      RegEx = new RegExp('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$');
    } else if (InputType === 'phoneNumber') {
      RegEx = new RegExp('^((\\+91-?)|0)?[0-9]{10}$');
    } else if (InputType === 'strongPasswordCheck') {
      RegEx = new RegExp(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[^A-Za-z0-9])(?=.*?[0-9]).{8,}$'
      );
    }
    const validRex = RegEx.test(inputVal);
    return validRex;
  }

  getProgress(): Observable<any> {
    return this.progress.asObservable();
  }

  setProgress(action: any | undefined) {
    this.progress.next({ text: action });
  }

  getLoadingLabel(): Observable<any> {
    return this.subject.asObservable();
  }

  setLoadingLabel(action: string) {
    this.subject.next({ text: action });
  }

  sendActionChildToParent(action: string) {
    this.subject.next({ text: action });
  }

  getActionChildToParent(): Observable<any> {
    return this.subject.asObservable();
  }

  authentication() {
    const userInfo = this.jwtService.loggedUserInfo;
    if (userInfo && userInfo.email) {
      const loginInfo = {
        email: userInfo.email,
      };
      this.usersService.authentication(loginInfo).subscribe(
        (data) => {
          if (!data.currentUser) {
            // this.globalService.sendActionChildToParent('stop');
            this.jwtService.destroyToken();
            this.sendActionChildToParent('Logout');
            this.router.navigate(['/login']);
          }
        },
        (error) => { }
      );
    }
  }

  logOut() {
    this.sendActionChildToParent('loggedOut');
    const userInfo = this.jwtService.loggedUserInfo;
    if (userInfo && userInfo.email) {
      const loginInfo = {
        email: userInfo.email,
      };
      this.usersService.logout().subscribe(
        (data) => { },
        (error) => { }
      );
    }
  }

  getPageTitle(title: any) {
    this.titleService.setTitle(title);
  }

  localUpload(image: any, folderName: string) {
    const extension = image.name.substring(image.name.lastIndexOf('.'));
    let fileName = image.name.replace(
      image.name.substr(image.name.lastIndexOf('.')),
      ''
    );

    fileName = fileName.replace(/[.]/g, '');
    let newFileName = fileName.replace(/[.\s]/g, '-') + extension;
    newFileName = newFileName + '###' + folderName;
    const formData = new FormData();
    formData.append('subscription_banner', image, newFileName);
    return this.httpClient.post(this.baseUrl + 'subscription/save', formData);

  }



  FileUploadProgressBar(file: any) {
    this.setProgress(1)
    const formData = new FormData();
    formData.append('image', file);

    return this.httpClient
      .post(this.baseUrl + 'fileUploadProgress', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.setProgress(Math.round((100 / event.total) * event.loaded))
          } else if (event.type == HttpEventType.Response) {
            // this.setProgress(null);
            // this.setProgress(null);
          }
        }),
        catchError((err: any) => {
          this.setProgress(null);
          alert(err.message);
          return throwError(err.message);
        })
      )
      // .toPromise();
  }

  // this method will destroy our session after 12 hours.
  destroySession() {
    const user = this.jwtService.getCurrentUser();
    if (user && user.sesionStartTime) {
      let sesionStartTime = new Date(user.sesionStartTime);
      let currentTime = new Date();
      let diff = currentTime.valueOf() - sesionStartTime.valueOf();
      let diffInHours = diff / 1000 / 60 / 60
      diffInHours = Number(diffInHours.toFixed());
      if (diffInHours > environment.sessionTime) {
        this.jwtService.destroyToken();
      }
    } else {
      this.jwtService.destroyToken();
    }
  }
}
