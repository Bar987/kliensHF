import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { Face, FaceAdapter } from "src/app/models/face.model";
import { catchError, map } from "rxjs/operators";
import { VerifyResponse } from "src/app/models/verify-response.model";

@Injectable({
  providedIn: "root",
})
export class FaceService {
  constructor(private http: HttpClient, private adapter: FaceAdapter) {}

  private API_URL = "https://myklienshf.cognitiveservices.azure.com/face/v1.0/";

  private httpOptionsDetect = {
    headers: new HttpHeaders({
      "Content-Type": "application/octet-stream",
    }),
    params: new HttpParams()
      .set("returnFaceId", "true")
      .set("returnFaceAttributes", "age,gender,glasses")
      .set("recognitionModel", "recognition_02"),
  };

  private httpOptionsVerify = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  // Elküld egy képet a szervernek, és visszakapja a tulajdonságait
  detectFace(img: Blob): Observable<Face[]> {
    return this.http
      .post(this.API_URL + "/detect", img, this.httpOptionsDetect)
      .pipe(
        map((data: any) => data.map((item) => this.adapter.adapt(item))),
        catchError(this.handleError)
      );
  }

  // Elküld két faceId-t a szervernek, majd a válaszban megkapja, hogy azonos emberhez tartoznak-e, és milyen bizonyossággal.
  verifyFaces(faceIds: string[]): Observable<VerifyResponse> {
    const body = {
      faceId1: faceIds[0],
      faceId2: faceIds[1],
    };
    return this.http.post<VerifyResponse>(
      this.API_URL + "verify",
      JSON.stringify(body),
      this.httpOptionsVerify
    );
  }
  
  // Http error esetén a hibát kiírja alertben
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      alert("An error occurred: " + error.error.message);
    } else {
      alert(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError("Something bad happened; please try again later.");
  }
}
