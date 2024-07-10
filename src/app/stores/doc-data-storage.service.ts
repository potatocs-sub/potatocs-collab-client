import { Injectable, WritableSignal, signal } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class DocDataStorageService {
	docs: WritableSignal<any | null> = signal<any | null>(null);
	files: WritableSignal<any | null> = signal<any | null>(null);
	constructor() {}
}
