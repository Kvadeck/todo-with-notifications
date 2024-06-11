<?php

namespace App\Repository;

use App\Entity\Tasks;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @extends ServiceEntityRepository<Tasks>
 *
 * @method Tasks|null find($id, $lockMode = null, $lockVersion = null)
 * @method Tasks|null findOneBy(array $criteria, array $orderBy = null)
 * @method Tasks[]    findAll()
 * @method Tasks[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TasksRepository extends ServiceEntityRepository
{

    private $manager;

    public function __construct
    (
        ManagerRegistry $registry,
        EntityManagerInterface $manager
    )
    {
        parent::__construct($registry, Tasks::class);
        $this->manager = $manager;
    }

    public function saveTask($category, $completed, $taskName, $taskTime)
    {
        $newTask = new Tasks();

        $newTask
            ->setTaskName($taskName)
            ->setCategory($category)
            ->setCompleted($completed)
            ->setTaskTime($taskTime);

        $this->getEntityManager()->persist($newTask);
        $this->getEntityManager()->flush();

        return $newTask->getId();

    }

    public function updateTask(Tasks $task, $data)
    {
        empty($data['taskName']) ? true : $task->setTaskName($data['taskName']);
        empty($data['time']) ? true : $task->setTaskTime($data['time']);
        $task->setCompleted($data['completed']);
        empty($data['category']) ? true : $task->setCategory($data['category']);

        $this->manager->flush();
    }

    public function removeTask(Tasks $task)
    {
        $this->manager->remove($task);
        $this->manager->flush();
    }


}
