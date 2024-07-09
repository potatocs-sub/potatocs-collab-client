import { Component, ViewChild, inject, signal } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialsModule } from '../../../materials/materials.module';
import { CommonModule } from '@angular/common';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { EmployeesService } from '../../../services/employees/employees.service';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [MaterialsModule, CommonModule],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.scss'
})
export class EmployeesListComponent {

  employeesService = inject(EmployeesService);


  displayedColumns: string[] = [
    'name',
    'position',
    'location',
    'annual_leave',
    'sick_leave',
    'replacementday_leave',
    'tenure_today',
  ];
  filterValues: any = {};
  filterSelectObj: any = [];
  company_max_day: any;

  employeeList = signal<MatTableDataSource<any>>(new MatTableDataSource());

  myRank = window.location.pathname.split('/')[3];
  managerName = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageSize = signal<number>(10);
  resultsLength = signal<number>(0);
  isLoadingResults = signal<boolean>(true);
  isRateLimitReached = signal<boolean>(false);


  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults.set(true);
          return this.employeesService.getMyEmployeeList(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
          ).pipe(catchError(() => of(null)));
        }),
        map((res: any) => {
          this.isLoadingResults.set(false);
          if (res === null) {
            this.isRateLimitReached.set(true);
            return [];
          }
          this.isRateLimitReached.set(false);
          this.resultsLength.set(res.myEmployeeList.length);
          // this.calculateTenure(res.myEmployeeList);
          return res.myEmployeeList;
        }),
      )
      .subscribe((data: any) => this.employeeList.set(new MatTableDataSource(data)));
  }
  // Called on Filter change
  filterChange(filter: any, event: any) {
    //let filterValues = {}
    this.filterValues[filter?.columnProp] = event.target.value.trim().toLowerCase();
    this.employeeList().filter = JSON.stringify(this.filterValues);
  }

  // Custom filter method fot Angular Material Datatable
  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }
      let nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          for (const col in searchTerms) {
            searchTerms[col]
              .trim()
              .toLowerCase()
              .split(' ')
              .forEach((word: any) => {
                if (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet) {
                  found = true;
                }
              });
          }
          return found;
        } else {
          return true;
        }
      };
      return nameSearch();
    };
    return filterFunction;
  }

  // Reset table filters
  resetFilters() {
    this.filterValues = {};
    this.filterSelectObj.forEach((value: any, key: any) => {
      value.modelValue = undefined;
    });
    this.employeeList().filter = '';
  }
}
