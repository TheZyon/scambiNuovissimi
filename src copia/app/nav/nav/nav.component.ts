import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { YourPageService } from 'src/app/LoggedFeatures/posts/your-page.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  isLoggedIn: boolean = false; //it will be listening to isLoggedIn$

  userId: string = '';

  constructor(private authSrv: AuthService, private yourPageSrv: YourPageService) { }

  ngOnInit(): void {


    this.authSrv.obsUser.subscribe(user => {
      if (user) {
        this.userId = user.info.id;

        this.authSrv.isLoggedIn$.subscribe(res => {
          this.isLoggedIn = res;
        })
      }
    }


    );

  }


  toggleYourPage() {
    this.yourPageSrv.toggle();
  }


  logout() {
    this.authSrv.logout();
  }

}
