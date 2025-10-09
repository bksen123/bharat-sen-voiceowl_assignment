import { EventService } from '../../../shared-ui/services/event.service';
import { Component } from '@angular/core';
import {
  currentUser,
  EventService,
  GlobalService,
  JwtService,
} from '../../../shared-ui';
import {
  SharedUiModule,
  SubscriptionService,
  TruncatePipe,
} from '../../../shared-ui';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faLink, faShare } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.component.html',
  imports: [SharedUiModule, TruncatePipe],
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  currentUrl: string = window.location.href;
  shareBaseUrl: string = environment.shareUrl;
  // shareBaseUrl: string = 'https://www.activelearnergroup.com';
  eventDetails: currentUser = new currentUser();
  events: any[] = [];
  isLoading = false;
  searchevents: string = '';
  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();

  constructor(
    private subscriptionService: SubscriptionService,
    private toastr: ToastrService,
    private jwtService: JwtService,
    private router: Router,
    private globalService: GlobalService,
    private spinnerLoading: NgxSpinnerService,
    private eventsservice: EventService,
    library: FaIconLibrary
  ) {
    library.addIcons(faLink, faShare);
    library.addIconPacks(fab);
  }

  ngOnInit(): void {
    this.eventDetails = this.jwtService.getCurrentUser();
    this.getEventsList();
    const searchSub = this.searchSubject
      .pipe(debounceTime(500))
      .subscribe((value: string) => {
        this.searchevents = value.trim();
        this.getEventsList();
      });

    this.subscriptions.add(searchSub);
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  getEventsList() {
    this.isLoading = true;
    this.EventService.getevet().subscribe({
      next: () => {},
      error: () => {},
    });
    this.eventsservice
      .getEvents({ searchEventvalue: this.searchevents })
      .subscribe({
        next: (response) => {
          console.log('getEvents', response);
          this.isLoading = false;
          const status = response?.status;
          const data = response?.data ?? [];

          if (status === 200) {
            this.events = data;
            console.log('Events loaded:', this.events[0]);
          } else {
            console.warn('Unexpected response status:', status);
            this.events = [];
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error fetching events list:', err);
          this.events = [];
        },
      });
  }

  isSameDate(item: any): boolean {
    const from = new Date(item.from_event_date);
    const to = new Date(item.to_event_date);
    return from.toDateString() === to.toDateString();
  }

  redirect_to_login(item: currentUser) {
    if (!this.eventDetails) {
      // this.router.navigate(['/subscription']);
      this.globalService.sendActionChildToParent('signin');
    } else {
      if (this.eventDetails && !this.eventDetails.sub_plan_status) {
        this.router.navigate(['/subscription']);
      } else {
        console.log('item.id', item.id);
        this.router.navigate(['/view-event/' + item.id]);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
