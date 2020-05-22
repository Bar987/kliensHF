import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
@Injectable({
  providedIn: "root",
})

// Service a törölni kivánt komponensek id-jainak küldésére, dinamikus komponensek esetén az EventEmmiter nem használható.
export class DeleteCompService {
  constructor() {}

  private idOfDeleted = new Subject<number>();

  getIdOfDeleted() {
    return this.idOfDeleted.asObservable();
  }

  delete(id) {
    this.idOfDeleted.next(id);
  }
}
