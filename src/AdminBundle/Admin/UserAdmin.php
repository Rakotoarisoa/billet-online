<?php


namespace AdminBundle\Admin;
use Knp\Menu\ItemInterface as MenuItemInterface;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Admin\AdminInterface;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;
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
    protected function configureTabMenu(MenuItemInterface $menu, $action, AdminInterface $childAdmin = null)
    {
        if (!$childAdmin && !in_array($action, ['edit', 'show'])) {
            return;
        }

        $admin = $this->isChild() ? $this->getParent() : $this;
        $id = $admin->getRequest()->get('id');
        if ($this->isGranted('LIST')) {
            $menu->addChild('Liste des évènements', [
                'uri' => $admin->generateUrl('admin.evenement.list', ['id' => $id])
            ]);
        }
    }

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->with('Informations Générales')
                ->add('nom', 'text', ['label' => 'Nom'])
                ->add('prenom', 'text', ['label' => 'Prénom'])
                ->add('phone')
                ->add('sexe', 'choice', [
                    'mapped'=> true,
                    'choices' => [
                        'Homme' => 'M',
                        'Femme' => 'F'
                    ]
                ])
                ->add('date_de_naissance', BirthdayType::class, [
                    'placeholder' => [
                        'year' => 'Année', 'month' => 'Mois', 'day' => 'Jour',
                    ]
                ])
            ->add('mobile_phone', 'text', ['label' => 'Numéro téléphone'])
                ->add('website','url')
                ->add('adresse', 'text', ['label' => 'Adresse'])
                ->add('code_postal','number')
                ->add('region','text')
                ->add('pays')
            ->end()
            ->with('Information de connexion')
                ->add('username','text',['label'=> 'Nom d\'utilisateur'])
                ->add('email')
            ->end()
            /*->add('plainPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'first_options' => ['label' => 'Mot de passe'],
                'second_options' => ['label' => 'Confirmer le mot de passe']
            ])*/
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
            ->add('roles',null,[ 'role' => 'ROLE_ADMIN']);
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('username', 'string', ['label' => 'Nom d\'utilisateur'])
            ->add('email', 'string', ['label' => 'Adresse e-mail'])
            ->add('last_login', 'date', [
                'format' => 'Y-m-d H:i',
                'timezone' => 'Europe/Moscow',
                'label' => 'Dernière connexion'
            ])
            ->add('date_enregistrement','date',[
                'format' => 'Y-m-d H:i',
                'timezone' => 'Europe/Moscow',
                'label' => 'Date de création'
            ])
            ->add('enabled', 'boolean',array('label'=> 'Activé'))
            ->add('_action', null,[
        'actions' => [
            'show' => [],
            'edit' => [
                // You may add custom link parameters used to generate the action url
                'link_parameters' => [
                    'full' => true,
                ]
            ],
            'delete' => [],
        ]
    ]);
    }

    protected function configureShowFields(ShowMapper $show)
    {
        parent::configureShowFields($show); // TODO: Change the autogenerated stub
        $show
        ->with('Informations de connexion')
            ->add('username')
            ->add('email')
            ->add('pointDeVente')
        ->end()

        ->with('Information générales')
                ->add('nom')
                ->add('prenom','text',['label'=>'Prénom'])
                ->add('adresse')
                ->add('phone')
                ->add('mobile_phone')
                ->add('code_postal')
                ->add('region')
                ->add('pays')
        ->end()
        ->with('Métadonnées')
            ->add('last_login','date',['label'=>'Dernière connexion',
                'format' => 'Y-m-d H:i',
                'timezone' => 'Europe/Moscow',
                ])
            ->add('date_enregistrement','date',['label'=>'Crée le','format' => 'Y-m-d H:i',
                'timezone' => 'Europe/Moscow',
                ])
        ->end();


    }
}
