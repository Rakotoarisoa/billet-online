<?php

namespace AppBundle\Form;
use Craue\FormFlowBundle\Form\FormFlow;
use Craue\FormFlowBundle\Form\FormFlowInterface;

class CreateEventFormFlow extends FormFlow {
    protected $allowDynamicStepNavigation = true;


    protected function loadStepsConfig() {
        return [
            [
                'label' => 'Information de base',
                'form_type' => EventType::class,
            ],
            [
                'label' => 'Information',
                'form_type' => EventType::class,
                /*'skip' => function($estimatedCurrentStepNumber, FormFlowInterface $flow) {
                    return $estimatedCurrentStepNumber > 1;
                },*/
            ],
            [
                'label' => 'Plan de Salle',
                'form_type' => EventType::class,
                /*'skip' => function($estimatedCurrentStepNumber, FormFlowInterface $flow) {
                    return $estimatedCurrentStepNumber > 2 ;
                },*/
            ],
            [
                'label' => 'Confirmation',
            ],
        ];
    }

}