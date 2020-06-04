<?php
namespace AdminBundle\Admin;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
final class ReservationAdmin extends AbstractAdmin
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
        return $object instanceof BilletAdmin
            ? $object->getRandomCodeCommande()
            : 'Réservation'; // shown in the breadcrumb on the create view
    }
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('createdAt');

    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('randomCodeCommande');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('randomCodeCommande', 'text', ['label' => 'Identifiant']);
        $listMapper
            ->add('evenement.titreEvenement', 'text', ['label' => 'Evènement'])
            ->add('montant_total','float',['Montant'])
            ->add('user_checkout.nom','text',['label'=>'Nom de l\'acheteur'])
            ->add('createdAt', 'date', ['lable' => 'Date de création', 'format' => 'DD-MM-YYYY']);
    }
}
