<?php

namespace App\Services;

use Mews\Purifier\Facades\Purifier;

class HtmlSanitizer
{
    /**
     * Limpia el HTML del editor antes de guardarlo.
     *
     * Se aplica a entradas y páginas: la web pública confía en este contenido,
     * así que la limpieza tiene que ocurrir en el servidor y no en el navegador.
     */
    public function clean(?string $html): ?string
    {
        if ($html === null || trim($html) === '') {
            return null;
        }

        return Purifier::clean($html, 'content');
    }
}
