<?php


namespace AppBundle\Controller\Api;
use AppBundle\Entity\Billet;
use AppBundle\Entity\Evenement;
use Doctrine\ORM\EntityManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\View\View;
use AppBundle\Entity\User;


class BilletController extends AbstractFOSRestController
{

    /**
     * @Rest\View
     * @Rest\Get("/api/billets/list")
     */
    public function getAllTicket()
    {
        $restResult = $this->getDoctrine()->getRepository(Billet::class)->findAll();
        if ($restResult === null) {
            return new View("there are no users exist", Response::HTTP_NOT_FOUND);
        }
        return $restResult;
    }

    /**
     * @Rest\Get("/api/billet/{id}")
     * Get Event by Id
     * @param $id
     * @return View|object|null
     */
    public function getTicketById($id)
    {
        $restResult = $this->getDoctrine()->getRepository(Billet::class)->find($id);
        if ($restResult === null) {
            return new View("there are no users exist", Response::HTTP_NOT_FOUND);
        }
        return View::create($restResult, Response::HTTP_OK);
    }
    /**
     * @Rest\Get("/api/ticket/update/{id}")
     * @param $id
     * @return View|object|null
     */
    public function setEventSeatMap($id){
        $em=$this->getDoctrine()->getManager();

        $restResult = $this->getDoctrine()->getRepository(Billet::class)->find($id);

    }
    /**
     * @Rest\Get("/api/ticket/delete/{id}")
     * @param $id
     * @return View|object|null
     */
    public function deleteTicket(Request $request){

        $id=$request->get('id');
        $sn = $this->getDoctrine()->getManager();
        $user = $this->getDoctrine()->getRepository(Billet::class)->find($id);
        if (empty($user)) {
            return new View("Ticket non trouvé", Response::HTTP_NOT_FOUND);
        }
        else {
            $sn->remove($user);
            $sn->flush();
        }
        return new View("Supprimé", Response::HTTP_OK);
    }
    //TODO: Récupérer données de la carte
    /**
     * @Rest\View
     * @Rest\Get("/api/event/{id}/billet/list")
     * @param $id
     * @return View|object|null
     */
    public function getTicketByEvent($id){
        $evenement =$this->getDoctrine()->getRepository(Evenement::class)->find($id);
        $billet = $this->getDoctrine()->getRepository(Billet::class)->findBy(['evenement'=> $evenement]);
        if ($billet === null) {
            return new View("there are no users exist", Response::HTTP_NOT_FOUND);
        }
        return $billet;

    }

    //TODO: Récupérer données de la carte
    /**
     * @Rest\View
     * @Rest\Get("/api/event/{id}/billet/mapped/list/")
     * @param $id
     * @return View|object|null
     */
    public function getMappedTicketSeatMap($id){
        $billet =$this->getDoctrine()->getRepository(Billet::class)->getMappedSeatMapTickets($id);
        if ($billet === null) {
            return new View("there are no users exist", Response::HTTP_NOT_FOUND);
        }
        return $billet;

    }
    /**
     * SELECT * FROM `billet` b
    JOIN typebillet tb ON tb.id=b.id_billet
    JOIN evenement evt ON tb.id_evenement=evt.id
    WHERE tb.id=95 and b.est_vendu = 0 ORDER BY b.id ASC LIMIT 15
     *
     */
    public function getBilletsRestants($event, $typeBillet, $nbr){
        $list=$this->getDoctrine()->getRepository(Billet::class)->getLeftTicketsByType();

    }


    public function countBilletsRestantsByType(){

    }




}