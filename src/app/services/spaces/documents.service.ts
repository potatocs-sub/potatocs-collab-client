import { Injectable, WritableSignal, effect, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { shareReplay, tap } from "rxjs/operators";
import { CommonService } from "../common/common.service";

@Injectable({
	providedIn: "root",
})
export class DocumentsService {
	meetingList: WritableSignal<any | null> = signal<any | null>(null);
	constructor(private http: HttpClient, private commonService: CommonService) {
		effect(() => {
			if (this.meetingList()) {
				console.log(this.meetingList);
			}
		});
	}

	// 미팅목록 가져오기
	getMeetingList(data) {
		console.log(data);
		return this.http.get("/api/v1/collab/space/doc/getMeetingList", { params: data }).pipe(
			shareReplay(1),
			tap((res: any) => {
				console.log(res.meetingList);
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
}
