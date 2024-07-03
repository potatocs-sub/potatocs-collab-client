import { Injectable, WritableSignal, effect, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { shareReplay, tap } from "rxjs/operators";
import { CommonService } from "../common/common.service";
import { environment } from "../../../environments/environment";
import { ScrumboardStorageService } from "../../stores/scrumboard-storage/scrumboard-storage.service";

@Injectable({
	providedIn: "root",
})
export class DocumentsService {
	private baseUrl = environment.apiUrl;
	meetingList: WritableSignal<any | null> = signal<any | null>(null);
	docs: WritableSignal<any | null> = signal<any | null>(null);

	constructor(
		private http: HttpClient,
		private commonService: CommonService,
		private scrumService: ScrumboardStorageService
	) {
		effect(() => {
			if (this.meetingList()) {
			}
		});
	}

	createDoc(docData) {
		console.log("doc서비스", docData);
		return this.http.post(this.baseUrl + "/collab/space/doc/create", docData).pipe(
			tap((res: any) => {
				console.log(res);
				this.scrumService.updateScrumBoard(res.scrumBoard);
			})
		);
	}
	// 미팅목록 가져오기
	getMeetingList(data) {
		console.log(data);
		return this.http.get(this.baseUrl + "/collab/space/doc/getMeetingList", { params: data }).pipe(
			shareReplay(1),
			tap((res: any) => {
				// this.pendingCompReqStorageService.updatePendingRequest(res.pendingCompanyData);

				// common service
				for (let index = 0; index < res.meetingList.length; index++) {
					(res.meetingList[index].start_date = this.commonService.dateFormatting(
						res.meetingList[index].start_date
					)),
						"dateOnly";
				}
				this.meetingList.set(res.meetingList);
				return res.message;
			})
		);
	}

	// scrumboard  drop event
	scrumEditDocStatus(data) {
		return this.http.put(this.baseUrl + "/collab/space/doc/scrumEditDocStatus", data).pipe(
			shareReplay(1),
			tap((res: any) => {
				console.log(res.spaceDocs);
				this.docs.set(res.spaceDocs);
				return res.message;
			})
		);
	}

	// scurmboard dropList event
	scrumEditStatusSequence(data) {
		return this.http.put(this.baseUrl + "/collab/space/doc/scrumEditStatusSequence", data);
	}

	// create doc Status
	scrumAddDocStatus(data) {
		return this.http.put(this.baseUrl + "/collab/space/doc/scrumAddDocStatus", data).pipe(
			shareReplay(1),
			tap(async (res: any) => {
				console.log(res.scrumboard);
				await this.scrumService.updateScrumBoard(res.scrumboard);
				return "fffff";
			})
		);
	}

	// delete doc Status
	scrumDeleteDocStatus(data) {
		return this.http.put(this.baseUrl + "/collab/space/doc/scrumDeleteDocStatus", data).pipe(
			shareReplay(1),
			tap(async (res: any) => {
				console.log(res.scrumboard);
				await this.scrumService.updateScrumBoard(res.scrumboard);
				return res.message;
			})
		);
	}

	statusNameChange(data) {
		console.log(data);
		return this.http.put(this.baseUrl + "/collab/space/doc/statusNameChange", data).pipe(
			shareReplay(1),
			tap(async (res: any) => {
				console.log(res.updateDocs);
				await this.scrumService.updateScrumBoard(res.scrumboard);
				this.docs.set(res.updateDocs);
				return res.message;
			})
		);
	}

	//done 상태 변경
	updateDoneEntry(updateDoneEntry) {
		return this.http.put(this.baseUrl + "/collab/space/doc/docCheckDone", updateDoneEntry).pipe(
			shareReplay(1),
			tap(async (res: any) => {
				// await this.scrumService.updateScrumBoard(res.scrumBoard);
				this.docs.set(res.updateDocs);
			})
		);
	}
}
