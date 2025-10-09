import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { currentUser, EventService, JwtService, SharedUiModule } from '../../../shared-ui';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-view-event',
  standalone: true,
  imports: [SharedUiModule],
  templateUrl: './view-event.component.html',
  styleUrl: './view-event.component.scss'
})
export class ViewEventComponent {
  currentUrl: string = window.location.href;

  shareBaseUrl: string = environment.shareUrl;
  // shareBaseUrl: string = 'https://www.activelearnergroup.com'; 
  event: any;
  event_id: any = '';
  userDetails: currentUser = new currentUser()

  constructor(
    private route: ActivatedRoute,
    public jwtService: JwtService,
    private router: Router,
    private toastr: ToastrService,
    private eventservice: EventService,
    private spinnerLoading: NgxSpinnerService,

  ) {

  }

  ngOnInit() {
    this.userDetails = this.jwtService.getCurrentUser();
    this.route.params.subscribe((res: any) => {
      this.event_id = res.event_id;
      if (this.event_id) {
        this.getMembersDetails()
      } else {
        if (!this.event_id) {
          this.router.navigate(['/']);
        }
      }
    });
  }

  getMembersDetails() {
    this.spinnerLoading.show();
    this.eventservice.getEventInfoById({ id: Number(this.event_id), user_id: this.userDetails.id }).subscribe({
      next: (response) => {
        this.spinnerLoading.hide();
        if (response.status == 200) {
          this.event = response.data;
          console.log('this.event', this.event);
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

  isSameDate(event: any): boolean {
    const from = new Date(event.from_event_date);
    const to = new Date(event.to_event_date);
    return from.toDateString() === to.toDateString();
  }


  joinEvent(event: any) {
    if (event.event_id) {
      this.toastr.success('Already You have joined.', 'Success');
      return;
    }
    this.spinnerLoading.show();
    this.eventservice.joinEventByUser({ event_id: Number(this.event_id), event: this.event, user: this.userDetails }).subscribe({
      next: (response) => {
        this.spinnerLoading.hide();
        if (response.status == 200) {
          this.toastr.success('This event has been joined successfully', 'Success');
          this.getMembersDetails()
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
