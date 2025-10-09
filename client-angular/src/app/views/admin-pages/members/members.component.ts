import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedUiModule, UsersService } from '../../../shared-ui';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

class selectedFiles {
  imageInfo: any = [];
  imageUrl: any = '';
};
@Component({
  selector: 'app-members',
  standalone: true,
  imports: [
    SharedUiModule,
    ImageCropperComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent {

  membersList: any[] = [];
  selectedUser: any = null;
  membersForm: any = new FormGroup({});
  currentMember: any = [];
  imageSrc: string = 'assets/dummy.jpg';
  selectedFiles: selectedFiles = new selectedFiles();
  viewMemberData: any;
  currentPage = 1;
  itemsPerPage = 6;
  isLoading = false;
  totalItems: number = 0;
  searchmember: string = ''
  private searchSubject = new Subject<string>();
  private subscriptions = new Subscription();


  // Image Cropper
  currentFile: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isCropping: boolean = false;

  // Image Cropper Modal
  @ViewChild('imageCropModal', { static: false })
  public imageCropModal!: ModalDirective;

  @ViewChild('showAddEditMembersModal', { static: false })
  public showAddEditMembersModal: any = ModalDirective;

  @ViewChild('showViewMembersInfoModal', { static: false })
  public showViewMembersInfoModal: any = ModalDirective;

  @ViewChild('deleteMemberModal', { static: false })
  public deleteMemberModal: any = ModalDirective;

  constructor(
    private membersService: UsersService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.getMembers();
    this.initForm();
    const searchSub = this.searchSubject
      .pipe(debounceTime(500))
      .subscribe((value: string) => {
        this.searchmember = value.trim();
        this.getMembers();
      });
    this.subscriptions.add(searchSub);
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  initForm(): void {
    this.selectedFiles = new selectedFiles();
    this.membersForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      password: [''],
      mobile_number: ['', Validators.required],
      company_name: ['', Validators.required],
      state: ['', Validators.required],
      website: ['', Validators.required],
      factory_address: ['', Validators.required],
      office_address: ['', Validators.required],
      business_type: ['', Validators.required],
      expertise: ['', Validators.required],
      group_since: ['', Validators.required],
      short_bio: ['', Validators.required],
      verified: [1, Validators.required],
      role: ['', Validators.required],
      is_active: [1],
      photo: [''],
      memberOldBanner: ['']
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.membersForm.get(controlName);
    return control ? control.hasError(errorName) && (control.dirty || control.touched) : false;
  }

  openViewModal(member: any): void {
    this.viewMemberData = member;
    this.showViewMembersInfoModal.show();
  }
  onPageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.getMembers();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.getMembers();
  }

  getMembers(): void {
    this.isLoading = true;
    const params = {
      searchmembervalue: this.searchmember,
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    this.membersService.getUsersList(params).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const status = res?.status;
        const data = res?.data ?? [];
        console.log("res", res)
        if (status === 200) {
          this.membersList = data || [];
          this.totalItems = res.pagination.total || 0;
        } else {
          console.warn('Unexpected response status:', status);
          this.membersList = [];
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error fetching user member list:', err);
        this.membersList = [];
      }
    });
  }

  addEditModel(member?: any): void {
    this.initForm();
    this.imageSrc = 'assets/dummy.jpg';
    this.selectedFiles = { imageUrl: '', imageInfo: null };
    if (member) {
      const memberData = JSON.parse(JSON.stringify(member));
      delete memberData.password
      if (memberData.event_date) {
        memberData.event_date = new Date(memberData.event_date).toISOString().substring(0, 10);
      }
      if (memberData.photo) {
        this.imageSrc = memberData.photo;
      }
      this.membersForm.patchValue(memberData);
      this.membersForm.get('verified').setValue(memberData.verified ? 1 : 0);
      this.membersForm.get('is_active').setValue(memberData.is_active.toString());
    }
    this.showAddEditMembersModal.show();
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
      if (this.membersForm.value && this.membersForm.value.photo) {
        const oldImage = JSON.parse(JSON.stringify(this.membersForm.value.photo));
        if (oldImage) {
          this.membersForm.patchValue({
            memberOldBanner: oldImage,
            photo: ''
          });
        }
        this.membersForm.patchValue({ photo: '' });
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
    this.imageCropModal.show(); // Show the crop modal
    const reader = new FileReader();
    const [selectedFile] = event.target.files;
    reader.onload = (e: any) => {
      this.selectedFiles.imageUrl = e.target.result;
      const currentPhoto = this.membersForm.get('photo').value;
      if (currentPhoto) {
        this.membersForm.patchValue({
          memberOldBanner: currentPhoto,
          photo: ''
        });
      }
    };
    reader.readAsDataURL(selectedFile);
  }
  // Cropper Methods functionality -----ENDs HERE-----

  // onFileChange(event: any) {
  //   const fileData = event.target.files[0];
  //   if (!fileData?.name.match(/\.(jpg|jpeg|png)$/i)) {
  //     this.toastr.warning('You can upload only jpg, jpeg, png image.', 'Warning');
  //     return false;
  //   }
  //   if (event.target.files && event.target.files.length) {
  //     this.selectedFiles.imageInfo = event.target.files[0];
  //     const reader = new FileReader();
  //     const [file] = event.target.files;

  //     reader.onload = (e: any) => {
  //       this.selectedFiles.imageUrl = e.target.result;
  //       const currentPhoto = this.membersForm.get('photo').value;
  //       if (currentPhoto) {
  //         this.membersForm.patchValue({
  //           memberOldBanner: currentPhoto,
  //           photo: ''
  //         });
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  //   return;
  // }

  profileImageView() {
    if (this.selectedFiles.imageUrl) {
      return this.selectedFiles.imageUrl;
    } else if (this.membersForm?.value?.photo) {
      return this.membersForm?.value?.photo;
    } else {
      return this.imageSrc;
    }
  }

  deleteImg() {
    this.selectedFiles.imageUrl = '';
    this.selectedFiles.imageInfo = [];
    const oldImage = JSON.parse(JSON.stringify(this.membersForm.value.photo));
    if (oldImage) {
      this.membersForm.value.memberOldBanner = oldImage;
    }
    this.membersForm.value.photo = '';
  }

  addUpdateMember(changeStatus?: any): void {
    if (this.membersForm.invalid) {
      this.membersForm.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    const formValues = this.membersForm.getRawValue(); // Use getRawValue() instead of value
    if (!formValues.password) {
      delete formValues.password;
    }
    Object.keys(formValues).map((key: any) => {
      formData.append(key, formValues[key])
    })
    if (this.selectedFiles.imageUrl) {
      formData.append("photo", this.selectedFiles.imageInfo);
    }
    this.membersService.saveMemberInfo(formData).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.initForm();
          this.imageSrc = 'assets/dummy.jpg';
          this.getMembers();
          if (!changeStatus) {
            this.closeModel();
          }
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

  openUserModal(user: any): void {
    this.selectedUser = user;
    this.showViewMembersInfoModal.show();
  }

  toggleStatus(index: number, member: any): void {
    member.verified = member.verified === 1 ? 0 : 1;
    this.membersService.statusUpdate(member).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.membersList[index].verified = member.verified;
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

  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }

  deleteMember(member: number): void {
    this.currentMember = member;
    this.deleteMemberModal.show();
  }

  confirmDelete(): void {
    this.membersService.deleteUser(this.currentMember).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.getMembers();
          this.closeModel();
          this.toastr.success(response.message, 'Success!')
        } else {
          this.toastr.error(response.message, 'Error!')
        }
      },
      error: (response: any) => {
        this.toastr.error(response, 'Error!')
      }
    });
  }

  closeModel() {
    this.showAddEditMembersModal.hide();
    this.showViewMembersInfoModal.hide();
    this.deleteMemberModal.hide();
    this.selectedFiles = new selectedFiles();
    this.initForm();
  }

}
