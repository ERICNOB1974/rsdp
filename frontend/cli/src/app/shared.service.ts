import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private dataSubject = new BehaviorSubject<any>(null);
  currentData = this.dataSubject.asObservable();

  constructor() { }
  
  changeData(data: any) {
    this.dataSubject.next(null);
    this.dataSubject.next(data);
  }
}
