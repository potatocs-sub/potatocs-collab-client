import { Route } from "@angular/router";
import { SpacesComponent } from "./spaces.component";

export const SPACES_ROUTES: Route[] = [
	{
		path: ":spaceTime",
		loadComponent: () => SpacesComponent,
		// canActivate: [SpaceGuard]
	},
	// {
	//   path: 'editor/ctDoc',
	//   loadComponent: () => EditorComponent,
	//   // canActivate: [SpaceGuard]
	// },
	// {
	//   path: 'space/:spaceTime/doc',
	//   loadComponent: () => DocumentComponent,
	//   canActivate: [SpaceGuard]
	// },
	// {
	//   path: 'space/calendar',
	//   loadComponent: () => CalendarListComponent,
	//   // canActivate: [SpaceGuard]
	// },
	{
		path: "",
		redirectTo: "employees/list",
		pathMatch: "full",
	},
];
