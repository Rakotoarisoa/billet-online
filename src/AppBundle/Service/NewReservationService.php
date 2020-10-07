<?php


namespace AppBundle\Service;


use AppBundle\Entity\Reservation;

class NewReservationService
{
    private $reservation;
    public function __construct()
    {
        $this->reservation = new Reservation();
    }

    /**
     * @return mixed
     */
    public function getReservation()
    {
        return $this->reservation;
    }


}
