import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../../components/ui/input/input';
import { TextareaComponent } from '../../../../components/ui/textarea/textarea';
import { ButtonComponent } from '../../../../components/ui/button/button';
import { AccountTypeSelectorComponent, AccountTypeOption } from '../../../../components/account-type-selector/account-type-selector.component';
import { PageHeader } from '../../../../components/page-header/page-header';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    TextareaComponent,
    ButtonComponent,
    AccountTypeSelectorComponent,
    PageHeader
  ],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {
  // Form Data
  courseTitle: string = '';
  courseDescription: string = '';
  price: string = '';
  duration: string = '';

  selectedCategory: string = '';
  selectedLevel: string = '';
  selectedExamType: string = 'none';

  // File Upload
  selectedFileName: string = 'No file chosen';

  // Certification Settings
  enableCertification: boolean = false;
  selectedTemplate: string = 'default';
  passingScore: string = '';

  // Options
  categories: AccountTypeOption[] = [
    { title: 'Development', value: 'development', description: 'Tech & Code', icon: 'bi-code-slash' },
    { title: 'Design', value: 'design', description: 'UI/UX & Art', icon: 'bi-palette' },
    { title: 'Business', value: 'business', description: 'Finance', icon: 'bi-briefcase' },
  ];

  levels: AccountTypeOption[] = [
    { title: 'Beginner', value: 'beginner', description: 'For starters', icon: 'bi-1-circle' },
    { title: 'Intermediate', value: 'intermediate', description: 'Mid-level', icon: 'bi-2-circle' },
    { title: 'Advanced', value: 'advanced', description: 'Experts', icon: 'bi-3-circle' },
  ];

  examTypes: AccountTypeOption[] = [
    { title: 'None', value: 'none', description: 'No specific exam', icon: 'bi-x-circle' },
    { title: 'WAEC', value: 'waec', description: 'West African Exam', icon: 'bi-book' },
    { title: 'JAMB', value: 'jamb', description: 'Joint Admissions', icon: 'bi-journal-check' },
    { title: 'NECO', value: 'neco', description: 'National Exam', icon: 'bi-file-text' },
  ];

  certificateTemplates: AccountTypeOption[] = [
    { title: 'Use Default Template', value: 'default', description: 'Standard layout', icon: 'bi-file-earmark-text' },
    { title: 'Modern Dark', value: 'modern_dark', description: 'Dark theme', icon: 'bi-moon' },
    { title: 'Classic Gold', value: 'classic_gold', description: 'Elegant style', icon: 'bi-award' },
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

  onSubmit() {
    console.log('Form Submitted', {
      title: this.courseTitle,
      description: this.courseDescription,
      price: this.price,
      duration: this.duration,
      category: this.selectedCategory,
      level: this.selectedLevel,
      examType: this.selectedExamType,
      certification: this.enableCertification,
      template: this.selectedTemplate,
      passingScore: this.passingScore
    });
  }
}
