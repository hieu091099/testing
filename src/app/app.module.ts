import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PdfGeneraterComponent } from './components/pdf-generater/pdf-generater.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
@NgModule({
  declarations: [AppComponent, PdfGeneraterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CKEditorModule,
    NgxDocViewerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
