import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material/toolbar";
import { FaceCaptureComponent } from "./components/face-capture/face-capture.component";
import { MatCardModule } from "@angular/material/card";
import { MainContainerComponent } from "./components/main-container/main-container.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { FlexLayoutModule } from "@angular/flex-layout";
import { HomeComponent } from "./components/home/home.component";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FaceUploadComponent } from "./components/face-upload/face-upload.component";
import { FirstImageDirective } from "./directives/first-image.directive";
import { SecondImageDirective } from "./directives/second-image.directive";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ApiKeyInterceptorService } from "./services/api-key-interceptor/api-key-interceptor.service";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { FaceDetailsComponent } from "./components/face-details/face-details.component";
@NgModule({
  declarations: [
    AppComponent,
    FaceCaptureComponent,
    MainContainerComponent,
    HomeComponent,
    FaceUploadComponent,
    FirstImageDirective,
    FaceDetailsComponent,
    SecondImageDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    FlexLayoutModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatDividerModule,
    MatListModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiKeyInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [FaceCaptureComponent, FaceUploadComponent],
})
export class AppModule {}
