import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { JwtService } from '..';
import { environment } from '../../../environments/environment';
// import { navItems } from '../../nav';
import { GlobalService } from '../services/global.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  // public navItems = navItems;
  constructor(
    private jwtService: JwtService,
    private router: Router,
    private globalService: GlobalService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.jwtService.getToken()) {
      const user = this.jwtService.loggedUserInfo;
      // console.log('user', user);
      if (user && user.role) {
        // this.globalService.authentication();
        if (user.role === environment.role.adminRole) {
          return true;
        } else {
          // const found = this.navItems.filter(function (nav) {
          //   return state.url === nav.url;
          // });
          // if (found.length) {
          //   this.router.navigate(['/']);
          //   return false;
          // } else {
          //   return true;
          // }
          this.router.navigate(['/']);
          return false;
        }
      } else {
        this.router.navigate(['/']);
        return false;
      }
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
