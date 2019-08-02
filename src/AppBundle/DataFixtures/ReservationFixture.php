<?php


namespace AppBundle\DataFixtures;

use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Reservation;

class ReservationFixture extends BaseFixture
{
    public function loadData(ObjectManager $manager)
    {
        $this->createMany(Reservation::class, 20, function(Reservation $reservation,$count) {
            $reservation->setModePaiement('AirtelMoney');
            $reservation->setMontantTotal('50000');
            $reservation->setNomReservation($this->faker->name);
            //$this->addReference('res1',$reservation);});
        });
        $manager->flush();
    }
}