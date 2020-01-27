<?php


namespace AppBundle\Controller\Api;

use AppBundle\Entity\Evenement;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;
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
        return new View($restResult, 200);
    }

    /**
     * @Rest\Get("/api/events/user/list")
     */
    public function getAllEventsByUser()
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
        return new View($restResult);
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
        return JsonResponse::create(unserialize($restResult->getEtatSalle()));
    }

    /**
     * @Rest\Get("/api/event/get-map2/{id}")
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
        $unse = unserialize($restResult->getEtatSalle());
        return json_decode($restResult->getEtatSalle(), true);
    }

    //Search Section and Seat into array to Lock
    private function lockSeat($array, $section = '', $seat = '', $id)
    {
        foreach ($array as $key => $value) {
            if (is_array($value) && array_key_exists('mapping', $value) && $value['nom'] == trim($section)) {
                foreach ($value['mapping'] as $mapKey => $mapValue) {
                    if (is_array($mapValue) &&
                        array_key_exists('seat_id', $mapValue) &&
                        array_key_exists('type', $mapValue) &&
                        $mapValue['seat_id'] == trim($seat)
                    ) {
                        $em = $this->getDoctrine()->getManager();
                        $event = $em->getRepository(Evenement::class)->find($id);
                        $array = unserialize($event->getEtatSalle());
                        $array[$key]['mapping'][$mapKey]['is_choosed'] = true;
                        $event->setEtatSalle(serialize($array));
                        $em->persist($event);
                        $em->flush();
                    }
                }
            }
        }
    }

    /**
     * @Rest\Post("/api/event/seats/unlock-all")
     * Get Event by Id
     * @param $id
     * @return View|object|null
     */
    public function unlockSeat(Request $request, $id=null)
    {
        if ($request->getMethod() != 'POST')
            return new MethodNotAllowedException(['POST']);
        if ($request->request->has('event_id')) {
            $id=(int)$request->request->get('event_id');
            $em = $this->getDoctrine()->getManager();
            $event = $this->getDoctrine()->getRepository(Evenement::class)->find($id);
            $array = unserialize($event->getEtatSalle());
            foreach ($array as $key => $value) {
                if (is_array($value) && array_key_exists('mapping', $value)) {
                    foreach ($value['mapping'] as $mapKey => $mapValue) {
                        if (is_array($mapValue) &&
                            array_key_exists('type', $mapValue)
                        ) {
                            if ($array[$key]['mapping'][$mapKey]['is_choosed']) {
                                $array[$key]['mapping'][$mapKey]['is_choosed'] = false;
                                $event->setEtatSalle(serialize($array));
                                $em->persist($event);
                                $em->flush();
                                return new Response('Done',200);
                            }
                            return new Response('No item to unlock',200);
                        }
                    }
                }
            }
        }
    }
    /**
     * @Rest\Post("/api/event/seat/is-locked")
     */
    //Search Section and Seat into array to Lock
    public function isLocked(Request $request, $array = null, $section = '', $seat = '')
    {
        if ($request->getMethod() != 'POST')
            return new MethodNotAllowedException(['POST']);
        if ($request->request->has('section_id') && $request->request->has('seat_id') && $request->request->has('table_event') && $request->request->has('lock_action') && $request->request->has('event_id')) {
            $array = $request->request->get('table_event');
            $section = $request->request->get('section_id');
            $seat = $request->request->get('seat_id');
            $lock_action = $request->request->get('lock_action');
            $id = $request->request->get('event_id');
            foreach ($array as $key => $value) {
                if (is_array($value) && array_key_exists('mapping', $value) && $value['nom'] == trim($section)) {
                    foreach ($value['mapping'] as $mapKey => $mapValue) {
                        if (is_array($mapValue) && array_key_exists('seat_id', $mapValue) && array_key_exists('type', $mapValue) &&
                            $mapValue['seat_id'] == trim($seat) && $mapValue['is_choosed'] == "true") {
                            return JsonResponse::create(true);
                        }
                        if ($lock_action) {
                            $this->lockSeat($array, $section, $seat, $id);
                        }
                        return JsonResponse::create(false);
                    }
                }
            }
        }
    }

    /**
     * @Rest\Get("/api/event/lock-seat/{id}/lock")
     * @param $id
     * @param $section
     * @param $seat
     * @return string
     */
    public function LockSeatBySectionAndSeat($id, $section = "Resa 2", $seat = "A1", $operation = "lock")
    {
        $restResult = $this->getDoctrine()->getRepository(Evenement::class)->find($id);
        $arraySalle = unserialize($restResult->getEtatSalle());
        if ($operation = "lock" && $section != null && $seat != null) {
            if (is_array($arraySalle) and count($arraySalle) > 0) {
                return JsonResponse::create(unserialize($this->lockOrUnlockSeat($arraySalle, $section, $seat)));
            }
        } else if ($operation = "lock" && $section != null && $seat != null) {

        }
        return JsonResponse::create($arraySalle, 200);
    }

    /**
     * @Rest\Post("/api/event/update-map/{id}")
     * @param Request $request
     * @param $id
     * @return string
     */
    public function setEventSeatMap(Request $request, $id)
    {
        try {
            $em = $this->getDoctrine()->getManager();
            $data_map = $request->request->get('data_map');
            $event = $this->getDoctrine()->getRepository(Evenement::class)->find($id);
            $event->setEtatSalle(serialize($data_map));
            $em->persist($event);
            $em->flush($event);
            return View::create($data_map, Response::HTTP_OK);
        } catch (\Exception $e) {
            return 'Cannot Edit Map';
        }
    }

    /**
     * @Rest\Post("/api/event/delete/{id}")
     * @param $id
     * @return View|object|null
     */
    public function deleteEvent(Request $request, $id)
    {
        if ($request->getMethod() != 'POST')
            return new MethodNotAllowedException('POST');
        $id = $request->get('id');
        $sn = $this->getDoctrine()->getManager();
        $event = $this->getDoctrine()->getRepository(Evenement::class)->find($id);
        if (empty($event)) {
            return new View("Evènement non trouvé", Response::HTTP_NOT_FOUND);
        } else {
            $sn->remove($event);
            $sn->flush();
        }
        return new View("Supprimé", Response::HTTP_OK);
    }

    /**
     * @Rest\Post("/api/event/delete-image/{id}")
     * @param $id
     * @return View|object|null
     */
    public function deleteImageEvent(Request $request, $id)
    {
        if ($request->getMethod() != 'POST')
            return new MethodNotAllowedException('POST');
        //$id=$request->get('id');
        $sn = $this->getDoctrine()->getManager();
        $event = $this->getDoctrine()->getRepository(Evenement::class)->find($id);
        if (empty($event)) {
            return new View("Evènement non trouvé", Response::HTTP_NOT_FOUND);
        } else {
            if ($request->request->get('key') == 1) {

            }
            $sn->remove($event);
            $sn->flush();
        }
        return new View("Supprimé", Response::HTTP_OK);
    }


    //TODO: Récupérer données de la carte
}