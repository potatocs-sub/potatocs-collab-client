import { Injectable, WritableSignal, signal } from "@angular/core";
import { CentralService } from "../../stores/central.service";

@Injectable({
	providedIn: "root",
})
export class ScrumboardStorageService {
	spaceMembers: WritableSignal<any> = this.centralService.spaceMembers;
	scrum: WritableSignal<any | null> = signal<any | null>(null);

	constructor(private centralService: CentralService) {}

	updateScrumBoard(scrums: any) {
		const spaceMember = this.spaceMembers()[0].memberObjects;
		const my_scrum = scrums.scrum;

		for (let scrum of my_scrum) {
			for (let scrumChild of scrum.children) {
				scrumChild.creator = scrumChild.creator.map((creator) => {
					return spaceMember.find((member) => member._id == creator);
				});
			}
		}
		this.scrum.set(scrums);
	}
}
