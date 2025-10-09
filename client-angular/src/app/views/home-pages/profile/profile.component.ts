import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { GlobalService, JwtService, SharedUiModule, UsersService } from '../../../shared-ui';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { currentUser } from '../../../shared-ui/models/current-user'
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
class selectedFiles {
  imageInfo: any = [];
  imageUrl: any = '';
};
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedUiModule, ImageCropperComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent implements OnInit {

  usermember: currentUser = new currentUser;
  userMemberForm: any = new FormGroup({});
  selectedBannerFile: File | null = null;
  imageSrc: string = 'assets/dummy.jpg';
  selectedFiles: selectedFiles = new selectedFiles();

  currentFile: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isCropping: boolean = false;

  private objectUrls: string[] = [];

  @ViewChild('imageCropModal', { static: false })
  public imageCropModal!: ModalDirective;

  constructor(private jwtService: JwtService,
    private userServices: UsersService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private globalService: GlobalService,
    private router: Router,
  ) {
    this.currentform()
  }

  ngOnInit() {
    this.usermember = this.jwtService.getCurrentUser();
    let usermember: currentUser = JSON.parse(JSON.stringify(this.usermember));
    usermember.password = "";
    this.userMemberForm.patchValue(usermember)
  }

  currentform() {
    this.selectedFiles = new selectedFiles();
    this.userMemberForm = this.fb.group({
      name: ['John Doe', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: '',
      mobile_number: ['9876543210', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      company_name: ['Tech Solutions', [Validators.required, Validators.minLength(3)]],
      group_since: ['2015', [Validators.required, Validators.minLength(3)]],
      expertise: ['Software Development', [Validators.required, Validators.minLength(3)]],
      website: ['www.techsolutions.com', [Validators.required, Validators.minLength(3)]],
      business_type: ['IT Services', [Validators.required, Validators.minLength(3)]],
      short_bio: ['Experienced full-stack developer with expertise in modern frameworks.', [Validators.required, Validators.maxLength(100)]],
      factory_address: ['123 Tech Street, Silicon Valley', [Validators.required, Validators.maxLength(100)]],
      office_address: ['456 Business Road, New York', [Validators.required, Validators.maxLength(100)]],
      state: ['California', [Validators.required, Validators.minLength(2)]],
      verified: [1],
      role: ['admin'],
      gender: ['male', Validators.required],
      is_active: [1],
      id: [],
      photo: [''],
      memberOldBanner: ['']
    });
  }

  profileImageView() {
    if (this.selectedFiles.imageUrl) {
      return this.selectedFiles.imageUrl;
    } else if (this.userMemberForm?.value?.photo) {
      return this.userMemberForm?.value?.photo;
    } else {
      return this.imageSrc;
    }
  }

  deleteImg() {
    this.selectedFiles.imageUrl = '';
    this.selectedFiles.imageInfo = [];
    const oldImage = JSON.parse(JSON.stringify(this.userMemberForm.value.photo));
    if (oldImage) {
      this.userMemberForm.value.memberOldBanner = oldImage;
    }
    // this.userMemberForm.value.photo = '';
    this.userMemberForm.patchValue({ photo: '' });

  }






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
      if (this.userMemberForm.value && this.userMemberForm.value.photo) {
        const oldImage = JSON.parse(JSON.stringify(this.userMemberForm.value.photo));
        if (oldImage) {
          this.userMemberForm.patchValue({
            memberOldBanner: oldImage,
            photo: ''
          });

        }
        this.userMemberForm.patchValue({ photo: '' });
      }
    };
    reader.readAsDataURL(croppedFile);
    this.closeModal();
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
      if (this.userMemberForm.value && this.userMemberForm.value.photo) {
        const oldImage = JSON.parse(JSON.stringify(this.userMemberForm.value.photo));
        if (oldImage) {
          this.userMemberForm.patchValue({
            memberOldBanner: oldImage,
            photo: ''
          });

        }
        this.userMemberForm.patchValue({ photo: '' });

      }
    };
    reader.readAsDataURL(selectedFile);
  }

  updateProfile() {
    if (this.userMemberForm.invalid) {
      this.userMemberForm.markAllAsTouched();
      this.toastr.error('Please fill out all required fields correctly', 'Validation Error');
      return;
    }
    let userEditData = JSON.parse(JSON.stringify(this.userMemberForm.value));
    if (!userEditData.password) {
      delete userEditData.password;
    }
    const formData = new FormData();

    Object.keys(userEditData).map((key: any) => {
      formData.append(key, userEditData[key])
    })
    if (this.selectedFiles.imageUrl) {
      formData.append("photo", this.selectedFiles.imageInfo);
    }
    this.userServices.saveMemberInfo(formData).subscribe({
      next: (response) => {
        if (response.status == 200) {
          delete response.data.password;
          response.data.sesionStartTime = new Date();
          let userDetails: currentUser = response.data;
          userDetails.verified = Number(response.data.verified);
          userDetails.sub_plan_status = this.usermember.sub_plan_status
          this.toastr.success(response.message, 'Success!');;
          this.jwtService.saveCurrentUser(JSON.stringify(userDetails));
          this.globalService.sendActionChildToParent('hideModel');
          this.router.navigate(['/view-profile']);
          this.resetFormState();
        } else {
          this.toastr.error(response.message, 'Error');
        }
      },
      error: (error) => {
        console.error('Update error:', error);
        this.toastr.error(error.error?.message || 'Failed to update profile', 'Error!');
      }
    });
  }

  resetFormState() {
    // this.selectedFiles = { imageUrl: '', imageInfo: null };
    this.selectedFiles = new selectedFiles();

    this.imageSrc = 'assets/dummy.jpg'; // Reset to default image
  }

  closeModal() {
    this.imageCropModal.hide();
  }

}
