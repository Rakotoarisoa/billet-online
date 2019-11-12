<?php
namespace AppBundle\Admin;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
final class LieuEvenementAdmin extends AbstractAdmin
{
    public function toString($object)
    {
        return $object instanceof LieuEvenementAdmin
            ? $object->getAdresse()
            : 'Lieu Evenement'; // shown in the breadcrumb on the create view
    }
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('adresse')
            ->add('pays')
            ->add('codePostal')
            ->add('nomSalle')
            ->add('capacite');
            
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('adresse')
            ->add('pays')
            ->add('codePostal')
            ->add('nomSalle');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('adresse')
            ->add('pays')
            ->add('codePostal')
            ->add('nomSalle');
       
    }
}