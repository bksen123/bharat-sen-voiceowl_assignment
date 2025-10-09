import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GlobalService, JwtService, SharedUiModule, UsersService } from '../../../shared-ui';

class userReset {
  newPass: string = '';
  newConfPass: string = '';
}

@Component({
  selector: 'app-recovery-password',
  standalone: true,
  imports: [SharedUiModule],
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss'],
})
export class RecoveryPasswordComponent implements OnInit {
  title = 'Reset Password | Active Learner Group';
  userResetInfo: userReset = new userReset();
  userId: any;
  link: any;
  userInfo: any = {};
  expiredLinkErrorMsg: String = '';

  viewInputType: any = {
    newPassType: 'password',
    newConfType: 'password',
  };

  inValidateCheck: any = {
    strongPasswordCheck: false,
  };

  requiredValidation: any = {
    newPass: '',
    newConfPass: '',
  };

  loading: boolean = true;

  constructor(
    private jwtService: JwtService,
    private globalService: GlobalService,
    private spinner: NgxSpinnerService,
    private usersService: UsersService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((res: any) => {
      this.userId = res.userId;
      this.link = res.token;
      localStorage.setItem('userId', res.userId.toString());
      if (this.userId && this.link) {
        this.jwtService.destroyToken();
        this.globalService.logOut();
        this.getUserData();
      }
    });

    this.globalService.getPageTitle(this.title);
  }

  changeInputType(keyType: any) {
    if (this.viewInputType[keyType] === 'password') {
      this.viewInputType[keyType] = 'text';
    } else {
      this.viewInputType[keyType] = 'password';
    }
  }

  patternMatchCheck(signupInfoValue: any, validateType: string) {
    const validate = this.globalService.patternMatchRegex(
      signupInfoValue,
      validateType
    );
    this.inValidateCheck[validateType] = validate;
  }

  getUserData() {
    this.spinner.show();
    const postData = {
      id: Number(this.userId),
      forgotLink: this.link,
    };
    this.usersService.getUserInfo(postData).subscribe(
     {
      next: (data) => {
        this.loading = false;
        this.spinner.hide();
        if (data.status === 200) {
          this.globalService.sendActionChildToParent('recoverPassword');
          this.userInfo = data.data;
        } else {
          this.globalService.sendActionChildToParent('hideModel');
          this.loading = true;
          this.expiredLinkErrorMsg = data.message;
        }
      },
      error:(error: any) => {
        this.loading = false;
        this.spinner.hide();
        this.toastr.error(error, 'Error');
      }
     }
    );
  }

  resetPassword() {
    const ObjectKeys = Object.keys(this.requiredValidation);
    let postData = JSON.parse(JSON.stringify(this.userResetInfo)); //IT BROKES TWO WAY DATABINDING
    const found = ObjectKeys.filter((obj: any) => {
      return !postData[obj];
    });
    this.globalService.sendActionChildToParent('showLoading');
    if (
      found.length ||
      !this.inValidateCheck.strongPasswordCheck ||
      this.userResetInfo.newPass !== this.userResetInfo.newConfPass
    ) {
      this.toastr.warning('*Please Fill All Fields are mandatory.', 'Warning');
      this.globalService.sendActionChildToParent('stop');
      return false;
    }
    let resetPasswordData = JSON.parse(JSON.stringify(this.userResetInfo)); //IT BROKES TWO WAY DATABINDING
    const resetPostData = {
      id: Number(localStorage.getItem('userId')),
      password: resetPasswordData.newPass,
      forgotLink: '',
      forgotStatus: 0,
    };
    this.spinner.show();
    this.usersService.saveUserInfo(resetPostData).subscribe(
      {
        next: (data: any) => {
          this.spinner.hide();
          localStorage.removeItem('userId')
          if (data.status === 200) {
            this.toastr.success('Password has been Reset successfully.', 'Success!');
            this.openAuthModal('signin')
          } else {
            this.toastr.error(data.message, 'Error');
          }
        },
        error: (error: any) => {
          this.spinner.hide();
          this.toastr.error(error, 'Error!');
        }
      }
    );
    return;
  }

  openAuthModal(modetype:string) {
    this.globalService.sendActionChildToParent('hideModel');
    setTimeout(() => {
      this.globalService.sendActionChildToParent(modetype);
    }, 1000);
  }
}
