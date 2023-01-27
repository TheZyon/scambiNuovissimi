import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  disabled: boolean = false;


  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

 onSubmit(f:NgForm) {
    console.log(f.value);

   this.auth.signup(f.value.email, f.value.password, f.value.name, f.value.age)


 }


}
