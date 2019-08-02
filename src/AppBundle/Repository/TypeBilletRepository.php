<?php

namespace AppBundle\Repository;
use AppBundle\Entity\Evenement;
use AppBundle\Entity\LieuEvenement;
use AppBundle\Entity\TypeBillet;
use AppBundle\Entity\Reservation;
use Doctrine\ORM\EntityRepository;
/**
 * EvenementRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class TypeBilletRepository extends EntityRepository
{
    public function getAllTicketType()
    {
        return $this->getEntityManager()->createQuery('SELECT tb.id, tb.libelle FROM AppBundle:TypeBillet tb  ORDER BY tb.libelle DESC')->getResult();

    }
}
