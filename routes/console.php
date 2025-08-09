<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('subscriptions:process-expired')
    ->dailyAt('23:59')
    ->name('process-expired-subscriptions')
    ->description('Process expired student subscriptions daily');

Schedule::command('sitemap:generate')
    ->dailyAt('02:30')
    ->name('generate-sitemap')
    ->description('Generate the sitemap daily');
