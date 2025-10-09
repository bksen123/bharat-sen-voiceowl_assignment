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
import { currentUser } from '../models/current-user';

@Injectable({
  providedIn: 'root',
})
export class isFalseAuthGuard implements CanActivate {
  // public navItems = navItems;
  currentUser: currentUser = new currentUser();
  constructor(private jwtService: JwtService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.currentUser = this.jwtService.getCurrentUser();
    if (this.currentUser && this.currentUser.role) {
      if (this.currentUser.role === environment.role.adminRole) {
        this.router.navigate(['/dashboard']);
        return true;
      } else {
        this.router.navigate(['/home']);
        return true;
      }
    }
    return true;
  }
}
