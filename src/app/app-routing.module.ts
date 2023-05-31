import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PdfGeneraterComponent } from './components/pdf-generater/pdf-generater.component';

const routes: Routes = [
  {
    path: '',
    component: PdfGeneraterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
