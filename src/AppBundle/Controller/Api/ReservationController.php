<?php


namespace AppBundle\Controller\Api;

use AppBundle\Entity\Billet;
use AppBundle\Entity\Reservation;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\View\View;



class ReservationController extends AbstractFOSRestController
{
    /**
     * @Rest\View
     * @Rest\Get("/api/order/{id}")
     */
    public function getOrder($id)
    {
        $billet_repo= $this->getDoctrine()->getRepository(Reservation::class);
        $reservation=$billet_repo->find($id);
        if ($reservation === null) {
            return new View("there are no Reservation exist", Response::HTTP_NOT_FOUND);
        }
        return $reservation;
    }

    /**
     * @Rest\View
     * @Rest\Get("/api/order/{id}/billets/list")
     */
    public function getAllTicketsByOrder($id)
    {
        $billet_repo= $this->getDoctrine()->getRepository(Billet::class);
        $billet_list=$billet_repo->findBy(['reservation'=>$id]);
        if ($billet_list === null) {
            return new View("there are no users exist", Response::HTTP_NOT_FOUND);
        }
        return array('data'=>$billet_list);
    }


}