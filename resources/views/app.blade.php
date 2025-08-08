<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="app-timezone" content="{{ config('app.timezone') }}">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- SEO Meta Tags --}}
        <meta name="description" content="Online piano lessons for kids ages 5–14. Live 1-on-1 with friendly, vetted teachers. Flexible scheduling, fun curriculum, progress tracking, and parent updates — learn piano at home with confidence.">
        <meta name="keywords" content="online piano lessons for kids, private piano lessons for children, beginner piano classes, piano teacher online, kids music lessons, learn piano at home, piano lessons for beginners, virtual piano teacher">
        <meta name="author" content="Learn Piano Online">
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
        <meta name="theme-color" content="#8B5CF6">
        <meta name="msapplication-TileColor" content="#8B5CF6">
        <link rel="canonical" href="{{ url()->current() }}">

        {{-- Open Graph / Facebook --}}
        <meta property="og:title" content="Learn Piano Online — Private Piano Lessons for Kids">
        <meta property="og:description" content="Live 1-on-1 online piano lessons for kids with friendly teachers, a playful curriculum, and parent progress updates. Flexible scheduling — learn from home.">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:type" content="website">
        <meta property="og:locale" content="en_US">
        <meta property="og:site_name" content="Learn Piano Online">
        <meta property="og:image" content="{{ asset('logo.svg') }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="Learn Piano Online - Professional Piano Lessons">

        {{-- Twitter --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Learn Piano Online — Private Piano Lessons for Kids">
        <meta name="twitter:description" content="Fun, live 1-on-1 online piano lessons for kids with friendly teachers and parent updates. Flexible, effective, and at-home.">
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

        {{-- Page-specific meta overrides and structured data --}}
        @if(request()->is('/'))
        {{-- Home: meta overrides tailored to parents and young learners --}}
        <meta name="description" content="Fun online piano lessons for kids ages 5+. Live 1-on-1 with friendly teachers, playful curriculum, and clear parent updates. Flexible scheduling — start learning from home.">
        <meta property="og:title" content="Online Piano Lessons for Kids | Live 1-on-1 at Home">
        <meta property="og:description" content="Give your child the joy of music. Live 1-on-1 online piano lessons with friendly teachers, personalized homework, and motivating feedback.">
        <meta property="og:type" content="website">
        <meta name="twitter:title" content="Online Piano Lessons for Kids | Live 1-on-1 at Home">
        <meta name="twitter:description" content="Live 1-on-1 piano lessons for kids. Friendly teachers. Flexible scheduling. Parent progress updates.">

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
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What ages are your piano lessons for?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Our lessons are designed for children ages 5 and up — beginners to intermediate learners."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How long are the lessons?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Standard lessons are 30 minutes, with 45-minute options for older or more advanced students."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Do we need a piano at home?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "An acoustic piano or an 88-key touch-sensitive digital keyboard works great for starting out."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How much do lessons cost?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Affordable plans start at ${{ env('MONTHLY_SUBSCRIBE_PRICE', '29.99') }} per month with no long-term contracts."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Can parents see progress?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes. Parents receive clear progress updates, practice goals, and tips after each lesson."
                    }
                }
            ]
        }
        </script>
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "{{ url('/') }}"}
            ]
        }
        </script>
        @endif

        @if(request()->is('pricing'))
        {{-- Pricing: meta overrides and product structured data --}}
        <meta name="description" content="Simple, affordable pricing for online piano lessons for kids. Choose monthly or yearly plans with live 1-on-1 lessons and parent progress updates.">
        <meta property="og:title" content="Pricing | Online Piano Lessons for Kids">
        <meta property="og:description" content="Flexible plans for every family — live 1-on-1 lessons, friendly teachers, and progress tracking.">
        <meta property="og:type" content="website">
        <meta name="twitter:title" content="Pricing | Online Piano Lessons for Kids">
        <meta name="twitter:description" content="Flexible plans for every family — live 1-on-1 lessons, friendly teachers, and progress tracking.">
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
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "{{ url('/') }}"},
                {"@type": "ListItem", "position": 2, "name": "Pricing", "item": "{{ url('/pricing') }}"}
            ]
        }
        </script>
        @endif

        @if(request()->is('about'))
        {{-- About: meta and breadcrumbs --}}
        <meta name="description" content="Meet the team behind Learn Piano Online. Our mission is to make music education joyful and accessible, with vetted instructors and a child-friendly curriculum.">
        <meta property="og:title" content="About Us | Learn Piano Online">
        <meta property="og:description" content="Our mission, our teachers, and our approach to helping kids love piano.">
        <meta property="og:type" content="website">
        <meta name="twitter:title" content="About Us | Learn Piano Online">
        <meta name="twitter:description" content="Our mission, our teachers, and our approach to helping kids love piano.">
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "{{ url('/') }}"},
                {"@type": "ListItem", "position": 2, "name": "About", "item": "{{ url('/about') }}"}
            ]
        }
        </script>
        @endif

        @if(request()->is('contact'))
        {{-- Contact: meta and breadcrumbs --}}
        <meta name="description" content="Have questions about online piano lessons for your child? Contact our friendly team for help with scheduling, pricing, or getting started.">
        <meta property="og:title" content="Contact Us | Learn Piano Online">
        <meta property="og:description" content="We're here to help you choose the right plan and schedule lessons that fit your family.">
        <meta property="og:type" content="website">
        <meta name="twitter:title" content="Contact Us | Learn Piano Online">
        <meta name="twitter:description" content="We're here to help you choose the right plan and schedule lessons that fit your family.">
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "{{ url('/') }}"},
                {"@type": "ListItem", "position": 2, "name": "Contact", "item": "{{ url('/contact') }}"}
            ]
        }
        </script>
        @endif

        @if(request()->is('blog'))
        {{-- Blog index: meta and breadcrumbs --}}
        <meta name="description" content="Parent tips, practice ideas, and music education resources to help your child thrive at the piano.">
        <meta property="og:title" content="Blog | Piano Tips for Parents and Kids">
        <meta property="og:description" content="Practical guidance for supporting your young pianist at home.">
        <meta property="og:type" content="website">
        <meta name="twitter:title" content="Blog | Piano Tips for Parents and Kids">
        <meta name="twitter:description" content="Practical guidance for supporting your young pianist at home.">
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "{{ url('/') }}"},
                {"@type": "ListItem", "position": 2, "name": "Blog", "item": "{{ url('/blog') }}"}
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
