<?php

namespace App\Console\Commands;

use App\Jobs\ProcessExpiredSubscriptions;
use Illuminate\Console\Command;

class ProcessExpiredSubscriptionsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:process-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process expired student subscriptions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        ProcessExpiredSubscriptions::dispatch();
    }
}
