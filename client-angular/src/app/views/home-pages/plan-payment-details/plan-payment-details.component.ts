import { Component, OnInit } from '@angular/core';
import { currentUser, GlobalService, JwtService, SharedUiModule, SubscriptionService } from '../../../shared-ui';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan-payment-details',
  standalone: true,
  imports: [SharedUiModule],
  templateUrl: './plan-payment-details.component.html',
  styleUrl: './plan-payment-details.component.scss'
})
export class PlanPaymentDetailsComponent implements OnInit{
  userplanData: any[] = [];
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
    this.userDetails = this.jwtService.getCurrentUser();
    this.getUserPlanDetails();
  }

  getUserPlanDetails(): void {
    this.spinnerLoading.show();
    // console.log("{user_id: this.userDetails.id}", this.userDetails.id)
    this.subscriptionService.getUserPlanDetails({user_id: this.userDetails.id}).subscribe({
      next: (response) => {
        this.spinnerLoading.hide();
        if (response.status == 200) {
          this.userplanData = response.data
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
}
