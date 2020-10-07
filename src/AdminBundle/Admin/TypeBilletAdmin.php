<?php


namespace AdminBundle\Admin;


use AppBundle\Entity\Billet;
use Doctrine\DBAL\Types\FloatType;
use Money\Number;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;

final class TypeBilletAdmin extends AbstractAdmin
{
    public function toString($object)
    {
        return $object instanceof TypeBilletAdmin
            ? $object->getOrganisation()
            : 'Type de billet'; // shown in the breadcrumb on the create view
    }
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('libelle')
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
