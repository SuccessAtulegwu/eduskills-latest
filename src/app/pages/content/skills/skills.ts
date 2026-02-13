import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountTypeOption, AccountTypeSelectorComponent } from '../../../components/account-type-selector/account-type-selector.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeader } from '../../../components/page-header/page-header';
import { SkillModel, RecommendationModel, ProficiencyLevel } from '../../../models/model';
import { Subscription } from 'rxjs';
import { SkillService } from '../../../services/skill.service';
import { CategoriesService } from '../../../services/categories.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-skills',
  imports: [CommonModule, FormsModule, AccountTypeSelectorComponent, PageHeader],
  templateUrl:'./skills.html',
  styleUrl: './skills.scss',
})
export class Skills implements OnInit, OnDestroy {
  // Skills component with thumbnail support
  // Skills data
  skills: SkillModel[] = [];
  filteredSkills: SkillModel[] = [];
  isLoading: boolean = true;

  // Recommendations data
  recommendations: RecommendationModel[] = [];
  showRecommendations: boolean = true;
  loadingRecommendations: boolean = false;

  // Filters
  selectedProficiency: string = 'all';

  // Modal state
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  editingSkill: SkillModel | null = null;

  // Form data
  newSkill = {
    skillName: '',
    category: '',
    proficiencyLevel: ProficiencyLevel.Beginner,
    level: 'Beginner',
    notes: ''
  };

  // Categories for dropdown
  categoryFormOptions: AccountTypeOption[] = [];
  loadingCategories: boolean = false;

  proficiencyOptions: AccountTypeOption[] = [
    { title: 'All Levels', value: 'all', description: 'Show all proficiency levels', icon: 'bi-star' },
    { title: 'Beginner', value: '0', description: 'Just starting out', icon: 'bi-star' },
    { title: 'Intermediate', value: '1', description: 'Some experience', icon: 'bi-star-half' },
    { title: 'Advanced', value: '2', description: 'Highly skilled', icon: 'bi-star-fill' },
    { title: 'Expert', value: '3', description: 'Master level', icon: 'bi-trophy-fill' }
  ];

  proficiencyFormOptions: AccountTypeOption[] = [
    { title: 'Beginner', value: 0, description: 'Just starting out', icon: 'bi-star' },
    { title: 'Intermediate', value: 1, description: 'Some experience', icon: 'bi-star-half' },
    { title: 'Advanced', value: 2, description: 'Highly skilled', icon: 'bi-star-fill' },
    { title: 'Expert', value: 3, description: 'Master level', icon: 'bi-trophy-fill' }
  ];

  sortOptions: AccountTypeOption[] = [
    { title: 'Newest First', value: 'newest', description: 'Show newest skills first', icon: 'bi-sort-down' },
    { title: 'Oldest First', value: 'oldest', description: 'Show oldest skills first', icon: 'bi-sort-up' },
    { title: 'Name A-Z', value: 'name_asc', description: 'Sort by name (A-Z)', icon: 'bi-sort-alpha-down' },
    { title: 'Name Z-A', value: 'name_desc', description: 'Sort by name (Z-A)', icon: 'bi-sort-alpha-up' }
  ];

  selectedSort: string = 'newest';

  private subscriptions: Subscription[] = [];

  constructor(
    private skillService: SkillService,
    private categoriesService: CategoriesService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadSkills();
    this.loadRecommendations();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Load skills from API
   */
  loadSkills(): void {
    this.isLoading = true;
    const sub = this.skillService.skills$.subscribe({
      next: (skills) => {
        this.skills = skills;
        this.filteredSkills = skills;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading skills:', error);
        this.isLoading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  /**
   * Load recommendations
   */
  loadRecommendations(): void {
    if (this.showRecommendations) {
      this.loadingRecommendations = true;
      this.skillService.getRecommendations(20).subscribe({
        next: (recommendations) => {
          this.recommendations = recommendations;
          this.loadingRecommendations = false;
        },
        error: (error: any) => {
          console.error('Error loading recommendations:', error);
          this.loadingRecommendations = false;
        }
      });
    }
  }

  /**
   * Load categories from API
   */
  loadCategories(): void {
    this.loadingCategories = true;
    this.categoriesService.getCategories().subscribe({
      next: (response: any) => {
        // Handle different response formats
        let categoriesData = response;
        if (response && !Array.isArray(response)) {
          if (Array.isArray(response.data)) categoriesData = response.data;
          else if (Array.isArray(response.result)) categoriesData = response.result;
          else if (Array.isArray(response.items)) categoriesData = response.items;
          else if (Array.isArray(response.value)) categoriesData = response.value;
        }

        if (Array.isArray(categoriesData)) {
          this.categoryFormOptions = categoriesData.map((cat: any) => ({
            title: cat.name || cat.Name,
            value: cat.name || cat.Name,
            description: cat.description || cat.Description || '',
            icon: 'bi-tag'
          }));
        }
        
        this.loadingCategories = false;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        this.loadingCategories = false;
        // Fallback categories
        this.categoryFormOptions = [
          { title: 'Programming', value: 'Programming', description: '', icon: 'bi-tag' },
          { title: 'Design', value: 'Design', description: '', icon: 'bi-tag' },
          { title: 'Business', value: 'Business', description: '', icon: 'bi-tag' },
          { title: 'Other', value: 'Other', description: '', icon: 'bi-tag' }
        ];
      }
    });
  }

  /**
   * Apply filters to skills
   */
  applyFilters(): void {
    let filtered = [...this.skills];

    // Proficiency filter
    if (this.selectedProficiency !== 'all') {
      const level = parseInt(this.selectedProficiency);
      filtered = filtered.filter(skill => skill.proficiencyLevelEnum === level);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (this.selectedSort) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name_asc':
          return a.skillName.localeCompare(b.skillName);
        case 'name_desc':
          return b.skillName.localeCompare(a.skillName);
        default:
          return 0;
      }
    });

    this.filteredSkills = filtered;
  }

  /**
   * Proficiency filter changed
   */
  onProficiencyChange(): void {
    this.applyFilters();
  }

  /**
   * Sort changed
   */
  onSearch(): void {
    this.applyFilters();
  }

  /**
   * Open add skill modal
   */
  openAddModal(): void {
    this.newSkill = {
      skillName: '',
      category: '',
      proficiencyLevel: ProficiencyLevel.Beginner,
      level: 'Beginner',
      notes: ''
    };
    this.showAddModal = true;
  }

  /**
   * Close add skill modal
   */
  closeAddModal(): void {
    this.showAddModal = false;
  }

  /**
   * Add new skill
   */
  addSkill(): void {
    if (!this.newSkill.skillName || !this.newSkill.category) {
      this.toastService.warning('Please fill in required fields');
      return;
    }

    this.skillService.createSkill(this.newSkill).subscribe({
      next: () => {
        this.toastService.success('Skill added successfully!');
        this.closeAddModal();
      },
      error: (error: any) => {
        const errorMessage = error?.message || 'Failed to create skill. Please try again.';
        this.toastService.error(errorMessage);
      }
    });
  }

  /**
   * Open edit skill modal
   */
  editSkill(skill: SkillModel): void {
    this.editingSkill = skill;
    this.newSkill = {
      skillName: skill.skillName,
      category: skill.category,
      proficiencyLevel: skill.proficiencyLevelEnum,
      level: skill.level,
      notes: skill.notes || ''
    };
    this.showEditModal = true;
  }

  /**
   * Close edit skill modal
   */
  closeEditModal(): void {
    this.showEditModal = false;
    this.editingSkill = null;
  }

  /**
   * Update skill
   */
  updateSkill(): void {
    if (!this.editingSkill) return;

    if (!this.newSkill.skillName || !this.newSkill.category) {
      this.toastService.warning('Please fill in required fields');
      return;
    }

    this.skillService.updateSkill(this.editingSkill.id, this.newSkill).subscribe({
      next: () => {
        this.toastService.success('Skill updated successfully!');
        this.closeEditModal();
      },
      error: (error: any) => {
        const errorMessage = error?.message || 'Failed to update skill. Please try again.';
        this.toastService.error(errorMessage);
      }
    });
  }

  /**
   * Delete skill
   */
  deleteSkill(skill: SkillModel): void {
    if (!confirm(`Are you sure you want to delete "${skill.skillName}"?`)) {
      return;
    }

    this.skillService.deleteSkill(skill.id).subscribe({
      next: () => {
        this.toastService.success('Skill deleted successfully!');
      },
      error: (error: any) => {
        const errorMessage = error?.message || 'Failed to delete skill. Please try again.';
        this.toastService.error(errorMessage);
      }
    });
  }

  /**
   * Open recommendation URL
   */
  openRecommendation(recommendation: RecommendationModel): void {
    if (recommendation.url) {
      window.open(recommendation.url, '_blank');
    }
  }

  /**
   * Update proficiency level in form
   */
  onProficiencyLevelSelect(level: number): void {
    this.newSkill.proficiencyLevel = level;
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    this.newSkill.level = levels[level] || 'Beginner';
  }

  /**
   * Category selected in form
   */
  onCategorySelect(category: string): void {
    this.newSkill.category = category;
  }
}
