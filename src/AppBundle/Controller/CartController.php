<?php

/**
 * Controller used to manage the shopping cart.
 *
 * @author Azraar Azward <mazraara@gmail.com>
 */

namespace AppBundle\Controller;

use AppBundle\Entity\Evenement;
use AppBundle\Entity\PaymentTransaction;
use AppBundle\Entity\Reservation;
use AppBundle\Entity\TypeBillet;
use AppBundle\Entity\LockedSeat;
use AppBundle\Entity\User;
use AppBundle\Entity\Billet;
use AppBundle\Entity\UserCheckout;
use AppBundle\Events\Reservation\RegisteredReservationEvent;
use AppBundle\Utils\Cart;
use AppBundle\Utils\CartItem;
use AppBundle\Entity\Sessions;
use Doctrine\Common\Collections\ArrayCollection;
use Dompdf\Exception;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\Form\Factory\FactoryInterface;
use FOS\UserBundle\FOSUserEvents;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Session\Attribute\NamespacedAttributeBag;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\NativeSessionStorage;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Routing\Exception\MethodNotAllowedException;

class CartController extends Controller
{
    /**
     * @var \Symfony\Component\HttpFoundation\Session\Session
     */
    protected $session;
    protected $cart;

    /**
     * The constructor
     */
    public function __construct()
    {
        $storage = new NativeSessionStorage();
        $attributes = new NamespacedAttributeBag();
        $this->session = new Session($storage, $attributes);
        $this->cart = new Cart($this->session);
    }

    /**
     * Takes the user to the cart list
     * @Route("/res_billet/list", name="cart_index")
     */
    public function showCartAction()
    {
        $cart = $this->cart->getItems();
        $this->session->set('quantity', count($this->cart->getItems()));
        $array = array();
        /** @var $formFactory FactoryInterface */
        $formFactory = $this->get('fos_user.registration.form.factory');
        /** @var $userManager UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');
        /** @var $dispatcher EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');
        $user = $userManager->createUser();
        $form = $formFactory->createForm();
        $event = new GetResponseUserEvent($user);
        $dispatcher->dispatch(FOSUserEvents::REGISTRATION_INITIALIZE, $event);
        $form->setData($user);
        $session_info_created=$this->session->getMetadataBag()->getCreated();
        $session_info_lastUsed=$this->session->getMetadataBag()->getLastUsed();
        $session_info_lifetime=$this->session->getMetadataBag()->getLifetime();
        $session_info_created=\DateTime::createFromFormat( 'U', $session_info_created );
        $session_info_lastUsed=\DateTime::createFromFormat( 'U', $session_info_lastUsed );
        $session_info_lifetime=\DateTime::createFromFormat( 'U', $session_info_lifetime );
        return $this->render('default/cart.html.twig', ['cart' => $cart, 'form' => $form->createView(),'lifetime'=> $session_info_lifetime,'lastUsed'=>$session_info_lastUsed,'created'=>$session_info_created]);
    }

    /**
     * Clears the cart
     *
     * @Route("/res_billet/clear", name="cart_clear")
     */
    public function clearCartAction()
    {
        $items=$this->cart->getItems();
        if(count($items) >0) {
                foreach ($items as $item){
                    //$this->unlockSeat(unserialize($item->getEvenement()->getEtatSalle()),$item->getSection(),$item->getSeat(),$item->getEvenement()->getId());
                    $locked_seat=$this->getDoctrine()->getRepository(LockedSeat::class)->findOneBy(['section_id' => $item->getSection(),'seat_id' => $item->getSeat(),'evenement'=>$item->getEvenement(),'sess_id'=>$this->session->getId()]);
                    if(!empty($locked_seat)) $this->getDoctrine()->getManager()->remove($locked_seat);
                }
                    $this->session->set('quantity', 0);
            $this->cart->clear();
            $this->getDoctrine()->getManager()->flush();
            return $this->redirect('/res_billet/list');
        }
        else{
            return new Response("No Data",200);
        }
    }
    /**
     * Clears the cart
     *
     * @Route("/res_billet/clearItem", name="cart_clear_item")
     */
    public function clearItemCartAction(Request $request)
    {
        if($request->request && $request->request->has('id')) {
            $item=$this->cart->getItem((int)$request->request->get('id'));
            $event=$item->getEvenement();
            $this->unlockSeat(unserialize($event->getEtatSalle()),$item->getSection(),$item->getSeat(),$event->getId());
            $this->cart->removeItem($request->request->get('id'));
            $locked_seat=$this->getDoctrine()->getRepository(LockedSeat::class)->findOneBy(['section_id' => $item->getSection(),'seat_id' => $item->getSeat(),'evenement'=>$event,'sess_id'=>$this->session->getId()]);
            $this->getDoctrine()->getManager()->remove($locked_seat);
            $this->getDoctrine()->getManager()->flush();
            return new Response('Done', Response::HTTP_OK);
        }
        return new Response('Error', Response::HTTP_INTERNAL_SERVER_ERROR);
    }
    /**
     * Clears the cart
     *
     * @Route("/res_billet/getSessions", name="cart_get_sessions")
     */
    public function getAllSessions()
    {
        $sessions=$this->getDoctrine()->getRepository(Sessions::class)->findAll();
        foreach($sessions as $session){
            var_dump($session->getSessData());
        }
            return new Response('Done', Response::HTTP_OK);

        //return new Response('Error', Response::HTTP_INTERNAL_SERVER_ERROR);
    }
    /**
     * Clears the cart
     *
     * @Route("/res_billet/clearItems", name="cart_clear_items")
     */
    public function clearItemsCartAction(Request $request)
    {
        if($request->request && $request->request->has('type')) {
            $this->cart->removeItems($request->request->get('type'));
            return new Response('Done', Response::HTTP_OK);
        }
        return new Response('Error', Response::HTTP_INTERNAL_SERVER_ERROR);
    }
    //Search Section and Seat into array to Lock
    private function unlockSeat($array, $section = '', $seat = '', $id)
    {
        if($array != null){
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
                        $array[$key]['mapping'][$mapKey]['is_choosed'] = false;
                        $event->setEtatSalle(serialize($array));
                        $em->persist($event);
                    }
                }
                $em->flush();
            }
        }
    }
    }

    /**
     * Adds coupon to the cart
     *
     * @Route("/res_billet/add-coupon", name="coupon_add")
     */
    public function addCouponAction(Request $request)
    {
        $coupon = $request->get('coupon', null);
        if (!empty($coupon)) {
            $this->cart->setCoupon($coupon);
            $this->addFlash('success', 'Coupon redeemed successfully.');
        } else {
            $this->addFlash('danger', 'Coupon code cannot be empty.');
        }
        return $this->redirectToRoute('cart_index');
    }
    /**
     *
     */
    private function lockItemSeat(Evenement $event, $section, $place){

    }
    public function isBooked($items,$book_action,$event)
    {
        try{
            $book_action = (boolean)$book_action;
            if ($book_action) {
                foreach ($items as $item) {
                    $this->bookSeat(unserialize($event->getEtatSalle()),$item->getSection(),$item->getSeat(),$event);
                }
            }

            return new Response('Done',200);
        }
        catch(Exception $e) {
            return new Response('Error occured : '.$e->getMessage(), 500);
        }
    }
    //Search Section and Seat into array to Lock
    private function bookSeat($array, $section = '', $seat = '', $event)
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
                        $array = unserialize($event->getEtatSalle());
                        $array[$key]['mapping'][$mapKey]['is_booked'] = true;
                        $array[$key]['mapping'][$mapKey]['is_choosed'] = false;
                        $event->setEtatSalle(serialize($array));
                        $em->persist($event);
                    }
                }
                $em->flush();
            }
        }
    }
    private function locked_seat($event,$section,$seat){
        $locked_seat=$this->getDoctrine()->getRepository(LockedSeat::class)->findOneBy(['evenement'=>$event,'section_id'=>$section,'seat_id'=>$seat]);
        return $locked_seat;
    }

    /**
     *  Adds the book to cart list
     *
     * @Route("/res_billet/add/", name="cart_add", requirements={"id": "\d+"}, methods="POST")
     */
    public function addToCartAction(Request $request)
    {
        if ($request->request->has('select_nb_billets') && $request->request->has('type_billet') && $request->request->has('event_id') && $request->request->has('redirect')) {
            $nbr_billets = $request->request->get('select_nb_billets');
            $type_billet = $request->request->get('type_billet');
            $event_id = $request->request->get('event_id');
            $redirect = $request->request->get('redirect');
        } else {
            throw new \Exception('Erreur lors de l\'ajout au panier');
        }
        //Récupérer les billets à vendre
        $event = $this->getDoctrine()->getRepository(Evenement::class)->find($event_id);//get Event entity
        //$repo_locked_seat=$this->getDoctrine()->getRepository(LockedSeat::class);
        $type_billet = $this->getDoctrine()->getRepository(TypeBillet::class)->findOneBy(['libelle' => $type_billet, 'evenement' => $event]);
        $section_id = '-';
        $place_id = '-';
        if ($request->request->has('section_id') && $request->request->has('place_id')) {
            $section_id = $request->request->get('section_id');
            $place_id = $request->request->get('place_id');
            if($this->cart->alreadyExists($section_id,$place_id,$type_billet->getLibelle())){
                return new Response('Le billet a été déjà commandé', Response::HTTP_ALREADY_REPORTED);
            }
        } 
        if(count($this->cart->getItems()) > 0){
            $items=$this->cart->getItems();
            if($items[0] != null && (int)$items[0]->getEvenement()->getId()  != (int)$event_id){
                    $this->clearCartAction();
            }
        }
        for ($i = 0; $i < $nbr_billets; $i++) {
            $item = new CartItem([
                'name' => '-', //Nom temporaire
                'price' => $type_billet->getPrix(),
                'seat' => $place_id,
                'section' => $section_id,
                'evenement' => $event
            ]);
            $item->setId($this->cart->count());
            $item->setQuantity(1); // defaults to 1
            $item->setCategoryStr($type_billet->getLibelle());
            $this->cart->addItem($item);
            if($section_id != '-' && $place_id != '-'){
                $locked=new LockedSeat();
                $locked->setEvenement($event);
                $locked->setSectionId($section_id);
                $locked->setSeatId($place_id);
                $locked->setSessId($this->session->getId());
                $this->getDoctrine()->getManager()->persist($locked);
                $this->getDoctrine()->getManager()->flush();
            }
        }
        return new Response('Section '.$section_id.' | Place n°'.$place_id.'  ajouté avec succès', Response::HTTP_OK);

    }

    /**
     * Removes given book from the cart
     *
     * @Route("/res_billet/remove/{id}", name="cart_remove", requirements={"id": "\d+"})
     */
    public function removeCartAction(int $id)
    {
        $this->cart->removeItem($id);
        $this->session->set('quantity', count($this->cart->getItems()));
        $this->addFlash('success', 'Billet éffacé avec succès.');

        return $this->redirect('/res_billet/list');
    }

    /**
     * Checkout process of the cart
     *
     * @Route("/res_billet/checkout", name="cart_checkout")
     */
    public function checkOutAction(EventDispatcherInterface $eventDispatcher)
    {
        $entity_manager=$this->container->get('doctrine.orm.default_entity_manager');
        $entity_manager->transactional(function($em) use ($eventDispatcher){
            $cartItems = $this->cart->getItems();
            $event = $this->getDoctrine()->getRepository(Evenement::class)->find($this->cart->getItem(0)->getEvenement()->getId());
            $buyer_data = $this->session->get('buyer_data');
            $user_exist = $this->getDoctrine()->getRepository(User::class)->findOneBy(['email' => (string)$buyer_data['email']]);
            $user_checkout = $this->getDoctrine()->getRepository(UserCheckout::class)->findOneBy(['email' => (string)$buyer_data['email']]);

                if (!isset($user_checkout) && $this->isCsrfTokenValid('checkout_info', $buyer_data['_token'])) {
                    $user_checkout = new  UserCheckout();
                    $user_checkout->setNom((string)$buyer_data['nom']);
                    $user_checkout->setPrenom((string)$buyer_data['prenom']);
                    $user_checkout->setAdresse1((string)$buyer_data['adresse']);
                    $user_checkout->setEmail((string)$buyer_data['email']);
                    $user_checkout->setIsRegisteredUser(isset($user_exist));
                    $user_checkout->setPays((string)$buyer_data['pays']);
                }
                $reservation= $this->session->has('_resa_')?$this->session->get('_resa_'):new Reservation();//$reservation = new Reservation();
                //$reservation->setNomReservation('commande_' . $reservation->getRandomCodeCommande());
                $reservation->setDateReservation(new \DateTime());
                //TODO: Ajouter les données de reservation
                $reservation->setEvenement($event);
                $reservation->setUserCheckout($user_checkout);
                $reservation->setMontantTotal($this->cart->getTotalPrice());
                $this->getDoctrine()->getManager()->persist($user_checkout);
                $this->getDoctrine()->getManager()->persist($reservation);
                $billets_collection = new ArrayCollection();
                foreach ($cartItems as $item) {
                    //TODO: Ajouter les billets
                    $typeBillet = $this->getDoctrine()->getRepository(TypeBillet::class)->findOneBy(['libelle' => $item->getCategoryStr(), 'evenement' => $event]);
                    $billet = new Billet();
                    $billet->setEstVendu(true);
                    if($item->getSeat() == "-" && $item->getSection() == "-"){$billet->setIsMapped(false);}
                    else{$billet->setIsMapped(true);}
                    $billet->setPlaceId($item->getSeat());
                    $billet->setSectionId($item->getSection());
                    $billet->setTypeBillet($typeBillet);
                    $billet->setReservation($reservation);
                    $this->getDoctrine()->getManager()->persist($billet);
                    $billets_collection->add($billet);
                }
                $reservation->setBillet($billets_collection);
                $txn = new PaymentTransaction();
                $txn->setReservation($reservation);
                $txn->setAmount($this->cart->getTotalPrice());
                $txn->setCurrency($event->getDevise()->getCode());
                $txn->setTxnid($this->session->has('pay_token')?$this->session->get('pay_token'):'-');
                $txn->setPayToken($this->session->has('pay_token')?$this->session->get('pay_token'):'-');
                $txn->setPaymentMethod($reservation->getModePaiement());
                $txn->setDescription($reservation->getNomReservation());
                $reservation->setPaymentTransaction($txn);

                $em->persist($reservation);


                foreach ($cartItems as $item){
                   if($item->getSection() != "-" && $item->getSeat() != "-"){
                       $this->isBooked($cartItems,true,$reservation->getEvenement());
                   }
                    //$this->unlockSeat(unserialize($item->getEvenement()->getEtatSalle()),$item->getSection(),$item->getSeat(),$item->getEvenement()->getId());
                    $locked_seat=$this->getDoctrine()->getRepository(LockedSeat::class)->findOneBy(['section_id' => $item->getSection(),'seat_id' => $item->getSeat(),'evenement'=>$item->getEvenement(),'sess_id'=>$this->session->getId()]);
                    if(!empty($locked_seat)) $this->getDoctrine()->getManager()->remove($locked_seat);
                }

                $eventDispatcher->dispatch(RegisteredReservationEvent::NAME, new RegisteredReservationEvent($reservation,'send_email',$buyer_data));
                //delete session and cart _data
                var_dump("redirect to payment");
                return $this->redirectToRoute('cart_payment_complete',array('order_id'=>$reservation->getNomReservation()));
                //return $this->redirectToRoute('viewList');



        });
        return new Response('Done',500);

    }
    /**
     * Checkout process of the cart
     *
     * @Route("/res_billet/payment_complete/{order_id}", name="cart_payment_complete")
     */
    public function completePayment(string $order_id){
        $reservation = $this->getDoctrine()->getRepository(Reservation::class)->findBy(['nomReservation'=> $order_id]);
        if($reservation and $reservation->getPaymentTransaction()->getStatus() == PaymentTransaction::STATUS_OK){
            return  $this->render('default/view-buy-success.html.twig',['reservation'=>$reservation]);
        }
        return $this->render('default/view-buy-success.html.twig',['reservation'=>$reservation]);
    }
    /**
     * Checkout process of the cart
     *
     * @Route("/res_billet/print_mail_order", name="cart_print_mail")
     */
    public function printOrMailAction(Request $request,EventDispatcherInterface $eventDispatcher)
    {
        $data_rq=$request->request;
        $order_method='print';
        if($data_rq->has('order_method')) {
            $order_method=$data_rq->get('order_method');
        }
        $cartItems = $this->cart->getItems();
        $event = $this->getDoctrine()->getRepository(Evenement::class)->find($this->cart->getItem(0)->getEvenement()->getId());
        $buyer_data = $this->session->get('buyer_data');
        $buyer_name=(string)$buyer_data['prenom'];
        $buyer_lastname=(string)$buyer_data['nom'];
        $user_exist = $this->getDoctrine()->getRepository(User::class)->findOneBy(['email' => (string)$buyer_data['email']]);
        $user_checkout = $this->getDoctrine()->getRepository(UserCheckout::class)->findOneBy(['email' => (string)$buyer_data['email']]);
        try {
            if (!isset($user_checkout) && $this->isCsrfTokenValid('checkout_info', $buyer_data['_token'])) {

                $user_checkout = new  UserCheckout();
                $user_checkout->setNom((string)$buyer_data['nom']);
                $user_checkout->setPrenom((string)$buyer_data['prenom']);
                $user_checkout->setAdresse1((string)$buyer_data['adresse']);
                $user_checkout->setEmail((string)$buyer_data['email']);
                $user_checkout->setIsRegisteredUser(isset($user_exist));
                $user_checkout->setPays((string)$buyer_data['pays']);
            }
            $reservation = new Reservation();
            $reservation->setNomReservation('commande_' . $reservation->getRandomCodeCommande());
            //TODO: Ajouter les données de reservation
            $reservation->setModePaiement('Point de vente: Test'/*. $user_exist->getPointDeVente()->getNom()*/);
            $reservation->setEvenement($event);
            $reservation->setPointDeVente(null/*$user_exist->getPointDeVente()*/);
            $reservation->setUserCheckout($user_checkout);
            $reservation->setMontantTotal($this->cart->getTotalPrice());
            $this->getDoctrine()->getManager()->persist($user_checkout);
            $this->getDoctrine()->getManager()->persist($reservation);
            $billets_collection = new ArrayCollection();
            foreach ($cartItems as $item) {
                //TODO: Ajouter les billets
                $typeBillet = $this->getDoctrine()->getRepository(TypeBillet::class)->findOneBy(['libelle' => $item->getCategoryStr(), 'evenement' => $event]);
                $billet = new Billet();
                $billet->setEstVendu(true);
                $billet->setIsMapped(false);
                $billet->setPlaceId($item->getSeat());
                $billet->setSectionId($item->getSection());
                $billet->setTypeBillet($typeBillet);
                $billet->setReservation($reservation);
                $this->getDoctrine()->getManager()->persist($billet);
                $billets_collection->add($billet);
            }
            $reservation->setBillet($billets_collection);
            $this->getDoctrine()->getManager()->persist($reservation);
            $this->getDoctrine()->getManager()->flush();
            //set Name and username
            $data_buyer_name="";
            $eventDispatcher->dispatch(RegisteredReservationEvent::NAME, new RegisteredReservationEvent($reservation,$order_method,array('name'=> $buyer_name,'lastname'=>$buyer_lastname)));
            foreach ($cartItems as $item){
                //$this->unlockSeat(unserialize($item->getEvenement()->getEtatSalle()),$item->getSection(),$item->getSeat(),$item->getEvenement()->getId());
                $locked_seat=$this->getDoctrine()->getRepository(LockedSeat::class)->findOneBy(['section_id' => $item->getSection(),'seat_id' => $item->getSeat(),'evenement'=>$item->getEvenement(),'sess_id'=>$this->session->getId()]);
                if(!empty($locked_seat)) $this->getDoctrine()->getManager()->remove($locked_seat);
            }
            $this->getDoctrine()->getManager()->flush();
            //delete session and cart _data
            return new Response('Processus Terminé', Response::HTTP_OK);
            //return $this->redirectToRoute('viewList');
        } catch (\Exception $exception) {
            //$this->addFlash('danger', 'Erreur lors de la création de la réservation'); // need to log the exception details
            return new Response($exception, Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    /**
     *
     * @Route("/res_billet/send_buyer_info", name="cart_register_buyer_info")
     */
    public function getBuyerInfo(Request $request)
    {

        if ($request && $request->getMethod() == 'POST') {
            $data_buyer = $request->request;
            if ($data_buyer->has('email') && $data_buyer->has('nom') && $data_buyer->has('prenom')) {
                $this->session->set('buyer_data', $data_buyer->all());
                return new Response($data_buyer->get('email') . ' registered', Response::HTTP_OK);
            } else {
                return new Response("Error Buyer ", Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }
    }

    /**
     * register_email process of the cart
     *
     * @Route("/res_billet/email_register", name="cart_register_email")
     */
    public function registerEmailAction(Request $request)
    {
        if ($request && $request->getMethod() == 'POST' && $request->request->has('email_register')) {
            $this->session->set('email_register', $request->request->get('email_register'));
            return new Response($request->request->get('email_register'), Response::HTTP_OK);
        } else {
            throw new \ErrorException('Erreur lors de l\'enregistrement', Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

}
