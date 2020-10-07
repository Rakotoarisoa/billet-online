<?php


namespace AdminBundle\Admin;

use AppBundle\Entity\Evenement;
use AppBundle\Entity\TypeBillet;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;
use Sonata\AdminBundle\Route\RouteCollection;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
//use Symfony\Component\Form\Extension\Core\Type\NumberType;

final class EventAdmin extends AbstractAdmin
{
    protected function configureRoutes(RouteCollection $collection)
    {
        if($this->isChild()){
            return;
        }
        // This is the route configuration as a parent
        $collection->clearExcept(['list']);

    }
    public function toString($object)
    {
        return $object instanceof Evenement
            ? $object->getTitreEvenement()
            : 'Evenement'; // shown in the breadcrumb on the create view
    }

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->with('Général')
            ->add('titreEvenement')
            ->add('description')
            ->end()
            ->with('Date')
            ->add('dateDebutEvent')
            ->add('dateFinEvent')
            ->end()
            ->with('Configurations')
            ->add('isPublished')
            ->add('isUsingSeatMap')
            ->end()
            ->with('Métadonnées')
            ->add('user',EntityType::class, array(
                'class' => 'AppBundle\Entity\User',
                'placeholder'=>'Utilisateur lié',
                'choice_label'  => 'nom',
                'label' => 'Nom',
                'required' => true))
            ->add('organisation')
            ->end()
        ;

    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('organisation')
            ->add('titreEvenement')
            ->add('dateDebutEvent')
            ->add('dateFinEvent')
        ;
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('titreEvenement')
            ->add('dateDebutEvent')
            ->add('dateFinEvent')
            ->add('organisation')
            ->add('_action', null,[
                'actions' => [
                    'show' => [],
                    'edit' => [],
                    'delete' => [],
                ]
            ]);
    }
    protected function configureShowFields(ShowMapper $showMapper)
    {
        $showMapper->with('Général')
                ->add('titreEvenement' ,null, array('label'=> 'Titre de l\'évènement'))
                ->add('description', null, array('label'=> 'Description'))
                ->add('dateDebutEvent', null, array('label'=> 'Date de début de l\'évènement'))
                ->add('dateFinEvent', null, array('label'=> 'Date de fin de l\'évènement'))
            ->end()
            ->with('Statistiques de ventes')
                ->add('typeBillets', 'sonata_type_collection',array(
                    'type'               => new TypeBillet(),
                    'allow_add'          => false,
                    'allow_delete'       => false,
                    'cascade_validation' => false,
                    'by_reference'       => false,
                    'delete_empty'       => false,
                    'options'            => array( 'label' => false ),
                ))
            ->end()
            ->with('Métadonnées')
                ->add('created_at', null,array(
                    'label'=> 'Date de création'
                ))
            ->end()
            ;
    }
}
