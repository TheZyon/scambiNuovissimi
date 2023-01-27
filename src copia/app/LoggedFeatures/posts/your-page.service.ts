import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YourPageService {

  yourPageToggle$ = new BehaviorSubject<boolean>(false);

  obs = this.yourPageToggle$.asObservable();

  toggle() {
    this.yourPageToggle$.next(!this.yourPageToggle$.value);
  }



  constructor() { }
}
