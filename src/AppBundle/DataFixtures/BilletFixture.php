<?php


namespace AppBundle\DataFixtures;

use AppBundle\Entity\Billet;
use Doctrine\Common\Persistence\ObjectManager;

class BilletFixture extends BaseFixture
{
    public function loadData(ObjectManager $manager)
    {
        $this->createMany(Billet::class, 20, function(Billet $billet,$count) {
            $billet->setIdentifiant($this->faker->ean13);
            $billet->setPrix(18000.20);
        });
        $manager->flush();
    }
}