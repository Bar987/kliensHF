import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
} from "@angular/core";
import { ImgService } from "src/app/services/img-service/img.service";
import { take } from "rxjs/operators";
import { FaceService } from "src/app/services/face-service/face.service";
import { Face } from "src/app/models/face.model";
import { DeleteCompService } from "src/app/services/delete-comp/delete-comp.service";

@Component({
  selector: "app-face-upload",
  templateUrl: "./face-upload.component.html",
  styleUrls: ["./face-upload.component.scss"],
})
export class FaceUploadComponent implements OnInit {
  constructor(
    private imgService: ImgService,
    private faceService: FaceService,
    private ngZone: NgZone,
    private deleteService: DeleteCompService
  ) {}

  id: number;
  @ViewChild("canvas", { static: true }) canvas: ElementRef;
  isNotLoaded: boolean = true;
  face: Face;
  error: string;

  ngOnInit(): void {
    this.getImg();
  }

  // Az ImgService aktuális képét kirajozolja egy canvasra.
  private getImg() {
    this.imgService
      .getImg()
      .pipe(take(1))
      .subscribe((img) => {
        this.drawImage(img);
      });
  }

  // A canvasra rajzolást végzi, majd elküldi a képet a szervernek
  private drawImage(img) {
    const image = new Image();
    image.src = img;
    image.onload = () => {
      let ctx = this.canvas.nativeElement.getContext("2d");
      ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height
      );
      this.isNotLoaded = false;
      this.canvas.nativeElement.toBlob((img) => {
        this.sendImg(img);
      });
    };
  }

  // A http kéréseket kezelő service-t meghívva, elküldi a képet a szervernek,
  // majd a válaszban szereplő, arcot keretező téglalapokat a canvasra rajzolja,
  // illetve az ImgService segítségével értesíti a kapott faceId-ról a tartalmazó komponenst.
  // Amennyiben a válaszban nem talál arcot, ezt kiírja a mat-card-ra.
  private sendImg(img: Blob) {
    this.faceService.detectFace(img).subscribe((faces: Face[]) => {
      if (faces.length > 0) {
        this.ngZone.run(() => (this.face = faces[0]));
        let ctx = this.canvas.nativeElement.getContext("2d");
        ctx.strokeStyle = "red";
        faces.forEach((face) => {
          ctx.beginPath();
          ctx.rect(
            face.faceRectangle.left,
            face.faceRectangle.top,
            face.faceRectangle.width,
            face.faceRectangle.height
          );
          ctx.stroke();
          ctx.strokeStyle = "black";
        });
        this.imgService.setFace(this.id, this.face.faceId);
      } else {
        this.ngZone.run(
          () =>
            (this.error =
              "Couldn't find a face on the picture! Please try again!")
        );
      }
    });
  }

  // A komponens elküldi az id-ját, hogy a tartalmazó komponens el tudja távolítani.
  public removeSelf() {
    this.deleteService.delete(this.id);
  }
}
