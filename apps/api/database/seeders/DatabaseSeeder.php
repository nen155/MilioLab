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
            'noticias' => 'Noticias',
            'tutoriales' => 'Tutoriales',
            'proyectos' => 'Proyectos',
        ];

        $categories = [];

        foreach ($names as $slug => $name) {
            $categories[$slug] = Category::query()->updateOrCreate(
                ['slug' => $slug],
                ['name' => $name],
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

        foreach (['Angular', 'Laravel', 'Diseño', 'Producto'] as $name) {
            $slug = Str::slug($name);

            $tags[$slug] = Tag::query()->updateOrCreate(
                ['slug' => $slug],
                ['name' => $name],
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
                'excerpt' => 'Un rincón para contar lo que construyo y lo que aprendo por el camino.',
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
                'status' => Page::STATUS_PUBLISHED,
                'template' => 'landing',
            ],
            'sobre-mi' => [
                'title' => 'Sobre mí',
                'excerpt' => 'Desarrollador de software. Me gusta construir cosas que se usen.',
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
                'status' => Page::STATUS_PUBLISHED,
            ],
            'contacto' => [
                'title' => 'Contacto',
                'excerpt' => '¿Tienes una idea o una pregunta? Escríbeme.',
                'body' => <<<'HTML'
                    <h2>Hablemos</h2>
                    <p>La forma más rápida de contactar conmigo es por correo:</p>
                    <p><strong><a href="mailto:hola@miliolab.com">hola@miliolab.com</a></strong></p>
                    <p>También puedes encontrarme en <a href="https://github.com/nen155" target="_blank" rel="noopener">GitHub</a>.</p>
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
                'excerpt' => 'WordPress funciona, pero quería entender cada línea de lo que publico. Este es el resultado.',
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
            ],
            [
                'slug' => 'angular-22-lo-que-mas-me-gusta',
                'title' => 'Angular 22: lo que más me gusta',
                'excerpt' => 'Signals, componentes standalone y un modo zoneless que por fin se siente natural.',
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
            ],
            [
                'slug' => 'disenar-un-blog-que-no-parezca-una-plantilla',
                'title' => 'Diseñar un blog que no parezca una plantilla',
                'excerpt' => 'Cuatro decisiones pequeñas que cambian por completo la sensación de un sitio.',
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
            ],
        ];

        foreach ($posts as $data) {
            $post = Post::query()->updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'title' => $data['title'],
                    'excerpt' => $data['excerpt'],
                    'body' => $data['body'],
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
            ['key' => 'site_description', 'value' => 'Blog personal de Emilio: desarrollo web, producto y proyectos propios.', 'type' => Setting::TYPE_TEXT, 'group' => 'general'],
            ['key' => 'site_url', 'value' => env('APP_URL', 'https://miliolab.com'), 'type' => Setting::TYPE_STRING, 'group' => 'general'],
            ['key' => 'accent_color', 'value' => '#6366f1', 'type' => Setting::TYPE_STRING, 'group' => 'apariencia'],
            ['key' => 'home_page_id', 'value' => (string) $home->id, 'type' => Setting::TYPE_INT, 'group' => 'general'],
            ['key' => 'posts_per_page', 'value' => '9', 'type' => Setting::TYPE_INT, 'group' => 'blog'],
            ['key' => 'blog_title', 'value' => 'Blog', 'type' => Setting::TYPE_STRING, 'group' => 'blog'],
            ['key' => 'blog_intro', 'value' => 'Lo que voy aprendiendo, contado sin prisa.', 'type' => Setting::TYPE_TEXT, 'group' => 'blog'],
            ['key' => 'contact_email', 'value' => 'hola@miliolab.com', 'type' => Setting::TYPE_STRING, 'group' => 'contacto'],
            ['key' => 'footer_text', 'value' => 'Hecho a mano con Angular y Laravel.', 'type' => Setting::TYPE_STRING, 'group' => 'general'],
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

        // El tema de nodos es el que se quiere enseñar por defecto.
        $nodos->activate();
    }

    /**
     * @param  array<string, Page>  $pages
     */
    private function menu(array $pages): void
    {
        $items = [
            ['label' => 'Inicio', 'page_id' => $pages['inicio']->id, 'position' => 0],
            ['label' => 'Blog', 'url' => '/blog', 'position' => 1],
            ['label' => 'Sobre mí', 'page_id' => $pages['sobre-mi']->id, 'position' => 2],
            ['label' => 'Contacto', 'page_id' => $pages['contacto']->id, 'position' => 3],
        ];

        foreach ($items as $item) {
            MenuItem::query()->updateOrCreate(
                ['label' => $item['label']],
                $item + ['target' => '_self', 'is_active' => true],
            );
        }
    }
}
