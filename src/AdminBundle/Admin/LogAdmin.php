<?php


namespace AdminBundle\Admin;


use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;


final class LogAdmin extends AbstractAdmin
{
    public function toString($object)
    {
        return $object instanceof LogAdmin
            ? $object->getType()
            : 'Journal'; // shown in the breadcrumb on the create view
    }

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('user', EntityType::class,[
                'class' => 'AppBundle\Entity\User',
                'placeholder'=>'Utilisateur lié',
                'choice_label'  => 'Utilisateur',
                'label' => 'Nom',
                'required' => true
            ])
            ->add('type')
            ->add('message');

    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('user.nom')
            ->add('type')
            ->add('message');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('message')
        ->add('createdAt','date',['label'=>'Date de création']);
    }
}
