import { Component, OnInit, Input } from "@angular/core";
import { Face } from "src/app/models/face.model";

@Component({
  selector: "app-face-details",
  templateUrl: "./face-details.component.html",
  styleUrls: ["./face-details.component.scss"],
})
export class FaceDetailsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Input() face: Face;
}
