import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService, JobModel } from '../job.service';
import { ButtonComponent } from '../../../../components/ui/button/button';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ButtonComponent],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details implements OnInit {
  job: JobModel | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.job = this.jobService.getJobById(id);
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
