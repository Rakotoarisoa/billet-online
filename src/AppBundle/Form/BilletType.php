<?php

namespace AppBundle\Form;

use AppBundle\Entity\TypeBillet;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class BilletType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('identifiant')->add('place_id',TextType::class , array('label'=>'Identifiant Place'))->add('estVendu')->add('prix')->add('typeBillet',EntityType::class, array(
            'class'         => 'AppBundle\Entity\TypeBillet',
            'placeholder'=>'Sélectionnez le type du billet',
            'choice_label'  => 'libelle',
            'label' => 'Type du billet',
            'required' => true));
    }/**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Billet'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'appbundle_billet';
    }


}
