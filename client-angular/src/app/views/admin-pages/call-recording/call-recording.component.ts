import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CallRecordingsService } from '../../../shared-ui/services/call-recordings.service';
import { SharedUiModule } from '../../../shared-ui';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface CallRecording {
	id: number;
	topic: string;
	recording_date: string;
	recording_description: string;
	recording_url: string;
	is_active: number;
}

const MAX_FILE_SIZE_BYTES = environment.audioFileSize;
const ALLOWED_AUDIO_TYPES = environment.audioFileTypes;

@Component({
	selector: 'app-call-recording',
	standalone: true,
	imports: [
		DatePipe,
		SharedUiModule,
	],
	templateUrl: './call-recording.component.html',
	styleUrl: './call-recording.component.scss'
})
export class CallRecordingComponent implements OnDestroy {
	callRecordingsList: CallRecording[] = [];
	selectedCallRecording: CallRecording | null = null;
	callRecordingForm: any;
	currentCallRecord: CallRecording | null = null;
	existingFileUrl: string | null = null;
	selectedFile: File | null = null;
	fileError: string | boolean = false;
	isSubmitting: boolean = false;
	viewAudioData: any = null;
	environment = environment;
	currentPage = 1;
	itemsPerPage = 4;
	totalItems: number = 0;
	private subscriptions: Subscription[] = [];
	searchcallrecording: any = ''
	private searchSubject = new Subject<string>();
	private subscriptionss = new Subscription();

	@ViewChild('showAddEditCallRecordingModal', { static: false })
	public showAddEditCallRecordingModal!: ModalDirective;

	@ViewChild('deleteCallRecordingModal', { static: false })
	public deleteCallRecordingModal!: ModalDirective;

	@ViewChild('viewCallRecordingModal', { static: false })
	public viewCallRecordingModal!: ModalDirective;

	constructor(
		private spinner: NgxSpinnerService,
		private toastr: ToastrService,
		private callRecordingsService: CallRecordingsService,
		private fb: FormBuilder
	) { }

	ngOnInit() {
		this.getAllCallRecordings();
		this.initForm();
		const searchSub = this.searchSubject
			.pipe(debounceTime(500))
			.subscribe((value: string) => {
				this.searchcallrecording = value.trim();
				this.getAllCallRecordings();
			});
		this.subscriptionss.add(searchSub);
	}

	onSearchChange(value: string): void {
		this.searchSubject.next(value);
	}

	onPageChange(event: { page: number }): void {
		this.currentPage = event.page;
		this.getAllCallRecordings();
	}

	onItemsPerPageChange(): void {
		this.currentPage = 1;
		this.getAllCallRecordings();
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sub => sub.unsubscribe());
		this.subscriptionss.unsubscribe();
	}

	initForm(): void {
		this.callRecordingForm = this.fb.group({
			id: [''],
			topic: ['', Validators.required],
			recording_date: ['', Validators.required],
			recording_description: ['', Validators.required],
			recording_url: ['']
		});
	}

	getAllCallRecordings() {
		this.spinner.show();
		const params = {
			searchCallRecording: this.searchcallrecording,
			page: this.currentPage,
			limit: this.itemsPerPage
		};
		const sub = this.callRecordingsService.getAllcallRecording(params).subscribe({
			next: (response) => {
				this.spinner.hide();
				const status = response?.status;
				const data = response?.data ?? [];
				const msg = response?.message;

				if (status === 200) {
					this.callRecordingsList = data;
					this.totalItems = response.pagination.total || 0;

				} else {
					console.warn('Unexpected response status:', status);
					this.callRecordingsList = [];
					this.toastr.error(msg || 'Unexpected response.', 'Failed to fetch call recordings!');
				}
			},
			error: (err) => {
				this.spinner.hide();
				console.error('Error fetching call recordings:', err);
				this.callRecordingsList = [];
				this.toastr.error('Something went wrong while fetching call recordings!', 'Error');
			}
		});
		this.subscriptions.push(sub);
	}

	addEditRecording(recording?: CallRecording) {
		// $('#recording_url').val();
		this.initForm();
		if (recording) {
			recording.recording_date = new Date(recording.recording_date).toISOString().substring(0, 10);
			this.callRecordingForm.patchValue(recording);
			this.existingFileUrl = recording.recording_url;
		} else {
			this.existingFileUrl = null;
		}
		this.selectedFile = null;
		this.fileError = false;
		this.showAddEditCallRecordingModal.show();
	}

	onFileSelected(event: any): void {
		const file: File = event.target.files[0];
		// this.fileError = false;
		// if (!file) {
		//   this.selectedFile = null;
		//   return;
		// }
		// if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
		//   this.selectedFile = null;
		//   this.fileError = 'Only MP3 and WAV audio files are allowed';
		//   return;
		// }
		// if (file.size > MAX_FILE_SIZE_BYTES) {
		//   this.selectedFile = null;
		//   this.fileError = `File too large it will not save (max ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB)`;
		//   return;
		// }
		this.selectedFile = file;
	}

	addOrUpdateCallRecording() {
		if (this.callRecordingForm.invalid) {
			this.callRecordingForm.markAllAsTouched();
			return;
		}

		if (!this.callRecordingForm.value.id && !this.selectedFile) {
			this.fileError = true;
			return;
		}

		this.isSubmitting = true;
		let formData: any = new FormData();
		let callRecodingData: any = Object.assign({}, this.callRecordingForm.value)
		Object.keys(callRecodingData).map((key: any) => {
			formData.append(key, callRecodingData[key])
		})
		// Only append file if selected
		if (this.selectedFile) {
			formData.append('recording_url', this.selectedFile);
		}
		const sub = this.callRecordingsService.saveCallRecording(formData).subscribe({
			next: (res: any) => {
				this.isSubmitting = false;
				if (res.status === 200) {
					this.toastr.success('Call recording saved successfully!');
					this.showAddEditCallRecordingModal.hide();
					this.getAllCallRecordings();
					this.isSubmitting = false;
				} else {
					this.toastr.error(res.message, 'Error!');
				}
			},
			error: (err: any) => {
				this.toastr.error(err.message || 'Failed to save call recording');
				this.isSubmitting = false;
			},
		});
		this.subscriptions.push(sub);
	}

	openViewModal(audio: any): void {
		this.viewAudioData = audio;
		this.viewCallRecordingModal.show();
	}

	toggleStatus(index: number, member: CallRecording): void {
		const isActive = member.is_active === 1 ? 0 : 1;
		const sub = this.callRecordingsService.statusUpdate({
			id: member.id,
			is_active: isActive
		}).subscribe({
			next: (response: any) => {
				if (response.status === 200) {
					this.callRecordingsList[index].is_active = isActive;
					this.toastr.success(response.message, 'Success!');
				} else {
					this.toastr.error(response.message, 'Error!');
					this.callRecordingsList[index].is_active = member.is_active;
				}
			},
			error: (err: any) => {
				this.toastr.error(err.message || 'An error occurred', 'Error!');
				this.callRecordingsList[index].is_active = member.is_active;
			}
		});
		this.subscriptions.push(sub);
	}

	deleteModel(item: CallRecording): void {
		this.currentCallRecord = item;
		this.deleteCallRecordingModal.show();
	}

	deleteRecording() {
		const sub = this.callRecordingsService.deleteCallRecording(this.currentCallRecord).subscribe({
			next: (response: any) => {
				if (response.status === 200) {
					this.toastr.success(response.message, 'Call recording deleted successfully!');
					this.getAllCallRecordings();
					this.deleteCallRecordingModal.hide();
					this.spinner.hide();
				} else {
					this.toastr.error(response.message, 'Error!');
				}
			},
			error: (error: any) => {
				this.toastr.error('Failed to delete call recording!');
				this.deleteCallRecordingModal.hide();
				this.spinner.hide();
			}
		});
		this.subscriptions.push(sub);
	}

	closeModel() {
		this.showAddEditCallRecordingModal.hide();
		this.deleteCallRecordingModal.hide();
		this.viewCallRecordingModal.hide();
		this.callRecordingForm.reset();
		this.initForm();
	}

}
