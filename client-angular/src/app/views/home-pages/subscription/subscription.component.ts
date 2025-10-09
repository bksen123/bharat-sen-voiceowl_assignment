import { Component } from '@angular/core';
import { currentUser, GlobalService, JwtService, SharedUiModule, SubscriptionService } from '../../../shared-ui';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
declare let Razorpay: any;

@Component({
  selector: 'app-subscription',
  standalone:true,
  imports: [SharedUiModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent {
  subscriptions: any[] = [];
  userDetails: currentUser = new currentUser()
  constructor(
    private subscriptionService: SubscriptionService,
    private toastr :ToastrService,
    private jwtService: JwtService,
    private router: Router,
    private globalService: GlobalService,
    private spinnerLoading: NgxSpinnerService,
    ) {}

  ngOnInit(): void {
    this.fetchSubscriptions();
    this.userDetails = this.jwtService.getCurrentUser();

  }

  fetchSubscriptions(): void {
    this.spinnerLoading.show();
    this.subscriptionService.getAllSubscription().subscribe({
      next: (response) => {
        this.spinnerLoading.hide();
        if (response.status == 200) {
          this.subscriptions = response.data
          // this.toastr.success(response.message, 'Success!');
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

  pay_for_plan(item: any){
    console.log("userDetails", this.userDetails);
    let planDetails = JSON.parse(JSON.stringify(item))
    // this.save_order_details('pay_QHFkeb8owdd2lM', planDetails)
    // return;
    this.userDetails = this.jwtService.getCurrentUser();
    if(!this.userDetails){
      window.localStorage.setItem('coming_from_plan', 'plan');
      this.globalService.sendActionChildToParent('signin');
    } else {
      if(this.userDetails.sub_plan_status) {
        this.toastr.success("You have already subscribed to a plan. Please wait for the current plan to expire before subscribing again.", 'Warning!');
        this.router.navigate(['/subscription-plan-history']);
        return;
      }
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
            self.save_order_details(response?.razorpay_payment_id, planDetails)
          }
        },
        prefill: {
          name: this.userDetails.name,
          email: this.userDetails.email,
          contact: this.userDetails.mobile_number,
        },
        notes: {
          name: this.userDetails.name,
          email: this.userDetails.email,
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
  }



  save_order_details (razorpay_payment_id: any, planDetails: any){
    let postData = {
      planDetails: planDetails,
      razorpay_payment_id: razorpay_payment_id,
      userDetails: this.userDetails
    }
    this.spinnerLoading.show();
    this.subscriptionService.orderSubcriptionPlan(postData).subscribe({
      next: (response) => {
        // console.log("response======", response);
        this.spinnerLoading.hide();
        if (response.status == 200) {
          // this.subscriptions = response.data
          let updateUserDetails = JSON.parse(JSON.stringify(this.userDetails));
          updateUserDetails.sub_plan_status = true;
          this.jwtService.saveCurrentUser(JSON.stringify(updateUserDetails));
          this.jwtService.getCurrentUser();
          this.router.navigate(['/subscription-plan-history']);
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
