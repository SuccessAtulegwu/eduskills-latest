import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputComponent } from '../../../components/ui/input/input';
import { TextareaComponent } from '../../../components/ui/textarea/textarea';
import { ButtonComponent } from '../../../components/ui/button/button';
import { User } from '../../../models/model';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    TextareaComponent,
    ButtonComponent
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  profileForm: FormGroup;
  selectedFileName: string = 'No file chosen';
  currentUser: User | null = null;
  fullname: string = '';
  initials: string = '';

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: 'soundblaz21@gmail.com', disabled: true }, [Validators.required, Validators.email]],
      bio: ['']
    });
  }


  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser) {
        this.fullname = this.currentUser?.firstname + ' ' + this.currentUser?.lastname;
        this.profileForm.patchValue({ 'firstName': this.currentUser.firstname })
        this.profileForm.patchValue({ 'lastName': this.currentUser.lastname })
        this.profileForm.patchValue({ 'email': this.currentUser.email })
        this.initials = this.getInitials(this.fullname);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
    }
  }

  saveChanges() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
    }
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }

  getInitials(fullname: string): string {
    if (!fullname || typeof fullname !== 'string') return '';
    const names = fullname.trim().replace(/\s+/g, ' ').split(' ');
    const validNames = names.filter(name => name.length > 0);
    if (validNames.length === 0) return '';
    const first = validNames[0].charAt(0).toUpperCase();
    const last = validNames.length > 1
      ? validNames[validNames.length - 1].charAt(0).toUpperCase()
      : '';

    return first + last;
  }
}
