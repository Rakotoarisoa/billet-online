<?php

namespace AppBundle\Form;

use AppBundle\Entity\EventOptions;
use AppBundle\Entity\TypeBillet;
use AppBundle\Entity\UserOptions;
use FOS\CKEditorBundle\Form\Type\CKEditorType;
use Sonata\Form\Type\BooleanType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class UserOptionsType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('isEventManager',CheckboxType::class,[
                'label' => 'Devenir créateur d\'évènements',
                'required' => false
            ])
            ->add('usePaypal', CheckboxType::class, [
                'required'=>false,
                'label' => 'Utiliser Paypal comme mode paiement',
            ])
            ->add('useOrangeMoney', CheckboxType::class, [
                'required'=>false,
                'label' => 'Utiliser Orange money comme mode paiement',
            ])
            ->add('paypalAccount', PasswordType::class)
            ->add('orangeMoneyConsumerId', PasswordType::class)
            ->add('orangeMoneyMerchantKey', PasswordType::class);
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => UserOptions::class
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'appbundle_user_options';
    }


}
