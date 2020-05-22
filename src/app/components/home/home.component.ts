import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ImgService } from "src/app/services/img-service/img.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private imgService: ImgService) {}

  ngOnInit(): void {}

  // A kiválasztott fájlt az ImgService segítségével kibocsájtja, majd a 'detect' routera navigál, az 'upload' query paraméterrel,
  // hogy egy FileUploadComponent töltödjön be a MainConntainerComponent inicializásakor  
  public handleFileInput(event) {
    this.imgService.uploadFile(event);
    this.router.navigate(["detect"], {
      queryParams: {
        type: "upload",
      },
    });
  }
}
