<?php
namespace AdminBundle\Admin;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
final class ShopAdmin extends AbstractAdmin
{
    public function toString($object)
    {
        return $object instanceof BilletAdmin
            ? $object->getIdentifiant()
            : 'Point de Vente'; // shown in the breadcrumb on the create view
    }
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('nom',TextType::class , array('label'=>'Nom du point de vente'))
            ->add('active', CheckboxType::class, [
                'label'    => 'Activé'
            ]);
        ;
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('nom');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('nom');
        $listMapper
            ->add('created_at', 'date',
                [
                    'format' =>'Y-m-d H:i',
                    'label' => 'Date de création',
                ])
            ->add('updated_at', 'date',
                [
                    'format' =>'Y-m-d H:i',
                    'label' => 'Date de Modification',
                ])
            ->add('active',null,['label'=> 'Activé']);
    }
}
