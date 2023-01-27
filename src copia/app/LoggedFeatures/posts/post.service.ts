import { Injectable } from '@angular/core';
import { DaoService } from 'src/app/dao/dao.service';
import { Post } from 'src/app/models/IUser.model';



@Injectable({
  providedIn: 'root'
})

export class PostService {

  postArrayUser: Post[] = [];

  constructor(private dao: DaoService) {




   }
}
