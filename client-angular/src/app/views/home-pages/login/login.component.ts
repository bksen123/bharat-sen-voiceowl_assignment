import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { currentUser, GlobalService, JwtService, SharedUiModule, SubscriptionService, UsersService } from '../../../shared-ui';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
declare let Razorpay: any;

class loginUser {
  email: string = '';
  password: string = '';
  remember: boolean = false;
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedUiModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showPassword: boolean = false;
  loginForm: FormGroup;
  subscriptions: any[] = [];

  constructor(private userServices: UsersService, private fb: FormBuilder,
    private router: Router,
    private jwtService: JwtService,
    private spinnerLoading: NgxSpinnerService,
    // private usersService: UsersService,
    private globalService: GlobalService,
    private toastr: ToastrService,
    private subscriptionService: SubscriptionService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember:['']
     });
     this.fetchSubscriptions();
    }

   ngOnInit() {
    this.globalService.sendActionChildToParent('stop');
    const rememberMeCookie = this.jwtService.getCookie(environment.cookieToken);
    if (rememberMeCookie) {
      const parsedData = typeof rememberMeCookie === 'string' ? JSON.parse(rememberMeCookie) : rememberMeCookie;
      this.loginForm.patchValue({
        email: parsedData.email || '',
        password: parsedData.password || '',
        remember: true
      });
    }
  }



  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  onLogin() {
    if (this.loginForm.valid) {
      // this.spinner.show();
    this.globalService.sendActionChildToParent('showLoading');

      const formData = { ...this.loginForm.value };
      if (formData.remember) {
        this.jwtService.setCookie(environment.cookieToken, formData);
      } else {
        this.jwtService.deleteCookie(environment.cookieToken);
      }
      // Remove confirmPassword from the copied object
      delete formData.remember;
      console.log(formData)
      this.userServices.userLogin(formData).subscribe({
        next: (response) => {
          this.globalService.sendActionChildToParent('stop');
        if (response.status == 200) {
          let userDetails = response.data;
          userDetails.sesionStartTime = new Date();
          if(userDetails.sub_plan_status) {
            this.toastr.success(response.message, 'Success');
            this.jwtService.saveToken(userDetails.authorization);
            this.jwtService.saveCurrentUser(JSON.stringify(userDetails));
            this.jwtService.getCurrentUser();
            // this.globalService.sendActionChildToParent('Loggin');
            this.globalService.sendActionChildToParent('hideModel');
            if (userDetails && userDetails.role === environment.role.adminRole) {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/members']);
              // let plan_value = window.localStorage.getItem('coming_from_plan');
              // if(!plan_value){
              //   if(userDetails.sub_plan_status) {
              //     this.router.navigate(['/members']);
              //   } else {
              //     this.router.navigate(['/subscription']);
              //   }
              // } else {
              //   window.localStorage.removeItem('coming_from_plan')
              // }
            }
          } else {
            this.pay_for_plan(this.subscriptions[0], userDetails)
          }
        } else {
          this.toastr.error(response.message, 'Error');
        }
        },
        error: (error) => {
          this.globalService.sendActionChildToParent('hideModel');
           this.toastr.error(error.message, 'Error');
        }
      });
    } else {
      alert('Please fill out the form correctly.');
    }
  }


  openAuthModal(modetype:string) {
    this.globalService.sendActionChildToParent('hideModel');
    setTimeout(() => {
      this.globalService.sendActionChildToParent(modetype);
    }, 1000);
  }

  fetchSubscriptions(): void {
    this.spinnerLoading.show();
    this.subscriptionService.getAllSubscription().subscribe({
      next: (response) => {
        this.spinnerLoading.hide();
        if (response.status == 200) {
          this.subscriptions = response.data
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (error) => {
        this.spinnerLoading.hide();
        this.toastr.error(error.message, 'Error!');
      }
    });
  }



  pay_for_plan(item: any, userDetails:any){
    console.log("userDetails", userDetails);
    let planDetails = JSON.parse(JSON.stringify(item))
    const self = this;
    var options = {
      key: "rzp_test_Kn9O9qsLpLi3Qy",
      // key: "rzp_test_rrhVTiOsvj7xdW",
      // "key": "rzp_test_0c3Mgg3xzCcTWp",
      amount: planDetails.amount * 100,
      // amount: 50 * 100,
      currency: "INR",
      name: 'Active Learner Group',
      description: planDetails.description,
      // image: "assest/logo_sm.jpg",
      image: 'https://activelearnergroup.com/assets/alg_logo.png',
      handler:  (response: any) => {
        if (response?.razorpay_payment_id) {
          self.save_order_details(response?.razorpay_payment_id, planDetails, userDetails)
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.mobile_number,
      },
      notes: {
        name: userDetails.name,
        email: userDetails.email,
        Product: planDetails.description,
      },
      theme: {
        color: "#b0d345",
      },
      capture: true // Capture payment along with payment creation
    };
    var rzp = new Razorpay(options);
    rzp.open();
  }



  save_order_details (razorpay_payment_id: any, planDetails: any, userDetails:any){
    let postData = {
      planDetails: planDetails,
      razorpay_payment_id: razorpay_payment_id,
      userDetails: userDetails
    }
    this.spinnerLoading.show();
    this.globalService.sendActionChildToParent('hideModel');
    this.subscriptionService.orderSubcriptionPlan(postData).subscribe({
      next: (response) => {
        this.spinnerLoading.hide();
        if (response.status == 200) {
          this.jwtService.saveToken(userDetails.authorization);
          let updateUserDetails = JSON.parse(JSON.stringify(userDetails));
          updateUserDetails.sub_plan_status = true;
          this.jwtService.saveCurrentUser(JSON.stringify(updateUserDetails));
          this.jwtService.getCurrentUser();
          this.router.navigate(['/members']);
          this.toastr.success(response.message+' You now have full access to our system.', 'Success!');
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (error) => {
        this.spinnerLoading.hide();
        this.toastr.error(error.message, 'Error!');
      }
    });
  }
}
