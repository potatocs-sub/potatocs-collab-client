import { Injectable, WritableSignal, effect, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CentralService } from "../../stores/central.service";

@Injectable({
	providedIn: "root",
})
export class SpacesService {
	spaceMembers: WritableSignal<any | null> = this.centralService.spaceMembers;
	userSpaceInfo: WritableSignal<any | null> = this.centralService.userSpaceInfo;

	constructor(private centralService: CentralService) {
		effect(() => {
			if (this.spaceMembers()) {
				console.log(this.spaceMembers());
			}
			if (this.userSpaceInfo()) {
				console.log(this.userSpaceInfo());
			}
		});
	}

	getSpaceMembers(spaceTime) {
		return this.centralService.getSpaceMembers(spaceTime);
	}

	deleteSpace(spaceTime) {
		return this.centralService.deleteSpace(spaceTime);
	}

	changeSpaceName(data) {
		return this.centralService.changeSpaceName(data);
	}

	changeSpaceBrief(data) {
		return this.centralService.changeSpaceBrief(data);
	}

	quitSpaceAdmin(data) {
		return this.centralService.quitSpaceAdmin(data);
	}

	addSpaceAdmin(data) {
		return this.centralService.addSpaceAdmin(data);
	}

	deleteSpaceMember(data) {
		return this.centralService.deleteSpaceMember(data);
	}

	searchSpaceMember(email) {
		return this.centralService.searchSpaceMember(email);
	}

	inviteSpaceMember(data) {
		return this.centralService.inviteSpaceMember(data);
	}
}
