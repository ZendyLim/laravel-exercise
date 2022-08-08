<?php

namespace App\Console\Commands;

use App\Models\Admin;
use App\Notifications\NotifyClientList;
use Illuminate\Console\Command;

class SendClientList extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:clients';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send client list to each of Admins';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $admins = Admin::all();

        foreach ($admins as $admin) {
            $clients = $admin->clients()->get();

            $admin->notify(new NotifyClientList($clients));
        }
    }
}
