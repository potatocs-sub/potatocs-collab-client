import { Component, Input, OnInit } from "@angular/core";
@Component({
	selector: "app-scrumboard-list",
	standalone: true,
	imports: [],
	templateUrl: "./scrumboard-list.component.html",
	styleUrl: "./scrumboard-list.component.scss",
})
export class ScrumboardListComponent {
	@Input() spaceInfo: any;
	@Input() memberInSpace: any;
}
