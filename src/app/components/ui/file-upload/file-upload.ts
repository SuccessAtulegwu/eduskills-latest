import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() accept: string = '*/*';  // e.g., 'image/*', 'video/*', '.pdf,.doc'
  @Input() multiple: boolean = false;
  @Input() maxSize: number = 10; // MB
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() helpText: string = '';
  @Input() errorMessage: string = '';
  @Input() showPreview: boolean = true;
  @Input() uploadType: 'image' | 'video' | 'file' = 'file';
  
  @Output() filesChanged = new EventEmitter<File[]>();
  
  files: File[] = [];
  isDragOver: boolean = false;
  previews: string[] = [];
  
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    if (value) {
      this.files = Array.isArray(value) ? value : [value];
      this.generatePreviews();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    if (!this.disabled && event.dataTransfer?.files) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  private handleFiles(newFiles: File[]): void {
    const validFiles = newFiles.filter(file => this.validateFile(file));
    
    if (this.multiple) {
      this.files = [...this.files, ...validFiles];
    } else {
      this.files = validFiles.slice(0, 1);
    }
    
    this.generatePreviews();
    this.onChange(this.multiple ? this.files : this.files[0]);
    this.filesChanged.emit(this.files);
    this.onTouched();
  }

  private validateFile(file: File): boolean {
    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > this.maxSize) {
      this.errorMessage = `File size exceeds ${this.maxSize}MB`;
      return false;
    }
    return true;
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
    this.previews.splice(index, 1);
    this.onChange(this.multiple ? this.files : this.files[0]);
    this.filesChanged.emit(this.files);
  }

  private generatePreviews(): void {
    this.previews = [];
    this.files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previews.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        this.previews.push('video-placeholder');
      } else {
        this.previews.push('file-placeholder');
      }
    });
  }

  get acceptText(): string {
    if (this.uploadType === 'image') return 'image/*';
    if (this.uploadType === 'video') return 'video/*';
    return this.accept;
  }

  get iconClass(): string {
    if (this.uploadType === 'image') return 'bi-image';
    if (this.uploadType === 'video') return 'bi-camera-video';
    return 'bi-file-earmark-arrow-up';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
