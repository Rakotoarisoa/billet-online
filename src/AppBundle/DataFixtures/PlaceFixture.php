<?php
namespace AppBundle\DataFixtures;


use AppBundle\Entity\Place;
use AppBundle\Entity\Reservation;
use AppBundle\Entity\TypeBillet;
use Doctrine\Common\Persistence\ObjectManager;


class PlaceFixture extends BaseFixture
{
    private static $libelles= [
        'VIP',
        'Normal',
        'Economie'
    ];

    public function loadData(ObjectManager $manager)
    {

        $this->createMany(Place::class, 3, function(Place $place,$count)  {
            $place->setIdentifiant($this->faker->ean13);

        });
        $manager->flush();
    }
}