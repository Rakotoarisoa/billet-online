<?php


namespace AppBundle\Events\Reservation;

use AppBundle\Entity\Reservation;
use Doctrine\ORM\EntityNotFoundException;
use http\Env\Response;
use Symfony\Component\EventDispatcher\Event;

class RegisteredReservationEvent extends  Event
{
    private $reservation;

    /**
     * @return Reservation
     */
    public function getReservation(): Reservation
    {
        return $this->reservation;
    }

    const NAME = 'reservation.registered';

    public function __construct(Reservation $reservation)
    {
        if($reservation instanceof Reservation)
            $this->reservation = $reservation;
        else
            throw new EntityNotFoundException('Entité Resrevation introuvable');
    }
}