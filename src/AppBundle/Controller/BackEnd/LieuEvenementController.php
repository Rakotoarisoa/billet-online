<?php

namespace AppBundle\Controller\BackEnd;

use AppBundle\Entity\LieuEvenement;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

/**
 * Lieuevenement controller.
 *
 */
class LieuEvenementController extends Controller
{
    /**
     * Lists all lieuEvenement entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $lieuEvenements = $em->getRepository('AppBundle:LieuEvenement')->findAll();

        return $this->render('lieuevenement/index.html.twig', array(
            'lieuEvenements' => $lieuEvenements,
        ));
    }

    /**
     * Creates a new lieuEvenement entity.
     *
     */
    public function newAction(Request $request)
    {
        $lieuEvenement = new Lieuevenement();
        $form = $this->createForm('AppBundle\Form\LieuEvenementType', $lieuEvenement);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($lieuEvenement);
            $em->flush();

            return $this->redirectToRoute('place_event_show', array('id' => $lieuEvenement->getId()));
        }

        return $this->render('lieuevenement/new.html.twig', array(
            'lieuEvenement' => $lieuEvenement,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a lieuEvenement entity.
     *
     */
    public function showAction(LieuEvenement $lieuEvenement)
    {
        $deleteForm = $this->createDeleteForm($lieuEvenement);

        return $this->render('lieuevenement/show.html.twig', array(
            'lieuEvenement' => $lieuEvenement,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing lieuEvenement entity.
     *
     */
    public function editAction(Request $request, LieuEvenement $lieuEvenement)
    {
        $deleteForm = $this->createDeleteForm($lieuEvenement);
        $editForm = $this->createForm('AppBundle\Form\LieuEvenementType', $lieuEvenement);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('place_event_edit', array('id' => $lieuEvenement->getId()));
        }

        return $this->render('lieuevenement/edit.html.twig', array(
            'lieuEvenement' => $lieuEvenement,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a lieuEvenement entity.
     *
     */
    public function deleteAction(Request $request, LieuEvenement $lieuEvenement)
    {
        $form = $this->createDeleteForm($lieuEvenement);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($lieuEvenement);
            $em->flush();
        }

        return $this->redirectToRoute('place_event_index');
    }

    /**
     * Creates a form to delete a lieuEvenement entity.
     *
     * @param LieuEvenement $lieuEvenement The lieuEvenement entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(LieuEvenement $lieuEvenement)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('place_event_delete', array('id' => $lieuEvenement->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}
