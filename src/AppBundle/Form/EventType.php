<?php


namespace AppBundle\Form;
use FOS\CKEditorBundle\Form\Type\CKEditorType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\RadioType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\File;

class EventType extends  AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('titreEvenement',TextType::class, array(
                'attr' => [
                    'autocomplete' => 'off',
                ],
                'constraints' => new NotBlank(),
                'required' => true,
            ))
            ->add('dateDebutEvent',  DateTimeType::class, array(
                'required' => true,
                'widget' => 'single_text',
                'constraints' => new NotBlank(),
                'attr' => [
                    'class' => 'form-control datetimepicker dateDebut',
                    'data-provide' => 'datetimepicker',
                    'date_format'=>"dd/MM/yyyy hh:mm",
                    'date_label' => 'Date de débute',
                    'html5' => false,
                    'autocomplete' => 'off'
                ],
            ))
            ->add('dateFinEvent',    DateTimeType::class, array(
                'widget' => 'single_text',
                'required' => false,
                'attr' => [
                    'class' => 'form-control datetimepicker dateFin',
                    'data-provide' => 'datetimepicker',
                    'date_format'=>"dd/MM/yyyy hh:mm",
                    'html5' => false,
                    'autocomplete' => 'off'
                ],
            ))
            ->add('imageEvent',FileType::class,[
                'label' => 'Image',

                // unmapped means that this field is not associated to any entity property
                'mapped' => false,
                'required' => false,

                // unmapped fields can't define their validation using annotations
                // in the associated entity, so you can use the PHP constraint classes
                'constraints' => [
                    new File([
                        'maxSize' => '1024k',
                        'mimeTypes' => [
                            'image/png',
                            'image/jpg',
                        ],
                        'mimeTypesMessage' => 'Enregistrez une image valide',
                    ])
                ],
            ])
            ->add('description', CKEditorType::class, array(
                'config' => array(
                    'uiColor' => '#ffffff',
                ),
                'required' => true
            ))
            ->add('categorieEvenement',EntityType::class, array(
                'class'         => 'AppBundle\Entity\CategorieEvenement',
                'placeholder'=>'Sélectionnez la catégorie de l\'évènement',
                'choice_label'  => 'libelle',
                'required' => true
            ))
            ->add('lieuEvenement',       EntityType::class, array(
                'class'         => 'AppBundle\Entity\LieuEvenement',
                'placeholder'=>'Sélectionnez le lieu ',
                'choice_label'  => 'nomSalle',
                'required' => true
            ))
            ->add('isUsingSeatMap',       ChoiceType::class, [
                    'choices'  => [
                        'Oui' => true,
                        'Non' => false,
                    ],
                    'expanded' => true,
                    'multiple' => false,
                    'label'=> 'Utiliser le plan de salle'
                ]

            )
            ->add('isPublished',       ChoiceType::class, [
                    'choices'  => [
                        'Oui' => true,
                        'Non' => false,
                    ],
                    'expanded' => false,
                    'multiple' => false,
                    'label'=>'Publier',
                ]

            )
            ->add('organisation',TextType::class, array(
                'label'  => 'Organisateur de l\'évènement',
                'required' => true,
                'constraints' => new NotBlank(),

            ))
            /*->add('salle',       EntityType::class, array(
                'class'         => 'Nexthope\IvencoBundle\Entity\Salle',
                'placeholder'=>'Sélectionnez la salle',
                'choice_label'  => 'libelle',
                'query_builder' => function (SalleRepository $sr) {
                    return $sr
                        ->createQueryBuilder('s')
                        ->where('s.isLibre = true')
                        ;
                },
            ))*/
            ->add('save_create_map',SubmitType::class, array(
                'label' => 'Enregistrer et créer un plan de salle',
                'attr'=>['class'=>'btn btn-outline-dark m-lg-2']))
            ->add('save_create_billet',SubmitType::class, array(
                'label' => 'Enregistrer et créer des billets',
                'attr'=>['class'=>'btn btn-outline-dark m-lg-2']))
            ->add('save',        SubmitType::class, array(
                'label' => 'Enregistrer'
            ))
            ->getForm();
        ;

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
        return 'appbundle_event';
    }
}