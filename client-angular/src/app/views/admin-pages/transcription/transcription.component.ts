import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GlobalService, SharedUiModule } from '../../../shared-ui';
import { newTranscription } from './new-transcription';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { TranscriptionService } from '../../../shared-ui/services/transcription.service';

declare var bootstrap: any;

@Component({
  selector: 'app-transcription',
  standalone: true,
  imports: [SharedUiModule],
  templateUrl: './transcription.component.html',
  styleUrl: './transcription.component.scss',
})
export class transcriptionComponent {
  transcriptionList: any[] = [];
  newTranscription: newTranscription = new newTranscription();
  confirmDeleteId: any = null;
  imageSrc: string = 'assets/img/brand/avatar.png';
  selectedFiles?: any = {
    imageInfo: [],
    imageUrl: '',
  };
  imageError: string = '';
  isImage: boolean = false;
  searchTranscription: any = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalItems: number = 0;
  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();
  @ViewChild('transcriptionForm') transcriptionFormRef!: NgForm;

  @ViewChild('showAddEdittranscriptionModal', { static: false })
  public showAddEdittranscriptionModal: any = ModalDirective;
  @ViewChild('deletetranscriptionModal', { static: false })
  public deletetranscriptionModal: any = ModalDirective;
  transcriptions: any;

  constructor(
    private spinner: NgxSpinnerService,
    private transcriptionService: TranscriptionService,
    private toastr: ToastrService,
    private globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.fetchTranscriptions();
    const searchSub = this.searchSubject
      .pipe(debounceTime(500))
      .subscribe((value: string) => {
        this.searchTranscription = value.trim();
        this.fetchTranscriptions();
      });

    this.transcriptions.add(searchSub);
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  onPageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.fetchTranscriptions();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.fetchTranscriptions();
  }

  fetchTranscriptions(): void {
    // this.spinner.show();
    const params = {
      searchTranscriptionValue: this.searchTranscription,
      page: this.currentPage,
      limit: this.itemsPerPage,
    };
    console.log('params', params);
    this.transcriptionService.getAllTranscription(params).subscribe({
      next: (res: any) => {
        console.log("res===================", res);
        if (res.status == 200) {
          this.transcriptionList = res?.data.items || [];
          this.totalItems = res.data.total || 0;
          this.spinner.hide();
        } else {
          this.transcriptionList = [];
        }
      },
      error: (err: any) => {
        console.error('Error fetching transcriptions:', err);
        this.spinner.hide();
      },
    });
  }

  addEdittranscription(sub?: any) {
    if (sub) {
      this.newTranscription = sub;
    } else {
      this.newTranscription = new newTranscription();
    }
    this.showAddEdittranscriptionModal.show();
  }

  showConfirmPopup(sub: newTranscription) {
    this.newTranscription = sub;
    this.deletetranscriptionModal.show();
  }

  closeConfirmPopup() {
    this.confirmDeleteId = null;
  }

  confirmDelete(transcription: newTranscription) {
    this.newTranscription = transcription;
    this.deletetranscriptionModal.show();
  }

  deleteTranscription(): void {
    this.spinner.show();
    this.transcriptionService.deleteTranscription({ _id: this.newTranscription._id}).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.toastr.success(response.message, 'Success!');
        } else {
          this.toastr.error(response.message, 'Error!');
        }
        this.fetchTranscriptions();
        this.closeModel();
      },
      error: (err: any) => {
        this.toastr.error('Something went wrong. Please try again.');
        this.spinner.hide();
      }
    });
  }

  saveupdateTranscription(changeStatus?: any): void {
    let postData: newTranscription = changeStatus || this.newTranscription;
    if (!changeStatus && this.transcriptionFormRef.invalid) {
      Object.values(this.transcriptionFormRef.controls).forEach((control: any) =>
        control.markAsTouched()
      );
      return;
    }
    this.transcriptionService.saveTranscription(postData).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.toastr.success(response.message, 'Success!');
        } else {
          this.toastr.error(response.message, 'Error!');
        }
        this.fetchTranscriptions();
        this.closeModel();
      },
      error: (err) => {
        this.toastr.error(err, 'Error!');
      }
    });
  }

  closeModel() {
    this.showAddEdittranscriptionModal.hide();
    this.deletetranscriptionModal.hide();
  }

  ngOnDestroy(): void {
    this.transcriptions.unsubscribe();
  }
}
