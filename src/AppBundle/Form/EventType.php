<?php


namespace AppBundle\Form;

use FOS\CKEditorBundle\Form\Type\CKEditorType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Image;

class EventType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        switch ($options['flow_step']) {
            case 1:
                $builder
                    ->add('titreEvenement', TextType::class, array(
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
                    ->add('dateDebutEvent', DateTimeType::class, array(
                        'required' => true,
                        'widget' => 'single_text',
                        'html5' => false,
                        'constraints' => new NotBlank(
                            array(
                                'groups' => 'flow_registration_step1'
                            )
                        ),
                        'attr' => [
                            'class' => 'form-control dateDebut',
                            'readOnly' => true
                        ],
                    ))
                    ->add('dateFinEvent', DateTimeType::class, array(
                        'widget' => 'single_text',
                        'required' => false,
                        'html5' => false,
                        'attr' => [
                            'class' => 'form-control dateFin',
                            'readOnly' => true
                        ],
                        //'constraints' => new NotBlank(),
                    ))
                    ->add('categorieEvenement', EntityType::class, array(
                        'class' => 'AppBundle\Entity\CategorieEvenement',
                        'placeholder' => 'Sélectionnez la catégorie de l\'évènement',
                        'choice_label' => 'libelle',
                        'required' => true
                    ))
                    ->add('lieuEvenement', EntityType::class, array(
                        'class' => 'AppBundle\Entity\LieuEvenement',
                        'placeholder' => 'Sélectionnez le lieu ',
                        'choice_label' => 'nomSalle',
                        'required' => true
                    ))
                    ->add('organisation', TextType::class, array(
                        'label' => 'Organisateur de l\'évènement',
                        'required' => true,
                        'constraints' => new NotBlank(),

                    ));
                break;
            case 2:
                $builder->add('image_event', FileType::class, [
                    'label' => 'Image',
                    // unmapped means that this field is not associated to any entity property
                    'mapped' => true,
                    'required' => true,
                    'constraints' => [
                        new Image(
                            [
                                'minHeight' => 300,
                                'minWidth' => 600
                            ]
                        )
                    ],
                    'attr' => [
                        'class' => 'image-event',
                        'accept' => '.jpg,.jpeg,.png'
                    ],
                    'data_class' => null
                ])
                    ->add('description', CKEditorType::class, array(
                        'config' => array(
                            'uiColor' => '#ffffff',
                        ),
                        'required' => true
                    ));
                break;
            case 3:
                $builder
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
                    ->add('isPublished', ChoiceType::class, [
                            'choices' => [
                                'Oui' => true,
                                'Non' => false,
                            ],
                            'expanded' => false,
                            'multiple' => false,
                            'attr' => [
                                'class' => 'custom-select mr-sm-2 col-sm-2'
                            ],
                            'label' => 'Publier',
                        ]

                    );
                break;
        }

    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Evenement',
            'flow_step' => 1,
            'validation_groups' => ['Default', 'registration']
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