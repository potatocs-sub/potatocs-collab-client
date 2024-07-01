import { Injectable, WritableSignal, signal } from "@angular/core";
import { SpacesService } from "../../services/spaces/spaces.service";
@Injectable({
	providedIn: "root",
})
export class ScrumboardStorageService {
	spaceMembers: WritableSignal<any> = this.spacesService.spaceMembers;

	scrum: WritableSignal<any | null> = signal<any | null>(null);

	constructor(private spacesService: SpacesService) {}

	updateScrumBoard(scrums: any) {
		const spaceMember = this.spaceMembers[0].memberObjects;
		const my_scrum = scrums.scrum;

		//scrum.scrum.children.creator 가 서버에서 올때 id만 가지고있는데, 여기에 id,name,profile-image,isRetired의 값으로 바꿔치기해줌
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
