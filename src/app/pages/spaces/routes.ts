import { Route } from "@angular/router";
import { SpacesComponent } from "./spaces.component";
import { CalendarListComponent } from "./calendar-list/calendar-list.component";
import { EditorComponent } from "./editor/editor.component";
import { DocumentComponent } from "./document/document.component";
export const SPACES_ROUTES: Route[] = [
	{
		path: ":spaceTime",
		loadComponent: () => SpacesComponent,
		// canActivate: [SpaceGuard]
	},
	{
		path: "editor/ctDoc",
		loadComponent: () => EditorComponent,
		// canActivate: [SpaceGuard]
	},
	{
		path: ":spaceTime/doc",
		loadComponent: () => DocumentComponent,
		// canActivate: [SpaceGuard],
	},
	{
		path: "calendar",
		loadComponent: () => CalendarListComponent,
		// canActivate: [SpaceGuard]
	},
	{
		path: "",
		redirectTo: "employees/list",
		pathMatch: "full",
	},
];
