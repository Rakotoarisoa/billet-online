<?php


namespace AdminBundle\Admin;


use AppBundle\Entity\Billet;
use AppBundle\Entity\PaymentTransaction;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;

use Sonata\AdminBundle\Show\ShowMapper;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\DateType;

final class PaymentTransactionAdmin extends AbstractAdmin
{
    public function toString($object)
    {
        return $object instanceof PaymentTransaction
            ? $object->getTxnid()
            : 'Transaction'; // shown in the breadcrumb on the create view
    }

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('status');

    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('payment_method')
                        ->add('txnid');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('txnid',null,array('label'=> 'Id transaction'))
                        ->add('status', null,array('label'=> 'Etat'))
                         ->add('currency',null,array('label'=> 'Devise'))
                        ->add('amount', null,array('label'=> 'Montant'))
                        ->add('payment_method',null,array('label'=> 'Méthode de paiement'))
                        ->add('created_at', DateType::class, array('label'=>'Date de création'))
                        ->add('updated_at', DateType::class, array('label'=>'Date de modification'));
    }
    protected function configureShowFields(ShowMapper $showMapper)
    {
        $showMapper
            ->with('Détails de la transaction')
                ->add('txnid',null,array('label'=> 'Id transaction'))
                ->add('status', null,array('label'=> 'Etat'))
                ->add('currency',null,array('label'=> 'Devise'))
                ->add('amount', null,array('label'=> 'Montant'))
                ->add('payment_method',null,array('label'=> 'Méthode de paiement'))
            ->end();
    }
}
