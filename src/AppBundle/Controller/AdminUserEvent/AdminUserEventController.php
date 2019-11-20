<?php

/**
 * Controller used to manage the admi event.
 *
 * @author hh
 */

namespace AppBundle\Controller\AdminUserEvent;

use AppBundle\Entity\Evenement;
use AppBundle\Entity\Reservation;
use AppBundle\Entity\TypeBillet;
use AppBundle\Entity\User;
use AppBundle\Entity\Billet;
use AppBundle\Utils\Cart;
use AppBundle\Utils\CartItem;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\Form\Factory\FactoryInterface;
use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Session\Attribute\NamespacedAttributeBag;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\NativeSessionStorage;
use Symfony\Component\Templating\EngineInterface;
use Dompdf\Dompdf;
use Dompdf\Options;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;



class AdminUserEventController extends Controller
{
    /**
     * Gestion des évènements de l'utilisateur
     * @Route("/{userId}/adminevent/list", name="viewEventUserAdmin")
     * @ParamConverter("user",options={"mapping":{"userId" = "id"}})
     * @param Request $request
     * @param User $user
     * @return Response
     */
    public function listAction(Request $request){
        //entity manager
        $em = $this->getDoctrine()->getManager();
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
              
        return $this->render('admin_user_event/view.html.twig',[
            'events'=>$event_all,
            'event_name'=>$event_name,
            'event_state'=> $event_state,
            'event_creator'=> $event_creator]);
    }
}