<?php


namespace AppBundle\Controller\Api;
use AppBundle\Entity\Evenement;
use AppBundle\Entity\Billet;
use Doctrine\ORM\EntityManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\View\View;
use AppBundle\Entity\User;


class TypeBilletController extends AbstractFOSRestController
{

    /**
     * @Rest\Get("/api/typeBillet/list")
     */
    public function getAllTicketType()
    {
        $restResult = $this->getDoctrine()->getRepository(TypeBillet::class)->findAll();
        if ($restResult === null) {
            return new View("there are no users exist", Response::HTTP_NOT_FOUND);
        }
        return $restResult;
    }

    /**
     * @Rest\Get("/api/typeBilletLeft/{id}")
     * Get Event by Id
     * @param $id de l'évènement
     * @return View|object|null
     */
    public function getTicketTypeByEvent($id)
    {
        //$id : id de l'évènement
        $evenement = $this->getDoctrine()->getRepository(Evenement::class)->find($id);
        //$restResult = $this->getDoctrine()->getRepository(TypeBillet::class)->findBy(["evenement"=>$evenement,"active" => true]);
        //$restResult = $this->getDoctrine()->getRepository(Billet::class)->getListTicketsByType($evenement);
        $restResult = $this->getDoctrine()->getRepository(Billet::class)->getLeftTicketsByType($evenement);
        if ($restResult === null) {
            return new View("there are no users exist", Response::HTTP_NOT_FOUND);
        }
        return View::create($restResult,Response::HTTP_OK);
    }
    /**
     * @Rest\Get("/api/typeBillet/{id}")
     * Get Event by Id
     * @param $id de l'évènement
     * @return View|object|null
     */
    public function getTicketListTypeByEvent($id)
    {
        //$id : id de l'évènement
        $evenement = $this->getDoctrine()->getRepository(Evenement::class)->find($id);
        //$restResult = $this->getDoctrine()->getRepository(TypeBillet::class)->findBy(["evenement"=>$evenement,"active" => true]);
        //$restResult = $this->getDoctrine()->getRepository(Billet::class)->getListTicketsByType($evenement);
        $restResult = $this->getDoctrine()->getRepository(Billet::class)->getListTicketsByType($evenement);
        if ($restResult === null) {
            return new View("there are no users exist", Response::HTTP_NOT_FOUND);
        }
        return View::create($restResult,Response::HTTP_OK);
    }
    /**
     * @Rest\Get("/api/event/update/{id}")
     * @param $id
     * @return View|object|null
     */
    public function setEventSeatMap($id){
        $em=$this->getDoctrine()->getManager();

        $restResult = $this->getDoctrine()->getRepository(User::class)->find($id);

    }
    /**
     * @Rest\Get("/api/event/delete/{id}")
     * @param $id
     * @return View|object|null
     */
    public function deleteEvent($id){
        $data = new Evenement();
        $sn = $this->getDoctrine()->getManager();
        $user = $this->getDoctrine()->getRepository('AppBundle:User')->find($id);
        if (empty($user)) {
            return new View("Evènement non trouvé", Response::HTTP_NOT_FOUND);
        }
        else {
            $sn->remove($user);
            $sn->flush();
        }
        return new View("Supprimé", Response::HTTP_OK);
    }
    //TODO: Récupérer données de la carte
}