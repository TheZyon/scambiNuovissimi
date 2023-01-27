export interface IUser {
  name: string,
  email: string,
  age: number,
  id:string
}

export interface User {


  token: string;

  info: {
    id: string;
    email: string;
    name: string;
    age: number;
  }


}

export interface Post {
  id?:string,
  title: string,
  body: string,
  idAuthor: string
}

export interface Like {
  idUser: string,
  idPost: string
}

export interface friendship {
  idUser1: string,
  idUser2:string
}
