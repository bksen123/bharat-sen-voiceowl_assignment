import { Component } from '@angular/core';
import { SharedUiModule, UsersService } from '../../../shared-ui';
import { ToastrService } from 'ngx-toastr';

interface DashboardCounts {
  contactsCount: number;
  eventsCount: number;
  membersCount: number;
  newsCount: number;
	callRecordings:number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedUiModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  dashboardCounts: DashboardCounts = {
    contactsCount: 0,
    eventsCount: 0,
    membersCount: 0,
    newsCount: 0,
		callRecordings:0
  };

  constructor(
    private userservice: UsersService,
    private toastr: ToastrService

  ) { }

  ngOnInit(): void {
    this.userservice.getDashboardCounts({type:'dashboard'}).subscribe({
      next: (res: any) => {
        if (res.status == 200 && res.data) {
          this.dashboardCounts = {
            contactsCount: res.data.contactsCount || 0,
            eventsCount: res.data.eventsCount || 0,
            membersCount: res.data.membersCount || 0,
            newsCount: res.data.newsCount || 0,
            callRecordings: res.data.callRecordingsCount || 0
          };
        }
      },
      error: (error: any) => {
        this.toastr.error(error.message, 'Error!');
      }
    });
  }
}
