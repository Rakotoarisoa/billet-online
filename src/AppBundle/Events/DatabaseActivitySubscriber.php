<?php

namespace AppBundle\Events;

use AppBundle\Entity\LockedSeat;
use AppBundle\Entity\Reservation;
use AppBundle\Entity\Sessions;
use AppBundle\Entity\User;
use AppBundle\Utils\CartItem;
use AppBundle\Manager\LogManager;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\Persistence\Event;
use Doctrine\ORM\Events;
use  Symfony\Component\HttpKernel;
use Doctrine\ORM\Repository\RepositoryFactory;
use Doctrine\Persistence\Event\PreUpdateEventArgs;
use Symfony\Component\HttpKernel\EventListener\SessionListener;

class DatabaseActivitySubscriber implements EventSubscriber
{
// this method can only return the event names; you cannot define a
// custom method name to execute when each event triggers
    private $logManager;
    private $em;

    public function __construct(LogManager $logManager, EntityManagerInterface $em)
    {
        $this->logManager = $logManager;
        $this->em = $em;
    }

    public function getSubscribedEvents()
    {
        return [
            Events::postPersist,
            Events::postRemove,
            Events::postUpdate
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
    private static function unserialize_php($session_data, $delimiter) {
        $return_data = array();
        $offset = 0;
        while ($offset < strlen($session_data)) {
            if (!strstr(substr($session_data, $offset), $delimiter)) {
                throw new \Exception("invalid data, remaining: " . substr($session_data, $offset));
            }
            $pos = strpos($session_data, $delimiter, $offset);
            $num = $pos - $offset;
            $varname = substr($session_data, $offset, $num);
            $offset += $num + 1;
            $data = unserialize(substr($session_data, $offset));
            $return_data[$varname] = $data;
            $offset += strlen(serialize($data));
        }
        return $return_data;
    }
    private function sessionSeatMapHandler(string $action,LifecycleEventArgs $args)
    {
        $entity = $args->getObject();
        /* On new session created or updated*/
        if($entity instanceof Sessions && ($action == 'persist' || $action == 'update')){
            $cart_session_data=$this::unserialize_php($entity->getSessData(),'|');
            $sess_id= $entity->getSessId();
            if(isset($cart_session_data['_sf2_attributes']['_cart'])){
                $data_cart=$cart_session_data['_sf2_attributes']['_cart'];
                foreach($data_cart as $cart_item){
                    $this->insertOrRemoveLockedSeat($cart_item,$sess_id);
                }
            }
        }
        /* On new session removed*/
        if($entity instanceof Sessions && $action == 'remove'){
            $cart_session_data=$this::unserialize_php($entity->getSessData(),'|');
            $sess_id= $entity->getSessId();
            if(isset($cart_session_data['_sf2_attributes']['_cart'])){
                $data_cart=$cart_session_data['_sf2_attributes']['_cart'];
                foreach($data_cart as $cart_item){
                    $this->insertOrRemoveLockedSeat($cart_item,$sess_id,'remove');
                }
            }
        }

    }
    private function insertOrRemoveLockedSeat(CartItem $cart_item,string $sess_id, string $action='persist'){
        $locked_item=$this->em->getRepository(LockedSeat::class)->findBy(['evenement'=>$cart_item->getEvenement(),'section_id'=>$cart_item->getSection(),'seat_id'=>$cart_item->getSeat()]);
        if(!isset($locked_item)){
            $new_locked= new LockedSeat();
            $new_locked->setSessId($sess_id);
            $new_locked->setSeatId($cart_item->getSeat());
            $new_locked->setSectionId($cart_item->getSection());
            $new_locked->setEvenement($cart_item->getEvenement());
            $this->em->persist($new_locked);
            $this->em->flush();
        }
        else if(isset($locked_item) && $action == 'remove'){
            $this->em->remove($locked_item);
            $this->em->flush();
        }
    }

}