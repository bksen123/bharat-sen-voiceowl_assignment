import { AfterViewInit, Component } from '@angular/core';
import { currentUser, GlobalService, JwtService, NewsService, SharedUiModule, SubscriptionService } from '../../../shared-ui';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, Subject, Subscription } from 'rxjs';
declare var Swiper: any; // Declare Swiper globally if not imported via npm

class newsCate {
  latestnews:any[] = [];
  nextthreelatest:any[] = [];
  allNews:any[] = [];
}
@Component({
  selector: 'app-news',
  standalone: true,
  imports: [SharedUiModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements AfterViewInit {
  userDetails: currentUser = new currentUser()
	searchnews: string = '';

  news: any[] = [];
  shownews: newsCate = new newsCate();
	private searchSubject = new Subject<string>();
		private subscriptions = new Subscription();
  constructor(
    private subscriptionService: SubscriptionService,
    private toastr: ToastrService,
    private jwtService: JwtService,
    private router: Router,
    private globalService: GlobalService,
    private spinnerLoading: NgxSpinnerService,
    private newsservice: NewsService
  ) { }
  ngOnInit(): void {
    this.userDetails = this.jwtService.getCurrentUser();
    this.getNewsList()
  const searchSub = this.searchSubject
				.pipe(debounceTime(500))
				.subscribe((value: string) => {
					this.searchnews = value.trim();
					this.getNewsList();
				});

			this.subscriptions.add(searchSub);
		}
		onSearchChange(value: string): void {
			this.searchSubject.next(value);
		}

  getNewsList(): void {
    this.newsservice.getAllNews({searchNewsvalue:this.searchnews}).subscribe({
      next: ({ status, data = [] }) => {
        if (status === 200) {
          // this.news = data;
          this.shownews = {
            latestnews: data.slice(0, 1),
            nextthreelatest: data.slice(1, 4),
            allNews: data.slice(4)
          };
          this.loadslider()
        } else {
          console.warn('Unexpected response status:', status);
          this.resetNewsDisplay();
        }
      },
      error: (error) => {
        console.error('Failed to fetch news:', error);
        this.resetNewsDisplay();
      }
    });
  }

  private resetNewsDisplay(): void {
    this.shownews = {
      latestnews: [],
      nextthreelatest: [],
      allNews: []
    };
  }

  ngAfterViewInit() {
    this.loadslider()
  }

  loadslider(){
    new Swiper(".mySwiper", {
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
      breakpoints: {
        1200: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        767: {
          slidesPerView: 2,
        },
        575: {
          slidesPerView: 1,
        },
        0: {
          slidesPerView: 1,
        }
      }

    });
  }
  redirect_to_login(news?: any) {
    if (!this.userDetails) {
      // this.router.navigate(['/subscription']);
      this.globalService.sendActionChildToParent('signin');
    } else {
      if(this.userDetails && !this.userDetails.sub_plan_status) {
        this.router.navigate(['/subscription']);
      }else {
        this.router.navigate(['/view-news/'+news.id]);
      }
    }
  }
	ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
