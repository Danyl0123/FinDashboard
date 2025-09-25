import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { urlConfig } from 'src/enviroments/url-config';

@Component({
  imports: [RouterModule, LayoutPageComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';

  ngOnInit() {
    console.log(urlConfig.backendUrl);
  }
}
