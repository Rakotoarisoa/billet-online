<?php


namespace AppBundle\Events\Reservation;

use AppBundle\Entity\Reservation;
use Doctrine\ORM\EntityNotFoundException;
use http\Env\Response;
use Symfony\Component\EventDispatcher\Event;

class RegisteredReservationEvent extends  Event
{
    private $reservation;
    private $order_method;
    private $buyer_data;

    /**
     * @return mixed
     */
    public function getBuyerData()
    {
        return $this->buyer_data;
    }

    /**
     * @return mixed
     */
    public function getOrderMethod()
    {
        return $this->order_method;
    }

    /**
     * @return Reservation
     */
    public function getReservation(): Reservation
    {
        return $this->reservation;
    }

    const NAME = 'reservation.registered';

    public function __construct(Reservation $reservation,$order_method,$buyer_data)
    {
        if($reservation instanceof Reservation && $order_method != '' && $buyer_data != null) {
            $this->reservation = $reservation;
            $this->order_method = $order_method;
            $this->buyer_data = $buyer_data;
        }
        else
            throw new EntityNotFoundException('Entité Reservation introuvable');
    }
}