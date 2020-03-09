<?php


namespace AppBundle\Admin;


use AppBundle\Entity\Billet;
use Doctrine\DBAL\Types\FloatType;
use Money\Number;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;

final class EventAdmin extends AbstractAdmin
{
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('titreEvenement')
            ->add('prix',NumberType::class , array('label'=>'Prix'))
            ->add('quantite',NumberType::class,array('label' =>'Quantité'))
            ->add('evenement.titreEvenement', EntityType::class,array(
                'label' => 'Evenement',
                'class' => 'AppBundle\Entity\Evenement'));

    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('prix');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('libelle');
    }
}