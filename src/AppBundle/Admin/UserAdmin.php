<?php


namespace AppBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Symfony\Bridge\Doctrine\Form\Type\ChoiceType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\BirthdayType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;

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
            ->add('nom', 'text', ['label' => 'Nom'])
            ->add('prenom', 'text', ['label' => 'Prénom'])
            ->add('username','text',['label'=> 'Nom d\'utilisateur'])
            ->add('adresse', 'text', ['label' => 'Adresse'])
            ->add('email')
            ->add('plainPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'first_options' => ['label' => 'Mot de passe'],
                'second_options' => ['label' => 'Confirmer le mot de passe']
            ])
            ->add('mobile_phone', 'text', ['label' => 'Numéro téléphone'])
            ->add('date_de_naissance', BirthdayType::class, [
                'placeholder' => [
                    'year' => 'Année', 'month' => 'Mois', 'day' => 'Jour',
                ]
            ])
            ->add('sexe', 'choice', [
                'mapped'=> true,
                'choices' => [
                    'Homme' => 'M',
                    'Femme' => 'F'
                ]
            ])
            ->add('pays', 'choice', [
                'label' => 'Pays',
                'mapped' => true,
                'choices' => [
                    'Madagascar' => 'Madagascar',
                    'France' => 'France',
                    'Etats-unis' => 'Etats-unis'
                ]


            ])
            ->add('code_postal','text', ['label'=> 'Code postal'])
            ->add('website','text',['label'=> 'Site web'])
            ->add('blog','text',['label'=> 'Blog'])
            ->add('phone','text',['label'=> 'Téléphone'])
            ->add('mobile_phone','text',['label'=> 'Téléphone mobile'])
            ->add('roles','choice',[
                'multiple' => true,
                'mapped' => true,
                'required' => true,
                'choices' => [
                    'Simple utilisateur' => 'ROLE_USER',
                    'Utilisateurs membre' => 'ROLE_USER_MEMBER',
                    'Administrateur' => 'ROLE_ADMIN',
                    'Administrateur de point de vente' => 'ROLE_USER_SHOP'
                ]
            ])
            ->add('point_de_vente',
                EntityType::class,
                ['class' => 'AppBundle\Entity\Shop','placeholder' => 'Sélectionner le point de vente à gérer']
            );

    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('username')
            ->add('roles');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('username', 'string', ['label' => 'Nom d\'utilisateur'])
            ->add('nom', 'string')
            ->add('prenom', 'string', ['label' => 'Prénom'])
            ->add('adresse', 'string', ['label' => 'Adresse'])
            ->add('email', 'string', ['label' => 'Adresse e-mail'])
            ->add('roles');
    }
}