<?php


namespace AppBundle\Controller\Api;
use AppBundle\Entity\Evenement;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\View\View;
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
     * @Rest\Get("/api/event/get-map/{id}")
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
        //var_dump($restResult->getEtatSalle());
        return unserialize($restResult->getEtatSalle());
    }
    /**
     * @Rest\Get("/event/get-map2/{id}")
     * Get Event by Id
     * @param $id
     * @return View|object|null
     */
    public function getEventMapById2($id)
    {
        $restResult = $this->getDoctrine()->getRepository(Evenement::class)->find($id);
        if ($restResult === null) {
            return new View("there are no map event exist", Response::HTTP_NOT_FOUND);
        }
        //var_dump(unserialize(json_decode($restResult->getEtatSalle())));
        var_dump(unserialize($restResult->getEtatSalle()));
        return json_decode($restResult->getEtatSalle(),true);
    }

    /**
     * @Rest\Post("/api/event/update-map/{id}")
     * @param Request $request
     * @param $id
     * @return string
     */
    public function setEventSeatMap(Request $request,$id){
        try {
            $em = $this->getDoctrine()->getManager();
            $data_map = $request->request->get('data_map');
            $event = $this->getDoctrine()->getRepository(Evenement::class)->find($id);
            $event->setEtatSalle(serialize($data_map));
            $em->persist($event);
            $em->flush($event);
        }
        catch (\Exception $e){
            return 'Cannot create Map';
        }

    }
    /**
     * @Rest\Post("/api/event/delete/{id}")
     * @param $id
     * @return View|object|null
     */
    public function deleteEvent(Request $request,$id){
        if($request->getMethod() != 'POST')
            return new MethodNotAllowedException('POST');
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