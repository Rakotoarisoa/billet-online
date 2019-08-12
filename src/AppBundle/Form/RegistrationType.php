<?php


namespace AppBundle\Form;
use Symfony\Component\Form\Extension\Core\Type\BirthdayType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\File;

class RegistrationType extends  AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('nom',TextType::class);
        $builder->add('prenom',TextType::class);
        $builder->add('adresse',TextType::class);
        $builder->add('mobile_phone');
        $builder->add('phone');//secondary phone
        $builder->add('sexe',ChoiceType::class,
        array('choices' => array(
            'Homme' => '1',
            'Femme' => '2',
            ),
            'choices_as_values' => true,'multiple'=>false,'expanded'=>true));
        $builder->add('date_de_naissance', BirthdayType::class,array(
            'widget'=>'single_text',
            'attr'=>['class'=>'form-row'],
            'placeholder' => [
                'year' => 'Année', 'month' => 'Mois', 'day' => 'Jour',
            ]
        ));
        $builder->add('pays');
        $builder->add('code_postal');
        $builder->add('region',TextType::class);
        $builder->add('website', TextType::class, array(
            'required' => false
        ));
        $builder->add('blog',TextType::class, array(
        'required' => false
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