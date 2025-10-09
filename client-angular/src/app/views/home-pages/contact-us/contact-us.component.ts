import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContactusService, SharedUiModule } from '../../../shared-ui';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [SharedUiModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  contactForm!: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
    business_name: FormControl<string>;
    message: FormControl<string>;
    // site_type: FormControl<string>;
    // enquiry_type: FormControl<string>;
  }>;
  submitted = false;

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private contactservice: ContactusService
  ) { }

  ngOnInit(): void {
    this.contactForm = new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(30)] }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(30)] }),
      phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)] }),
      business_name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(30)] }),
      message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(80)] }),
      // site_type: new FormControl('3', { nonNullable: true }),
      // enquiry_type: new FormControl('1', { nonNullable: true })
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.invalid) {
      return;
    }

    console.log('Form Data:', this.contactForm.value);
    if (this.contactForm.valid) {
      console.log('Sending contactForm Data:', this.contactForm.value);
      const formData = { ...this.contactForm.value };
      console.log(formData)
      this.contactservice.saveContactUsInfo(formData).subscribe({
        next: (response) => {
          console.log("response", response)
          if (response.status == 200) {
            this.toastr.success(response.message, 'Success!');
            this.contactForm.reset();
            this.submitted = false;

          } else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: (error) => {
          this.toastr.error(error.message, 'Error!');
        }
      });
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}