<?php


namespace AppBundle\Repository;


class EventOptionsRepository
{
    public function getAllEventOptionsByEvent($event){
        return $this->getEntityManager()
            ->createQuery('SELECT e FROM AppBundle:Evenement e ORDER BY e.dateDebutEvent ASC')
            ->setParameter()
            ->getResult();
    }
    public function getEventOptionByEvent($event,$option){

    }
}
