import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DaoService } from 'src/app/dao/dao.service';
import { Post } from 'src/app/models/IUser.model';


@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {



  post: Post = {
    title: 'carlino',
    body: 'carlino il canino',
    idAuthor: 'laMadonnaEVergineLoSaiBattiLeMani'
  }

  sub!: Subscription;


  @Output() onCreate = new EventEmitter();

  @Input() titl: string = '';
  @Input() bod: string = '';

  constructor(private dao: DaoService, private authSrv: AuthService) { }

  ngOnInit(): void {

    //ottiene le info dell'utente
    this.sub= this.authSrv.obsUser.subscribe(res => {
      if (res?.info.id) {
        this.post.idAuthor = res?.info.id;
      }
    })
  }


  postManager(f: NgForm) { //if use ==true -> aggiungo post al DB, altrimenti faccio update

    this.onCreate.emit(f);
    this.titl = '';
    this.bod = '';


  }

 ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
