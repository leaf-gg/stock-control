import { SignupUserResponse } from './../../interfaces/user/SignupUserResponse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignupUserRequest } from 'src/app/interfaces/user/SignupUserRequest';
import { AuthRequest } from 'src/app/interfaces/user/auth/AuthRequest';
import { AuthResponse } from 'src/app/interfaces/user/auth/AuthResponse';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = enviroment.API_URL;

  constructor(private http: HttpClient) {}

  signupUser(requestData: SignupUserRequest): Observable<SignupUserResponse> {
    return this.http.post<SignupUserResponse>(
      `${this.API_URL}/user`, requestData
    )
  }

  authUser(requestData: AuthRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth`, requestData
    )
  }
}