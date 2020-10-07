<?php
namespace AdminBundle\Admin;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\Form\Type\BooleanType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
final class UserCheckoutAdmin extends AbstractAdmin
{
    public function toString($object)
    {
        return $object instanceof BilletAdmin
            ? $object->getNom()
            : 'Client'; // shown in the breadcrumb on the create view
    }
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('nom','text',array('label'=>'Nom'))
            ->add('prenom',TextType::class , array('label'=>'Identifiant Place'))
            ->add('email',EmailType::class,['label'=>'email'])
            ->add('adresse1' ,TextType::class , array('label'=>'Adresse 1'))
            ->add('adresse2',TextType::class , array('label'=>'Adresse 2'))
            ->add('isRegisteredUser');
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('nom')
            ->add('prenom');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('id');
        $listMapper
            ->add('nom',TextType::class , array('label'=>'Nom'))
            ->add('prenom',TextType::class , array('label'=>'Prénom'))
            ->add('email',TextType::class , array('label'=>'Email'))
            ->add('adresse1',TextType::class , array('label'=>'Adresse 1'))
            ->add('adresse2', TextType::class , array('label'=>'Adresse 2'))
            ->add('isRegisteredUser', BooleanType::class,array('label'=>"Utilisateur Authentifié"));
    }
}
