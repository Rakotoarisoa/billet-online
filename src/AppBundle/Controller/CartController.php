<?php

/**
 * Controller used to manage the shopping cart.
 *
 * @author Azraar Azward <mazraara@gmail.com>
 */

namespace AppBundle\Controller;

use AppBundle\Entity\Evenement;
use AppBundle\Entity\Reservation;
use AppBundle\Entity\TypeBillet;
use AppBundle\Entity\User;
use AppBundle\Entity\Billet;
use AppBundle\Entity\UserCheckout;
use AppBundle\Events\Reservation\RegisteredReservationEvent;
use AppBundle\Utils\Cart;
use AppBundle\Utils\CartItem;
use Doctrine\Common\Collections\ArrayCollection;
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
        return $this->render('default/cart.html.twig', ['cart' => $cart, 'form' => $form->createView()]);
    }

    /**
     * Clears the cart
     *
     * @Route("/res_billet/clear", name="cart_clear")
     */
    public function clearCartAction()
    {
        $this->session->set('quantity', 0);
        $this->cart->clear();
        return $this->redirect('/res_billet/list');
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
        $type_billet = $this->getDoctrine()->getRepository(TypeBillet::class)->findOneBy(['libelle' => $type_billet, 'evenement' => $event]);
        $section_id = '-';
        $place_id = '-';
        if ($request->request->has('section_id') && $request->request->has('place_id')) {
            $section_id = $request->request->get('section_id');
            $place_id = $request->request->get('place_id');

            if($this->cart->alreadyExists($section_id,$place_id,$type_billet->getLibelle())){
                return new Response('Le billet est déjà commandé', Response::HTTP_ALREADY_REPORTED);
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

        $cartItems = $this->cart->getItems();
        $event = $this->getDoctrine()->getRepository(Evenement::class)->find($this->cart->getItem(0)->getEvenement()->getId());
        $buyer_data = $this->session->get('buyer_data');
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
            $reservation->setModePaiement('Paypal');
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
            $eventDispatcher->dispatch(RegisteredReservationEvent::NAME, new RegisteredReservationEvent($reservation));
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