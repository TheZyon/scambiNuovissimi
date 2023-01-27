import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  disabled: boolean = false;

  constructor(private auth : AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(f:NgForm) {
    console.log(f.value);
    this.auth.login(f.value.email, f.value.password);
 

  }
}
