import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-space-add-status-dialog",
	standalone: true,
	imports: [],
	templateUrl: "./space-add-status-dialog.component.html",
	styleUrl: "./space-add-status-dialog.component.scss",
})
export class SpaceAddStatusDialogComponent implements OnInit {
	ngOnInit(): void {
		console.log("스크럼보드 리스트 : ");
	}
}
