import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';

import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';

import { FormsModule } from '@angular/forms';
import { PostFormComponent } from './post-form/post-form.component';
import { PostComponent } from './post/post.component';

const routes: Routes = [
  {
    path: ':id',
    component: PostsComponent
  }
]

@NgModule({
  declarations: [
    PostsComponent,
    PostFormComponent,
    PostComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class PostsModule { }
