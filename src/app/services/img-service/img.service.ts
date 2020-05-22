import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { FaceData } from "src/app/models/faceData.model";

@Injectable({
  providedIn: "root",
})
export class ImgService {
  constructor() {}

  private imgSource = new Subject<string>();
  private face = new Subject<FaceData>();

  // Observable-ként visszadja a kép base64 stringjét tartalmazó Subject-et.
  getImg() {
    return this.imgSource.asObservable();
  }

  // Az képfeltöltés eventjében található base64 string-et beállítja a service által emittált képének.
  uploadFile(event) {
    let path: string | ArrayBuffer;
    const file = event.target.files[0];
    let fr = new FileReader();
    fr.onload = () => {
      path = fr.result;
      this.imgSource.next(<string>path);
    };
    fr.readAsDataURL(file);
  }

  // A paraméterben kapott arc-ot beállítja a service által kibocsájtott arcnak. 
  setFace(faceId, id) {
    this.face.next(new FaceData(faceId, id));
  }

  // Observable-ként visszadja az arcot tartalmazó Subject-et.
  getFace() {
    return this.face.asObservable();
  }
}
