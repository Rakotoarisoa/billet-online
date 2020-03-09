<?php
namespace AppBundle\Admin;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
final class BilletAdmin extends AbstractAdmin
{
    public function toString($object)
    {
        return $object instanceof BilletAdmin
            ? $object->getIdentifiant()
            : 'Billet'; // shown in the breadcrumb on the create view
    }
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('identifiant')
            ->add('place_id',TextType::class , array('label'=>'Identifiant Place'))
            ->add('estVendu')
            ->add('typeBillet',EntityType::class, array(
            'class' => 'AppBundle\Entity\TypeBillet',
            'placeholder'=>'Sélectionnez le type du billet',
            'choice_label'  => 'libelle',
            'label' => 'Type du billet',
            'required' => true));
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('typeBillet');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('identifiant');
        $listMapper
            ->add('section_id')
            ->add('place_id')
            ->add('typeBillet.libelle');
    }
}