import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';


import { IUser, Post } from '../models/IUser.model';
import { Observable, catchError, tap, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DaoService {

  private usersCollection : AngularFirestoreCollection<IUser>;

  private postsCollection: AngularFirestoreCollection<Post>;


  constructor(private db: AngularFirestore) {
    this.usersCollection = db.collection<IUser>('users');
    this.postsCollection = db.collection<Post>('posts');
  }



//CREATE

  async createUser(user: IUser) {// creates/updates user document in users collection
    return this.usersCollection.doc(user.id).set({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age
   }).catch(err => { console.log("Error in DAO service in createUser: ", err)});

  }

  async createPost(post: Post) {
    return this.postsCollection.add({
      title: post.title,
      body: post.body,
      idAuthor: post.idAuthor
    }).catch(err => { console.log("Error in DAO service in createPost: ", err)});
  }


  //RETRIEVE

  getUserById(id: string) {
    return this.usersCollection.doc(id).get()
    .pipe(catchError((err) => { console.log(err); throw err; }));

  };

  getAllUsers() {

    return this.usersCollection.get().pipe(catchError((err) => { console.log(err); throw err; }));
  }

  /* getPostByAuthorId(id:string) {

    return this.db.collection('posts', ref => ref.where('idAuthor', '==', id)) //è ref che ha i metodi per fare la query
            .get();
  }
 */

  getAllPosts() {
    return this.postsCollection.get().pipe(catchError((err) => { console.log(err); throw err; }));
  }

  //UPDATE

  updatePostById(id: string, post:Post) {
    return this.postsCollection.doc(id).set(post).catch(err => {console.log(err);})
  }




  //DELETE

  deletePostById(id: string) {
    return this.postsCollection.doc(id).delete().catch(err => { console.log(err)})
  }


}
