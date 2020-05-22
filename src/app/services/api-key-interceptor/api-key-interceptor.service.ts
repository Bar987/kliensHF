import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApiKeyInterceptorService implements HttpInterceptor {
  constructor() {}

  private apikey: string = "131450b6cfe847d090cdb0452886d4a1";

  // Minden egyes http kérés fejlécébe beleteszi az api-kulcsot
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clonedRequest = request.clone({
      headers: request.headers.append("Ocp-Apim-Subscription-Key", this.apikey),
    });
    return next.handle(clonedRequest);
  }
}
