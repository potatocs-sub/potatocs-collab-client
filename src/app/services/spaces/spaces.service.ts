import { Injectable, WritableSignal, effect, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ScrumboardStorageService } from "../../stores/scrumboard-storage/scrumboard-storage.service";
import { tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
@Injectable({
	providedIn: "root",
})
export class SpacesService {
	private baseUrl = environment.apiUrl;
	spaceMembers: WritableSignal<any | null> = signal<any | null>(null);
	//
	userSpaceInfo: WritableSignal<any | null> = signal<any | null>(null);

	constructor(private http: HttpClient, private scrumService: ScrumboardStorageService) {
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
		return this.http.get(this.baseUrl + "/collab/space/" + spaceTime).pipe(
			tap((res: any) => {
				this.spaceMembers.set(res.spaceMembers);
				console.log(res.scrumBoard);
				console.log(res.spaceDocs);
				console.log(res.spaceMembers);
				// this.mdsService.updateMembers(res.M);
				// this.scrumService.updateScrumBoard(res.scrumBoard);
				// this.ddsService.updateDocs(res.spaceDocs);
				return res.message;
			})
		);
	}

	deleteSpace(spaceTime) {
		console.log("delete space");
		return this.http.delete(this.baseUrl + "/collab/space/deleteSpace", { params: spaceTime });
	}

	changeSpaceName(data) {
		// { params: data }
		return this.http.put(this.baseUrl + "/collab/space/change-space-name", data);
	}

	changeSpaceBrief(data) {
		return this.http.put(this.baseUrl + "/collab/change-space-brief", data);
	}

	quitSpaceAdmin(data) {
		return this.http.put(this.baseUrl + "/collab/quit-space-admin", data);
	}

	addSpaceAdmin(data) {
		return this.http.put(this.baseUrl + "/collab/add-space-member", data);
	}

	deleteSpaceMember(data) {
		return this.http.put(this.baseUrl + "/collab/delete-space-member", data);
	}

	searchSpaceMember(email) {
		return this.http.get(this.baseUrl + "/collab/searchSpaceMember", { params: email });
	}

	inviteSpaceMember(data) {
		return this.http.put(this.baseUrl + "/collab/inviteSpaceMember", data);
	}
}
