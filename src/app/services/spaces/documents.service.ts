import { Injectable, WritableSignal, effect, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { shareReplay, tap } from "rxjs/operators";
import { CommonService } from "../common/common.service";
import { environment } from "../../../environments/environment";
import { ScrumboardStorageService } from "../../stores/scrumboard-storage/scrumboard-storage.service";
import { AuthService } from "../auth/auth.service";
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
		private scrumService: ScrumboardStorageService,
		private authService: AuthService
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

	getRecording(gstd_key) {
		console.log(gstd_key);
		return this.http.post(this.baseUrl + "/collab/space/doc/getRecording", { gstd_key });
	}

	deleteRecording(recData) {
		console.log(recData);
		return this.http.delete(this.baseUrl + "/collab/space/doc/deleteRecording", { params: recData });
	}
	// 미팅목록 가져오기
	getMeetingList(data) {
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

	getInfo(docId) {
		const httpParams = new HttpParams({
			fromObject: {
				docId,
			},
		});
		console.log(httpParams);
		// const paramData = {
		// 	spaceTime
		// }

		return this.http.get(this.baseUrl + "/collab/space/doc/getDocInfo", { params: httpParams });
	}

	// doc 에 올려진 파일 목록 가져오기
	getUploadFileList(docId) {
		return this.http.get(this.baseUrl + "/collab/space/doc/getUploadFileList", { params: docId });
	}

	// 파일 업로드
	fileUpload(filedata, docId, description) {
		const formData = new FormData();
		formData.append("file", filedata);
		formData.append("docId", docId);
		formData.append("description", description);
		console.log(formData);
		return this.http.post(this.baseUrl + "/collab/space/doc/fileUpload", formData);
	}

	// 업로드된 파일 다운로드
	fileDownload(fileId: any) {
		// params를 쓸땐 객체로 보내야한다.
		return this.http.get(this.baseUrl + "/collab/space/doc/fileDownload", {
			params: { fileId: fileId },
			responseType: "blob",
		});
		// return this.http.get('/api/v1/collab/space/doc/getUploadFileList',{ params: docId });
	}

	//업로드된 파일 삭제
	deleteUploadFile(fileId) {
		console.log(fileId);
		console.log(typeof fileId);
		return this.http.delete(this.baseUrl + "/collab/space/doc/deleteUploadFile", { params: fileId });
	}

	// doc에 있는 채팅들 가져오기
	getChatInDoc(docId) {
		console.log(docId);
		return this.http.get(this.baseUrl + "/collab/space/doc/getChatInDoc", { params: docId });
	}

	// 채팅 생성
	createChat(data) {
		return this.http.post(this.baseUrl + "/collab/space/doc/createChat", data);
	}

	// edit doc description
	editDocDescription(data) {
		return this.http.post(this.baseUrl + "/collab/space/doc/editDocDescription", data);
	}

	// document 편집
	updateDoc(updateDocData) {
		console.log("1");
		return this.http.put(this.baseUrl + "/collab/space/doc/update", updateDocData);
	} // 문서 삭제
	deleteDoc(docId) {
		return this.http.delete(this.baseUrl + "/collab/space/doc/deleteDoc", { params: docId }).pipe(
			tap((res: any) => {
				console.log(res.scrumBoard);
				this.docs.set(res.spaceDocs);
				this.scrumService.updateScrumBoard(res.scrumBoard);
				return res.message;
			})
		);
	}

	// 채팅 삭제
	deleteChat(data) {
		return this.http.delete(this.baseUrl + "/collab/space/doc/deleteChat", { params: data });
	}

	//scrum title change
	titleChange(data) {
		console.log(data);
		return this.http.put(this.baseUrl + "/collab/space/doc/titleChange", data).pipe(
			shareReplay(1),
			tap(async (res: any) => {
				//await this.scrumService.updateScrumBoard(res.scrumBoard);
				this.docs.set(res.spaceDocs);
				return res.message;
			})
		);
	}

	//#park
	//document entry 편집
	updateDocEntry(updateDocEntry) {
		return this.http.put(this.baseUrl + "/collab/space/doc/docEntryUpdate", updateDocEntry).pipe(
			shareReplay(1),
			tap(async (res: any) => {
				//console.log(res.up);
				// await this.scrumService.updateScrumBoard(res.scrumBoard);
				this.docs.set(res.spaceDocs);
			})
		);
	}

	//#hokyun 2022-08-17
	//doc labels 상태 변경
	updateLabelsEntry(updateLabelsEntry) {
		return this.http.put(this.baseUrl + "/collab/space/doc/docLabelsUpdate", updateLabelsEntry).pipe(
			shareReplay(1),
			tap(async (res: any) => {
				this.docs.set(res.spaceDocs);
			})
		);
	}

	// 문서 일정 편집
	editDocDate(data) {
		return this.http.post(this.baseUrl + "/collab/space/doc/editDoc", data).pipe(
			tap((res: any) => {
				console.log(res.scrumBoard);
				this.docs.set(res.spaceDocs);
				this.scrumService.updateScrumBoard(res.scrumBoard);
				return res.message;
			})
		);
	}

	// Rec Data 불러오기
	getWhiteBoardRecList(docId: string) {
		return this.http.post(this.baseUrl + "/collab/space/doc/getWhiteBoardRecList", { docId });
	}

	downloadRecording(recData) {
		return this.http.get(this.baseUrl + "/collab/space/doc/downloadRecording", {
			params: recData,
			responseType: "blob",
		});
	}

	// 파일 업로드
	bgImageUpload(fileData) {
		const formData = new FormData();
		formData.append("fileData", fileData);
		// console.log(formData);
		return this.http.post(this.baseUrl + "/collab/space/doc/bgImageUpload", formData);
	}

	// 파일 경로 및 데이터 DB 저장
	sendWhiteBoardRec(
		docId: string,
		recordingTitle: string,
		gstd_key: string,
		bgImg_key: string,
		bgImg_location: string
	) {
		const data = {
			docId,
			recordingTitle,
			gstd_key,
			bgImg_key,
			bgImg_location,
		};
		return this.http.post(this.baseUrl + "/collab/space/doc/saveRecording", data);
	}

	// CANVAS GSTD 파일 업로드 및 경로 리턴
	uploadBlobToMultipart(url: string, filename: string, blobObj: Blob, appendName: string) {
		const formData = new FormData();
		formData.append(appendName, blobObj, filename);
		// console.log(url);
		const request = new XMLHttpRequest();

		request.open("POST", url);
		request.setRequestHeader("Authorization", "Bearer " + this.authService.getToken());

		return new Promise(function (resolve, reject) {
			request.onload = function (e) {
				resolve(request.response);
			};

			request.send(formData);
		});
	}
}
