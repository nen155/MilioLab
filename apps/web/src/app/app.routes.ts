import { Routes } from '@angular/router';

import { BlogListComponent } from './features/blog/blog-list.component';
import { PostDetailComponent } from './features/blog/post-detail.component';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { PageViewComponent } from './features/page/page-view.component';
import { SkillsComponent } from './features/skills/skills.component';
import { TextIndexComponent } from './features/text/text-index.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'MilioLab' },
  { path: 'texto', component: TextIndexComponent, title: 'Versión texto · MilioLab' },
  { path: 'habilidades', component: SkillsComponent, title: 'Habilidades · MilioLab' },
  { path: 'blog', component: BlogListComponent },
  { path: 'blog/categoria/:category', component: BlogListComponent },
  { path: 'blog/etiqueta/:tag', component: BlogListComponent },
  { path: 'blog/:slug', component: PostDetailComponent },
  { path: '404', component: NotFoundComponent },
  { path: ':slug', component: PageViewComponent },
  { path: '**', component: NotFoundComponent },
];
