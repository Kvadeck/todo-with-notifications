<?php

namespace App\Controller;

use App\Message\SendSocketMessage;
use App\Repository\TasksRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;
use GuzzleHttp\Client;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[Route('/api', name: 'api_')]
class TasksController extends AbstractController
{
    private $tasksRepository;
    private $bus;
    private $client;

    public function __construct(TasksRepository $tasksRepository, MessageBusInterface $bus, HttpClientInterface $client)
    {
        $this->tasksRepository = $tasksRepository;
        $this->bus = $bus;
        $this->client = $client;
    }

    /**
     * @Route("/all", name="app_tasks", methods={"GET"})
     */
    public function getAllTasks(): JsonResponse
    {
        $tasks = $this->tasksRepository->findAll();
        $data = [];

        foreach ($tasks as $task) {
            $data[] = [
                'id' => $task->getId(),
                'taskName' => $task->getTaskName(),
                'time' => $task->getTaskTime(),
                'category' => $task->getCategory(),
                'completed' => $task->isCompleted(),
            ];
        }

        //         $this->bus->dispatch(new SendSocketMessage($data));

        return new JsonResponse($data, Response::HTTP_OK);
    }

    /**
     * @Route("/trigger-notification", name="trigger_notification", methods={"POST"})
     */
    public function triggerNotification(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $this->client->request('POST', 'http://127.0.0.1:3000/emit', [
                    'json' => $data,
        ]);

        return new JsonResponse(['status' => 'Message dispatched']);
    }

    /**
     * @Route("/get/{id}", name="get_one_task", methods={"GET"})
     */
    public function getOneTask($id): JsonResponse
    {
        $task = $this->tasksRepository->findOneBy(['id' => $id]);

        $data = [
            'id' => $task->getId(),
            'taskName' => $task->getTaskName(),
            'time' => $task->getTaskTime(),
            'category' => $task->getCategory(),
            'completed' => $task->isCompleted(),
        ];

        return new JsonResponse(['task' => $data], Response::HTTP_OK);
    }

   /**
     * @Route("/add", name="add_task", methods={"POST"})
     */
    public function addTask(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $taskName = $data['taskName'];
        $taskTime = $data['time'];
        $category = $data['category'];
        $completed = $data['completed'];

        if (empty($taskName) || empty($taskTime) || empty($category)) {
                    throw new NotFoundHttpException('Expecting mandatory parameters!');
        }

        $id = $this->tasksRepository->saveTask($category, $completed, $taskName, $taskTime);

        return new JsonResponse(['id' => $id], Response::HTTP_CREATED);
    }

    /**
     * @Route("/update/{id}", name="update_task", methods={"PUT"})
     */
    public function updateTask($id, Request $request): JsonResponse
    {
        $task = $this->tasksRepository->findOneBy(['id' => $id]);
        $data = json_decode($request->getContent(), true);

        $this->tasksRepository->updateTask($task, $data);

        return new JsonResponse(['status' => 'task updated!']);
    }

    /**
     * @Route("/delete/{id}", name="delete_task", methods={"DELETE"})
     */
    public function deleteTask($id): JsonResponse
    {
        $task = $this->tasksRepository->findOneBy(['id' => $id]);

        $this->tasksRepository->removeTask($task);

        return new JsonResponse(['status' => 'task deleted!']);
    }


}
