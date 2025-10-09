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
  searchtranscription: any = '';
  currentPage = 1;
  itemsPerPage = 8;
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
    this.fetchtranscriptions();
    const searchSub = this.searchSubject
      .pipe(debounceTime(500))
      .subscribe((value: string) => {
        this.searchtranscription = value.trim();
        this.fetchtranscriptions();
      });

    this.transcriptions.add(searchSub);
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  onPageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.fetchtranscriptions();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.fetchtranscriptions();
  }

  fetchtranscriptions(): void {
    this.spinner.show();
    const params = {
      searchtranscriptionValue: this.searchtranscription,
      page: this.currentPage,
      limit: this.itemsPerPage,
    };
    console.log('params', params);
    this.transcriptionService.saveSubscriptionInfo(params).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.transcriptionList = res?.data || [];
          this.totalItems = res.pagination.total || 0;
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

  confirmDelete() {}

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
    this.showAddEdittranscriptionModal.hide();
    this.deletetranscriptionModal.hide();
  }

  ngOnDestroy(): void {
    this.transcriptions.unsubscribe();
  }
}
