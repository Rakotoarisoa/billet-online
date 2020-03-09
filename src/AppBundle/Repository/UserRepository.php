<?php


namespace AppBundle\Repository;


use Doctrine\ORM\EntityRepository;
use AppBundle\Entity\User;

class UserRepository extends EntityRepository
{
    /**
     * count Event
     */
    public function countEvents(User $user){
        return $this->getEntityManager()->createQuery('SELECT count(u) AS nombreEvents
            from AppBundle:User u
            JOIN AppBundle:Evenement e WITH u.id=e.user 
            WHERE u.id= :userId
            GROUP BY  u.id
            ')
            ->setParameter('userId', $user->getId())
            ->getResult();
    }
    public function countCheckout(User $user){
        return $this->getEntityManager()->createQuery('SELECT count(u) AS nombreCheckout
            from AppBundle:User u
            JOIN AppBundle:Evenement e WITH u.id=e.user
            LEFT JOIN AppBundle:Reservation r WITH e.id=r.evenement
            WHERE u.id= :userId
            GROUP BY  u.id
            ')
            ->setParameter('userId', $user->getId())
            ->getResult();
    }
    public function countTickets(User $user){
        return $this->getEntityManager()->createQuery('SELECT Count(u) AS nombreBillets
            from AppBundle:User u
            JOIN AppBundle:Evenement e WITH u.id=e.user
            LEFT JOIN AppBundle:TypeBillet tb WITH tb.evenement=e.id
            LEFT JOIN AppBundle:Billet b WITH tb.id=b.typeBillet
            WHERE u.id= :userId
            GROUP BY  u.id
            ')
            ->setParameter('userId', $user->getId())
            ->getResult();
    }
    public function countVerifiedTickets(User $user)
    {
        return $this->getEntityManager()->createQuery('SELECT Count(u) AS nombreBilletV
            from AppBundle:User u
            JOIN AppBundle:Evenement e WITH u.id=e.user
            LEFT JOIN AppBundle:TypeBillet tb WITH tb.evenement=e.id
            LEFT JOIN AppBundle:Billet b WITH tb.id=b.typeBillet
            WHERE u.id= :userId
            AND b.checked = 1
            GROUP BY  u.id
            ')
            ->setParameter('userId', $user->getId())
            ->getResult();
    }



    /**
     * count Event Public
     */
    public function countEventsPublic(User $user){
        return $this->getEntityManager()->createQuery('SELECT count(u) AS nombreEvents
            from AppBundle:User u
            JOIN AppBundle:Evenement e WITH u.id=e.user 
            WHERE u.id= :userId
            AND e.isPublished = True
            GROUP BY  u.id
            ')
            ->setParameter('userId', $user->getId())
            ->getResult();
    }

    /**
     * count Event Public
     */
    public function countEventsUsingSeatMap(User $user){
        return $this->getEntityManager()->createQuery('SELECT count(u) AS nombreEvents
            from AppBundle:User u
            JOIN AppBundle:Evenement e WITH u.id=e.user 
            WHERE u.id= :userId
            AND e.isUsingSeatMap = True
            GROUP BY  u.id
            ')
            ->setParameter('userId', $user->getId())
            ->getResult();
    }
}