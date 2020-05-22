import { Injectable } from "@angular/core";
import { Adapter } from "../adapter/adapter";

export class Face {
  constructor(
    public faceId: string,
    public faceAttributes: FaceAttributes,
    public faceRectangle: FaceRectangle
  ) {}
}

export class FaceRectangle {
  constructor(
    public width: number,
    public height: number,
    public left: number,
    public top: number
  ) {}
}

export class FaceAttributes {
  constructor(
    public age: number,
    public gender: string,
    public glasses: string
  ) {}
}

@Injectable({
  providedIn: "root",
})
export class FaceAdapter implements Adapter<Face> {
  adapt(item: any): Face {
    return new Face(
      item.faceId,
      new FaceAttributes(
        item.faceAttributes.age,
        item.faceAttributes.gender,
        item.faceAttributes.glasses
      ),
      new FaceRectangle(
        item.faceRectangle.width,
        item.faceRectangle.height,
        item.faceRectangle.left,
        item.faceRectangle.top
      )
    );
  }
}
