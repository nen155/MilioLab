<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\Post;
use App\Models\Setting;
use App\Models\Tag;
use App\Models\Theme;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Datos iniciales: usuario administrador, páginas, entradas de ejemplo,
     * categorías, etiquetas, menú y ajustes del sitio.
     *
     * Todo se crea con `updateOrCreate`, así que se puede ejecutar varias veces.
     */
    public function run(): void
    {
        $admin = $this->adminUser();

        $categories = $this->categories();
        $tags = $this->tags();
        $pages = $this->pages($admin);

        $this->posts($admin, $categories, $tags);
        $this->settings($pages['inicio']);
        $this->themes();
        $this->menu($pages);
    }

    private function adminUser(): User
    {
        $user = User::query()->updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@miliolab.com')],
            [
                'name' => env('ADMIN_NAME', 'MilioLab'),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'miliolab')),
                'role' => User::ROLE_ADMIN,
                'email_verified_at' => now(),
            ],
        );

        return $user;
    }

    /**
     * @return array<string, Category>
     */
    private function categories(): array
    {
        $names = [
            'noticias' => ['Noticias', 'News'],
            'tutoriales' => ['Tutoriales', 'Tutorials'],
            'proyectos' => ['Proyectos', 'Projects'],
        ];

        $categories = [];

        foreach ($names as $slug => [$name, $nameEn]) {
            $categories[$slug] = Category::query()->updateOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'name_en' => $nameEn],
            );
        }

        return $categories;
    }

    /**
     * @return array<string, Tag>
     */
    private function tags(): array
    {
        $tags = [];

        $names = [
            'Angular' => 'Angular',
            'Laravel' => 'Laravel',
            'Diseño' => 'Design',
            'Producto' => 'Product',
        ];

        foreach ($names as $name => $nameEn) {
            $slug = Str::slug($name);

            $tags[$slug] = Tag::query()->updateOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'name_en' => $nameEn],
            );
        }

        return $tags;
    }

    /**
     * @return array<string, Page>
     */
    private function pages(User $admin): array
    {
        $pages = [
            'inicio' => [
                'title' => 'Inicio',
                'title_en' => 'Home',
                'excerpt' => 'Un rincón para contar lo que construyo y lo que aprendo por el camino.',
                'excerpt_en' => 'A corner to share what I build and what I learn along the way.',
                'body' => <<<'HTML'
                    <h2>Hola, bienvenido a MilioLab</h2>
                    <p>Este es mi espacio personal: aquí escribo sobre desarrollo web, producto y las
                    pequeñas obsesiones que aparecen cuando uno intenta hacer las cosas bien.</p>
                    <p>La web que estás viendo la he construido desde cero: <strong>Angular</strong> para la
                    parte pública, otro <strong>Angular</strong> para el panel de edición y una
                    <strong>API en Laravel</strong>. Sin plantillas mágicas ni plugins de terceros: solo el
                    contenido y yo.</p>
                    <blockquote>Si algo no existe y lo necesito, lo construyo. Así nació este CMS.</blockquote>
                    <p>Puedes leer las últimas entradas en el <a href="/blog">blog</a> o escribirme desde la
                    página de <a href="/contacto">contacto</a>.</p>
                    HTML,
                'body_en' => <<<'HTML'
                    <h2>Hello, welcome to MilioLab</h2>
                    <p>This is my personal space: I write about web development, product and the small
                    obsessions that show up when you try to do things properly.</p>
                    <p>You are looking at a site I built from scratch: <strong>Angular</strong> for the
                    public side, another <strong>Angular</strong> app for the editing panel and a
                    <strong>Laravel API</strong>. No magic templates or third-party plugins: just the
                    content and me.</p>
                    <blockquote>If something does not exist and I need it, I build it. That is how this CMS was born.</blockquote>
                    <p>You can read the latest posts on the <a href="/blog">blog</a> or write to me from the
                    <a href="/contacto">contact</a> page.</p>
                    HTML,
                'status' => Page::STATUS_PUBLISHED,
                'template' => 'landing',
            ],
            'sobre-mi' => [
                'title' => 'Sobre mí',
                'title_en' => 'About me',
                'excerpt' => 'Desarrollador de software. Me gusta construir cosas que se usen.',
                'excerpt_en' => 'Software developer. I like building things people actually use.',
                'body' => <<<'HTML'
                    <h2>Quién está detrás</h2>
                    <p>Soy Emilio, desarrollador de software. Trabajo sobre todo con Angular, Laravel y
                    todo lo que haga falta para que una idea llegue a producción.</p>
                    <p>MilioLab es mi laboratorio: un sitio donde probar ideas, contar lo que aprendo y
                    enseñar los proyectos en los que voy trabajando.</p>
                    <h3>Con qué trabajo</h3>
                    <ul>
                      <li>Frontend con Angular y TypeScript.</li>
                      <li>Backend con Laravel y PHP.</li>
                      <li>Bases de datos MySQL/MariaDB y despliegues en hosting compartido.</li>
                    </ul>
                    <p>Si quieres hablar de un proyecto, escríbeme a
                    <a href="mailto:hola@miliolab.com">hola@miliolab.com</a>.</p>
                    HTML,
                'body_en' => <<<'HTML'
                    <h2>Who is behind this</h2>
                    <p>I am Emilio, a software developer. I mostly work with Angular, Laravel and whatever
                    it takes to get an idea into production.</p>
                    <p>MilioLab is my laboratory: a place to try ideas, write about what I learn and show
                    the projects I am working on.</p>
                    <h3>What I work with</h3>
                    <ul>
                      <li>Frontend with Angular and TypeScript.</li>
                      <li>Backend with Laravel and PHP.</li>
                      <li>MySQL/MariaDB databases and deployments on shared hosting.</li>
                    </ul>
                    <p>If you want to talk about a project, write to me at
                    <a href="mailto:hola@miliolab.com">hola@miliolab.com</a>.</p>
                    HTML,
                'status' => Page::STATUS_PUBLISHED,
            ],
            'contacto' => [
                'title' => 'Contacto',
                'title_en' => 'Contact',
                'excerpt' => '¿Tienes una idea o una pregunta? Escríbeme.',
                'excerpt_en' => 'Do you have an idea or a question? Write to me.',
                'body' => <<<'HTML'
                    <h2>Hablemos</h2>
                    <p>La forma más rápida de contactar conmigo es por correo:</p>
                    <p><strong><a href="mailto:hola@miliolab.com">hola@miliolab.com</a></strong></p>
                    <p>También puedes encontrarme en <a href="https://github.com/nen155" target="_blank" rel="noopener">GitHub</a>.</p>
                    HTML,
                'body_en' => <<<'HTML'
                    <h2>Let's talk</h2>
                    <p>The fastest way to reach me is by email:</p>
                    <p><strong><a href="mailto:hola@miliolab.com">hola@miliolab.com</a></strong></p>
                    <p>You can also find me on <a href="https://github.com/nen155" target="_blank" rel="noopener">GitHub</a>.</p>
                    HTML,
                'status' => Page::STATUS_PUBLISHED,
            ],
        ];

        $created = [];

        foreach ($pages as $slug => $data) {
            $created[$slug] = Page::query()->updateOrCreate(
                ['slug' => $slug],
                $data + [
                    'author_id' => $admin->id,
                    'published_at' => now()->subDays(10),
                ],
            );
        }

        return $created;
    }

    /**
     * @param  array<string, Category>  $categories
     * @param  array<string, Tag>  $tags
     */
    private function posts(User $admin, array $categories, array $tags): void
    {
        $posts = [
            [
                'slug' => 'por-que-mi-propio-cms',
                'title' => 'Por qué he construido mi propio CMS',
                'title_en' => 'Why I built my own CMS',
                'excerpt' => 'WordPress funciona, pero quería entender cada línea de lo que publico. Este es el resultado.',
                'excerpt_en' => 'WordPress works, but I wanted to understand every line I publish. This is the result.',
                'category' => 'noticias',
                'tags' => ['producto', 'laravel', 'angular'],
                'published_at' => now()->subDays(2),
                'body' => <<<'HTML'
                    <p>Durante años he usado WordPress para proyectos pequeños. Funciona, hay plugins para
                    todo y en una tarde tienes un blog. Pero cada vez que quería cambiar algo terminaba
                    peleándome con un ecosistema que no controlaba.</p>
                    <p>Así que hice lo que cualquier persona razonable haría: construirlo desde cero.</p>
                    <h2>Qué quería</h2>
                    <ul>
                      <li>Un editor cómodo, sin distracciones.</li>
                      <li>Páginas y entradas con la misma importancia.</li>
                      <li>Control total del HTML que se publica.</li>
                      <li>Una web rápida, sin plugins que carguen cosas que no uso.</li>
                    </ul>
                    <h2>Cómo está hecho</h2>
                    <p>La parte pública es una aplicación Angular que consume una API en Laravel. El panel
                    de administración es otra aplicación Angular independiente. La base de datos es
                    MariaDB y todo vive en un hosting compartido.</p>
                    <p>No hay magia: si quiero una funcionalidad nueva, la programo. Y eso, para un
                    laboratorio personal, es exactamente lo que buscaba.</p>
                    HTML,
                'body_en' => <<<'HTML'
                    <p>For years I used WordPress for small projects. It works, there is a plugin for
                    everything and you can have a blog running in an afternoon. But every time I wanted
                    to change something I ended up fighting an ecosystem I did not control.</p>
                    <p>So I did what any reasonable person would do: build it from scratch.</p>
                    <h2>What I wanted</h2>
                    <ul>
                      <li>A comfortable editor without distractions.</li>
                      <li>Pages and posts with the same importance.</li>
                      <li>Full control over the HTML that gets published.</li>
                      <li>A fast site, without plugins loading things I do not use.</li>
                    </ul>
                    <h2>How it is built</h2>
                    <p>The public side is an Angular application that consumes a Laravel API. The admin
                    panel is another independent Angular app. The database is MariaDB and everything runs
                    on shared hosting.</p>
                    <p>There is no magic: if I want a new feature, I code it. And for a personal
                    laboratory, that is exactly what I was looking for.</p>
                    HTML,
            ],
            [
                'slug' => 'angular-22-lo-que-mas-me-gusta',
                'title' => 'Angular 22: lo que más me gusta',
                'title_en' => 'Angular 22: what I like the most',
                'excerpt' => 'Signals, componentes standalone y un modo zoneless que por fin se siente natural.',
                'excerpt_en' => 'Signals, standalone components and a zoneless mode that finally feels natural.',
                'category' => 'tutoriales',
                'tags' => ['angular', 'producto'],
                'published_at' => now()->subDays(6),
                'body' => <<<'HTML'
                    <p>Angular ha cambiado mucho en los últimos años. La versión 22 consolida una forma de
                    trabajar que se parece bastante a lo que siempre quise: menos ceremonia y más código
                    directo.</p>
                    <h2>Signals en todas partes</h2>
                    <p>El estado reactivo con <code>signal()</code> y <code>computed()</code> hace que los
                    componentes sean más fáciles de leer. Ya no hay que pensar en suscripciones que hay que
                    cerrar a mano.</p>
                    <h2>Zoneless</h2>
                    <p>Quitar <code>zone.js</code> reduce el tamaño del bundle y hace que el cambio de
                    detección sea explícito. Al principio cuesta, pero el resultado es más predecible.</p>
                    <h2>Componentes standalone</h2>
                    <p>Los módulos siguen existiendo, pero ya no son el centro del universo. Cada componente
                    declara lo que necesita y se acabó.</p>
                    <p>Si vienes de versiones anteriores, el salto más grande es mental: deja de pensar en
                    módulos y empieza a pensar en funcionalidades.</p>
                    HTML,
                'body_en' => <<<'HTML'
                    <p>Angular has changed a lot in recent years. Version 22 consolidates a way of working
                    that looks a lot like what I always wanted: less ceremony and more direct code.</p>
                    <h2>Signals everywhere</h2>
                    <p>Reactive state with <code>signal()</code> and <code>computed()</code> makes
                    components easier to read. You no longer have to think about subscriptions that must
                    be closed by hand.</p>
                    <h2>Zoneless</h2>
                    <p>Removing <code>zone.js</code> reduces the bundle size and makes change detection
                    explicit. It takes some getting used to, but the result is more predictable.</p>
                    <h2>Standalone components</h2>
                    <p>Modules still exist, but they are no longer the centre of the universe. Each
                    component declares what it needs and that is it.</p>
                    <p>If you come from older versions, the biggest leap is mental: stop thinking in
                    modules and start thinking in features.</p>
                    HTML,
            ],
            [
                'slug' => 'disenar-un-blog-que-no-parezca-una-plantilla',
                'title' => 'Diseñar un blog que no parezca una plantilla',
                'title_en' => 'Designing a blog that does not look like a template',
                'excerpt' => 'Cuatro decisiones pequeñas que cambian por completo la sensación de un sitio.',
                'excerpt_en' => 'Four small decisions that completely change how a site feels.',
                'category' => 'proyectos',
                'tags' => ['diseno', 'producto'],
                'published_at' => now()->subDays(12),
                'body' => <<<'HTML'
                    <p>Hay algo reconfortante en las plantillas: todo encaja y no hay que decidir nada. Pero
                    también hacen que todos los sitios se parezcan.</p>
                    <h2>1. Una sola tipografía, bien elegida</h2>
                    <p>No necesitas tres fuentes. Con una familia con buenos pesos y un tamaño de línea
                    generoso ya tienes el 80% del trabajo.</p>
                    <h2>2. Espacio en blanco de verdad</h2>
                    <p>El contenido respira cuando hay margen. Si tienes que elegir entre meter una cosa más
                    o dejar aire, deja aire.</p>
                    <h2>3. Un color de acento y nada más</h2>
                    <p>Un acento fuerte usado con moderación guía la mirada. Cinco colores compitiendo no
                    guían nada.</p>
                    <h2>4. Detalles que no se ven</h2>
                    <p>Transiciones cortas, estados de foco visibles, imágenes que no saltan al cargar. Son
                    cosas que nadie comenta, pero todo el mundo nota cuando faltan.</p>
                    HTML,
                'body_en' => <<<'HTML'
                    <p>There is something comforting about templates: everything fits and you do not have
                    to decide anything. But they also make every site look the same.</p>
                    <h2>1. One typeface, well chosen</h2>
                    <p>You do not need three fonts. A family with good weights and a generous line height
                    already gets you 80% of the way.</p>
                    <h2>2. Real white space</h2>
                    <p>Content breathes when there is margin. If you have to choose between adding one
                    more thing or leaving air, leave air.</p>
                    <h2>3. One accent colour and nothing else</h2>
                    <p>A strong accent used sparingly guides the eye. Five competing colours guide
                    nothing.</p>
                    <h2>4. Details you do not see</h2>
                    <p>Short transitions, visible focus states, images that do not jump while loading.
                    Nobody comments on them, but everyone notices when they are missing.</p>
                    HTML,
            ],
        ];

        foreach ($posts as $data) {
            $post = Post::query()->updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'title' => $data['title'],
                    'title_en' => $data['title_en'],
                    'excerpt' => $data['excerpt'],
                    'excerpt_en' => $data['excerpt_en'],
                    'body' => $data['body'],
                    'body_en' => $data['body_en'],
                    'category_id' => $categories[$data['category']]->id,
                    'status' => Post::STATUS_PUBLISHED,
                    'published_at' => $data['published_at'],
                    'author_id' => $admin->id,
                ],
            );

            $post->tags()->sync(
                collect($data['tags'])->map(fn (string $slug) => $tags[$slug]->id)->all()
            );
        }
    }

    private function settings(Page $home): void
    {
        $settings = [
            ['key' => 'site_name', 'value' => 'MilioLab', 'type' => Setting::TYPE_STRING, 'group' => 'general'],
            ['key' => 'site_tagline', 'value' => 'Ideas, código y cosas que voy aprendiendo', 'type' => Setting::TYPE_STRING, 'group' => 'general'],
            ['key' => 'site_tagline_en', 'value' => 'Ideas, code and things I keep learning', 'type' => Setting::TYPE_STRING, 'group' => 'general'],
            ['key' => 'site_description', 'value' => 'Blog personal de Emilio: desarrollo web, producto y proyectos propios.', 'type' => Setting::TYPE_TEXT, 'group' => 'general'],
            ['key' => 'site_description_en', 'value' => 'Emilio\'s personal blog: web development, product and personal projects.', 'type' => Setting::TYPE_TEXT, 'group' => 'general'],
            ['key' => 'site_url', 'value' => env('APP_URL', 'https://miliolab.com'), 'type' => Setting::TYPE_STRING, 'group' => 'general'],
            ['key' => 'accent_color', 'value' => '#6366f1', 'type' => Setting::TYPE_STRING, 'group' => 'apariencia'],
            ['key' => 'home_page_id', 'value' => (string) $home->id, 'type' => Setting::TYPE_INT, 'group' => 'general'],
            ['key' => 'posts_per_page', 'value' => '9', 'type' => Setting::TYPE_INT, 'group' => 'blog'],
            ['key' => 'blog_title', 'value' => 'Blog', 'type' => Setting::TYPE_STRING, 'group' => 'blog'],
            ['key' => 'blog_title_en', 'value' => 'Blog', 'type' => Setting::TYPE_STRING, 'group' => 'blog'],
            ['key' => 'blog_intro', 'value' => 'Lo que voy aprendiendo, contado sin prisa.', 'type' => Setting::TYPE_TEXT, 'group' => 'blog'],
            ['key' => 'blog_intro_en', 'value' => 'What I keep learning, told without hurry.', 'type' => Setting::TYPE_TEXT, 'group' => 'blog'],
            ['key' => 'contact_email', 'value' => 'hola@miliolab.com', 'type' => Setting::TYPE_STRING, 'group' => 'contacto'],
            ['key' => 'footer_text', 'value' => 'Desarrollado con IA · Angular y Laravel.', 'type' => Setting::TYPE_STRING, 'group' => 'general'],
            ['key' => 'footer_text_en', 'value' => 'Developed with AI · Angular and Laravel.', 'type' => Setting::TYPE_STRING, 'group' => 'general'],
            ['key' => 'social_github', 'value' => 'https://github.com/nen155', 'type' => Setting::TYPE_STRING, 'group' => 'social'],
            ['key' => 'social_linkedin', 'value' => '', 'type' => Setting::TYPE_STRING, 'group' => 'social'],
            ['key' => 'social_x', 'value' => '', 'type' => Setting::TYPE_STRING, 'group' => 'social'],
            ['key' => 'social_youtube', 'value' => '', 'type' => Setting::TYPE_STRING, 'group' => 'social'],
            ['key' => 'show_author', 'value' => '1', 'type' => Setting::TYPE_BOOL, 'group' => 'blog'],
        ];

        foreach ($settings as $setting) {
            Setting::query()->updateOrCreate(['key' => $setting['key']], $setting);
        }
    }

    private function themes(): void
    {
        Theme::query()->updateOrCreate(
            ['slug' => 'cuaderno'],
            [
                'name' => 'Cuaderno de laboratorio',
                'layout' => 'notebook',
                'tokens' => [
                    '--paper' => '#f6f3ea',
                    '--paper-2' => '#efeade',
                    '--ink' => '#17161a',
                    '--ink-soft' => '#3b3a42',
                    '--ink-mute' => '#6d6a63',
                    '--line' => '#d9d3c4',
                    '--line-strong' => '#b9b2a1',
                    '--accent' => '#4f46e5',
                    '--accent-ink' => '#ffffff',
                    '--accent-soft' => '#e8e6fb',
                ],
                'is_active' => Theme::query()->where('is_active', true)->doesntExist(),
            ],
        );

        $nodos = Theme::query()->updateOrCreate(
            ['slug' => 'nodos'],
            [
                'name' => 'Nodos',
                'layout' => 'sketch',
                'tokens' => [
                    '--paper' => '#120e1d',
                    '--paper-2' => '#1a1430',
                    '--ink' => '#f1ecff',
                    '--ink-soft' => '#cdc2ee',
                    '--ink-mute' => '#9a8fc0',
                    '--line' => '#2e2450',
                    '--line-strong' => '#4b3a7a',
                    '--accent' => '#a855f7',
                    '--accent-ink' => '#120e1d',
                    '--accent-soft' => '#2a1b47',
                    '--grid' => 'rgb(168 85 247 / 8%)',
                    '--grid-size' => '32px',
                ],
            ],
        );

        Theme::query()->updateOrCreate(
            ['slug' => 'granito'],
            [
                'name' => 'Granito',
                'layout' => 'sketch',
                'tokens' => [
                    '--paper' => '#e9e4d8',
                    '--paper-2' => '#ded7c7',
                    '--ink' => '#24211c',
                    '--ink-soft' => '#4a443b',
                    '--ink-mute' => '#7a7264',
                    '--line' => '#c9c0ae',
                    '--line-strong' => '#a89d88',
                    '--accent' => '#b45309',
                    '--accent-ink' => '#ffffff',
                    '--accent-soft' => '#f3e3cf',
                    '--grid' => 'rgb(36 33 28 / 5%)',
                    '--grid-size' => '28px',
                ],
            ],
        );

        Theme::query()->updateOrCreate(
            ['slug' => 'marco-dorado'],
            [
                'name' => 'Marco dorado',
                'layout' => 'cards',
                'tokens' => [
                    '--paper' => '#171310',
                    '--paper-2' => '#211a14',
                    '--ink' => '#f3e8cf',
                    '--ink-soft' => '#d6c6a5',
                    '--ink-mute' => '#9c8d72',
                    '--line' => '#3a2f22',
                    '--line-strong' => '#5a4830',
                    '--accent' => '#d4a13a',
                    '--accent-ink' => '#1a1208',
                    '--accent-soft' => '#2e2417',
                    '--grid' => 'rgb(212 161 58 / 8%)',
                    '--grid-size' => '32px',
                ],
            ],
        );

        Theme::query()->updateOrCreate(
            ['slug' => 'consola'],
            [
                'name' => 'Consola',
                'layout' => 'hud',
                'tokens' => [
                    '--paper' => '#0b0f0d',
                    '--paper-2' => '#121a16',
                    '--ink' => '#d7ffe6',
                    '--ink-soft' => '#9fe0b8',
                    '--ink-mute' => '#6a9c7f',
                    '--line' => '#1e3328',
                    '--line-strong' => '#2f5a42',
                    '--accent' => '#22c55e',
                    '--accent-ink' => '#04120a',
                    '--accent-soft' => '#0f2a1b',
                    '--grid' => 'rgb(34 197 94 / 7%)',
                    '--grid-size' => '40px',
                ],
            ],
        );

        // El tema de nodos es el que se quiere enseñar por defecto.
        $nodos->activate();
    }

    /**
     * @param  array<string, Page>  $pages
     */
    private function menu(array $pages): void
    {
        $items = [
            ['label' => 'Inicio', 'label_en' => 'Home', 'page_id' => $pages['inicio']->id, 'position' => 0],
            ['label' => 'Blog', 'label_en' => 'Blog', 'url' => '/blog', 'position' => 1],
            ['label' => 'Proyectos', 'label_en' => 'Projects', 'url' => '/proyectos', 'position' => 2],
            ['label' => 'Habilidades', 'label_en' => 'Skills', 'url' => '/habilidades', 'position' => 3],
            ['label' => 'Sobre mí', 'label_en' => 'About me', 'page_id' => $pages['sobre-mi']->id, 'position' => 4],
            ['label' => 'Contacto', 'label_en' => 'Contact', 'page_id' => $pages['contacto']->id, 'position' => 5],
        ];

        foreach ($items as $item) {
            MenuItem::query()->updateOrCreate(
                ['label' => $item['label']],
                $item + ['target' => '_self', 'is_active' => true],
            );
        }
    }
}
