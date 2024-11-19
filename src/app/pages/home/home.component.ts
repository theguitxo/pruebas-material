import { Component } from '@angular/core';
import { PageTitleComponent } from '../../components/page-title/page-title.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    imports: [PageTitleComponent]
})
export class HomeComponent {}
