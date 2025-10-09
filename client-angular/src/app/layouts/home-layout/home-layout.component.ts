import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { currentUser, GlobalService, JwtService, LoadingComponent, SharedUiModule } from '../../shared-ui';
import { LoginComponent } from '../../views/home-pages/login/login.component';
import { SignupComponent } from "../../views/home-pages/signup/signup.component";
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from '../../views/home-pages/forgot-password/forgot-password.component';
import { RecoveryPasswordComponent } from '../../views/home-pages/recovery-password/recovery-password.component';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [SharedUiModule, LoginComponent, SignupComponent, LoadingComponent, ForgotPasswordComponent, RecoveryPasswordComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss'
})
export class HomeLayoutComponent implements OnInit {

  @ViewChild('showAddEditUserModal', { static: false })
  public showAddEditUserModal: any = ModalDirective;
  modelType: string = '';
  subscription: Subscription = new Subscription();
  currentUser: any = {};
  isLoggedIn = false;
  userDetails:currentUser = new currentUser();


  constructor(
    private jwtService: JwtService,
    private router: Router,
    private globalService: GlobalService,
    private toastr: ToastrService,
    // private usersService: UsersService,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2
    // private cdr: ChangeDetectorRef
  ) {
    this.jwtService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }
  ngOnInit(): void {

    // this.currentUser = this.jwtService.getCurrentUser();
    // alert("uiiii")
    // debugger
    this.subscription = this.globalService
      .getActionChildToParent()
      .subscribe((message) => {
        this.userDetails = this.jwtService.getCurrentUser();
        if (message) {
          if (message && message.text === 'signin') {
            this.showAuthModal(message.text);
          } else if (message && message.text === 'signup') {
            this.showAuthModal(message.text);
          } else if (message && message.text === 'forgot') {
            this.showAuthModal(message.text);
          } else if (message && message.text === 'recoverPassword') {
            this.showAuthModal(message.text);
          } else {
            if (message.text === 'hideModel') {
              if (this.showAddEditUserModal.hide) {
                this.showAddEditUserModal.hide();
              }
            }
          }

        }
      });
      this.userDetails = this.jwtService.getCurrentUser();
      this.globalService.destroySession();
  }

  logout(closebtn?:string) {
    this.jwtService.destroyToken();
    this.router.navigate(['/']);
    if(!closebtn){
      this.toastr.success('You have logged out successfully. ', 'Success');
    }
  }

  showAuthModal(modelType?: any) {
    this.modelType = modelType;
    this.showAddEditUserModal.show();
  }


  toggleMobileMenu(): void {
    if (window.innerWidth > 1200) {
      return;
    }

    const hasClass = document.body.classList.contains('mobile-menu');
    const menuBanner = document.querySelector('.menu-top-banner') as HTMLElement;
    const menuClick = document.querySelector('.menu_click') as HTMLElement;
    const middle = menuClick?.querySelector('.middle') as HTMLElement;
    const top = menuClick?.querySelector('.top') as HTMLElement;
    const bottom = menuClick?.querySelector('.bottom') as HTMLElement;

    if (hasClass) {
      this.renderer.removeClass(document.body, 'mobile-menu');
      this.renderer.removeStyle(document.body, 'position');
      this.renderer.removeStyle(document.body, 'top');
      this.renderer.removeStyle(document.body, 'left');
      this.renderer.removeStyle(document.body, 'right');
      this.renderer.removeStyle(document.body, 'margin');
      this.renderer.removeStyle(document.body, 'width');
      this.renderer.removeStyle(document.body, 'height');
      this.renderer.removeStyle(document.body, 'background');

      if (menuBanner) {
        this.renderer.setStyle(menuBanner, 'left', '-100%');
        this.renderer.setStyle(menuBanner, 'opacity', '0');
      }
      if (middle) this.renderer.setStyle(middle, 'opacity', '1');
      if (top) {
        this.renderer.removeStyle(top, 'top');
        this.renderer.removeStyle(top, 'transform');
      }
      if (bottom) {
        this.renderer.removeStyle(bottom, 'top');
        this.renderer.removeStyle(bottom, 'transform');
      }
    } else {
      this.renderer.addClass(document.body, 'mobile-menu');
      this.renderer.setStyle(document.body, 'position', 'fixed');
      this.renderer.setStyle(document.body, 'top', '0');
      this.renderer.setStyle(document.body, 'left', '0');
      this.renderer.setStyle(document.body, 'right', '0');
      this.renderer.setStyle(document.body, 'margin', 'auto');
      this.renderer.setStyle(document.body, 'width', '100%');
      this.renderer.setStyle(document.body, 'height', '100%');
      this.renderer.setStyle(document.body, 'background', '#fff');

      if (menuBanner) {
        this.renderer.setStyle(menuBanner, 'left', '0%');
        this.renderer.setStyle(menuBanner, 'opacity', '1');
      }
      if (middle) this.renderer.setStyle(middle, 'opacity', '0');
      if (top) {
        this.renderer.setStyle(top, 'top', '50%');
        this.renderer.setStyle(top, 'transform', 'translateY(-50%) rotate(45deg)');
      }
      if (bottom) {
        this.renderer.setStyle(bottom, 'top', '50%');
        this.renderer.setStyle(bottom, 'transform', 'translateY(-50%) rotate(-45deg)');
      }
    }
  }


}
