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

final class EvenementAdmin extends AbstractAdmin
{
    public function toString($object)
    {
        return $object instanceof EvenementAdmin
            ? $object->getOrganisation()
            : 'Evenement'; // shown in the breadcrumb on the create view
    }

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('titreEvenement')
            ->add('titreEvenementSlug')
            //->add('dateDebutEvent')
            //->add('dateFinEvent')
            ->add('user',EntityType::class, array(
                'class' => 'AppBundle\Entity\User',
                'placeholder'=>'Utilisateur lié',
                'choice_label'  => 'nom',
                'label' => 'Nom',
                'required' => true))
            ->add('organisation');           

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
                        ->add('titreEvenementSlug')
                        ->add('dateDebutEvent')
                        ->add('dateFinEvent')
                        ->add('user.nom')
                        ->add('organisation');
    }
}