import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  status: boolean=true;//segna se la UI del template è un post o è un form per modificare il post

  @Input() yours: boolean = false; //segnala se il post è nella pagina dell'utente loggato o se è nela pagine di un'altro utente

  @Input() title: string="viva gesù";
  @Input() body: string = "ma davero eh";


  @Output() onUpdate = new EventEmitter();

  @Output() onDelete = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  deletePost() {

    this.onDelete.emit("elimina");

  }

  updatePost(f: NgForm) {
    this.onUpdate.emit(f);
    this.toggle();
  }


  toggle() {
    this.status = !this.status;
  }

}
