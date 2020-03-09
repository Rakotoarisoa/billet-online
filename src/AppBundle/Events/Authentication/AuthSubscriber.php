<?php


namespace AppBundle\Events\Authentication;

use AppBundle\Manager\LogManager;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Http\SecurityEvents;
use FOS\UserBundle\FOSUserEvents;


class AuthSubscriber implements EventSubscriberInterface
{
    protected $logManager;
    public function __construct(LogManager $logManager)
    {
        $this->logManager= $logManager;
    }

    public function handleLogin(InteractiveLoginEvent $event)
    {
        $this->logManager->logAction('Connexion', 'Utilisateur: '.$event->getAuthenticationToken()->getUsername().':'.$event->getAuthenticationToken()->getUser()->getEmail().' connecté', $event->getAuthenticationToken()->getUser());

    }
    public function onRegistrationSuccess(InteractiveLoginEvent $event)
    {
        $this->logManager->logAction('Inscription', 'Nouvel Utilisateur ajouté',$event->getAuthenticationToken()->getUser());

    }

    /**
     * @return array
     */
    public static function getSubscribedEvents()
    {
        return [
            SecurityEvents::INTERACTIVE_LOGIN => 'handleLogin',
            //FOSUserEvents::REGISTRATION_SUCCESS => 'onRegistrationSuccess'
        ];
    }


}