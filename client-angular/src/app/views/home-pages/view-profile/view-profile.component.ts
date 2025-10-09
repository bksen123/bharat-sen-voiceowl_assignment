import { Component, OnInit } from '@angular/core';
import { currentUser, GlobalService, JwtService, SharedUiModule, UsersService } from '../../../shared-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [SharedUiModule],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss'
})
export class ViewProfileComponent implements OnInit {
  usermember: currentUser = new currentUser;
  user_id: any = '';
  constructor(
    private route: ActivatedRoute,
    public jwtService: JwtService,
    private router: Router,
    private spinnerLoading: NgxSpinnerService,
    private userservice: UsersService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit() {
    
    this.usermember = this.jwtService.getCurrentUser();
    this.route.params.subscribe((res: any) => {
      this.user_id = res.user_id;
      if (this.user_id) {
        this.getMembersDetails()
      } else {
        if (!this.usermember) {
          this.router.navigate(['/']);
        }
      }
    });
  }

  getMembersDetails() {
    this.spinnerLoading.show();
    this.userservice.getUserById({ id: this.user_id }).subscribe({
      next: (response) => {
        this.spinnerLoading.hide();
        if (response.status == 200) {
          this.usermember = response.data;
          console.log('this.usermember', this.usermember);
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
