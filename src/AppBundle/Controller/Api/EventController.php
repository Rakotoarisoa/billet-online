<?php


namespace AppBundle\Controller\Api;
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
use Symfony\Component\Routing\Exception\MethodNotAllowedException;


class EventController extends AbstractFOSRestController
{

    /**
     * @Rest\Get("/api/events/list")
     */
    public function getAllEvents()
    {
        $restResult = $this->getDoctrine()->getRepository(Evenement::class)->findAll();
        if ($restResult === null) {
            return new View("there are no users exist", Response::HTTP_NOT_FOUND);
        }
        return $restResult;
    }

    /**
     * @Rest\Get("/api/event/{id}")
     * Get Event by Id
     * @param $id
     * @return View|object|null
     */
    public function getEventById($id)
    {
        $restResult = $this->getDoctrine()->getRepository(Evenement::class)->find($id);
        if ($restResult === null) {
            return new View("there are no users exist", Response::HTTP_NOT_FOUND);
        }
        return $restResult;
    }
    /**
     * @Rest\Get("/api/event/{id}/getMap")
     * Get Event by Id
     * @param $id
     * @return View|object|null
     */
    public function getEventMapById($id)
    {
        $restResult = $this->getDoctrine()->getRepository(Evenement::class)->find($id);
        if ($restResult === null) {
            return new View("there are no map event exist", Response::HTTP_NOT_FOUND);
        }
        //var_dump(unserialize(json_decode($restResult->getEtatSalle())));
        return json_decode(unserialize($restResult->getEtatSalle()),JSON_UNESCAPED_SLASHES);
    }
    /**
     * @Rest\Get("/api/event/update/{id}")
     * @param $id
     * @return View|object|null
     */
    public function setEventSeatMap($id){
        $em=$this->getDoctrine()->getManager();

        $restResult = $this->getDoctrine()->getRepository(Evenement::class)->find($id);

    }
    /**
     * @Rest\Get("/api/event/delete/{id}")
     * @param $id
     * @return View|object|null
     */
    public function deleteEvent(Request $request){
        if($request->getMethod() != 'POST')
            return new MethodNotAllowedException('');
        $id=$request->get('id');
        $sn = $this->getDoctrine()->getManager();
        $event = $this->getDoctrine()->getRepository(Evenement::class)->find($id);
        if (empty($event)) {
            return new View("Evènement non trouvé", Response::HTTP_NOT_FOUND);
        }
        else {
            $sn->remove($event);
            $sn->flush();
        }
        return new View("Supprimé", Response::HTTP_OK);
    }
    //TODO: Récupérer données de la carte
}