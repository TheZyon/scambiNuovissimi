import { Component, OnInit } from '@angular/core';
import { DaoService } from '../dao/dao.service';
import { IUser } from '../models/IUser.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private dao: DaoService, private authSrv: AuthService) { }

  isLoggedIn: boolean = false;

  subUsers!: Subscription;



  iUsersArray: IUser[]=[]; //array degli IUser di tutti gli utenti

  ngOnInit(): void {

    this.authSrv.isLoggedIn$.subscribe(logged => this.isLoggedIn = logged);

    /* if (this.isLoggedIn) */ this.getAllUsers(); //if the user is logged in, we will show other users


  }



  getAllUsers() { //makes a subscription and uses it to populate iUsersArray


    this.subUsers=this.dao.getAllUsers().subscribe(
      res => {
        res.docs.forEach(doc => {
          this.iUsersArray.push(
            <IUser>{
              name: doc.data().name,
              age: doc.data().age,
              id: doc.id,
              email: doc.data().email
            })
        })
        console.log(this.iUsersArray)

      }
    )


  }


}
