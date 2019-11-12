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

final class DeviseAdmin extends AbstractAdmin
{
    public function toString($object)
    {
        return $object instanceof DeviseAdmin
            ? $object->getOrganisation()
            : 'Devise'; // shown in the breadcrumb on the create view
    }

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('code')
            ->add('libelle');           

    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('code')
                        ->add('libelle');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('code')
                        ->add('libelle');
    }
}