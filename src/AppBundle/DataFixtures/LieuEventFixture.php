<?php


namespace AppBundle\DataFixtures;


use AppBundle\Entity\CategorieEvenement;
use AppBundle\Entity\Evenement;
use AppBundle\Entity\LieuEvenement;
use DateTime;
use Doctrine\Common\Persistence\ObjectManager;

class LieuEventFixture extends BaseFixture
{

    private static $nomSalle = [
        'Palais',
        'Stade',
        'Coliseum',
        'Theater'
    ];
    public function loadData(ObjectManager $manager)
    {
        $this->createMany(LieuEvenement::class, 3, function(LieuEvenement $lieuEvent,$count) {
            $arraySalle=['Palace',
                'Stade',
                'Coliseum',
                'Theater'];
        $jsonContent=file_get_contents( 'C:\wamp64\www\symfony3.4\web\js\seat-map.json');
        $lieuEvent->setNomSalle($arraySalle[$count]);
        $lieuEvent->setPays('Madagascar');
        $lieuEvent->setCapacite($this->faker->randomNumber(2,true));
        $lieuEvent->setAdresse($this->faker->streetAddress);
        $lieuEvent->setStructureSalle($jsonContent);
        $lieuEvent->setCodePostal('101');
        $this->addReference('lieu'+$count, $lieuEvent);
        });
        $manager->flush();
    }

}