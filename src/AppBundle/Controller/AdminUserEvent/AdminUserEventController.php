<?php

/**
 * Controller used to manage the admi event.
 *
 * @author hh
 */

namespace AppBundle\Controller\AdminUserEvent;
use AppBundle\Entity\Evenement;
use AppBundle\Entity\Reservation;
use AppBundle\Entity\User;
use Dompdf\Exception;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Dompdf\Dompdf;
use Dompdf\Options;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;


class AdminUserEventController extends Controller
{
    /**
     * Gestion des évènements de l'utilisateur
     * @Route("/user/admin-event/list", name="viewEventUserAdmin")
     * @Security("has_role('ROLE_USER_MEMBER')")
     * @param Request $request
     * @param User $user
     * @return Response
     */
    public function listAction(Request $request){
        //entity manager
        $eventRepository = $this->getDoctrine()->getRepository(Evenement::class);
        $userRepository= $this->getDoctrine()->getRepository(User::class);
        $user = $this->getUser();
        $nbEvents=$userRepository->countEvents($user);
        /** code HH */
        $nbEventsPublic=$userRepository->countEventsPublic($user);
        $nbEventsUsingSeatMap = $userRepository->countEventsUsingSeatMap($user);
        /** end code HH */
        $nbCheckout=$userRepository->countCheckout($user);
        $nbTickets=$userRepository->countTickets($user);
        $nbTicketsVerified=$userRepository->countVerifiedTickets($user);
        $event_name = $request->get('event_name');
        $event_state = $request->get('event_state');
        $event_creator = $request->get('event_creator');
        if($event_name or $event_state or $event_creator){
            $event = $eventRepository->getSearchEvent($event_name,$event_creator,$user);
        }else{
            $tabUser = compact('user');
            $event = $eventRepository->findBy($tabUser);
        }
        $event_all = $this->get('knp_paginator')->paginate($event,$request->query->get('page',1),10);
              
        return $this->render('admin_user_event/view_user_event_list.html.twig',[
            'events'=>$event_all,
            'event_name'=>$event_name,
            'event_state'=> $event_state,
            'event_creator'=> $event_creator,
            'nbEvents' => ($nbEvents?$nbEvents[0]['nombreEvents']:0),
            'nbEventsPublic'=>$nbEventsPublic?$nbEventsPublic[0]['nombreEvents']:0,
            'nbEventsUsingSeatMap'=>$nbEventsUsingSeatMap?$nbEventsUsingSeatMap[0]['nombreEvents']:0,
            'nbCheckout' => $nbCheckout?$nbCheckout[0]['nombreCheckout']:0,
            'nbTickets' => $nbTickets?$nbTickets[0]['nombreBillets']:0,
            'nbChecked' => $nbTicketsVerified?$nbTicketsVerified[0]['nombreBilletV']:0]);
    }
    /**
     * List des commandes pour un évènements
     * @Route("/user/admin-event/{eventId}/orders/list", name="viewOrdersList")
     * @ParamConverter("evenement",options={"mapping":{"eventId"= "id"}})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param Evenement $event
     * @return Response
     */
    public function userOrdersAction(Request $request, Evenement $evenement){
        $order_id = $request->get('order_id');
        $order_name = $request->get('order_name');
        $date = $request->get('date');
        $repository=$this->getDoctrine()->getRepository(Reservation::class);
        $result= $repository->getOrdersListByEvent($order_id,$order_name,$date,$evenement);
        $orders_all = $this->get('knp_paginator')->paginate($result,$request->query->get('page',1),20);
        $users_checkout = $repository->getUserCheckoutsByEvent($evenement);
        return $this->render('admin_user_event/view_commandes_event_admin.html.twig',[
            'event' =>$evenement,'orders'=>$orders_all,'users_checkout'=>$users_checkout]);
    }

    /**
     * List des commandes pour un évènements
     * @Route("/user/admin-event/{eventId}/order/print", name="printOrder",methods={"POST"})
     * @ParamConverter("user",options={"mapping":{"id" = "userId"}})
     * @ParamConverter("evenement",options={"mapping":{"eventId"= "id"}})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param Evenement $event
     * @return Response
     * @throws \Exception
     */
    public function printOrder(Request $request){
        if($request->request->has('_token') and  $this->isCsrfTokenValid('order-print',$request->request->get('_token'))){
            $order_id=(int)$request->request->get('_order_print');
            try{
                $reservation=$this->getDoctrine()->getRepository(Reservation::class)->find($order_id);
                $domOpt=new Options();
                $domPdf=new Dompdf();
                $codeGen=$this->container->get('skies_barcode.generator');
                $html = '';
                $domOpt->set('isRemoteEnabled', TRUE);
                $domOpt->set('isHtml5ParserEnabled', true);
                $domPdf->setOptions($domOpt);
                $domPdf->setPaper('A4', 'landscape');
                $html .= $this->renderView('emails/attachments/attachment_email.html.twig', ['event' => $reservation->getEvenement(), 'reservation' => $reservation, 'qr' => $codeGen]);
                $html .= '';
                $domPdf->loadHtml($html);
                $domPdf->render();
                $domPdf->stream("Commmande-".$reservation->getRandomCodeCommande()."-".$reservation->getEvenement()->getRandomCodeEvent().".pdf",["Attachment" => true]);
                //return //$render->stream("test.pdf",["Attachment" => false]);
            }
            catch(\Exception $e) {
                throw new \Exception('Erreur pendant le téléchargement: '.$e->getMessage());
            }
        }
    }
    /**
     * Gestion des évènements de l'utilisateur
     * @Route("/user/admin-event/{eventId}/ticket/list", name="viewTicketEventUserAdmin")     
     * @ParamConverter("user",options={"mapping":{"userId" = "id","eventId"= "event_id"}})
     * @ParamConverter("evenement",options={"mapping":{"eventId"= "id"}})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param Evenement $event
     * @return Response
     */
    public function eventTicketsAction(Request $request, Evenement $evenement){
        $billet_place = $request->get('billet_place');
        $billet_type = $request->get('billet_type');
        $billet_checked = $request->get('billet_checked');

        //entity manager
        $eventRepository = $this->getDoctrine()->getRepository(Evenement::class);

        $nbAllBillets = $eventRepository->getCountTicketsEvents($evenement);
        $nbAllBilletChecked = $eventRepository->getCountTicketsEventsChecked($evenement);
        if($nbAllBilletChecked){
            $allbilletchecked = $nbAllBilletChecked[0]['nbAllBillet'];

        }else{
            $allbilletchecked = 0;
        }
        
        $nbEventsBillets=$eventRepository->getAllTicketsEvents($evenement,$billet_place,$billet_type,$billet_checked);
        $nbEventsBillets_all = $this->get('knp_paginator')->paginate($nbEventsBillets,$request->query->get('page',1),20);
        return $this->render('admin_user_event/view_billets_event_admin.html.twig',[
            'event' =>$evenement,
            'billet_place'=>$billet_place,
            'billet_type'=>$billet_type,
            'billet_checked'=>$billet_checked,
            'nbAllBillet'=> $nbAllBillets[0]['nbAllBillet'],
            'nbAllBilletChecked'=> $allbilletchecked,
            'billets'=>$nbEventsBillets_all]);
    }
    /**
     * Gestion des évènements de l'utilisateur
     * @Route("/user/admin-event/{eventId}/delete", name="deleteEventUserAdmin")
     * @ParamConverter("user",options={"mapping":{"eventId"= "event_id"}})
     * @ParamConverter("evenement",options={"mapping":{"eventId"= "id"}})
     * @Security("has_role('ROLE_USER_MEMBER')")
     * @param Request $request
     * @param Evenement $event
     * @return Response
     */
    public function deleteEvent(Request $request, Evenement $evenement){
        try{
            $em=$this->getDoctrine()->getManager();
            $em->remove($evenement);
            $em->flush();
            return new Response('Suppression Réussie',200);
        }
        catch (Exception $e){
            return new Response('Erreur: '.$e->getMessage(), 500);
        }
    }


}
