<?php

namespace AppBundle\Form;

use AppBundle\Entity\TypeBillet;
use FOS\CKEditorBundle\Form\Type\CKEditorType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class TypeBilletType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('libelle', TextType::class, array('label' => 'Libellé', 'attr' => [
                'placeholder' => 'Ajouter un titre explicite à votre billet'
            ],
                'required' => true
            ))
            ->add('prix', NumberType::class, array('label' => 'Prix (MGA)', 'attr' => [
                'placeholder' => 'Définir le prix de votre Billet'
            ],
                'required' => true
            ))
            ->add('active', ChoiceType::class, [
                    'choices' => [
                        'Oui' => true,
                        'Non' => false,
                    ],
                    'expanded' => false,
                    'multiple' => false,
                    'label' => 'Activer/désactiver le billet',
                    'empty_data' => true,
                    'attr' => [
                        'class' => 'custom-select mr-sm-2 col-sm-1'
                    ]
                ]

            )
            ->add('description', CKEditorType::class, array(
                'label' => 'Description',
                'config' => array(
                    'uiColor' => '#ffffff',
                ),
                'required' => true,
                'attr' => [
                    'placeholder' => 'Ajouter une description'
                ]
            ))
            ->add('dateDebut', DateTimeType::class, array(
                'label' => 'Date de début des ventes',
                'widget' => 'single_text',
                'html5' => false,
                'attr' => [
                    'class' => 'form-control dateDebutBillets',
                    'readOnly' => true
                ],
            ))
            ->add('dateFin', DateTimeType::class, array(
                'label' => 'Date de fin des ventes',
                'widget' => 'single_text',
                'html5' => false,
                'attr' => [
                    'class' => 'form-control dateFinBillets',
                    'readOnly' => true
                ],
            ))
            ->add('quantite', NumberType::class, array('label' => 'Quantité', 'attr' => [
                'placeholder' => 'Nombre de billets'
            ]));
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => TypeBillet::class
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'appbundle_type_billet';
    }


}
