import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";
import { User } from '../_models';
import { UserService, AuthenticationService } from '../_services';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {
    
    UserData: any = [];
    currentUser: User;
    currentUserSubscription: Subscription;
    // users: User[] = [];
    dataSource: MatTableDataSource<User>;
    @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'username', 'action'];


    constructor(
        private authenticationService: AuthenticationService,
        private spinner: NgxSpinnerService,
        private userService: UserService
    ) {
        this.userService.getAll().subscribe(data => {
            this.UserData = data;
            this.dataSource = new MatTableDataSource<User>(this.UserData);
      setTimeout(() => {
        this.spinner.hide();
        this.dataSource.paginator = this.paginator;
      }, 0);
    
        })
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        
        this.loadAllUsers();
        
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    deleteUser(index: number, e) {
        const data =this.dataSource.data;
        data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
        this.dataSource.data = data;
        this.userService.delete(e.id).pipe(first()).subscribe(() => {
            this.loadAllUsers()
        });
    }

    private loadAllUsers() {
        this.dataSource = new MatTableDataSource<User>(this.UserData);
          setTimeout(() => {
            this.spinner.show();
            this.dataSource.paginator = this.paginator;
          }, 0);

        this.userService.getAll().pipe(first()).subscribe(data => {
            this.spinner.hide();
            this.UserData = data;
           
        });
    }
}
