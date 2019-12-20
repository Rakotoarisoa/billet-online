<?php

/**
 * Controller used to manage the admi event.
 *
 * @author hh
 */

namespace AppBundle\Controller\AdminUserEvent;
use AppBundle\Entity\Evenement;
use AppBundle\Entity\Reservation;
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
        $event_all = $this->get('knp_paginator')->paginate($event,$request->query->get('page',1),10);
              
        return $this->render('admin_user_event/view_user_event_list.html.twig',[
            'events'=>$event_all,
            'event_name'=>$event_name,
            'event_state'=> $event_state,
            'event_creator'=> $event_creator]);
    }
    /**
     * List des commandes pour un évènements
     * @Route("/user/{userId}/admin-event/{eventId}/orders/list", name="viewOrdersList")
     * @ParamConverter("user",options={"mapping":{"id" = "userId"}})
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
     * @Route("/user/{userId}/admin-event/{eventId}/order/print", name="printOrder",methods={"POST"})
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
            $order_id=(int)$request->request->has('_order_print');
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
                $domPdf->stream("test.pdf",["Attachment" => false]);
                //return //$render->stream("test.pdf",["Attachment" => false]);
            }
            catch(\Exception $e) {
                throw new \Exception('Erreur pendant le téléchargement: '.$e->getMessage());
            }
        }
    }
    /**
     * Gestion des évènements de l'utilisateur
     * @Route("/user/{userId}/admin-event/{e_id}/ticket/list", name="viewTicketEventUserAdmin")
     * @ParamConverter("user",options={"mapping":{"userId" = "id","e_id"= "event_id"}})
     * @ParamConverter("evenement",options={"mapping":{"e_id"= "id"}})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param Evenement $event
     * @return Response
     */
    public function eventTicketsAction(Request $request, Evenement $event){
        return $this->render('admin_user_event/view_billets_event_admin.html.twig',[
            'event' =>$event]);
    }


}