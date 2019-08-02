<?php


namespace AppBundle\DataFixtures;

use AppBundle\Entity\CategorieEvenement;
use AppBundle\Entity\LieuEvenement;
use AppBundle\Entity\User;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Evenement;
use AppBundle\Utils\Slugger;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;


class EventFixture extends BaseFixture
{
    protected $container;
    private static $EventTitles = [
        'Mage 4 Test',
        'Colombes hommage',
        'Ricky Test',
        'The weekend',
        ''
    ];
    private static $EventImages = [
        'img/e1.jpg',
        'img/e2.jpg',
        'img/e3.jpg',
        'img/e4.jpg'
    ];
    public function loadData(ObjectManager $manager)
    {

        // On configure dans quelles langues nous voulons nos données
        $this->createMany(Evenement::class, 10, function(Evenement $event,$count) {
            $slugger=new Slugger();
            $arrayEvent=[
                'Mage 4 Test',
                'Colombes hommage',
                'Ricky Test',
                'The weekend',
                'ColdPlay',
                'Ambondrona',
                'LinkinPark',
                'Aina Cook',
                'Jazz Time',
                'Zaza Kanto'
            ];
            $event->setTitreEvenement($arrayEvent[$count]);
            $event->setImageEvent($this->faker->randomElement(self::$EventImages));
            $event->setDescription($this->faker->paragraph($nbSentences = 8, $variableNbSentences = true));
            $event->setDateDebutEvent(new \DateTime('NOW'));
            $event->setDateFinEvent(new \DateTime('+ 8 hours'));
            $event->setTitreEvenementSlug($slugger->slugify($event->getTitreEvenement()));
            $event->setLieuEvenement($this->getReference('lieu1'));
            $event->setStatut('A venir');
        });
        $manager->flush();
    }
}