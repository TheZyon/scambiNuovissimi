import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//authModule
import { AuthModule } from './auth/auth.module';

//Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; //interacting with the
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; //using the firestore

//custom modules
import { NavModule } from './nav/nav.module';
import { HomeComponent } from './home/home.component';

import { PostsModule } from './LoggedFeatures/posts/posts.module';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase), //this will be connecting our app to firebase
    AngularFireAuthModule,
    AngularFirestoreModule,
    AuthModule,
    NavModule,
    PostsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
