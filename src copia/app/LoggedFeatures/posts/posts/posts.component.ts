import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DaoService } from 'src/app/dao/dao.service';
import { IUser, Post, User } from 'src/app/models/IUser.model';
import { YourPageService } from '../your-page.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  constructor(private authSrv: AuthService, private dao: DaoService, private route: ActivatedRoute, private yourPageSrv: YourPageService) { }

  //teniamo conto dell'utente loggato e dell'utente cui appartene la bakeka

  //subscriptions we make

  subSelectedUser!: Subscription;
  subLoggedUser!: Subscription;
  subPosts!: Subscription;

  user: IUser | null = {

      id: 'laMadonninaEVergineTuLoSaiBattiLeMani',
      email: 'sangiuseppe@gmail.com',
      name: 'Mr Craig',
      age: 2050

  }

  yourPageNewClick: boolean=false;


  selectedUserIsLoggedUser: boolean = false; //dice se l'utente loggato coincide con l'utente cui appartiene questa pagina
  selectedUserId: string = '';
  loggedUserId: string = '';



  //array dei post pubblicati dall'utente
  postArrayUser: Post[] = [];

  ngOnInit(): void { //subscribe to get info logged user & subscribe to get posts from db

    console.log("route: ",this.route.snapshot)

    //subscription to get the myPageToggle
    this.yourPageSrv.obs.subscribe(resp => {
      /* console.log("response del yourPageSrv.obs:  ",resp); */
      this.yourPageNewClick = resp;
    })


    this.selectedUserId = this.route.snapshot.params['id']; //prendo id dell'utente selezionato (= a cui appartiene la pagina)
    /* console.log("the id of selected user: ", this.selectedUserId) */



    //1. subscription to get info selected user -> assigning it to variable "user"
    //2. subscription to get id logged user -> assigning it to "loggedUserId"
    //3. subscription to get the posts of the selected user -> assigning them to variable "postArrayUser"

    //1.
    this.subSelectedUser = this.dao.getUserById(this.selectedUserId).subscribe(res => {
      let data = res.data();
      this.user = {
        id: this.selectedUserId,
        name: data!.name,
        email: data!.email,
        age: data!.age
      }

      //2.
      this.subLoggedUser=this.authSrv.obsUser.subscribe(res => {
        this.loggedUserId = res!.info.id;

        this.selectedUserIsLoggedUser = (this.loggedUserId == this.selectedUserId);

      }

      );

      //3.
      this.loadUserPosts();
    })

  }

  ngDoCheck() {
    //se l'url non contiene l'id dell'utente loggato, ricarica la pagina
    //serve per far funzionare il passaggio diretto dalla bakeka di un utente alla propria bakeka
    //senza doevr passare per un'altra componente (le bakeke sono fatte tutte con la stessa componente
    //collegata a diversi url quindi al passaggio da una bakeka all'altra non si attiva ngOnInit())

    if (this.route.snapshot.params['id'] != this.selectedUserId) {
      console.error("selected user id i different from route id")
      this.ngOnDestroy();
      this.ngOnInit();
    }
  }

  loadUserPosts() {
    // 0. sottoscrizione a this.dao.getAllPosts()
    // 1. resetta postArrayUser a []
    // 2. pusha in postArrayUser i post dell'utente attualemnte nel DB



      //0.
      this.subPosts = this.dao.getAllPosts().subscribe(res => {

      //1.
      this.postArrayUser = [];

      //3.
      let docsUser = res.docs.filter(doc => {
        return doc.data().idAuthor == this.user?.id
      });

      docsUser.forEach(doc => {


        this.postArrayUser.push({
          title: doc.data().title,
          body: doc.data().body,
          idAuthor: doc.data().idAuthor,
          id: doc.id
        });
      });

      /* console.log("array post user: ", this.postArrayUser); */


    });



  }

  refreshComponent() {
    this.ngOnDestroy();
    this.ngOnInit();
  }

  ngOnDestroy() {
    this.subLoggedUser.unsubscribe();
    this.subSelectedUser.unsubscribe();
    this.subPosts.unsubscribe();

  }

  //CRUD Operations methods for the posts

  updatePost(f: NgForm, i: number) {//modifica un post nel DB e aggiorna i post visualizzati dall'utente

    //1. usa indice i del post nell'arrayPostUser per risalire all'id del post
    //2. update del db
    //3. reset subscription posts per avere visualizzazione dell'utente (perché?)


    let newVersion: Post = {
      idAuthor: this.user!.id,
      title: f.value.title,
      body: f.value.body
    }

    //1.
    let id = this.postArrayUser[i].id;
    /* console.log("l'id: ", id);*/

    if (id) {
      this.dao.updatePostById(id, newVersion) //2.
        .then(res => {/* this.resetSubscriptionPosts() */ this.refreshComponent(); }); //3.
    }
    else { console.log("post id not found during update!!")}


  }

  createPost(f: NgForm) { //crea un nuovo post con le info del NgForm f

    let newPost = <Post>{
      title: f.value.title,
      body: f.value.body,
      idAuthor: this.user?.id
    }

    this.dao.createPost(newPost).then(
      resp => { /* this.resetSubscriptionPosts(); */
        this.refreshComponent();
}
    );

  }

  deletePostById(id?: string) {
    if (id) {
      this.dao.deletePostById(id);
      /* this.resetSubscriptionPosts(); */
      this.refreshComponent();
    }
    else { console.error("id non trovato")}
  }

   
  /* resetSubscriptionPosts() { //resetta la sottoscrizione per i post del DB
    this.subPosts.unsubscribe();
    this.loadUserPosts();
  //se non tolgo e rimetto la sottoscrizione non si aggiorna postArrayUser, come mai?
  }*/

}
