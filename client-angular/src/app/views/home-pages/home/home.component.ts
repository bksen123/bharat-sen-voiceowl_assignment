import { Component, AfterViewInit, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { currentUser, EventService, GlobalService, JwtService, NewsService, SharedUiModule, TruncatePipe, UsersService } from '../../../shared-ui';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

declare var Swiper: any;
interface HomeCounts {
	membersCount: number,
	eventsCount: number,
	newsCount: number,
	callRecordingsCount: number,
}
@Component({
	selector: 'app-home',
	standalone: true,
	imports: [SharedUiModule, TruncatePipe],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnInit {
	@ViewChild('members', { static: true }) members!: ElementRef<HTMLDivElement>;
	@ViewChild('eve', { static: true }) eve!: ElementRef<HTMLDivElement>;
	@ViewChild('new', { static: true }) new!: ElementRef<HTMLDivElement>;
	@ViewChild('recording', { static: true }) recording!: ElementRef<HTMLDivElement>;

	homeCounts: HomeCounts = {
		membersCount: 0,
		eventsCount: 0,
		newsCount: 0,
		callRecordingsCount: 0,
	};
	userDetails: currentUser = new currentUser()
	events: any[] = [];
	news: any[] = [];
	isLoading = false;

	constructor(private userservice: UsersService,
		private eventsservice: EventService,
		private newsservice: NewsService,
		private jwtService: JwtService,
		private router: Router,
		private globalService: GlobalService
	) { }

	ngOnInit(): void {
		this.getHomeCountList();
		this.loadNewsAndEvents();
		this.userDetails = this.jwtService.getCurrentUser();
	}

	getHomeCountList(): void {
		this.userservice.getDashboardCounts({ type: 'home' }).subscribe({
			next: (res: any) => {
				const data = res?.data;
				if (res.status === 200) {
					this.homeCounts = {
						membersCount: data?.membersCount || 0,
						eventsCount: data?.eventsCount || 0,
						newsCount: data?.newsCount || 0,
						callRecordingsCount: data?.callRecordingsCount || 0
					};
				} else {
					console.error('Failed to load dashboard counts:', res.message);
				}
			},
			error: (error: any) => {
				console.error('Failed to load dashboard counts:', error);
			}
		});
	}

	loadNewsAndEvents(): void {
		this.isLoading = true;
		forkJoin({
			news: this.newsservice.getAllNews(),
			events: this.eventsservice.getEvents()
		}).subscribe({
			next: ({ news, events }) => {
				this.handleNewsResponse(news);
				this.handleEventsResponse(events);
				this.isLoading = false;
			},
			error: (err) => {
				console.error('Failed to load news or events:', err);
				this.events = [];
				this.isLoading = false;
			}
		});
	}

	isSameDate(item: any): boolean {
		const from = new Date(item.from_event_date);
		const to = new Date(item.to_event_date);
		return from.toDateString() === to.toDateString();
	}

	private handleNewsResponse(response: any): void {
		const { message, status, data = [] } = response ?? {};
		if (status === 200) {
			this.news = data.slice(0, 3);
			console.log(message, this.news)

		} else {
			console.log(message);
			this.news = [];
		}
	}

	private handleEventsResponse(response: any): void {
		const { message, status, data = [] } = response ?? {};
		if (status === 200) {
			this.events = data.slice(0, 3);
			console.log(message, this.events)
		} else {
			console.log(message)
			this.events = [];
		}
	}

	formatTimeRange(startTime: string, endTime: string): string {
		const format = (time: string): string => {
			const [hours, minutes] = time.split(':').map(Number);
			const date = new Date();
			date.setHours(hours, minutes);
			// Format as 12-hour with AM/PM
			return new Intl.DateTimeFormat('en-US', {
				hour: 'numeric',
				minute: minutes === 0 ? undefined : '2-digit'
			}).format(date);
		};

		return `${format(startTime)} - ${format(endTime)}`;
	}

	ngAfterViewInit() {
		new Swiper(".hero-Swiper", {
			loop: true,
			autoplay: {
				delay: 3000,
			},
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},

		});
	}

	@HostListener('window:scroll', [])
	onWindowScroll() {
		this.animateValue(this.members.nativeElement, 0, this.homeCounts.membersCount, 1500);
		this.animateValue(this.eve.nativeElement, 0, this.homeCounts.eventsCount, 1500);
		this.animateValue(this.new.nativeElement, 0, this.homeCounts.newsCount, 1500);
		this.animateValue(this.recording.nativeElement, 0, this.homeCounts.callRecordingsCount, 1500);
	}

	animateValue(el: HTMLElement, start: number, end: number, duration: number): void {
		let startTimestamp: number | null = null;

		const step = (timestamp: number) => {
			if (!startTimestamp) startTimestamp = timestamp;
			const progress = Math.min((timestamp - startTimestamp) / duration, 1);
			el.textContent = Math.floor(progress * (end - start) + start).toString();
			if (progress < 1) {
				window.requestAnimationFrame(step);
			}
		};

		window.requestAnimationFrame(step);
	}

	redirect_to_login(item: currentUser, type: string) {
		if (!this.userDetails) {
			// this.router.navigate(['/subscription']);4
			this.globalService.sendActionChildToParent('signin');
		} else {
			if (this.userDetails && !this.userDetails.sub_plan_status) {
				this.router.navigate(['/subscription']);
			} else {
				this.router.navigate(['/view-' + type + '/' + item.id]);
			}
		}
	}
}
