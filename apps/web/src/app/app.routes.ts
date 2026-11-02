import { Routes } from '@angular/router';

import { BlogListComponent } from './features/blog/blog-list.component';
import { PostDetailComponent } from './features/blog/post-detail.component';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { PageViewComponent } from './features/page/page-view.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { SkillsComponent } from './features/skills/skills.component';
import { TextIndexComponent } from './features/text/text-index.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'texto', component: TextIndexComponent },
  { path: 'proyectos', component: ProjectsComponent },
  { path: 'habilidades', component: SkillsComponent },
  { path: 'blog', component: BlogListComponent },
  { path: 'blog/categoria/:category', component: BlogListComponent },
  { path: 'blog/etiqueta/:tag', component: BlogListComponent },
  { path: 'blog/:slug', component: PostDetailComponent },
  { path: '404', component: NotFoundComponent },
  { path: ':slug', component: PageViewComponent },
  { path: '**', component: NotFoundComponent },
];
