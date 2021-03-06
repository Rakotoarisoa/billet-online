<?php

namespace AppBundle\Form;

use FOS\CKEditorBundle\Form\Type\CKEditorType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Image;
use Symfony\Component\Validator\Constraints\NotBlank;
use Vich\UploaderBundle\Form\Type\VichImageType;
use Symfony\Component\Validator\Constraints as Assert;

class EvenementType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->remove('isPublished');

        $builder->add('titreEvenement', TextType::class, array(
                        'label' => 'create_event_field_label.title_event',
                        'attr' => [
                            'autocomplete' => 'on',
                            'placeholder' => 'Soyez clair et précis',
                            'maxLength' => 75
                        ],
                        'constraints' => new NotBlank(array(
                            'groups' => 'flow_registration_step1'
                        )),
                        'required' => true,
                    ))
                    ->add('typeBillets', CollectionType::class, [
                        'entry_type' => TypeBilletType::class,
                        'allow_add' => true,
                        'allow_delete' => true,
                        'by_reference' => false,
                        'required' => true,
                        'constraints' => [
                            new Assert\Count([
                                'min' => 1,
                                'minMessage' => 'Au moins un type de billets est requis',
                                // also has max and maxMessage just like the Length constraint
                            ])]
                    ])
                    ->add('devise',EntityType::class ,array(
                        'label' => 'Sélectionner la devise',
                        'class' => 'AppBundle\Entity\Devise',
                        'placeholder' => 'Sélectionnez la devise à utiliser',
                        'choice_label' => 'libelle',
                        'constraints' => new NotBlank(
                            array(
                                'groups' => 'flow_registration_step1'
                            )
                        ),
                        'required' => true
                    ))
                    ->add('dateDebutEvent', DateTimeType::class, array(
                        'label'=> 'create_event_field_label.date_start',
                        'required' => true,
                        'widget' => 'single_text',
                        'html5' => false,
                        'format' => 'dd-MM-yyyy HH:mm',
                        'constraints' => new NotBlank(
                            array(
                                'groups' => 'flow_registration_step1'
                            )
                        ),
                        'attr' => [
                            'class' => 'form-control dateDebut'
                        ],
                    ))
                    ->add('dateFinEvent', DateTimeType::class, array(
                        'label' => 'create_event_field_label.date_end',
                        'widget' => 'single_text',
                        'required' => false,

                        'format' => 'dd-MM-yyyy HH:mm',
                        'attr' => [
                            'class' => 'form-control dateFin',
                        ],
                        //'constraints' => new NotBlank(),
                    ))
                    ->add('categorieEvenement', EntityType::class, array(
                        'label' => 'create_event_field_label.categorie',
                        'class' => 'AppBundle\Entity\CategorieEvenement',
                        'placeholder' => 'Sélectionnez la catégorie de l\'évènement',
                        'choice_label' => 'libelle',
                        'required' => true
                    ))
                    ->add('lieuEvenement', EntityType::class, array(
                        'label' => 'create_event_field_label.lieu',
                        'class' => 'AppBundle\Entity\LieuEvenement',
                        'placeholder' => 'Sélectionnez le lieu',
                        'choice_label' => 'nomSalle',
                        'required' => true
                    ))
                    ->add('organisation', TextType::class, array(
                        'label' => 'Organisateur de l\'évènement',
                        'required' => true,
                        'constraints' => new NotBlank(),

                    ))
                    ->add('image', VichImageType::class, [
                    'label' => 'Image de l\'évènement',
                    // unmapped means that this field is not associated to any entity property
                    'mapped' => true,
                    'required' => false,
                    'constraints' => [
                        new Image(
                            [
                                'minHeight' => 400,
                                'minWidth' => 600
                            ]
                        )
                    ],
                    'attr' => [
                        'id' => "image-event",
                        'class' => 'image-event file',
                        'accept' => '.jpg,.jpeg',
                        'data-msg-placeholder' => "Selectionner une image ..."
                    ]
                    ])
                    ->add('description', CKEditorType::class, array(
                        'config' => array(
                            'uiColor' => '#ffffff',
                        ),
                        'required' => true
                    ))
                    ->add('isUsingSeatMap', ChoiceType::class, [
                            'choices' => [
                                'Oui' => true,
                                'Non' => false,
                            ],
                            'expanded' => false,
                            'multiple' => false,
                            'label' => 'Utiliser le plan de salle',
                            'empty_data' => true,
                            'attr' => [
                                'class' => 'custom-select mr-sm-2 col-sm-2'
                            ]
                        ]

                    )
                    ->add('templateSeatMap', ChoiceType::class, [
                            'choices' => [
                                'Antsahamanitra' => 'antsahamanitra',
                                'Palais des sports' => 'palais',
                            ],
                            'expanded' => false,
                            'multiple' => false,
                            'label' => 'Utiliser comme modèle',
                            'empty_data' => true,
                            'attr' => [
                                'class' => 'custom-select mr-sm-2 col-5'
                            ],
                            'mapped' => false
                        ]

                    )

                /* ->add('isPublished', CheckboxType::class, [

                         'attr' => [
                             'class' => 'col-sm-1'
                         ],
                         'label' => 'Publier',
                     ]

                 );*/
                    ->add('options', EventOptionsType::class, [
                    ]);
    }

    /**
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
        return 'appbundle_event_form';
    }


}
