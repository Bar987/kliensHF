import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  NgZone,
} from "@angular/core";
import { FaceService } from "src/app/services/face-service/face.service";
import { Face } from "src/app/models/face.model";
import { DeleteCompService } from "src/app/services/delete-comp/delete-comp.service";
import { ImgService } from "src/app/services/img-service/img.service";

@Component({
  selector: "app-face-detect",
  templateUrl: "./face-capture.component.html",
  styleUrls: ["./face-capture.component.scss"],
})
export class FaceCaptureComponent implements OnInit {
  constructor(
    private renderer: Renderer2,
    private faceService: FaceService,
    private ngZone: NgZone,
    private deleteService: DeleteCompService,
    private imgService: ImgService
  ) {}

  id: number;
  @ViewChild("video", { static: true }) videoElement: ElementRef;
  @ViewChild("canvas", { static: true }) canvas: ElementRef;
  private videoWidth = 0;
  private videoHeight = 0;
  isCaptured: boolean = false;
  isNotLoaded: boolean = true;
  face: Face = null;
  error: string;

  private constraints = {
    video: {
      facingMode: "user",
    },
  };

  ngOnInit(): void {
    this.startCamera();
  }

  ngOnDestroy(): void {
    this.stopStream();
  }

  // Elindítja a webkamerát, amennyiben elérhető, illetve elrejti a canvas-t a templateről
  private startCamera() {
    this.isCaptured = false;
    this.renderer.setProperty(this.canvas.nativeElement, "hidden", true);
    this.isNotLoaded = true;
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices
        .getUserMedia(this.constraints)
        .then(this.attachVideo.bind(this))
        .catch(this.handleError);
    } else {
      alert("Sorry, camera not available.");
    }
  }

  private handleError(error) {
    console.log("Error: ", error);
  }

  // Beállítja a webkamera tulajdonságait
  private attachVideo(stream) {
    this.renderer.setProperty(
      this.videoElement.nativeElement,
      "srcObject",
      stream
    );
    this.renderer.listen(this.videoElement.nativeElement, "play", (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
    this.renderer.setProperty(this.videoElement.nativeElement, "hidden", false);
    this.isNotLoaded = false;
  }

  // A 'Capture' gomb hatására, a canvasra rajzolja a videón éppen szereplő képet, leállítja a webkamerát,
  // és elküldi a képet a szervernek
  capture() {
    this.renderer.setProperty(
      this.canvas.nativeElement,
      "width",
      this.videoWidth
    );

    this.renderer.setProperty(
      this.canvas.nativeElement,
      "height",
      this.videoHeight
    );
    let ctx = this.canvas.nativeElement.getContext("2d");
    ctx.drawImage(this.videoElement.nativeElement, 0, 0);
    this.renderer.setProperty(this.canvas.nativeElement, "hidden", false);
    this.renderer.setProperty(this.videoElement.nativeElement, "hidden", true);
    this.isCaptured = true;
    this.stopStream();

    this.canvas.nativeElement.toBlob((img) => {
      this.sendImg(img);
    });
  }

  // Videó stream leállítása
  private stopStream() {
    this.videoElement.nativeElement.srcObject
      .getVideoTracks()
      .forEach((track) => {
        track.stop();
      });
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
  removeSelf() {
    this.deleteService.delete(this.id);
  }
}
