<?php


namespace AppBundle\DataFixtures;

use AppBundle\Entity\TypeBillet;
use Doctrine\Common\Persistence\ObjectManager;

class TypeBilletFixture extends BaseFixture
{
    private static $libelles= [
        'VIP',
        'Normal',
        'Economie'
    ];
    public function loadData(ObjectManager $manager)
    {
        // On configure dans quelles langues nous voulons nos données
        $this->createMany(TypeBillet::class, 3, function(TypeBillet $typeBillet,$count) {
            $typeBillet->setLibelle(self::$libelles[$count]);
        });
        $manager->flush();
    }
}
