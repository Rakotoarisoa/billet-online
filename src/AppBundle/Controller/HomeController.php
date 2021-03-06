<?php

namespace AppBundle\Controller;

use AdminBundle\Admin\UserCheckoutAdmin;
use AppBundle\Entity\Billet;
use AppBundle\Entity\CategorieEvenement;
use AppBundle\Entity\Pays;
use AppBundle\Entity\Reservation;
use AppBundle\Entity\UserCheckout;
use AppBundle\Utils\Cart;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\Evenement;
use Symfony\Component\HttpFoundation\Response;
use Omines\DataTablesBundle\Adapter\ArrayAdapter;
use Omines\DataTablesBundle\Column\TextColumn;
use Omines\DataTablesBundle\Controller\DataTablesTrait;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\HttpFoundation\Session\Attribute\NamespacedAttributeBag;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\NativeSessionStorage;

class HomeController extends Controller
{
    use DataTablesTrait;
    private $session;
    /**
     * The constructor
     */
    public function __construct()
    {
        $storage = new NativeSessionStorage();
        $attributes = new NamespacedAttributeBag();
        $this->session = new Session($storage, $attributes);

    }
    /**
     * Page d'accueil liste d'évènements
     * @Route("/", name="viewList")
     */
    public function showListEvent(Request $request )
    {
        if($lieu=$request->request->has('lieu'))
            $lieu=$request->request->get('lieu');
        if($titre=$request->request->has('titre'))
            $titre=$request->request->get('titre');
        if($date=$request->request->has('date'))
            $date=$request->request->get('date');
        if($cat=$request->request->has('cat'))
            $cat=$request->request->get('cat');
        $eventsList = $this->getDoctrine()
            ->getRepository(Evenement::class)
            ->search($titre,$lieu,$date,$cat);
        $categoryList= $this->getDoctrine()
            ->getRepository(CategorieEvenement::class)
            ->searchUsedCategories();
        $events_paginated = $this->get('knp_paginator')->paginate($eventsList,$request->query->get('page',1),15);
        return $this->render('default/index.html.twig', array('catList'=> $categoryList,'dataSearch'=>$request->request,'events' => $events_paginated,'lieu'=>$lieu,'nbEvents'=>count($eventsList)));
    }

    /**
     * Page affichage évènement
     * @Route("/event/{id}", name="viewSingle")
     * @ParamConverter("event", options={"mapping":{"id" = "id"}})
     * @param Evenement $event
     * @return Response
     */
    public function showSingleEvent(Request $request,Evenement $event)
    {
        //var_dump($request->getMethod());
        //die;
        //OAuth 2 Management, here is Orange Money
        if($request->getMethod() == 'POST' && $this->isCsrfTokenValid('payment-om', $request->get('_token'))){
            $reservation = new Reservation();
            $this->getDoctrine()->getManager()->persist($reservation);
            $this->getDoctrine()->getManager()->flush();
            $om=$this->container->get('service.payment.orange_money.api');
            $om->setReservation($reservation);
            $token=json_decode($om->getToken()->getBody()->getContents());
            $status=$om->Payment($token->access_token,[]);
            $result_status=json_decode($status->getBody()->getContents());
            $this->session->set('_resa_',$om->getReservation());
            //check result of status and redirects
            if($result_status->status == $om::STATUS_OK) return $this->redirect($result_status->payment_url);
            else return new Response($result_status->message,500);
        }
        else{
            $repo = $this->getDoctrine()->getRepository(Billet::class);
            $queryTicketsState=$repo->getListTicketsByType($event);
            $this->getDoctrine()->getRepository(Evenement::class)->initMapEvent($event);
            $categoryList= $this->getDoctrine()
            ->getRepository(CategorieEvenement::class)
            ->searchUsedCategories();
            $country = $this->getDoctrine()->getRepository(Pays::class)->findAll();//Command_ID generation
            return $this->render('default/view-single-event.html.twig',array('event'=>$event,'ticketNumber'=> $queryTicketsState,'max_command_per_ticket'=> 10,'country_list'=>$country,'catList'=>$categoryList));
        }
    }
    /**
     * Page création map
     * @Route("/create-map/{id}", name="viewCreateMape")
     * @Security("has_role('ROLE_USER')")
     * TODO:Implémentation Création Map
     */
    public function vueCreateMap(Evenement $event){
        return $this->render('event_admin/event/view-map-admin.html.twig',array('event'=>$event));
    }
    /**
     * Page Seatmap , reservation de place
     * @Route("/event/{idEvent}/map", name="viewBuyMap")
     * @ParamConverter("event", options={"mapping":{"idEvent"="id"}})
     */
    public function vueMap(Request $request,  Evenement $event){
        if($request->getMethod() == 'POST' && $this->isCsrfTokenValid('payment-om', $request->get('_token'))){
            $reservation = new Reservation();
            $reservation->setModePaiement('OrangeMoney');
            $reservation->setDateReservation(new \DateTime());
            //TODO: Ajouter les données de reservation
            $reservation->setEvenement($event);
            $reservation->setMontantTotal($request->request->get('amount'));
            $user_checkout=new UserCheckout();
            $user_checkout->setEmail('a'.random_int(10,1000).'@a.com');
            $user_checkout->setNom('nom');
            $user_checkout->setPrenom('prenom');
            $user_checkout->setIsRegisteredUser(false);
            $reservation->setUserCheckout($user_checkout);
            $this->getDoctrine()->getManager()->persist($reservation);
            $this->getDoctrine()->getManager()->flush();
            $om=$this->container->get('service.payment.orange_money.api');
            $buyer_data=$this->session->get('buyer_data');
            $om->setReservation($reservation);
            $token=json_decode($om->getToken()->getBody()->getContents());
            $status=$om->Payment($token->access_token,[]);
            $result_status=json_decode($status->getBody()->getContents());
            if($result_status->status == $om::STATUS_OK) $this->session->set('pay_token',$result_status->pay_token);
            $this->session->set('_resa_',$om->getReservation());
            //check result of status and redirects
            if($result_status->status == $om::STATUS_OK) return $this->redirect($result_status->payment_url);
            else return new Response($result_status->message,500);
        }

        return $this->render('default/view-buy-map.html.twig',array('event'=>$event,'max_command_per_ticket'=> 10));
    }

    /**
     * Page Seatmap , reservation de place, liste de billets
     * @Route("/event/{id}/list-ticket", name="viewTicketList")
     * @ParamConverter("event", options={"mapping":{"id" = "id"}})
     * @param Request $request
     * @param Evenement $event
     * @return Response
     */
    public function listeBillet(Request $request,Evenement $event){
        $repo = $this->getDoctrine()->getRepository(Billet::class);
        $queryDt=$repo->getDataForDatatables($event);
        $queryTicketsState=$repo->countPurchasedTickets($event);
        $datatable = $this->createDataTable()
            ->add('nombreBillets', TextColumn::class,['label'=>'Nombre total de billets'])
            ->add('libelle', TextColumn::class,['label'=>'Type'])
            ->add('prix',TextColumn::class,['label'=>'Prix du billet'])
            ->add('reste_tickets',TextColumn::class,['label'=>'Billets restants'])
            ->createAdapter(ArrayAdapter::class,
               $queryDt
            )
            ->handleRequest($request);

        if ($datatable->isCallback()) {
            return $datatable->getResponse();
        }
        return $this->render('default/view-buy-list.html.twig',array('event'=>$event,'datatable'=>$datatable,'ticketState'=>$queryTicketsState));

    }

    /**
     * @Route("/contact", name="contact")
     * @return Response
     */
    public function contact(){
        return $this->render('default/view-contact.html.twig');
    }
    /**
     * @Route("/support", name="support")
     * @return Response
     */
    public function support(){
        return $this->render('default/view-support.html.twig');
    }
    /**
     * @Route("/send_mail", name="send_mail_support")
     * @return Response
     */
    public function sendMail(Request $request){
        if($request->isMethod('POST') && $request->request->has('nom')
            && $request->request->has('email')
            && $request->request->has('sujet')
            && $request->request->has('message')
            && $request->request->has('current_uri')
        ){
            $mail_admin=$this->getParameter('mailer_user');
            $mailer = $this->get('mailer');
            $data=$request->request;
        $message = (new \Swift_Message('Votre commande'))
            ->setSubject($request->request->get('sujet'))
            ->setFrom(array($request->request->get('email') => "Support Ivenco - Message de ".$data->get('nom')))
            ->setTo(array(
                $mail_admin => $mail_admin
            ))
            ->setBody(
                $data->get("message")."<br>ContactMail :".$data->get("email")
            );
        $mailer->send($message);
        $this->addFlash('success','Merci de nous avoir contacté, votre e-mail est envoyé au support');
        return $this->redirect($request->request->get('current_uri'));
        }
        else{
            $this->addFlash('error','Un erreur s\'est produite pendant l\'envoi de l\'email');
        }
        return $this->redirect($request->request->get('current_uri'));
    }
    /**
     * @Route("/testQrCode", name="qc")
     * TODO:Implémentation QR Code
     */
    public function testQRCode(){
        $options = array(
            'code'   => '001-T1',
            'type'   => 'qrcode',
            'format' => 'png',
            'width'  => 10,
            'height' => 10,
            'color'  => array(0,0,0),
        );
        $barcode =
            $this->get('skies_barcode.generator')->generate($options);
        return new Response('<img src="data:image/png;base64,'.$barcode.'" />');
    }
    /**
     * @Route("/seatsio", name="seatsio")
     * @return Response
     */
    public function seatsio(Request $request){
        return $this->render('default/seatsio.html.twig');
    }

}
