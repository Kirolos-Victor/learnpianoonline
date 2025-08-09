<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Psr\Http\Message\UriInterface;
use Spatie\Sitemap\SitemapGenerator;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'sitemap:generate';

    /**
     * The console command description.
     */
    protected $description = 'Generate the sitemap for the application.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $baseUrl = (string) config('app.url', 'http://localhost');
        $sitemapPath = public_path('sitemap.xml');

        SitemapGenerator::create($baseUrl)
            ->setMaximumCrawlCount(1000)
            ->shouldCrawl(function (UriInterface $url): bool {
                $path = $url->getPath() ?? '/';

                // Block admin-ish or private areas
                if (preg_match('#^/(admin|instructor|parent|student)(/.*)?$#i', $path)) {
                    return false;
                }

                // Block auth / system / tooling / APIs / payments / chat / legacy home
                if (preg_match('#^/(login|logout|register|password|email|verify-email|sanctum|telescope|horizon|_debugbar|api|payment|chat|home)(/.*)?$#i', $path)) {
                    return false;
                }

                // Block any inertia/asset helper paths that might appear
                if (preg_match('#^/(build|storage|vendor|favicon\\.ico|logo\\.svg)(/.*)?$#i', $path)) {
                    return false;
                }

                return true;
            })
            ->hasCrawled(function (Url $url): Url {
                $now = Carbon::now();
                $path = parse_url((string) $url->url, PHP_URL_PATH) ?: '/';

                // Normalize changefreq/priority for marketing pages to target parents/kids learning 1-on-1 piano lessons
                switch (true) {
                    case $path === '/' || $path === '':
                        $url->setPriority(1.0)->setChangeFrequency('weekly')->setLastModificationDate($now);
                        // Add a representative image on the homepage
                        $url->addImage(url('logo.svg'), 'Learn Piano Online – 1-on-1 Private Piano Lessons for Kids and Parents');
                        break;

                    case preg_match('#^/pricing/?$#i', $path) === 1:
                        $url->setPriority(0.9)->setChangeFrequency('monthly')->setLastModificationDate($now);
                        break;

                    case preg_match('#^/sessions/?$#i', $path) === 1:
                        $url->setPriority(0.85)->setChangeFrequency('weekly')->setLastModificationDate($now);
                        break;

                    case preg_match('#^/blog/?$#i', $path) === 1:
                        $url->setPriority(0.75)->setChangeFrequency('weekly')->setLastModificationDate($now);
                        break;

                    case preg_match('#^/about/?$#i', $path) === 1:
                        $url->setPriority(0.65)->setChangeFrequency('monthly')->setLastModificationDate($now);
                        break;

                    case preg_match('#^/contact/?$#i', $path) === 1:
                        $url->setPriority(0.65)->setChangeFrequency('monthly')->setLastModificationDate($now);
                        break;

                    default:
                        // Reasonable defaults for other public pages
                        $url->setPriority(0.6)->setChangeFrequency('monthly')->setLastModificationDate($now);
                        break;
                }

                return $url;
            })
            ->writeToFile($sitemapPath);

        $this->info('Sitemap generated at: ' . $sitemapPath);
        return self::SUCCESS;
    }
}
