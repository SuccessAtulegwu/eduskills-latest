import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { AccountTypeSelectorComponent, AccountTypeOption } from '../../../components/account-type-selector/account-type-selector.component';
import { InputComponent } from '../../../components/ui/input/input';
import { TextareaComponent } from '../../../components/ui/textarea/textarea';

@Component({
  selector: 'app-uploads',
  standalone: true,
  imports: [CommonModule, FormsModule, AccountTypeSelectorComponent, InputComponent, TextareaComponent],
  templateUrl: './uploads.html',
  styleUrl: './uploads.scss',
})
export class Uploads {
  videoTitle: string = '';
  description: string = '';
  category: string = '';
  subCategory: string = '';
  selectedFileName: string = 'No file chosen';
  isUploading: boolean = false;

  categoryOptions: AccountTypeOption[] = [
    { title: 'Mathematics', value: 'math', description: 'Algebra, Geometry, Calculus', icon: 'bi bi-calculator' },
    { title: 'Science', value: 'science', description: 'Physics, Chemistry, Biology', icon: 'bi bi-flask' },
    { title: 'Coding', value: 'coding', description: 'Web Dev, Python, Java', icon: 'bi bi-code-slash' }
  ];

  constructor(private location: Location) { }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
    }
  }

  onCancel() {
    this.location.back();
  }

  onUpload() {
    if (this.isUploading) return;

    console.log('Upload triggered');
    this.isUploading = true;

    // Simulate upload process
    setTimeout(() => {
      this.isUploading = false;
      alert('Video uploaded successfully!');
      this.location.back();
    }, 3000);
  }
}
