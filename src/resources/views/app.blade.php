<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <meta name="description" content="Find and share precision-tuned setups for EA Sports WRC cars, locations, and surface conditions.">
        <link rel="canonical" href="{{ url()->current() }}">

        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ config('app.name', 'EA WRC Setups') }}">
        <meta property="og:title" content="{{ config('app.name', 'EA WRC Setups') }}">
        <meta property="og:description" content="Find and share precision-tuned setups for EA Sports WRC cars, locations, and surface conditions.">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="{{ asset('images/social_preview.png') }}">
        <meta property="og:image:alt" content="EA WRC Setups setup browser">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ config('app.name', 'EA WRC Setups') }}">
        <meta name="twitter:description" content="Find and share precision-tuned setups for EA Sports WRC cars, locations, and surface conditions.">
        <meta name="twitter:image" content="{{ asset('images/social_preview.png') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
