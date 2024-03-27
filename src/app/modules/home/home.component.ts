import { CookieService } from 'ngx-cookie-service';
import { UserService } from './../../services/user/user.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SignupUserRequest } from 'src/app/interfaces/user/SignupUserRequest';
import { AuthRequest } from 'src/app/interfaces/user/auth/AuthRequest';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  loginCard = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
  ) {}

  onSubmitLoginForm(): void {
    // console.log('form login data: ', this.loginForm.value);
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest).subscribe({
        next: (response) => {
          if(response){
            this.cookieService.set('user_info', response?.token);
            this.loginForm.reset();
            this.router.navigate(['/dashboard'])

            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: `Welcome back ${response?.name}`,
              life: 2000
            })
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Attempt to login failed`,
            life: 2000
          });
          console.log(err)

        }
      })

    }

  }

  onSubmitSignUp(): void {
    // console.log('form sign data: ', this.signupForm.value)
    if (this.signupForm.value && this.signupForm.valid) {
      this.userService
        .signupUser(this.signupForm.value as SignupUserRequest)
        .subscribe({
          next: (response) => {
            if (response) {
              alert('Test user created.');
              this.signupForm.reset();
              this.loginCard = true;

            this.messageService.add({
              severity: 'success',
              summary: 'Success!',
              detail: `User created successfully`,
              life: 2000
            })


            }
          },
          error: (err) => {


            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Login failed, try again.`,
              life: 2000
            })



            console.log('error', err)},
        });
    }
  }
}
