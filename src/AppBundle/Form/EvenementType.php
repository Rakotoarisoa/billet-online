<?php

namespace AppBundle\Form;

use FOS\CKEditorBundle\Form\Type\CKEditorType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class EvenementType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nom',        TextType::class, array(
                'attr' => [
                    'autocomplete' => 'off',
                ]
            ))
            ->add('dateDebutEvent',  DateTimeType::class, array(
                'required' => true,
                'widget' => 'single_text',
                'attr' => [
                    'class' => 'form-control datetimepicker dateDebut',
                    'data-provide' => 'datetimepicker',
                    'date_format'=>"dd/MM/yyyy hh:mm",
                    'html5' => false,
                    'autocomplete' => 'off'
                ],
            ))
            ->add('dateFinEvent',    DateTimeType::class, array(
                'widget' => 'single_text',
                'attr' => [
                    'class' => 'form-control datetimepicker dateDebut',
                    'data-provide' => 'datetimepicker',
                    'date_format'=>"dd/MM/yyyy hh:mm",
                    'html5' => false,
                    'autocomplete' => 'off'
                ],
            ))
            ->add('imageEvent',      ImageType::class)
            ->add('description',CKEditorType::class, array(
                'config_name' => 'mon_config',

//                    array(
//                   'removeButtons' => ['Table','Source'],
//                   'removePlugins' => [ 'image', 'Link', 'blockToolbar', 'cloudServices', 'mediaEmbed', 'about', 'Source']
//                ),
            ))
            ->add('categorieEvenement',       EntityType::class, array(
                'class'         => 'AppBundle\Entity\CategorieEvenement',
                'placeholder'=>'Sélectionnez le type d\'événement',
                'choice_label'  => 'libelle'
            ))
            ->add('lieuEvenement',       EntityType::class, array(
                'class'         => 'AppBundle\Entity\LieuEvenement',
                'placeholder'=>'Sélectionnez un thème',
                'choice_label'  => 'libelle'
            ))

            ->add('billet',      ImageType::class, array(
                'required' => false
            ))
            ->add('save',        SubmitType::class, array(
                'label' => 'Valider'
            ))
        ;
    }/**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Evenement'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'appbundle_event';
    }


}
