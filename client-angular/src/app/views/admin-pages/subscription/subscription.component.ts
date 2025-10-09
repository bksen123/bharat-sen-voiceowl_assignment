import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubscriptionService } from '../../../shared-ui/services/subscription.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalService, SharedUiModule } from '../../../shared-ui';
import { newSubscription } from './new-subscription';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { debounceTime, Subject, Subscription } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [SharedUiModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent {

  subscriptionList: any[] = [];
  newSubscription: newSubscription = new newSubscription();
  confirmDeleteId: any = null;
  imageSrc: string = 'assets/img/brand/avatar.png';
  selectedFiles?: any = {
    imageInfo: [],
    imageUrl: '',
  };
  imageError: string = '';
  isImage: boolean = false;
  searchsubscription: any = ''
  currentPage = 1;
  itemsPerPage = 8;
  totalItems: number = 0;
  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();
  @ViewChild('subscriptionForm') subscriptionFormRef!: NgForm;

  @ViewChild('showAddEditSubscriptionModal', { static: false })
  public showAddEditSubscriptionModal: any = ModalDirective;
  @ViewChild('deleteSubscriptionModal', { static: false })
  public deleteSubscriptionModal: any = ModalDirective;

  constructor(
    private spinner: NgxSpinnerService,
    private subscriptionService: SubscriptionService,
    private toastr: ToastrService,
    private globalService: GlobalService
  ) { }

  ngOnInit(): void {
    this.fetchSubscriptions();
    const searchSub = this.searchSubject
      .pipe(debounceTime(500))
      .subscribe((value: string) => {
        this.searchsubscription = value.trim();
        this.fetchSubscriptions();
      });

    this.subscriptions.add(searchSub);
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  onPageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.fetchSubscriptions();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.fetchSubscriptions();
  }

  fetchSubscriptions(): void {
    this.spinner.show();
    const params = {
      searchSubscriptionValue: this.searchsubscription,
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    console.log("params", params)
    this.subscriptionService.getAllSubscription(params).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.subscriptionList = res?.data || [];
          this.totalItems = res.pagination.total || 0;
          this.spinner.hide();
        }
        else {
          this.subscriptionList = []
        }
      },
      error: (err: any) => {
        console.error('Error fetching subscriptions:', err);
        this.spinner.hide();
      }
    });
  }

  addEditSubscription(sub?: any) {
    if (sub) {
      this.newSubscription = sub;
    } else {
      this.newSubscription = new newSubscription();
    }
    this.showAddEditSubscriptionModal.show();
  }

  showConfirmPopup(sub: newSubscription) {
    this.newSubscription = sub
    this.deleteSubscriptionModal.show()
  }

  closeConfirmPopup() {
    this.confirmDeleteId = null;
  }

  confirmDelete() {
    this.deleteSubscription(this.newSubscription.id);
  }

  profileImageView() {
    if (this.selectedFiles.imageUrl) {
      return this.selectedFiles.imageUrl;
    } else if (this.newSubscription?.subscription_banner) {
      return this.newSubscription.subscription_banner
    }
    else {
      return this.imageSrc;
    }
  }

  onFileChange(event: any) {
    const fileData = event.target.files[0];
    if (!fileData.name.match(/\.(jpg|jpeg|png)$/)) {
      this.toastr.warning(
        'You can upload only jpg, jpeg, png, gif image.',
        'Warning'
      );
      return false;
    } else if (event.target.files && event.target.files.length) {
      this.selectedFiles.imageInfo = event.target.files[0];
      const reader = new FileReader(); // File Preview
      const [file] = event.target.files;
      reader.onload = (e: any) => {
        this.selectedFiles.imageUrl = e.target.result;
        // this.imageSrc = reader.result as string;
        this.isImage = true;
      };
      reader.readAsDataURL(file);
    }
    return;
  }

  closeModel() {
    this.showAddEditSubscriptionModal.hide();
    this.deleteSubscriptionModal.hide();
  }

  deleteSubscription(id: any): void {
    this.spinner.show();
    this.subscriptionService.deleteSubscription({ id }).subscribe({
      next: (res: any) => {
        this.toastr.success('Subscription deleted successfully!');
        this.fetchSubscriptions();
        this.closeModel();
        this.spinner.hide();
      },
      error: (err: any) => {
        console.error('Error deleting subscription:', err);
        this.toastr.error('Something went wrong. Please try again.');
        this.spinner.hide();
      }
    });
  }

  saveupdateSubscription(changeStatus?: any): void {
    let postData: newSubscription = changeStatus || this.newSubscription;
    if (!changeStatus && this.subscriptionFormRef.invalid) {
      Object.values(this.subscriptionFormRef.controls).forEach((control: any) =>
        control.markAsTouched()
      );
      return;
    }
    this.subscriptionService.updateSubscription(postData).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.toastr.success(response.message, 'Success!');
        } else {
          this.toastr.error(response.message, 'Error!');
        }
        this.fetchSubscriptions();
        this.closeModel();
      },
      error: (err) => {
        this.toastr.error(err, 'Error!');
      }
    });
  }

  toggleStatus(index: number, sub: any): void {
    const updatedStatus = sub.is_active === 1 ? 0 : 1;
    this.subscriptionService.statusUpdate({
      id: sub.id,
      is_active: updatedStatus
    }).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.subscriptionList[index].is_active = updatedStatus;
          this.toastr.success(response.message, 'Success!');
        } else {
          this.toastr.error(response.message, 'Error!');
        }
      },
      error: (err: any) => {
        this.toastr.error(err.message || 'An error occurred', 'Error!');
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
