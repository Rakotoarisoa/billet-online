<?php
namespace AppBundle\Admin;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
final class CategorieEvenementAdmin extends AbstractAdmin
{
    public function toString($object)
    {
        return $object instanceof CategorieEvenementAdmin
            ? $object->getLibelle()
            : 'Catégorie Evenement'; // shown in the breadcrumb on the create view
    }
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('libelle');
            
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('libelle');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('libelle');
       
    }
}