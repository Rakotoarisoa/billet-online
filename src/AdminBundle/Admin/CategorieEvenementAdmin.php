<?php
namespace AdminBundle\Admin;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
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
            ->add('libelle')
            ->add('evenement', 'sonata_type_collection', array(
                'by_reference' => false,
            ), array(
                'edit' => 'inline',
                'inline' => 'table',
               
            ));

            // $formMapper->add('scores', CollectionType::class, [
            //     'by_reference' => false, // Use this because of reasons
            //     'allow_add' => true, // True if you want allow adding new entries to the collection
            //     'allow_delete' => true, // True if you want to allow deleting entries
            //     'prototype' => true, // True if you want to use a custom form type
            //     'entry_type' => ScoreType::class, // Form type for the Entity that is being attached to the object
            // ]);
            
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('libelle');

    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('libelle')
            ->add('_action', null,[
                'actions' => [
                    'show' => [],
                    'edit' => [],
                    'delete' => [],
                ]
            ]);
       
    }
}
