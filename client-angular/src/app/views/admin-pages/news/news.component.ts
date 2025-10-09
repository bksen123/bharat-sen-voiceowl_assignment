import { Component, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../environments/environment';
import { NewsService, SharedUiModule } from '../../../shared-ui';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

class selectedFiles {
  imageInfo: any = [];
  imageUrl: any = '';
};
@Component({
  selector: 'app-news',
  standalone: true,
  imports: [SharedUiModule, ImageCropperComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent {

  selectedImageFile: File | null = null;
  selectedImageUrl: string | null = null;
  environment = environment;
  newsList: any[] = [];
  currentNews: any = [];
  newsForm!: FormGroup;
  selectedNews: any = null;
  selectedNewsIdToDelete: any;
  selectedFiles: selectedFiles = new selectedFiles();
  imageSrc: string = 'assets/dummy.jpg';
  selectedFile: File | null = null;
  searchnews: string = '';
  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();
  currentPage = 1;
  itemsPerPage = 8;
  totalItems: number = 0;

  // Image Cropper
  currentFile: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isCropping: boolean = false;

  // Image Cropper Modal
  @ViewChild('imageCropModal', { static: false })
  public imageCropModal!: ModalDirective;


  @ViewChild('showAddEditNewsModal', { static: false })
  public showAddEditNewsModal: any = ModalDirective;
  @ViewChild('deleteNewsModal', { static: false })
  public deleteNewsModal: any = ModalDirective;

  constructor(
    private spinner: NgxSpinnerService,
    private newsServices: NewsService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getNewsList();
    this.initForm();
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
  onPageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.getNewsList();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.getNewsList();
  }

  initForm(): void {
    this.selectedFiles = new selectedFiles();
    this.newsForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      news_date: ['', Validators.required],
      category: ['', Validators.required],
      news_banner: [''],
      newsOldBanner: ['']
    });
  }

  getNewsList(): void {
    this.spinner.show();
    const params = {
      searchNewsvalue: this.searchnews,
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    this.newsServices.getAll(params).subscribe({
      next: ({ status, message, data = [], pagination }) => {
        this.spinner.hide();
        if (status === 200) {
          this.newsList = data || [];
          this.totalItems = pagination.total || 0;

          // this.toastr.success(response.message, 'Success!')
        } else {
          this.toastr.error(message, 'Error!')
          this.newsList = [];
        }
      },
      error: (error: any) => {
        this.toastr.error(error, 'Error!')
        this.spinner.hide();
        this.newsList = [];
      }
    });
  }

  get f() {
    return this.newsForm.controls;
  }

  addEditNews(news?: any): void {
    this.initForm()
    if (news) {
      let patchedData = { ...news };
      patchedData.news_date = new Date(patchedData.news_date).toISOString().substring(0, 10);
      if (news.news_banner) {
        this.imageSrc = news.news_banner;
      } else {
        this.imageSrc = 'assets/dummy.jpg';
      }
      this.newsForm.patchValue(patchedData);
    } else {
      this.imageSrc = 'assets/dummy.jpg';
    }
    this.showAddEditNewsModal.show();
  }

  toggleStatus(index: number, news: any): void {
    const updatedStatus = news.is_active === 1 ? 0 : 1;
    this.newsServices.statusUpdate({
      id: news.id,
      is_active: updatedStatus
    }).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.newsList[index].is_active = updatedStatus;
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
      if (this.newsForm.value && this.newsForm.value.news_banner) {
        const oldImage = JSON.parse(JSON.stringify(this.newsForm.value.news_banner));
        if (oldImage) {
          this.newsForm.patchValue({
            newsOldBanner: oldImage,
            news_banner: ''
          });
        }
        this.newsForm.patchValue({ news_banner: '' });
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

    // if (file.size > 2097152) {
    //   this.toastr.warning('Maximum image size is 2MB', 'File Too Large');
    //   return;
    // }

    this.currentFile = file; // Store the current file for reference
    // this.imageCropModal.show(); // Show the crop modal
    const reader = new FileReader();
    const [selectedFile] = event.target.files;
    this.selectedFiles.imageInfo = file;
    reader.onload = (e: any) => {
      this.selectedFiles.imageUrl = e.target.result;
      if (this.newsForm.value && this.newsForm.value.news_banner) {
        const oldImage = JSON.parse(JSON.stringify(this.newsForm.value.news_banner));
        if (oldImage) {
          this.newsForm.value.newsOldBanner = oldImage;
        }
        this.newsForm.value.news_banner = '';
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
  //       if (this.newsForm.value && this.newsForm.value.news_banner) {
  //         const oldImage = JSON.parse(JSON.stringify(this.newsForm.value.news_banner));
  //         if (oldImage) {
  //           this.newsForm.value.newsOldBanner = oldImage;
  //         }
  //         this.newsForm.value.news_banner = '';
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  //   return;
  // }





  addOrUpdateNews(changeStatus?: any): void {
    if (!changeStatus && this.newsForm.invalid) {
      this.newsForm.markAllAsTouched();
      return;
    }
    let newsPostData: any = Object.assign({}, this.newsForm.value)
    let formData: any = new FormData();
    Object.keys(newsPostData).map((key: any) => {
      formData.append(key, newsPostData[key])
    })
    if (this.selectedFiles.imageUrl) {
      formData.append("news_banner", this.selectedFiles.imageInfo);
    }
    if (changeStatus) {
      formData = changeStatus;
    }
    this.newsServices.saveNewsInfo(formData).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.getNewsList();
          if (!changeStatus) {
            this.closeModal();
          }
          this.toastr.success(response.message, 'Success!')
        } else {
          this.toastr.error(response.message, 'Error!')
        }
      },
      error: (err) => {
        this.toastr.error(err.message, 'Error');
      }
    });
  }

  deleteImg() {
    this.selectedFiles.imageUrl = '';
    this.selectedFiles.imageInfo = [];
    const oldImage = JSON.parse(JSON.stringify(this.newsForm.value.news_banner));
    if (oldImage) {
      this.newsForm.value.newsOldBanner = oldImage;
    }
    this.newsForm.value.news_banner = '';
  }

  profileImageView() {
    if (this.selectedFiles.imageUrl) {
      return this.selectedFiles.imageUrl;
    } else if (this.newsForm?.value?.event_banner) {
      return this.newsForm?.value?.event_banner;
    } else {
      return this.imageSrc;
    }
  }

  openDeleteModal(event: number): void {
    this.currentNews = event
    this.deleteNewsModal.show()
  }

  confirmDelete(): void {
    this.newsServices.deleteNews(this.currentNews).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.getNewsList();
          this.closeModal();
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  closeModal(): void {
    this.showAddEditNewsModal.hide();
    this.deleteNewsModal.hide();
    this.selectedFiles = new selectedFiles();
  }

}

