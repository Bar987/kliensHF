import {
  Component,
  OnInit,
  ViewChild,
  ComponentFactoryResolver,
  NgZone,
} from "@angular/core";
import { FaceCaptureComponent } from "../face-capture/face-capture.component";
import { MediaChange, MediaObserver } from "@angular/flex-layout";
import { ActivatedRoute, Router, NavigationStart } from "@angular/router";
import { FirstImageDirective } from "src/app/directives/first-image.directive";
import { FaceUploadComponent } from "../face-upload/face-upload.component";
import { SecondImageDirective } from "src/app/directives/second-image.directive";
import { ImgService } from "src/app/services/img-service/img.service";
import { DeleteCompService } from "src/app/services/delete-comp/delete-comp.service";
import { FaceData } from "src/app/models/faceData.model";
import { FaceService } from "src/app/services/face-service/face.service";
import { VerifyResponse } from "src/app/models/verify-response.model";

@Component({
  selector: "app-main-container",
  templateUrl: "./main-container.component.html",
  styleUrls: ["./main-container.component.scss"],
})
export class MainContainerComponent implements OnInit {
  constructor(
    private observableMedia: MediaObserver,
    private componentFactoryResolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private imgService: ImgService,
    private deleteService: DeleteCompService,
    private router: Router,
    private faceService: FaceService,
    private ngZone: NgZone
  ) {}

  isBothAdded: boolean = false;
  colSize: number = 2;
  colNum: number = 2;
  @ViewChild(FirstImageDirective, { static: true })
  appFirstImage: FirstImageDirective;
  @ViewChild(SecondImageDirective, { static: true })
  appSecondImage: SecondImageDirective;
  components = new Map();
  private currentId: number = 0;
  faces = new Map<number, string>();
  comparation: string;
  confidence: number;

  // Feliratkozik a megfelelő observable-ekre
  ngOnInit(): void {
    this.getQueryParam();
    this.listenForComponentRemove();
    this.verifyIfAvailable();
  }

  // A képernyőméret változásának megfelelően állítja a mat-grid-list oszlopainak számát
  ngAfterContentInit() {
    let gridByBreakpoint = {
      xl: 2,
      lg: 2,
      md: 2,
      sm: 1,
      xs: 1,
    };
    this.observableMedia.media$.subscribe((change: MediaChange) => {
      if (this.components.size > 1) {
        this.colNum = gridByBreakpoint[change.mqAlias];
      }
    });
  }

  // Ha új képet töltünk fel, akkor hozzáadja a megfelelő komponenst, illetve az ImgService-ben beállítja a kiválasztott fájlt.
  handleFileInput(event) {
    this.addUploadComponent();
    this.imgService.uploadFile(event);
  }

  // Dinamikusan létrehoz, és a templateben a megfelelő (első üres) helyre beszúr egy feltöltött képet megjelenítő komponenst,
  // beállítja az id-ját, és a componens map-be is beleteszi az új komponens direktiváját.
  addUploadComponent() {
    if (!this.isBothAdded) {
      let comp = FaceUploadComponent;
      let location = null;
      if (this.appFirstImage.viewContainerRef.length === 0) {
        location = this.appFirstImage;
      } else {
        location = this.appSecondImage;
      }
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        comp
      );

      const viewContainerRef = location.viewContainerRef;
      viewContainerRef.clear();

      let newComp = viewContainerRef.createComponent(componentFactory);
      (<FaceUploadComponent>newComp.instance).id = this.currentId;

      this.components.set(this.currentId, location);

      this.currentId++;

      if (this.components.size === 2) {
        this.isBothAdded = true;
        this.colSize = 1;
      }
    }
  }

  // addUploadComponent() -hez hasonló, csak fotózni képes komponenst hoz létre.
  addCaptureComponent() {
    if (!this.isBothAdded) {
      let comp = FaceCaptureComponent;
      let location = null;
      if (this.appFirstImage.viewContainerRef.length === 0) {
        location = this.appFirstImage;
      } else {
        location = this.appSecondImage;
      }

      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        comp
      );

      const viewContainerRef = location.viewContainerRef;
      viewContainerRef.clear();

      let newComp = viewContainerRef.createComponent(componentFactory);
      (<FaceCaptureComponent>newComp.instance).id = this.currentId;
      this.components.set(this.currentId, location);
      this.currentId++;

      if (this.components.size == 2) {
        this.isBothAdded = true;
        this.colSize = 1;
      }
    }
  }

  // A queryparaméter kiolvasását végzi, amennyiben ez "upload", FaceUploadComponent jön létre, egyébként FaceDetectComponent.
  private getQueryParam() {
    this.route.queryParamMap.subscribe((params) => {
      let type = params.get("type");
      if (type === "upload") {
        this.addUploadComponent();
      } else {
        this.addCaptureComponent();
      }
    });
  }

  // Feliratkozik arra az observable-re, amin a törölni kivánt komponensek id-ja érkezik.
  private listenForComponentRemove() {
    this.deleteService.getIdOfDeleted().subscribe((id) => {
      if (this.components.get(id) != undefined) {
        this.components.get(id).viewContainerRef.clear();
        this.components.delete(id);
        this.faces.delete(id);
        this.isBothAdded = false;
        if (this.components.size == 0) {
          this.router.navigate(["home"]);
        }
      }
    });
  }

  // Feliratkozik a komponensek által küldött faceId-kra, és amennyiben már kettő beérkezett, akkor egy hívást
  // intéz a szerverhez, és a válaszban megkapja, hogy a két arc azonos emberhez tartozik-e, illetve hogy ezt milyen biztonsággal döntötte el.
  // Ezt a két adatot beállítja, hogy a template-en is megjelenhessen.
  private verifyIfAvailable() {
    this.imgService.getFace().subscribe((face: FaceData) => {
      if (this.faces.size < 2) {
        this.faces.set(face.id, face.faceId);
      }
      if (this.faces.size === 2) {
        const faceIds = Array.from(this.faces.values());
        this.faceService
          .verifyFaces(faceIds)
          .subscribe((response: VerifyResponse) => {
            if (response.isIdentical) {
              this.ngZone.run(() => (this.comparation = "identical"));
              this.ngZone.run(
                () => (this.confidence = response.confidence * 100)
              );
            } else {
              this.ngZone.run(() => (this.comparation = "different"));
              this.ngZone.run(
                () => (this.confidence = (1 - response.confidence) * 100)
              );
            }
          });
      }
    });
  }
}
