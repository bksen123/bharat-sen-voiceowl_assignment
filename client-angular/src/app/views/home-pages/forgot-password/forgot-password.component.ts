import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GlobalService, SharedUiModule, UsersService } from '../../../shared-ui';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [SharedUiModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  title = 'Forgot Password | Angular Node Training';
  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  forgotPasswordInfo: any = {
    email: '',
  };

  constructor(
    private globalService: GlobalService,
    private spinner: NgxSpinnerService,
    private usersService: UsersService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.globalService.getPageTitle(this.title);
  }

  forgotPassword() {
    this.spinner.show();
    this.globalService.sendActionChildToParent('showLoading');
    this.successMessage = '';
    this.errorMessage = '';
    this.loading = true;
    this.usersService.forgotPassword(this.forgotPasswordInfo).subscribe(
      {
        next: 
        (data: any) => {
          console.log('data', data);
          this.spinner.hide();
          if (data.status === 200) {
            this.toastr.success(data.message, 'Success');
            this.successMessage = data.message;
            // this.globalService.sendActionChildToParent('stop');
            this.loading = false;
          } else {
            this.toastr.error(data.message, 'Error');
            this.errorMessage = data.message;
            // this.globalService.sendActionChildToParent('stop');
            this.loading = false;
          }
          this.forgotPasswordInfo.email = '';
        },
        error: (error: any) => {
          this.toastr.error(
            'There are some server Please check connection.',
            'Error'
          );
          this.spinner.hide();
          this.forgotPasswordInfo.email = '';
          this.globalService.sendActionChildToParent('stop');
        }
      }
    );
  }

  openAuthModal(modetype:string) {
    this.globalService.sendActionChildToParent('hideModel');
    setTimeout(() => {
      this.globalService.sendActionChildToParent(modetype);
    }, 1000);
  }
}
