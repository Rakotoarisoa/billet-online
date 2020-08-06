<?php

namespace AppBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Doctrine\DBAL\Types\Type;

class AppBundle extends Bundle
{
    public function boot()
    {
        $em = $this->container->get('doctrine.orm.default_entity_manager');
        //$sql=$em->getConnection()->getDatabasePlatform()->getBlobTypeDeclarationSQL(array('mediumblob'));
           // Type::addType('mediumblob', 'AppBundle\Doctrine\Types\MediumBlobType');
           //$em->getConnection()->getDatabasePlatform()
            // ->registerDoctrineTypeMapping('MEDIUMBLOB', 'mediumblob');
    }
    public function getParent()
    {
        return 'FOSUserBundle';
    }
}
