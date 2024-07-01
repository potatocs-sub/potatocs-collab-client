import { Injectable, WritableSignal, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { tap } from "rxjs/operators";

@Injectable({
	providedIn: "root",
})
export class CentralService {
	private baseUrl = environment.apiUrl;

	spaceMembers: WritableSignal<any | null> = signal<any | null>(null);
	userSpaceInfo: WritableSignal<any | null> = signal<any | null>(null);

	constructor(private http: HttpClient) {}

	getSpaceMembers(spaceTime) {
		return this.http.get(this.baseUrl + "/collab/space/" + spaceTime).pipe(
			tap((res: any) => {
				this.spaceMembers.set(res.spaceMembers);
				this.userSpaceInfo.set(res.userSpaceInfo);
				return res.message;
			})
		);
	}

	deleteSpace(spaceTime) {
		console.log("delete space");
		return this.http.delete(this.baseUrl + "/collab/space/deleteSpace", { params: spaceTime });
	}

	changeSpaceName(data) {
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
