import { Component, Inject, inject, OnInit, ViewChild, WritableSignal } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { SpacesService } from "../../services/spaces/spaces.service";
import { DocumentsService } from "../../services/spaces/documents.service";
import { CommonService } from "../../services/common/common.service";
import { MaterialsModule } from "../../materials/materials.module";
import { SideNavService } from "../../stores/side-nav/side-nav.service";
import { DialogService } from "../../stores/dialog/dialog.service";
import { NavigationService } from "../../stores/navigation/navigation.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DialogSettingSpaceComponent } from "./dialogs/dialog-setting-space/dialog-setting-space.component";
import { DialogSpaceMemberComponent } from "./dialogs/dialog-space-member/dialog-space-member.component";
import { CalendarListComponent } from "./calendar-list/calendar-list.component";
import { CommonModule } from "@angular/common";
import { ScrumboardListComponent } from "./scrumboard-list/scrumboard-list.component";
import { MemberDataStorageService } from "../../stores/member-data-storage/member-data-storage.service";
@Component({
	selector: "app-spaces",
	standalone: true,
	imports: [MaterialsModule, CalendarListComponent, CommonModule, ScrumboardListComponent],
	templateUrl: "./spaces.component.html",
	styleUrl: "./spaces.component.scss",
})
export class SpacesComponent implements OnInit {
	basicProfile = "/assets/image/person.png";
	public spaceInfo;
	public memberInSpace;
	public adminInSpace;
	public spaceTime: string;

	spaceMembers: WritableSignal<any> = this.mdsService.member;
	constructor(
		public dialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute,
		private spacesService: SpacesService,
		private docService: DocumentsService,
		private commonService: CommonService,
		private mdsService: MemberDataStorageService
	) {}
	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.spaceTime = this.route.snapshot.params["spaceTime"];
			console.log(params);

			this.spacesService.getSpaceMembers(params["spaceTime"]).subscribe({
				next: (data: any) => {
					console.log("스페이스서비스");
					this.getMembers();
				},
				error: (err: any) => {
					console.log("spacesService error", err);
				},
			});

			this.docService.getMeetingList({ spaceId: this.spaceTime }).subscribe({
				next: (data: any) => {
					console.log(data);
				},
				error: (err: any) => {
					console.log(err);
				},
			});
		});
	}

	getMembers() {
		try {
			const data = this.spaceMembers();
			console.log(data);

			if (data.length == 0) {
				this.router.navigate(["collab"]);
			} else {
				this.spaceInfo = {
					_id: data[0]._id,
					displayName: data[0].displayName,
					displayBrief: data[0].displayBrief,
					spaceTime: data[0].spaceTime,
					isAdmin: data[0].isAdmin,
					memberObjects: data[0].memberObjects,
					docStatus: data[0].docStatus,
					labels: data[0].labels,
				};
				// console.log(this.spaceInfo);
				this.memberInSpace = data[0].memberObjects;
				this.adminInSpace = data[0].admins;

				this.memberInSpace.map((data) => this.commonService.checkArray(data, this.adminInSpace));
			}
		} catch (error) {
			console.error("An error occurred:", error);
			alert("An unexpected error occurred. Please try again later.");
		}
	}

	openSpaceOption(): void {
		const dialogRef = this.dialog.open(DialogSettingSpaceComponent, {
			// width: '600px',
			// height: '500px',
			data: {
				spaceInfo: this.spaceInfo,
				memberInSpace: this.memberInSpace,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log("The dialog setting was closed");
			if (result == null || result == "") {
			} else {
			}
		});
	}
	openSpaceMemeber(): void {
		console.log("openSpaceMemeber this.spaceTime : ", this.spaceTime);
		const dialogRef = this.dialog.open(DialogSpaceMemberComponent, {
			width: "600px",
			height: "300px",
			data: {
				spaceTime: this.spaceTime,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log("The dialog setting was closed");
			this.getMembers();
			if (result == null || result == "") {
			} else {
			}
		});
	}
}
