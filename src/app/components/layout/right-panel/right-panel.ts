import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right-panel',
  imports: [CommonModule],
  templateUrl: './right-panel.html',
  styleUrl: './right-panel.scss',
})
export class RightPanel {
  @Input() isOpen = false;
  @Output() panelClose = new EventEmitter<void>();

  trendingTopics: string[] = [
    'WebDev', 'Plumbing', 'Mathematics',
    'Carpentry', 'Programming', 'Design'
  ];

  suggestedCreators = [
    {
      name: 'Musa Sule',
      handle: 'musagadabs1@yahoo.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      initials: 'MS'
    },
    {
      name: 'Admin User',
      handle: 'admin@eduskillng.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
      initials: 'AU',
      bgColor: '#E0B0FF' // Light purple
    },
    {
      name: 'Amatullah Musa',
      handle: 'amatullah@yahoo.com',
      avatar: 'https://i.pravatar.cc/150?img=3',
      initials: 'AM'
    }
  ];

   trendingCreators = [
     {
      name: 'Amatullah Malik',
      handle: 'malik@yahoo.com',
      avatar: 'https://i.pravatar.cc/150?img=4',
      initials: 'AM',
       bgColor: '#E0B0FF'
    },
     {
      name: 'Mercy Abro',
      handle: 'mercy@yahoo.com',
      avatar: 'https://i.pravatar.cc/150?img=5',
      initials: 'MA'
    },
     {
      name: 'Blessing Uche',
      handle: 'blessing.uche@gmail.com',
      avatar: 'https://i.pravatar.cc/150?img=6',
      initials: 'BU'
    }
  ];
  closePanel(): void {
    this.panelClose.emit();
  }
}
