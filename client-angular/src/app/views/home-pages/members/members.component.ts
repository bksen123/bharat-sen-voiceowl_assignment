import { Component } from '@angular/core';
import { currentUser, GlobalService, JwtService, SharedUiModule, SubscriptionService, UsersService } from '../../../shared-ui';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import {  Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-members',
  standalone: true,
  imports: [SharedUiModule],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent {
  userDetails: currentUser = new currentUser()
  members:any[] = []
	searchmembers: string = '';

  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();
	  constructor(
    private subscriptionService: SubscriptionService,
    private toastr :ToastrService,
    private jwtService: JwtService,
    private router: Router,
    private globalService: GlobalService,
    private spinnerLoading: NgxSpinnerService,
    private userservice : UsersService
    ) {}
  ngOnInit(): void {
    this.userDetails = this.jwtService.getCurrentUser();
    this.getMembersList();
		const searchSub = this.searchSubject
      .pipe(debounceTime(500))
      .subscribe((value: string) => {
        this.searchmembers = value.trim();
        this.getMembersList();
      });

    this.subscriptions.add(searchSub);
  }
	onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }
	

  getMembersList(): void {
		this.spinnerLoading.show();
    this.userservice.getMembers({searchvalue:this.searchmembers}).subscribe({
      next: (response) => {
        this.spinnerLoading.hide();
        if (response.status == 200) {
          if(!this.userDetails.sub_plan_status) {
            this.members = response.data.slice(0, 8);
          } else {
            this.members = response.data
          }
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

  redirect_to_login(member: currentUser){
    if(!this.userDetails){
      // this.router.navigate(['/subscription']);
      this.globalService.sendActionChildToParent('signin');
    } else {
      if(this.userDetails && !this.userDetails.sub_plan_status) {
        this.router.navigate(['/subscription']);
      } else {
        this.router.navigate(['/view-profile/'+member.id]);
      }
    }
  }
	ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
