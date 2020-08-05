<?php

namespace AppBundle\Form;
use Craue\FormFlowBundle\Form\FormFlow;

class CreateEventFormFlow extends FormFlow {
    protected $allowDynamicStepNavigation = true;

    protected function loadStepsConfig() {
        return [
            [
                'label' => 'Information de base',
                'form_type' => EventType::class,
                'form_options' => [
                    'validation_groups' => ['Default'],
                ],
            ],
            [
                'label' => 'Information visuelle',
                'form_type' => EventType::class,
                'form_options' => [
                    'validation_groups' => ['Default'],
                ],
                /*'skip' => function($estimatedCurrentStepNumber, FormFlowInterface $flow) {
                    return $estimatedCurrentStepNumber > 1;
                },*/
            ],
            [
                'label' => 'Plan de Salle',
                'form_type' => EventType::class,
                'form_options' => [
                    'validation_groups' => ['Default'],
                ],
                /*'skip' => function($estimatedCurrentStepNumber, FormFlowInterface $flow) {
                    return $estimatedCurrentStepNumber > 2 ;
                },*/
            ],
            [
                'label' => 'Configuration et méthode de paiement',
                'form_type' => EventType::class,
                'form_options' => [
                    'validation_groups' => ['Default'],
                ],
                /*'skip' => function($estimatedCurrentStepNumber, FormFlowInterface $flow) {
                    return $estimatedCurrentStepNumber > 2 ;
                },*/
            ],
            /*[
                'label' => 'Billets',
                'form_type' => BilletType::class,
                'form_options' => [
                    'validation_groups' => ['Default'],
                ],
            ],*/
            [
                'label' => 'Confirmation',
            ],
        ];
    }

}
