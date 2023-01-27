import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable, Subscription, map, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { DaoService } from '../dao/dao.service';
import { IUser, User } from '../models/IUser.model';




@Injectable({
  providedIn: 'root'
})

export class AuthService {



  constructor(private auth: AngularFireAuth, private router: Router, private dao: DaoService) { }

  subscription!: Subscription;

  jwt = new JwtHelperService();

  user$ = new BehaviorSubject<User | null>(null); //behaviour subject contiene le info dell'utente loggato o null

  isLoggedIn$ = this.user$.pipe(map(x => !!x)); //behaviour subject che segnala se si è loggati con un boolean

  obsUser = this.user$.asObservable();


  autoLogoutTimer: any;


  login(email: string, password: string) { //salva info utente nel localStorage, setta autologout e passa info ad auth$ per informare componenti


    try {
      this.auth.signInWithEmailAndPassword(email, password).then(resp => {
        console.log("the login response: ", resp);

        let responseLogin = resp;
        let responseLoginUser = responseLogin.user;

        if (responseLoginUser) {//login resp has user



          this.subscription = this.dao.getUserById(responseLoginUser.uid).subscribe(responseDB => {


          //1. retrieving iUser from the DB and saving them in iUser

            let iUser: IUser = {
              id:'Non ce ne è coviddi',
              name: 'peppino',
              email: 'peppiniello@gmail.comme',
              age: 999
            }

            console.log("the response of the DB: ", responseDB.id)
            let data = responseDB.data();

            if (data != undefined) iUser = data;


            console.log("the retrieved iUser: ", iUser);


             /* 2. getting the token and using it to complete the login procedures
             2.1 getting the token,
             2.2 setting the autologout,
             2.3 nexting the User to the user$
             2.4 redirecting to homepage
 */
            responseLoginUser!.getIdTokenResult().then(resp => {


              //2.1
              let token = resp.token;

              //2.2
              const expirationDate = this.jwt.getTokenExpirationDate(token) as Date;
              this.autoLogout(expirationDate);

              //2.4
              this.router.navigate(['/']);

              //2.3
              return this.user$.next({ info: { id: responseDB.id, email: iUser.email, name: iUser.name, age: iUser.age }, token: resp.token });

            }).catch(err => { console.log("error getting token: ", err);})

          }
          )

        }
        else { console.log("Error: no user in the login response!") }

      });
      }
    catch (e) { console.log("error during logging in: ", e)}

  }


  //next per passare al authToggle le credenziali nel then delle promises


  signup(email: string, password: string, name:string, age: number) { //aggiunge l'utente tra gli utenti registrati in firebase, aggiunge l'utente nella collection "users" del DB

    try {
      this.auth.createUserWithEmailAndPassword(email as string, password as string)
        .then(resp => {

          if (resp.user?.uid) {//creo utente nel db
            return this.dao.createUser({ name: name, email: email, age: age, id: resp.user?.uid } as IUser);

          }
          else {//ERR->non era fornito l'utente nella resp al signup di firebase
            console.log("ERRR: no user in the  sugnup response");
            return null;  }

        }
        );

    }
    catch (e) {//errore nel signup
      console.log("errore nel signup: ", e);
    }
    finally {this.router.navigate(['/auth/login']); }
 }

 logout() {
  this.user$.next(null); //segnalare al sito che non siamo più loggati
  this.router.navigate(['/']); //reindirizzamento al login -> cambiare ad home?
  localStorage.removeItem('userInfo');//dimentichiamo il token per evitare autologin
  if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
  }
 }

 autoLogout(expirationDate: Date) {
  //getTime da il valore della data in ms
  const expMs = expirationDate.getTime() - new Date().getTime(); //ms rimasti primache scada
  this.autoLogoutTimer = setTimeout(() => {
      this.logout();
  }, expMs);
}

}
