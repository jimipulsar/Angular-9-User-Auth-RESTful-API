import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

    getAll() {
        return this.http.get<User[]>(`/users`);
    }

    register(user: User) {
        return this.http.post(`/users/register`, user);
        
    }

    delete(id: number) {
        this.spinner.show();
        return this.http.delete(`/users/${id}`);
    }
}