import { Injectable, WritableSignal, effect, inject, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProfilesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  userProfileInfo: WritableSignal<any | null> = signal<any | null>(null);
  userCompanyInfo: WritableSignal<any | null> = signal<any | null>(null);
  userManagerInfo: WritableSignal<any | null> = signal<any | null>(null);

  constructor() {
    effect(() => {
      console.log(this.userProfileInfo());
      console.log(this.userCompanyInfo());
      console.log(this.userManagerInfo());
    });
  }
  getUserProfile() {
    return this.http.get(this.baseUrl + "/user/profile").pipe(
      tap((res: any) => {
        // console.log('profile Service Result', res);
        if (res.user.profile_img == "") {
          res.user.profile_img = "/assets/image/person.png";
        }
        if (res.manager != null && res.manager.profile_img == "") {
          res.manager.profile_img = "/assets/image/person.png";
        }
        this.userProfileInfo.set(res.user);
        this.userCompanyInfo.set(res.company);
        this.userManagerInfo.set(res.manager);
        return (res.result = true);
      })
    );
  }
  changeUserProfile(data) {
    return this.http.put("/api/v1/user/profileChange", data);
  }

  changeProfileImage(imgFile) {
    const imgData = new FormData();
    imgData.append("file", imgFile);
    console.log();
    return this.http.post("/api/v1/user/profileImageChange", imgData);
  }
}
