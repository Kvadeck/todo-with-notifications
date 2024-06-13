<?php

namespace App\MessageHandler;

use App\Message\SendSocketMessage;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use GuzzleHttp\Client;

#[AsMessageHandler]
class SendSocketMessageHandler
{
    public function __invoke(SendSocketMessage $message)
    {
        $data = $message->getData();

                       $client = new Client();
                       $client->post('http://localhost:3000/emit', [
                           'json' => $data
                       ]);
    }
}