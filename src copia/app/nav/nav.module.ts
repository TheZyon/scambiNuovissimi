import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';

import { AuthModule } from '../auth/auth.module';

@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    CommonModule,
    AuthModule
  ],
  exports: [
    NavComponent,
    RouterModule
  ]
})
export class NavModule { }
