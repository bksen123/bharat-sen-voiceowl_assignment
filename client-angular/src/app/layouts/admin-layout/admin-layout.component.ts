import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import {
  currentUser,
  GlobalService,
  JwtService,
  LoadingComponent,
} from '../../shared-ui';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    RouterModule,
    LoadingComponent,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  isCollapsed = false;
  userDetails: currentUser = new currentUser();
  constructor(
    public jwtService: JwtService,
    public globalService: GlobalService,
    public router: Router,
    public toastr: ToastrService
  ) {}

  ngOnInit() {
    this.userDetails = this.jwtService.getCurrentUser();
    // console.log("this.jwtService.getCurrentUser();", this.userDetails)
    this.globalService.destroySession();
  }
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  navItems = [
    { label: 'Dashboard', link: '/dashboard', icon: 'bi bi-speedometer2' },
    {
      label: 'Subscription',
      link: '/subscription',
      icon: 'bi bi-clipboard2-check',
    },
  ];

  logout() {
    this.jwtService.destroyToken();
    this.globalService.logOut();
    this.router.navigate(['/']);
    this.toastr.success('You have logged out successfully. ', 'Success');
  }
}
