import {Routes} from '@angular/router';
import {PageNotFoundComponent} from './core/page-not-found/page-not-found.component';
import {MainComponent} from './features/main/main.component';
import {HomeComponent} from './features/home/home.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'main', component: MainComponent},
    {path: '**', component: PageNotFoundComponent}
];
