<?php


namespace AdminBundle\Admin;

use AppBundle\Entity\CategorieEvenement;
use AppBundle\Entity\Evenement;
use Knp\Menu\ItemInterface as MenuItemInterface;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Admin\AdminInterface;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Form\Type\Filter\DateType;
use Sonata\AdminBundle\Show\ShowMapper;
use Sonata\AdminBundle\Route\RouteCollection;

use Sonata\Form\Type\BooleanType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
//use Symfony\Component\Form\Extension\Core\Type\NumberType;

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
    protected function configureTabMenu(MenuItemInterface $menu, $action, AdminInterface $childAdmin = null)
    {
        if (!$childAdmin && !in_array($action, ['edit','show'])) {
            return;
        }
        $admin = $this->isChild() ? $this->getParent() : $this;
        $id = $this->getRequest()->get('id');
        if ($this->isGranted('list')) {
            $menu->addChild('Afficher les types de  billets', [
                'uri' => $admin->generateUrl('admin.typebillet.list', ['id' => $id])
            ]);
            $menu->addChild('Afficher les réservations', [
                'uri' => $admin->generateUrl('admin.reservation.list', ['id' => $id])
            ]);
        }
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
                        ->add('dateDebutEvent',null,array('format'=> 'd-m-Y','label'=>'Date de début'))
                        ->add('categorieEvenement.libelle',null,array('label'=>'Catégorie'))
                        ->add('organisation',null,array('label'=>'Organisateur'))
                        ->add('isPublished', 'boolean',array('label'=>'Est publié'))
                        ->add('user.username',null,array('label'=>'Utilisateur'))
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
        $showMapper->tab('Général')
                ->with('Informations Générales',[
                    'class'       => 'col-md-8',
                    'box_class'   => 'box box-solid box-primary',
                ])
                    ->add('titreEvenement' ,null, array('label'=> false))
                    ->add('description', null, array('label'=> 'Description'))
                    ->add('organisation',null, array('label'=>'Organisateur'))
                    ->add('categorieEvenement.libelle', null, array('label'=> 'Catégorie de l\'évènement'))
                    ->add('devise.libelle', null, array('label'=> 'Devise'))
                    ->add('dateDebutEvent', null, array('label'=> 'Date de début de l\'évènement'))
                    ->add('dateFinEvent', null, array('label'=> 'Date de fin de l\'évènement'))
                    ->add('isPublished' , null,array('label' => 'Est publié'))
                ->end()
            ->end()
            ->tab('Plan de salle')
                ->with('Configurations',[
                    'class'       => 'col-md-12',
                    'box_class'   => 'box box-solid box-secondary',
                ])
                    ->add('isUsingSeatMap', null, array('label' => 'L\'évènement utilise le plan de salle'))
                ->end()
            ->end()
            ->tab('Billets et statistiques')
                ->with('Billets',[
                    'class'       => 'col-md-12',
                    'box_class'   => 'box box-solid box-success',
                ])
                    ->add('typeBillets', 'null' ,array(
                        'label' => false,
                        'template' => 'AdminBundle:admin:show_events_ticket_type.html.twig'

                    ))
                ->end()
            ->end()
            ->tab('Métadonnées')
                ->add('createdAt', null,array(
                    'label'=> 'Date de création'
                ))
                ->add('updatedAt', null,array(
                    'label'=> 'Date de dernière modification'
                ))
            ->end()
        ;
    }
}
