import { Component } from '@angular/core';
import { ActivatedRoute ,Router} from '@angular/router';
import { JwtService, NewsService, SharedUiModule } from '../../../shared-ui';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-news',
  standalone: true,
  imports: [SharedUiModule],
  templateUrl: './view-news.component.html',
  styleUrl: './view-news.component.scss'
})
export class ViewNewsComponent {
  news: any ;
  news_id: any = '';

  constructor(
    private route: ActivatedRoute,
    public jwtService: JwtService,
    private router: Router,
    private toastr: ToastrService,
    private newsservice :NewsService,
    private spinnerLoading: NgxSpinnerService,

  ) {

  }

  ngOnInit() {
    this.route.params.subscribe((res: any) => {
      this.news_id = res.news_id;
      if (this.news_id) {
        this.getNewsDetails()
      } else {
        if (!this.news_id) {
          this.router.navigate(['/']);
        }
      }
    });
  }

  getNewsDetails() {
    this.spinnerLoading.show();
    this.newsservice.getNewsInfoById({ id: this.news_id }).subscribe({
      next: (response) => {
        this.spinnerLoading.hide();
        if (response.status == 200) {
          this.news = response.data;
          console.log('this.news', this.news);
          console.log('this.news', this.news);
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
