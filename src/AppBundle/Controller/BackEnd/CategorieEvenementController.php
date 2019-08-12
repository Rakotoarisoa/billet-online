<?php

namespace AppBundle\Controller\BackEnd;

use AppBundle\Entity\CategorieEvenement;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

/**
 * Categorieevenement controller.
 *
 */
class CategorieEvenementController extends Controller
{
    /**
     * Lists all categorieEvenement entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $categorieEvenements = $em->getRepository('AppBundle:CategorieEvenement')->findAll();

        return $this->render('categorieevenement/index.html.twig', array(
            'categorieEvenements' => $categorieEvenements,
        ));
    }

    /**
     * Creates a new categorieEvenement entity.
     *
     */
    public function newAction(Request $request)
    {
        $categorieEvenement = new Categorieevenement();
        $form = $this->createForm('AppBundle\Form\CategorieEvenementType', $categorieEvenement);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($categorieEvenement);
            $em->flush();

            return $this->redirectToRoute('cat_event_show', array('id' => $categorieEvenement->getId()));
        }

        return $this->render('categorieevenement/new.html.twig', array(
            'categorieEvenement' => $categorieEvenement,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a categorieEvenement entity.
     *
     */
    public function showAction(CategorieEvenement $categorieEvenement)
    {
        $deleteForm = $this->createDeleteForm($categorieEvenement);

        return $this->render('categorieevenement/show.html.twig', array(
            'categorieEvenement' => $categorieEvenement,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing categorieEvenement entity.
     *
     */
    public function editAction(Request $request, CategorieEvenement $categorieEvenement)
    {
        $deleteForm = $this->createDeleteForm($categorieEvenement);
        $editForm = $this->createForm('AppBundle\Form\CategorieEvenementType', $categorieEvenement);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('cat_event_edit', array('id' => $categorieEvenement->getId()));
        }

        return $this->render('categorieevenement/edit.html.twig', array(
            'categorieEvenement' => $categorieEvenement,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a categorieEvenement entity.
     *
     */
    public function deleteAction(Request $request, CategorieEvenement $categorieEvenement)
    {
        $form = $this->createDeleteForm($categorieEvenement);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($categorieEvenement);
            $em->flush();
        }

        return $this->redirectToRoute('cat_event_index');
    }

    /**
     * Creates a form to delete a categorieEvenement entity.
     *
     * @param CategorieEvenement $categorieEvenement The categorieEvenement entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(CategorieEvenement $categorieEvenement)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('cat_event_delete', array('id' => $categorieEvenement->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}
