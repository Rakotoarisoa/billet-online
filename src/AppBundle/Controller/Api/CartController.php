<?php

namespace AppBundle\Controller\Api;

use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\Form\Factory\FactoryInterface;
use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Model\UserManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\View\View;
use AppBundle\Entity\User;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Attribute\NamespacedAttributeBag;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\NativeSessionStorage;
use AppBundle\Utils\Cart;

class CartController extends AbstractFOSRestController
{
//TODO: Récupérer données de la carte
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
     * @Rest\View
     * @Rest\Get("/api/cart/list", name="cart_inde")
     * @return View|object|null
     */
    public function showCartAction()
    {
        $cart = $this->cart->getItems();
        $this->session->set('quantity', count($this->cart->getItems()));
        if ($cart === null) {
            return new View("there are no users exist", Response::HTTP_NOT_FOUND);
        }
        return View::create($cart,Response::HTTP_OK);
    }
    /**
     * Takes the user to the cart list
     * @Rest\View
     * @Rest\Get("/api/cart/count", name="cart_count")
     * @return View|object|null
     */
    public function countCartItem()
    {
        $count = $this->cart->count();
        $this->session->set('quantity', count($this->cart->getItems()));
        if ($count === null) {

            return new View("there are no users exist", Response::HTTP_NOT_FOUND);
        }
        return View::create($count,Response::HTTP_OK);
    }

    /**
     * Takes the user to the cart list
     * @Rest\View
     * @Rest\Get("/api/cart/clear", name="cart_clear")
     * @return View|object|null
     */
    public function clearItems()
    {
        $this->session->set('quantity', count($this->cart->getItems()));
        $this->cart->clear();
        if (200 === null) {
            return new View("Panier vidé", Response::HTTP_NOT_FOUND);
        }
        return View::create("Panier vidé",Response::HTTP_OK);
    }

    /**
     * @Rest\Get("/api/cart/{id}")
     * @param $id
     * @return View|object|null
     */
    public function setEventSeatMap($id)
    {
        $restResult = $this->getDoctrine()->getRepository(User::class)->find($id);
        return $restResult;
    }
}