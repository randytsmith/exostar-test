import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FileUploadService } from '../../services/file-upload.service';
import { Logger } from '../../utils/logging.service';
import { FileUploadResponse } from '../../models/file-upload-response.model';
import { MatError } from '@angular/material/form-field';
import { SnackbarService } from '../../utils/snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { UserState } from '../../store/reducers/users.reducers';
import { loadUsers } from '../../store/actions/users.actions';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatError, MatProgressSpinnerModule],

  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  isLoading = false;
  error: string | null = null;
  isDragOver = false;

  constructor(
    private fileUploadService: FileUploadService,
    private logger: Logger,
    private snackbarService: SnackbarService,
    private store: Store<UserState>
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.error = 'Please select a file.';
      return;
    }

    this.isLoading = true;
    this.fileUploadService.uploadFile(this.selectedFile).subscribe({
      next: (response: FileUploadResponse) => {
        this.isLoading = false;
        this.logger.log('File uploaded successfully');
        this.snackbarService.showSnackbar(
          response.message,
          response.status === 'error' ? 'error' : 'success'
        );
        // If response is success get users
        if (response.status === 'success') {
          this.store.dispatch(loadUsers());
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.error?.message
          ? err.error?.message
          : 'File upload failed!';
        this.snackbarService.showSnackbar(errorMessage, 'error');
        this.logger.log(errorMessage);
      },
    });
  }
}
