<?php


namespace AdminBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;

final class EvenementAdmin extends AbstractAdmin
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
        return $object instanceof EvenementAdmin
            ? $object->getTitreEvenement()
            : 'Evenement'; // shown in the breadcrumb on the create view
    }

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->with('Général')
                ->add('titreEvenement')
                -add('description')
            ->end()
            ->with('Date')
                ->add('dateDebutEvent')
                ->add('dateFinEvent')
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
        ;
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('titreEvenement')
                        ->add('dateDebutEvent')
                        ->add('dateFinEvent')
                        ->add('organisation');
    }
}
