<?php


namespace AppBundle\DataFixtures;
use AppBundle\Entity\CategorieEvenement;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Evenement;
use DateTime;


class CategorieFixture extends BaseFixture
{
    private static $libelles = [
        'Concert',
        'Gala',
        'Invitation'
    ];

    public function loadData(ObjectManager $manager)
    {
        $this->createMany(CategorieEvenement::class, 3, function(CategorieEvenement $cat,$count) {
            $cat->setLibelle($this->faker->randomElement(self::$libelles));
        });
        $manager->flush();
    }
}