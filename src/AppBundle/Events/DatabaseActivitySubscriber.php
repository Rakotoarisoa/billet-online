<?php

namespace AppBundle\Events;

use AppBundle\Entity\Reservation;
use AppBundle\Entity\User;
use AppBundle\Manager\LogManager;
use Doctrine\Common\EventSubscriber;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\PreUpdateEventArgs;

class DatabaseActivitySubscriber implements EventSubscriber
{
// this method can only return the event names; you cannot define a
// custom method name to execute when each event triggers
    private $logManager;

    public function __construct(LogManager $logManager)
    {
        $this->logManager = $logManager;
    }

    public function getSubscribedEvents()
    {
        return [
            Events::postPersist,
            Events::postRemove,
            Events::postUpdate,
        ];
    }

// callback methods must be called exactly like the events they listen to;
// they receive an argument of type LifecycleEventArgs, which gives you access
// to both the entity object of the event and the entity manager itself
    public function postPersist(LifecycleEventArgs $args)
    {
        $this->logActivity('persist', $args);
    }

    public function postRemove(LifecycleEventArgs $args)
    {
        $this->logActivity('remove', $args);
    }

    public function postUpdate(LifecycleEventArgs $args)
    {
        $this->logActivity('update', $args);
    }

    private function logActivity(string $action, LifecycleEventArgs $args)
    {
        $entity = $args->getObject();
        /* ------------------ Réservation------------------------*/
        if ($entity instanceof Reservation && $action == 'persist') {
            $this->logManager->logAction('Réservation','Nouvelle Réservation n° '.$entity->getRandomCodeCommande().' au nom de '.$entity->getUserCheckout()->getNom().' '.$entity->getUserCheckout()->getPrenom(),$entity->getEvenement()->getUser());
        }
        if ($entity  instanceof Reservation && $action == 'update') {
            $this->logManager->logAction('Réservation','Mise à jour Réservation n° '.$entity->getRandomCodeCommande().' au nom de '.$entity->getUserCheckout()->getNom().' '.$entity->getUserCheckout()->getPrenom(),$entity->getEvenement()->getUser());
        }
        if ($entity  instanceof Reservation && $action == 'remove') {
            $this->logManager->logAction('Réservation','Mise à jour Réservation n° '.$entity->getRandomCodeCommande().' au nom de '.$entity->getUserCheckout()->getNom().' '.$entity->getUserCheckout()->getPrenom(),$entity->getEvenement()->getUser());
        }
        /*------------------- User ------------------------------*/
        if ($entity instanceof User && $action == 'persist') {
            //$this->logManager->logAction('Utilisateur','Nouvelle Réservation n° '.$entity->getRandomCodeCommande().' au nom de '.$entity->getUserCheckout()->getNom().' '.$entity->getUserCheckout()->getPrenom(),$entity->getEvenement()->getUser());
        }
        if ($entity  instanceof User && $action == 'update') {
            //$this->logManager->logAction('Utilisateur','Mise à jour Réservation n° '.$entity->getRandomCodeCommande().' au nom de '.$entity->getUserCheckout()->getNom().' '.$entity->getUserCheckout()->getPrenom(),$entity->getEvenement()->getUser());
        }
        if ($entity  instanceof User && $action == 'remove') {
            //$this->logManager->logAction('Utilisateur','Mise à jour Réservation n° '.$entity->getRandomCodeCommande().' au nom de '.$entity->getUserCheckout()->getNom().' '.$entity->getUserCheckout()->getPrenom(),$entity->getEvenement()->getUser());
        }

        /*------------------- Event -----------------------------*/

// if this subscriber only applies to certain entity types,
// add some code to check the entity type as early as possible

// ... get the entity information and log it somehow
    }

}