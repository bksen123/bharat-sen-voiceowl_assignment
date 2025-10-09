import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService, SharedUiModule } from '../../../shared-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../environments/environment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { formatDate } from '@angular/common';

class selectedFiles {
  imageInfo: any = [];
  imageUrl: any = '';
};
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [SharedUiModule, ImageCropperComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {

  eventForm: any = new FormGroup({});
  selectedEventIdToDelete: number | null = null;
  eventsList: any[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  totalItems: number = 0;
  environment = environment;
  selectedBannerFile: File | null = null;
  currentEvent: any = [];
  isLoading = false;
  searchevents: string = '';
  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();

  imageSrc: string = 'assets/dummy.jpg';
  selectedFiles: selectedFiles = new selectedFiles();


  // Image Cropper
  currentFile: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isCropping: boolean = false;

  // Image Cropper Modal
  @ViewChild('imageCropModal', { static: false })
  public imageCropModal!: ModalDirective;


  @ViewChild('showAddEditEventsModal', { static: false })
  public showAddEditEventsModal: any = ModalDirective;
  @ViewChild('deleteEventModal', { static: false })
  public deleteEventModal: any = ModalDirective;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.getEvents();
    this.initForm();
    const searchSub = this.searchSubject
      .pipe(debounceTime(500))
      .subscribe((value: string) => {
        this.searchevents = value.trim();
        this.getEvents();
      });

    this.subscriptions.add(searchSub);
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }
  onPageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.getEvents();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.getEvents();
  }

  initForm(): void {
    this.selectedFiles = new selectedFiles();
    this.eventForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      from_event_date: ['', Validators.required],
      to_event_date: ['', Validators.required],
      start_time: ['10:00', Validators.required],
      end_time: ['17:00', Validators.required],
      location: ['indore', Validators.required],
      mode: ['Online', Validators.required],
      meeting_link: [''],
      // priority: ['Medium', Validators.required],
      event_type: ['Imitation', Validators.required],
      description: ['', Validators.required],
      event_banner: [''],
      eventOldBanner: ['']
    });
  }

  getEvents(): void {
    this.spinner.show();
    const params = {
      searchEventvalue: this.searchevents,
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    this.eventService.getAllEvents(params).subscribe({
      next: (response: any) => {
        console.log("getEvents", response)
        this.spinner.hide();
        const status = response?.status;
        const data = response?.data ?? [];
        if (status === 200) {
          this.eventsList = data || [];
          this.totalItems = response.pagination.total || 0;
        } else {
          this.toastr.error(response.message, 'Error!')
          this.eventsList = [];
        }
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error!')
        this.spinner.hide();
        this.eventsList = [];
      }
    });
  }

  isSameDate(event: any): boolean {
    const from = new Date(event.from_event_date);
    const to = new Date(event.to_event_date);
    return (
      from.getFullYear() === to.getFullYear() &&
      from.getMonth() === to.getMonth() &&
      from.getDate() === to.getDate()
    );
  }


  profileImageView() {
    if (this.selectedFiles.imageUrl) {
      return this.selectedFiles.imageUrl;
    } else if (this.eventForm?.value?.event_banner) {
      return this.eventForm?.value?.event_banner;
    } else {
      return this.imageSrc;
    }
  }

  deleteImg() {
    this.selectedFiles.imageUrl = '';
    this.selectedFiles.imageInfo = [];
    const oldImage = JSON.parse(JSON.stringify(this.eventForm.value.event_banner));
    if (oldImage) {
      this.eventForm.value.eventOldBanner = oldImage;
    }
    this.eventForm.value.event_banner = '';
  }

  // addEditModel(event?: any): void {
  //   this.initForm()
  //   if (event) {
  //     let patchedData = { ...event };
  //     patchedData.from_event_date = new Date(patchedData.from_event_date).toISOString().substring(0, 10);
  //     if (event.event_banner) {
  //       this.imageSrc = event.event_banner;
  //     } else {
  //       this.imageSrc = 'assets/dummy.jpg';
  //     }
  //     this.eventForm.patchValue(patchedData);
  //   } else {
  //     this.imageSrc = 'assets/dummy.jpg';
  //   }
  //   this.showAddEditEventsModal.show();
  // }

  addEditModel(event?: any): void {
    this.initForm();

    if (event) {
      let patchedData = { ...event };

      // Format both from_event_date and to_event_date to YYYY-MM-DD
      // if (patchedData.from_event_date) {
      //   patchedData.from_event_date = new Date(patchedData.from_event_date).toISOString().substring(0, 10);
      // }
      // if (patchedData.to_event_date) {
      //   patchedData.to_event_date = new Date(patchedData.to_event_date).toISOString().substring(0, 10);
      // }

      if (patchedData.from_event_date) {
        patchedData.from_event_date = formatDate(patchedData.from_event_date, 'yyyy-MM-dd', 'en-US');
      }
      if (patchedData.to_event_date) {
        patchedData.to_event_date = formatDate(patchedData.to_event_date, 'yyyy-MM-dd', 'en-US');
      }

      // Set image if present
      this.imageSrc = event.event_banner ? event.event_banner : 'assets/dummy.jpg';

      this.eventForm.patchValue(patchedData);
    } else {
      this.imageSrc = 'assets/dummy.jpg';
    }

    this.showAddEditEventsModal.show();
  }

  // Cropper Methods functionality -----STARTS HERE-----
  // Cropper Methods
  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      this.croppedImage = event.blob;
      console.log('Blob:', this.croppedImage);
    }
    // Fallback to base64
    else if (event.base64) {
      this.croppedImage = event.base64;
    }
    // Last resort - object URL
    else if (event.objectUrl) {
      this.croppedImage = event.objectUrl;
    }
  }

  // Cropper
  async applyCroppedImage() {
    if (!this.croppedImage) {
      this.toastr.warning('Please crop the image first', 'Warning');
      return;
    }
    this.isCropping = true;
    try {
      let blob: Blob;
      // Case 1: Already a Blob (from imageCropped event)
      if (this.croppedImage instanceof Blob) {
        blob = this.croppedImage;
      }
      // Case 2: Object URL (blob:...)
      else if (typeof this.croppedImage === 'string' && this.croppedImage.startsWith('blob:')) {
        const response = await fetch(this.croppedImage);
        blob = await response.blob();
      }
      // Case 3: Base64 data URI
      else if (typeof this.croppedImage === 'string') {
        blob = this.dataURItoBlob(this.croppedImage);
      }
      // Unsupported format
      else {
        throw new Error('Unsupported image format');
      }

      this.processCroppedImage(blob);
    } catch (error: any) {
      console.error('Error applying cropped image:', error);
      this.toastr.error(error.message || 'Failed to process the cropped image', 'Error');
    } finally {
      this.isCropping = false;
    }
  }

  // Cropper
  private processCroppedImage(blob: Blob) {
    const fileName = this.currentFile?.name || `profile-${Date.now()}.png`;
    const croppedFile = new File([blob], fileName, {
      type: 'image/png',
      lastModified: Date.now()
    });
    const reader = new FileReader();
    if (!croppedFile.type.match(/image\/(jpeg|jpg|png)/)) {
      this.toastr.warning('Only JPG, JPEG, and PNG images are allowed', 'Invalid File');
      return;
    }

    this.selectedFiles.imageInfo = croppedFile;
    reader.onload = (e: any) => {
      this.selectedFiles.imageUrl = e.target.result;
      if (this.eventForm.value && this.eventForm.value.event_banner) {
        const oldImage = JSON.parse(JSON.stringify(this.eventForm.value.event_banner));
        if (oldImage) {
          this.eventForm.patchValue({
            eventOldBanner: oldImage,
            event_banner: ''
          });

        }
        this.eventForm.patchValue({ event_banner: '' });
      }
    };
    reader.readAsDataURL(croppedFile);
    this.imageCropModal.hide();
  }

  private dataURItoBlob(dataURI: string): Blob {
    if (!dataURI || typeof dataURI !== 'string') {
      throw new Error('Invalid data URI');
    }

    // Split the URI into components
    const splitURI = dataURI.split(',');
    if (splitURI.length < 2) {
      throw new Error('Malformed data URI');
    }

    const mimeString = splitURI[0].match(/:(.*?);/)?.[1];
    if (!mimeString) {
      throw new Error('Could not extract MIME type');
    }

    const byteString = atob(splitURI[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  // Cropper
  onFileChangeForCrop(event: any) {
    const file = event.target.files[0];
    if (!file) {
      console.log('No file selected');
      return
    };
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      this.toastr.warning('Only JPG, JPEG, and PNG images are allowed', 'Invalid File');
      return;
    }
    if (file.size > 2097152) {
      this.toastr.warning('Maximum image size is 2MB', 'File Too Large');
      return;
    }
    this.imageChangedEvent = event; // Set for image cropper
    this.imageCropModal.show();
  }

  onFileChange(event: any) {
    console.log('File change event:', event);
    const file = event.target.files[0];
    if (!file) {
      console.log('No file selected');
      return
    };

    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      this.toastr.warning('Only JPG, JPEG, and PNG images are allowed', 'Invalid File');
      return;
    }

    if (file.size > 2097152) {
      this.toastr.warning('Maximum image size is 2MB', 'File Too Large');
      return;
    }

    this.currentFile = file; // Store the current file for reference
    // this.imageCropModal.show(); // Show the crop modal
    const reader = new FileReader();
    const [selectedFile] = event.target.files;
    this.selectedFiles.imageInfo = file;
    reader.onload = (e: any) => {
      this.selectedFiles.imageUrl = e.target.result;
      if (this.eventForm.value && this.eventForm.value.event_banner) {
        const oldImage = JSON.parse(JSON.stringify(this.eventForm.value.event_banner));
        if (oldImage) {
          this.eventForm.value.eventOldBanner = oldImage;
        }
        this.eventForm.value.event_banner = '';
      }
    };
    reader.readAsDataURL(selectedFile);
  }
  // Cropper Methods functionality -----ENDs HERE-----



  // onFileChange(event: any) {
  //   const fileData = event.target.files[0];
  //   if (!fileData.name.match(/\.(jpg|jpeg|png)$/)) {
  //     this.toastr.warning(
  //       'You can upload only jpg, jpeg, png, gif image.',
  //       'Warning'
  //     );
  //     return false;
  //   } else if (event.target.files && event.target.files.length) {
  //     this.selectedFiles.imageInfo = event.target.files[0];
  //     const reader = new FileReader(); // File Preview
  //     const [file] = event.target.files;
  //     reader.onload = (e: any) => {
  //       this.selectedFiles.imageUrl = e.target.result;
  //       if (this.eventForm.value && this.eventForm.value.event_banner) {
  //         const oldImage = JSON.parse(JSON.stringify(this.eventForm.value.event_banner));
  //         if (oldImage) {
  //           this.eventForm.value.eventOldBanner = oldImage;
  //         }
  //         this.eventForm.value.event_banner = '';
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  //   return;
  // }















  openDeleteModal(event: number): void {
    this.currentEvent = event
    this.deleteEventModal.show()
  }

  confirmDelete(): void {
    this.eventService.deleteEvent(this.currentEvent).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.getEvents();
          this.closeModel();
          this.toastr.success(response.message, 'Success!')
        } else {
          this.toastr.error(response.message, 'Error!')
        }
      },
      error: (err) => {
        this.toastr.error(err, 'Error!')
      }
    });
  }

  addUpdateEvent(changeStatus?: any): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }
    let eventPostData: any = Object.assign({}, this.eventForm.value)
    let formData: any = new FormData();
    Object.keys(eventPostData).map((key: any) => {
      formData.append(key, eventPostData[key])
    })
    if (this.selectedFiles.imageUrl) {
      formData.append("event_banner", this.selectedFiles.imageInfo);
    }
    if (changeStatus) {
      formData = changeStatus;
    }
    this.eventService.saveUpdateEvent(formData).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.getEvents();
          if (!changeStatus) {
            this.closeModel();
          }
          this.toastr.success(response.message, 'Success!')
        } else {
          this.toastr.error(response.message, 'Error!')
        }
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error!')
      }
    });
  }

  toggleStatus(index: number, event: any): void {
    const updatedStatus = event.is_active === 1 ? 0 : 1;
    this.eventService.statusUpdate({
      id: event.id,
      is_active: updatedStatus
    }).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.eventsList[index].is_active = updatedStatus;
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

  closeModel() {
    this.showAddEditEventsModal.hide();
    this.deleteEventModal.hide();
    this.selectedFiles = new selectedFiles();
    this.initForm();
  }

}
