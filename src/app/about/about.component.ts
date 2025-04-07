import { Component } from '@angular/core';
import { TeamMemberComponent } from '../team-member/team-member.component';

@Component({
  selector: 'app-about',
  imports: [TeamMemberComponent],
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  SKHimagePath = 'assets/images/SKHpic.jpg';
}
