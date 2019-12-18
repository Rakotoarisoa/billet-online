<?php

/**
 * Controller used to manage the admi event.
 *
 * @author hh
 */

namespace AppBundle\Controller\AdminUserEvent;
use AppBundle\Entity\Evenement;
use AppBundle\Entity\Reservation;
use PhpOption\Tests\Repository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;



class AdminUserEventController extends Controller
{
    /**
     * Gestion des évènements de l'utilisateur
     * @Route("/user/{userId}/admin-event/list", name="viewEventUserAdmin")
     * @ParamConverter("user",options={"mapping":{"userId" = "id"}})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param User $user
     * @return Response
     */
    public function listAction(Request $request){
        //entity manager
        $repository = $this->getDoctrine()->getRepository(Evenement::class);
        $user = $request->get('userId');
        $event_name = $request->get('event_name');
        $event_state = $request->get('event_state');
        $event_creator = $request->get('event_creator');
        if($event_name or $event_state or $event_creator){
            $event = $repository->getSearchEvent($event_name,$event_creator,$user);            
        }else{
            $tabUser = compact('user');
            $event = $repository->findBy($tabUser);
        }
        $event_all = $this->get('knp_paginator')->paginate($event,$request->query->get('page',1),4);     
              
        return $this->render('admin_user_event/view_user_event_list.html.twig',[
            'events'=>$event_all,
            'event_name'=>$event_name,
            'event_state'=> $event_state,
            'event_creator'=> $event_creator]);
    }
    /**
     * Gestion des évènements de l'utilisateur
     * @Route("/user/{userId}/admin-event/{e_id}/orders/list", name="viewOrdersList")
     * @ParamConverter("user",options={"mapping":{"userId" = "id","e_id"= "event_id"}})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param Evenement $evenement
     * @return Response
     */
    public function userOrdersAction(Request $request, Evenement $event){
        $repository=$this->getDoctrine()->getRepository(Reservation::class);
        $result= $repository->findBy(['evenement'=>$event]);
        $orders_all = $this->get('knp_paginator')->paginate($result,$request->query->get('page',1),10);

        return $this->render('admin_user_event/view_commandes_event_admin.html.twig',[
            'event' =>$event,'orders'=>$orders_all]);

    }
    /**
     * Gestion des évènements de l'utilisateur
     * @Route("/user/{userId}/admin-event/{e_id}/ticket/list", name="viewTicketEventUserAdmin")
     * @ParamConverter("user",options={"mapping":{"userId" = "id","e_id"= "event_id"}})
     * @ParamConverter("evenement",options={"mapping":{"e_id"= "id"}})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param Evenement $evenement
     * @return Response
     */
    public function eventTicketsAction(Request $request, Evenement $event){
        return $this->render('admin_user_event/view_billets_event_admin.html.twig',[
            'event' =>$event]);

    }


}