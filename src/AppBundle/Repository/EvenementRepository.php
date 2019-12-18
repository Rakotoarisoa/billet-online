<?php

namespace AppBundle\Repository;
use AppBundle\Entity\Evenement;
use AppBundle\Entity\User;
use AppBundle\Entity\LieuEvenement;
use Doctrine\ORM\EntityRepository;
/**
 * EvenementRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class EvenementRepository extends EntityRepository
{
    public function search($titre=null,$lieu=null,$date=null,$cat=null)
    {
        return $this->getEntityManager()
            ->createQuery('SELECT e.id,e.titreEvenementSlug, e.titreEvenement, e.imageEvent, e.dateDebutEvent, e.dateFinEvent, lieu.nomSalle FROM AppBundle:Evenement e
            LEFT JOIN AppBundle:LieuEvenement lieu WITH e.lieuEvenement=lieu.id JOIN AppBundle:CategorieEvenement cat WITH e.categorieEvenement=cat.id
           WHERE 
           e.titreEvenement LIKE :titre AND 
           lieu.nomSalle LIKE :lieu AND 
           e.dateDebutEvent LIKE :date AND
           cat.libelle LIKE :cat AND
            e.isPublished = 1
            ORDER BY e.dateDebutEvent DESC')
            ->setParameter('titre', '%'.$titre.'%')
            ->setParameter('lieu', '%'.$lieu.'%')
            ->setParameter('date', '%'.$date.'%')
            ->setParameter('cat','%'.$cat.'%')
            ->getResult();
    }
    public function getAllEvents()
    {
        return $this->getEntityManager()
            ->createQuery('SELECT e FROM AppBundle:Evenement e ORDER BY e.dateDebutEvent ASC')
            ->getResult();

    }
    public function getEventsByUser(User $user,$titre=null,$lieu=null,$date=null){
        return $this->getEntityManager()
            ->createQuery('SELECT e.id,e.isPublished,e.titreEvenementSlug, e.titreEvenement, e.imageEvent, e.dateDebutEvent, e.dateFinEvent, lieu.nomSalle FROM AppBundle:Evenement e
            LEFT JOIN AppBundle:LieuEvenement lieu WITH e.lieuEvenement=lieu.id
           WHERE e.user=:user AND e.titreEvenement LIKE :titre AND lieu.nomSalle LIKE :lieu AND e.dateDebutEvent LIKE :date')
            ->setParameter('titre', '%'.$titre.'%')
            ->setParameter('lieu', '%'.$lieu.'%')
            ->setParameter('date', '%'.$date.'%')
            ->setParameter('user', $user)
            ->getResult();
    }

    /** @fonction initier plan de salle
     * @param Evenement $event
     * $
     */
    public function initMapEvent(Evenement $event=null)
    {
        $em=$this->getEntityManager();

        if($event){
            $em->persist($event);
            $em->flush($event);
            return true;
        }
        return false;
    }

    /**
     * get Event with search and user
     */

    public function getSearchEvent($event_name=null,$event_creator=null,$user=null){ 
        
        $qbEvent = $this->createQueryBuilder('e')
                        ->andWhere('1 = 1')
                        ->andWhere('e.user = :user')
                        ->setParameter('user',$user);                        
            
        if($event_name){
            $qbEvent->andWhere('e.titreEvenement LIKE :titreEvenement')
                    ->setParameter('titreEvenement','%'.$event_name.'%');

        }
        // if($event_state){
        //     $qbEvent->andWhere('e.titreEvenement LIKE :titreEvenement')
        //             ->setParameter('titreEvenement','%'.$event_state.'%');

        // }*/
        if($event_creator){
            $qbEvent->andWhere('e.organisation LIKE :organisation')
                    ->setParameter('organisation','%'.$event_creator.'%');

        }
        $qbEvent->orderBy('e.dateDebutEvent','DESC');
        return $qbEvent->getQuery()
                       ->execute();
                    
    }
}
