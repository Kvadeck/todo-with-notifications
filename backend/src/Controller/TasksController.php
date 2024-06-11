<?php

namespace App\Controller;

use App\Repository\TasksRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;


#[Route('/api', name: 'api_')]
class TasksController extends AbstractController
{
    private $tasksRepository;

    public function __construct(TasksRepository $tasksRepository)
    {
        $this->tasksRepository = $tasksRepository;
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

        return new JsonResponse($data, Response::HTTP_OK);
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

        $this->tasksRepository->saveTask($category, $completed, $taskName, $taskTime);

        return new JsonResponse(['status' => 'task added!'], Response::HTTP_CREATED);
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
