import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactusService, SharedUiModule } from '../../../shared-ui';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [SharedUiModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  contactUsList = [];
  itemsPerPageOptions: number[] = [10, 20, 50, 100];
  itemsPerPage: number = 10;
  currentPage = 1;
  totalItems = 0;
  searchcontact: any = '';
  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();

  constructor(
    private contactservice: ContactusService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllContactus();
    const searchSub = this.searchSubject
      .pipe(debounceTime(500))
      .subscribe((value: string) => {
        this.searchcontact = value.trim();
        this.currentPage = 1;
        this.getAllContactus();
      });
    this.subscriptions.add(searchSub);
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  onPageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.getAllContactus();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.getAllContactus();
  }

  getAllContactus(): void {
    const params = {
      searchContactValue: this.searchcontact,
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    this.contactservice.getAllContactUsList(params).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.contactUsList = response.data.list || [];
          this.totalItems = response.data.total || 0;
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (error: any) => {
        this.toastr.error(error.message, 'Error!');
      }
    });
  }

  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
