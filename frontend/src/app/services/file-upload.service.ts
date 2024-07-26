import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadResponse } from '../models/file-upload-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private uploadUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<FileUploadResponse>(this.uploadUrl, formData);
  }
}
