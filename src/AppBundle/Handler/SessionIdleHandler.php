<?php


namespace AppBundle\Handler;
use AppBundle\Entity\LockedSeat;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Doctrine\ORM\EntityManagerInterface;
use AppBundle\Utils\Cart;

class SessionIdleHandler
{
    protected $session;
    protected $tokenStorage;
    protected $router;
    protected $maxIdleTime;
    protected $maxIdleTimeRemoveCart;
    protected $cart;
    protected $manager;


    public function __construct(SessionInterface $session, TokenStorageInterface $tokenStorage, RouterInterface $router,EntityManagerInterface $eManager, $maxIdleTimeRemoveCart = 0,$maxIdleTime = 0)
    {
        $this->session = $session;
        $this->tokenStorage = $tokenStorage;
        $this->router = $router;
        $this->maxIdleTime = $maxIdleTime;
        $this->maxIdleTimeRemoveCart= $maxIdleTimeRemoveCart;
        $this->cart= new Cart($this->session);
        $this->manager=$eManager;
    }

    public function onKernelRequest(GetResponseEvent $event)
    {
        if (HttpKernelInterface::MASTER_REQUEST != $event->getRequestType()) {
            return;
        }

        if ($this->maxIdleTime > 0) {
            $this->session->start();
            $lapse = time() - $this->session->getMetadataBag()->getLastUsed();
            if($lapse > $this->maxIdleTimeRemoveCart){
                $items=$this->cart->getItems();
                if(count($items) >0) {
                    foreach ($items as $item){
                        $locked_seat=$this->manager->getRepository(LockedSeat::class)->findOneBy(['section_id' => $item->getSection(),'seat_id' => $item->getSeat(),'evenement'=>$item->getEvenement(),'sess_id'=>$this->session->getId()]);
                        $this->manager->remove($locked_seat);
                    }
                    $this->session->set('quantity', 0);
                    $this->cart->clear();
                    $this->manager->flush();
                }
            }
            /*if ($lapse > $this->maxIdleTime) {
                $this->tokenStorage->setToken(null);
                $this->session->getFlashBag()->add('info', 'You have been logged out due to inactivity.');
                //Redirect URL to logout
                //$event->setResponse(new RedirectResponse($this->router->generate('logout')));
            }*/
        }
    }
}
