import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { GlobalService, SharedUiModule, UsersService } from '../../../shared-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SharedUiModule, NgIf],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  signupForm: FormGroup;
  showPassword: boolean = false;
  confirmPassword: boolean = false


  constructor(
    private userServices: UsersService,
    private fb: FormBuilder,
    private router: Router,
    private globalService: GlobalService,
    public toastr: ToastrService
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mobile_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
			gender:['male',[Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      // countryCode: ['+1', [Validators.required]],
      // phone: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      role: ['user'],
      is_active: [1]
    }, { validators: this.passwordsMatch });
  }
  ngOnInit() { }

  togglePasswordVisibility(checkPass: any) {
    if (checkPass === "password")
      this.showPassword = !this.showPassword;
    else if (checkPass === "confirmPassword")
      this.confirmPassword = !this.confirmPassword
  }
  passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  get passwordsDoNotMatch() {
    return this.signupForm.hasError('notMatching') &&
      this.signupForm.get('confirmPassword')?.touched;
  }
  get phoneInvalid() {
    return this.signupForm.controls['mobile_number'].invalid && this.signupForm.controls['mobile_number'].touched;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Signup Form Data:', this.signupForm.value);
      setTimeout(() => {
        alert('Signup Successful');
      }, 1000);
    }
  }

  signup() {
    if (this.signupForm.valid) {
      const formData = { ...this.signupForm.value };
      delete formData.confirmPassword;
      console.log(formData)
      this.userServices.saveUserInfo(formData).subscribe({
        next: (response) => {
          if (response.status == 200) {
            this.toastr.success(response.message, 'Success!');
            this.openAuthModal();
          } else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: (error) => {
          this.globalService.sendActionChildToParent('hideModel');
          this.toastr.error(error.message, 'Error!');
        }
      });
    } else {
      alert('Please fill out the form correctly.');
    }
  }

  openAuthModal() {
    this.globalService.sendActionChildToParent('hideModel');
    setTimeout(() => {
      this.globalService.sendActionChildToParent('signin');
    }, 1000);
  }
}
