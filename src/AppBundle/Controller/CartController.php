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
        $event = $this->getDoctrine()->getRepository(Evenement::class)->find($event_id);
        $type_billet = $this->getDoctrine()->getRepository(TypeBillet::class)->findOneBy(['libelle' => $type_billet, 'evenement' => $event]);
        $result = $this->getDoctrine()->getRepository(Billet::class)->getTicketsToBuy($event_id, $nbr_billets, $type_billet);
        $section_id='-';
        $place_id='-';
        if($request->request->has('section_id') && $request->request->has('place_id'))
        {
            $section_id=$request->request->get('section_id');
            $place_id=$request->request->get('place_id');
        }
        for ($i = 0; $i < count($result); $i++) {
            $item = new CartItem([
                'id' => $i,
                'name' => $result[$i]->getIdentifiant(),
                'price' => $type_billet->getPrix(),
                'event' => $event->getTitreEvenement(),
                'seat' =>$place_id,
                'section' => $section_id,
                'evenement' => $event
            ]);
            $item->setQuantity(1); // defaults to 1
            $item->setCategoryStr($type_billet->getLibelle());
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
    public function checkOutAction(EngineInterface $tplEngine)
    {

        $cartItems = $this->cart->getItems();
        $cartTotal = $this->cart->getDiscountTotal();
        $discount = $this->cart->getAppliedDiscount();
        $em = $this->getDoctrine()->getManager();
        $repo = $this->getDoctrine()->getRepository(Billet::class);
        //$firstUser = $em->getRepository(User::class)->findOneBy([]); // current user id needs to be set after sign up
        try {
            $reservation = new Reservation();
            $reservation->setNomReservation('commande-'.date('d F Y'));
            //TODO: Ajouter les données de reservation
            //$em->persist($reservation);
            //$em->flush();

            foreach ($this->cart->getItems() as $item) {
                //TODO: Ajouter les billets
                //$em->persist();
                //$em->flush();
            }
            $this->sendEmailToBuyer();
            $this->addFlash('success', 'Validation de la reservation complétée. Vous serez notifié par e-mail avec votre commande');
            $this->cart->clear();
            return $this->redirectToRoute('viewList');
        } catch (\Exception $exception) {
            $this->addFlash('danger', 'Erreur lors de la création de la réservation'); // need to log the exception details
            return new Response($exception->getMessage(), Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        /* return $this->render('default/invoice.html.twig', [
             'cart' => $cartItems,
             'total' => $cartTotal,
             //'orderId' => $order->getId(),
             'discount' => $discount,
         ]);*/
        return new Response('ok', Response::HTTP_OK);
    }

    /**
     * Checkout process of the cart
     *
     * @Route("/res_billet/send_email", name="cart_send_email")
     */
    private function sendEmailToBuyer()
    {
        try {
            $mailer = $this->get('mailer');
            $html = '<html><body>';
            $bGen=$this->get('skies_barcode.generator');
            $domOptions=new Options();
            $domOptions->set('isRemoteEnabled', TRUE);
            $domOptions->set('isHtml5ParserEnabled',true);
            $domPdf=new Dompdf($domOptions);
            $domPdf->setPaper('A4','landscape');
            foreach ($this->cart->getItems() as $item) {
                $options = array(
                    'code' => $item->getName(),
                    'type' => 'qrcode',
                    'format' => 'png',
                    'width' => 10,
                    'height' => 10,
                    'color' => array(0, 0, 0),
                );
                $barcode = $bGen->generate($options);
                $qr_code = "data:image/png;base64,' . $barcode";
                $html .= $this->renderView('emails/attachments/attachment.html.twig', ['event' => $item->getEvenement(),'qr' => $qr_code]);
            }
            $html.='</body></html>';
            $domPdf->loadHtml($html);
            $domPdf->render();
            $attachment = new \Swift_Attachment($domPdf->output(), 'commande-'.date('d-m-Y').'.pdf', 'application/pdf');
            $message = (new \Swift_Message('Votre commande'))
                ->setSubject('Ivenco Réservation - Votre commande du '.date('d F Y'))
                ->setFrom('andry163.nexthope@gmail.com')
                ->setTo('andry163.nexthope@gmail.com')
                ->setBody(
                    $this->renderView(// app/Resources/views/Emails/registration.html.twig
                        'emails/template_clients/body.html.twig'
                    ),
                    'text/html'
                )
                ->attach($attachment)
                // you can remove the following code if you don't define a text version for your emails
                /*->addPart(
                    $this->renderView(
                        'Emails/registration.txt.twig',
                        ['name' => $name]
                    ),
                    'text/plain'
                )*/
            ;
            $mailer->send($message);
        } catch (\ErrorException $e) {
            throw new $e;
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