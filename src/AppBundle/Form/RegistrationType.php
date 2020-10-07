<?php


namespace AppBundle\Form;
use Symfony\Component\Form\Extension\Core\Type\BirthdayType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Validator\Constraints\IsTrue;

class
RegistrationType extends  AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('nom',TextType::class,array(
            'label'=> 'Nom',
            'required' => true)
        );
        $builder->add('prenom',TextType::class,array('label'=> 'Prénom',
            'required' => true
        ));
        $builder->add('adresse',TextType::class,array('label'=>'Adresse',
            'required' => true
        ));
        $builder->add('mobile_phone',TextType::class,array('label'=> 'Numéro Téléphone',
            'required' => true
        ));
        $builder->add('phone',TextType::class,array('label'=> 'Autre numéro téléphone',
            'required' => true
        ));//secondary phone
        $builder->add('options',UserOptionsType::class,[
            'label' => 'Options de l\'évènement',
            //'attr' => array('class' => 'custom-checkbox'),
            //'label_attr' =>array('class' => 'custom-control-label')
        ]);
        /*$builder->add('options.isEventManager',CheckboxType::class,[
            'label' => 'Devenir créateur d\'évènements',
            'mapped' => false,
            'required' => false
            //'attr' => array('class' => 'custom-checkbox'),
            //'label_attr' =>array('class' => 'custom-control-label')
        ]);*/
        $builder->add('plainPassword', RepeatedType::class, array(
        'type' => PasswordType::class,
        'first_options'  => array('label' => 'Mot de passe'),
        'second_options' => array('label' => 'Répéter le mot de passe'),
    ));
        $builder->add('sexe',ChoiceType::class,
        array('choices' => array(
            'Homme' => '1',
            'Femme' => '2',
            ),
            'label_attr' => array('class'=>'checkbox-inline'),
            'choices_as_values' => true,
            'multiple'=>false,
            'expanded'=>true,
            'data' => '1'
        ));
        $builder->add('date_de_naissance', BirthdayType::class,array(
            'widget'=>'single_text',
            'attr'=>['class'=>'form-row'],
            'required' => true,
            'empty_data' => '01/01/1900'
        ));
        $builder->add('pays',TextType::class,array('label'=> 'Pays'));
        $builder->add('code_postal');
        $builder->add('region',TextType::class);
        $builder->add('website', TextType::class, array(
            'required' => true,
            'label'=> 'Site web'
        ));
        $builder->add('blog',TextType::class, array(
        'required' => true,
            'label' => 'Blog'
        ));
        $builder->add('image',FileType::class,[
            'label' => 'Image',

            // unmapped means that this field is not associated to any entity property
            'mapped' => false,

            // make it optional so you don't have to re-upload the PDF file
            // everytime you edit the Product details
            'required' => false,

            // unmapped fields can't define their validation using annotations
            // in the associated entity, so you can use the PHP constraint classes
            'constraints' => [
                new File([
                    'maxSize' => '1024k',
                    'mimeTypes' => [
                        'image/png',
                        'image/jpg',
                        'image/jpeg',
                    ],
                    'mimeTypesMessage' => 'Enregistrez une image valide',
                ])
            ],
        ]);


    }
    public function getParent()
    {
        return 'FOS\UserBundle\Form\Type\RegistrationFormType';
    }
    public function getBlockPrefix()
    {
        return 'app_user_registration';
    }
    public function getName()
    {
        return $this->getBlockPrefix();
    }
}
