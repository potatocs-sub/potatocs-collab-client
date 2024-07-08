import { Component, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";

import { ActivatedRoute, Router } from "@angular/router";
import { FormControl } from "@angular/forms";

@Component({
	selector: "app-calendar-list",
	standalone: true,
	imports: [],
	templateUrl: "./calendar-list.component.html",
	styleUrl: "./calendar-list.component.scss",
})
export class CalendarListComponent {
	private unsubscribe$ = new Subject<void>();
	docsArray: any;

	member = new FormControl();
	@Input() memberInSpace: any;

	@ViewChild("modalContent") modalContent: TemplateRef<any>;

	viewDate: Date = new Date();

	refresh: Subject<any> = new Subject();
	// actions: CalendarEventAction[] = [
	// 	{
	// 		label: '<i class="fa fa-fw fa-pencil"></i>',
	// 		onClick: ({ event }: { event: CalendarEvent }): void => {
	// 			this.handleEvent("Edited", event);
	// 		},
	// 	},
	// ];
	activeDayIsOpen = true;
	startDate: any;
	endDate: any;
}
