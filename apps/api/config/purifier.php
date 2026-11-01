<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Configuración de HTMLPurifier
    |--------------------------------------------------------------------------
    |
    | El contenido del editor (TipTap) llega como HTML y se limpia antes de
    | guardarlo: así la web pública puede pintarlo sin riesgo de XSS aunque en
    | el futuro haya más de un usuario escribiendo.
    |
    */

    'encoding' => 'UTF-8',
    'finalize' => true,
    'ignoreNonStrings' => false,
    'cachePath' => storage_path('app/purifier'),
    'cacheFileMode' => 0755,

    'settings' => [

        'default' => [
            'HTML.Doctype' => 'HTML 4.01 Transitional',
            'HTML.Allowed' => 'div,b,strong,i,em,u,a[href|title|target|rel],ul,ol,li,p[style],br,'
                .'span[style],img[width|height|alt|src|loading],h1,h2,h3,h4,h5,h6,blockquote,'
                .'pre,code,hr,figure,figcaption,table,thead,tbody,tr,th,td,s,del,ins,sub,sup,'
                .'iframe[src|width|height|frameborder|allowfullscreen|title]',
            'CSS.AllowedProperties' => 'font,font-size,font-weight,font-style,font-family,'
                .'text-decoration,padding-left,color,background-color,text-align',
            'AutoFormat.AutoParagraph' => false,
            'AutoFormat.RemoveEmpty' => true,
        ],

        'content' => [
            'HTML.SafeIframe' => true,
            'URI.SafeIframeRegexp' => '%^(https?:)?//(www\.youtube(?:-nocookie)?\.com/embed/|player\.vimeo\.com/video/)%',
            'Attr.AllowedFrameTargets' => ['_blank', '_self'],
            'HTML.TargetBlank' => true,
            'URI.AllowedSchemes' => ['http' => true, 'https' => true, 'mailto' => true, 'tel' => true],
        ],

    ],

];
