<?php

/**
 * Controller used to manage the shopping cart.
 *
 * @author Azraar Azward <mazraara@gmail.com>
 */

namespace AppBundle\Controller;

use AppBundle\Entity\Evenement;
use AppBundle\Entity\Reservation;
use AppBundle\Entity\User;
use AppBundle\Entity\Billet;
use AppBundle\Utils\Cart;
use AppBundle\Utils\CartItem;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
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


        return $this->render('default/cart.html.twig', ['cart' => $cart]);
    }

    /**
     * Clears the cart
     *
     * @Route("/res_billet/clear", name="cart_clear")
     */
    public function clearCartAction()
    {
        $this->session->set('quantity', count($this->cart->getItems()));
        $this->cart->clear();

        $this->addFlash('success', 'Panier vidé');

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
        $result = $this->getDoctrine()->getRepository(Billet::class)->getTicketsToBuy($event_id, $nbr_billets, $type_billet);
        $event = $this->getDoctrine()->getRepository(Evenement::class)->find($event_id);
        if (count($result) > 0) {
            $item = new CartItem([
                'id' => $result[0]['identifiant'],
                'name' => strtolower($type_billet) . "-" . $result[0]['identifiant'] . "-" . $event->getTitreEvenementSlug(),
                'price' => $result[0]['prix'],
                'event' => $event_id
            ]);
            $item->setQuantity((integer)$nbr_billets); // defaults to 1
            $item->setCategoryStr($type_billet);
            $this->cart->addItem($item);
        }


        $this->addFlash('success', 'Billet ajouté dans le panier avec succès.');

        return $this->redirect($redirect);
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
    public function checkOutAction()
    {

        $cartItems = $this->cart->getItems();

        $cartTotal = $this->cart->getDiscountTotal();
        $discount = $this->cart->getAppliedDiscount();
        $em = $this->getDoctrine()->getManager();
        $repo = $this->getDoctrine()->getRepository(Billet::class);
        $reservation = new Reservation();

        foreach ($cartItems as $cart) {
            $repo->getTicketToBuy($cart->getEvent(), $cart->getQuantity(), $cart->getCategoryStr(),true);
        }
        $firstUser = $em->getRepository(User::class)->findOneBy([]); // current user id needs to be set after sign up


        try {
            //TODO: Ajouter les données de reservation
            $em->persist($reservation);
            //$em->flush();

            foreach ($this->cart->getItems() as $item) {
                //TODO: Ajouter les billets
                $em->persist();
                //$em->flush();
            }

            $this->addFlash('success', 'Validation de la reservation complétée. Vous serez notifié par mail');
            $this->cart->clear();
        } catch (\Exception $exception) {
            $this->addFlash('danger', 'Erreur lors de la création de la réservation'); // need to log the exception details
        }

        return $this->render('default/invoice.html.twig', [
            'cart' => $cartItems,
            'total' => $cartTotal,
            //'orderId' => $order->getId(),
            'discount' => $discount,
        ]);
    }
}