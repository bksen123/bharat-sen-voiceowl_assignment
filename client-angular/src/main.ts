import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    // Spread the providers already defined in appConfig, if any
    ...(appConfig.providers || []),
    // Add your additional providers here
    provideAnimations(),
    provideToastr({
       positionClass: 'toast-bottom-right'
    })
  ]
}).catch((err) => console.error(err));
