import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-team-member',
  imports: [],
  templateUrl: './team-member.component.html',
  styleUrl: './team-member.component.css'
})
export class TeamMemberComponent {
  @Input() name!: string;
  @Input() image!: string;
  @Input() bio!: string;
}
