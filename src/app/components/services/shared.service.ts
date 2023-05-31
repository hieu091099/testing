import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private subject = new Subject<any>();

  constructor() {}

  sendClickEvent(): void {
    this.subject.next('click');
  }
  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}
