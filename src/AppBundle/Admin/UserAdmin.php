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
use Symfony\Bridge\Doctrine\Form\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;

final class UserAdmin extends AbstractAdmin
{
    public function toString($object)
    {
        return $object instanceof UserAdmin
            ? $object->getNom()
            : 'Utilisateurs'; // shown in the breadcrumb on the create view
    }

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('nom')
            ->add('prenom')
            ->add('adresse')
            ->add('mobile_phone')
            ->add('date_de_naissance')
            ->add('sexe')
            ->add('pays')
            ->add('code_postal')
            ->add('roles','choice',[
                'multiple' => true,
                'expanded' => true,
                'mapped' => true,
                'choices' => [
                    'Simple utilisateur' => 'ROLE_USER',
                    'Utilisateurs membre' => 'ROLE_USER_MEMBER',
                    'Administrateur' => 'ROLE_ADMIN',
                    'Administrateur shop' => 'ROLE_USER_SHOP'
                ]
            ]); 
            //->add('roles', [], array('required' => false,'attr'=>array('class'=>'mapCoordinate')))  ;        

    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('nom')
                        ->add('prenom')
                        ->add('adresse')                       
        ;
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('nom')
                    ->add('prenom')
                    ->add('adresse')
                    ->add('mobile_phone')
                    ->add('date_de_naissance')
                    ->add('sexe')
                    ->add('pays')
                    ->add('code_postal')
                    ;
    }
}