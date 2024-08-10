<?php

namespace App\Events;

use Log;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CustomerEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    // public $customer;
    // public function __construct()
    // {
    //     Log::channel('event')->info('inside construct', []);
    // }

    public function broadcastAs()
    {
        Log::channel('event')->info('inside broadcast as customer event', []);
        return "update";
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        Log::channel('event')->info('inside broadcast on customer event');

        return [new Channel('customer-update')];
    }
}
