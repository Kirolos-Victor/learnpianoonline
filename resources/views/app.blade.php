<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="app-timezone" content="{{ config('app.timezone') }}">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- SEO Meta Tags --}}
        <meta name="author" content="Learn Piano Online">
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
        <meta name="theme-color" content="#8B5CF6">
        <meta name="msapplication-TileColor" content="#8B5CF6">

        {{-- Open Graph / Facebook --}}
        <meta property="og:locale" content="en_US">
        <meta property="og:site_name" content="Learn Piano Online">
        <meta property="og:image" content="{{ asset('logo.svg') }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="Learn Piano Online - Professional Piano Lessons">

        {{-- Twitter --}}
        <meta name="twitter:site" content="@learnpianoonline">
        <meta name="twitter:creator" content="@learnpianoonline">
        <meta name="twitter:image" content="{{ asset('logo.svg') }}">

        {{-- Structured Data for Organization --}}
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Learn Piano Online",
            "url": "{{ url('/') }}",
            "logo": "{{ asset('logo.svg') }}",
            "description": "Fun online piano lessons for kids ages 5+! Live 1-on-1 instruction with friendly teachers, personalized homework, and helpful feedback.",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "{{ env('SUPPORT_PHONE', '1-800-PIANO-01') }}",
                "contactType": "customer service",
                "availableLanguage": "English",
                "email": "{{ env('SUPPORT_EMAIL', 'support@learnpianoonline.com') }}"
            },
            "sameAs": [
                "https://www.facebook.com/learnpianoonline",
                "https://www.instagram.com/learnpianoonline",
                "https://www.youtube.com/learnpianoonline"
            ]
        }
        </script>

        {{-- Page-specific structured data --}}
        @if(request()->is('/'))
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Online Piano Lessons for Kids",
            "description": "Fun 1-on-1 online piano lessons for kids ages 5+ with friendly teachers, personalized homework, and exciting activities.",
            "provider": {
                "@type": "Organization",
                "name": "Learn Piano Online"
            },
            "serviceType": "Music Education",
            "audience": {
                "@type": "Audience",
                "audienceType": "Children ages 5 and up, all skill levels"
            },
            "offers": {
                "@type": "Offer",
                "price": "{{ env('MONTHLY_SUBSCRIBE_PRICE', '29.99') }}",
                "priceCurrency": "USD",
                "priceValidUntil": "2025-12-31",
                "availability": "https://schema.org/InStock"
            }
        }
        </script>
        @endif

        @if(request()->is('pricing'))
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Online Piano Lessons for Kids",
            "description": "Fun 1-on-1 online piano lessons for kids ages 5+ with friendly teachers",
            "brand": {
                "@type": "Organization",
                "name": "Learn Piano Online"
            },
            "offers": [
                {
                    "@type": "Offer",
                    "name": "Monthly Piano Lessons",
                    "price": "{{ env('MONTHLY_SUBSCRIBE_PRICE', '29.99') }}",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "validFrom": "2024-01-01",
                    "priceValidUntil": "2025-12-31",
                    "description": "4 fun 1-on-1 piano lessons per month with friendly teachers and personalized homework"
                },
                {
                    "@type": "Offer",
                    "name": "Yearly Piano Lessons",
                    "price": "{{ env('YEARLY_SUBSCRIBE_PRICE', '299.99') }}",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "validFrom": "2024-01-01",
                    "priceValidUntil": "2025-12-31",
                    "description": "48 fun 1-on-1 piano lessons per year with exciting activities and bonus features"
                }
            ]
        }
        </script>
        @endif

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link rel="dns-prefetch" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap" rel="stylesheet" />

        {{-- Performance optimizations --}}
        <link rel="preload" href="/logo.svg" as="image">
        <meta name="format-detection" content="telephone=no">
        <meta http-equiv="x-dns-prefetch-control" content="on">

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
