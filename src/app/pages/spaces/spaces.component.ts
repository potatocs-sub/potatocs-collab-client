import { Component, inject, OnInit, ViewChild, WritableSignal } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { SpacesService } from "../../services/spaces/spaces.service";
import { DocumentsService } from "../../services/spaces/documents.service";
import { CommonService } from "../../services/common/common.service";
import { MaterialsModule } from "../../materials/materials.module";

@Component({
	selector: "app-spaces",
	standalone: true,
	imports: [MaterialsModule],
	templateUrl: "./spaces.component.html",
	styleUrl: "./spaces.component.scss",
})
export class SpacesComponent implements OnInit {
	basicProfile = "/assets/image/person.png";
	public spaceInfo;
	public memberInSpace;
	public adminInSpace;
	public spaceTime: string;

	spaceMembers: WritableSignal<any> = this.spacesService.spaceMembers;
	constructor(
		public dialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute,
		private spacesService: SpacesService,
		private docService: DocumentsService,
		private commonService: CommonService
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
}
