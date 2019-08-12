<?php


namespace AppBundle\Form;

use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RechercheBilletType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('identifiant', TextType::class, array('required'=>false,'label' => 'Référence', 'attr' => ['class' => 'form-control mb-2 mr-sm-2','name'=>'identifiant']))
            ->add('place_id', TextType::class, array('required'=>false,'label' => 'Place Id','attr' => ['class' => 'form-control mb-2 mr-sm-2']))
            ->add('estVendu', ChoiceType::class, array('choices'  => [
                'Oui' => true,
                'Non' => false,
            ],
                'expanded' => false,
                'multiple' => false,
                'label'=> 'Est vendu',
                'required'=>false,
                'empty_data'=>'true'))
            ->add('typeBillet', EntityType::class, array(
                'class' => 'AppBundle\Entity\TypeBillet',
                'placeholder' => 'Sélectionnez le type du billet',
                'choice_label' => 'libelle',
                'label' => 'Type',
                'required' => false,
                'attr'=>['class'=>'form-control mb-2 mr-sm-2']));
    }/**
 * {@inheritdoc}
 */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class'=>'AppBundle\Entity\Billet'
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