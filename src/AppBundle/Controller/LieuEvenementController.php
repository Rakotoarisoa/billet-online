<?php


namespace AppBundle\Controller;


use AppBundle\Entity\CategorieEvenement;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\Evenement;
use Symfony\Component\HttpFoundation\Response;
use AppBundle\Entity\LieuEvenement;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

class LieuEvenementController extends Controller
{

    /**
     * Displays a form to edit an existing categorie entity.
     *
     * @Route("/{userId}/{event}/lieu_event/edit/{id}", name="place_event_edit")
     * @ParamConverter("event", options={"mapping":{"userId" = "username","event"="titreEvenementSlug","id"="id"}})
     * @Security("has_role('ROLE_USER')")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, CategorieEvenement $lieu)
    {
        $deleteForm = $this->createDeleteForm($lieu);
        $editForm = $this->createForm('AppBundle\Form\CategorieEvenementType', $lieu);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('cat_show', array('id' => $lieu->getId(), 'userId' => $this->getUser()->getUserName(), 'event' => $lieu->getEvenement()->getTitreEvenementSlug()));
        }

        return $this->render('event_admin/categorieevenement/edit.html.twig', array(
            'event' => $lieu->getEvenement(),
            'categorie' => $lieu,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a categorie entity.
     *
     * @Route("/{userId}/{event}/lieu_event/delete/{id}", name="place_event_delete")
     * @ParamConverter("event", options={"mapping":{"userId" = "username","event"="titreEvenementSlug","id"="id"}})
     * @Method("DELETE")
     * @Security("has_role('ROLE_USER')")
     */
    public function deleteAction(Request $request, CategorieEvenement $lieu)
    {
        $form = $this->createDeleteForm($lieu);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($lieu);
            $em->flush();
        }

        return $this->redirectToRoute('cat_index', array('userId' => $this->getUser()->getUserName(), 'event' => $lieu->getEvenement()->getTitreEvenementSlug()));
    }

    /**
     * Finds and displays a categorie entity.
     *
     * @Route("/{userId}/{event}/lieu_event/{id}", name="place_event_show")
     * @ParamConverter("event", options={"mapping":{"userId" = "username","event"="titreEvenementSlug","id"="id"}})
     * @Method("GET")
     * @Security("has_role('ROLE_USER')")
     */
    public function showAction(LieuEvenement $lieu)
    {
        $deleteForm = $this->createDeleteForm($lieu);

        return $this->render('event_admin/categorieevenement/show.html.twig', array(
            'event' => $lieu->getEvenement(),
            'categorie' => $lieu,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Creates a new categorie entity.
     *
     * @Route("/{userId}/{event}/lieu_event/create", name="place_event_new")
     * @ParamConverter("event", options={"mapping":{"userId" = "username","event"="titreEvenementSlug"}})
     * @Method({"GET", "POST"})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param Evenement $event
     * @return RedirectResponse|Response
     */
    public function newAction(Request $request, Evenement $event)
    {
        $lieu = new CategorieEvenement();
        $form = $this->createForm('AppBundle\Form\CategorieEvenementType', $lieu);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $lieu->setEvenement($event);
            $em->persist($lieu);
            $em->flush();
            return $this->redirectToRoute('cat_show', array('id' => $lieu->getId(), 'event' => $event->getTitreEvenementSlug(), 'userId' => $this->getUser()->getUserName()));
        }
        return $this->render('event_admin/categorieevenement/new.html.twig', array(
            'categorie' => $lieu,
            'event' => $event,
            'form' => $form->createView(),
        ));
    }

    /**
     * Creates a form to delete a categorie entity.
     *
     * @param categorie $lieu The categorie entity
     *
     * @return
     */
    private function createDeleteForm(LieuEvenement $lieu)
    {

        return $this->createFormBuilder()
            ->setAction($this->generateUrl('cat_delete', array('id' => $lieu->getId(), 'userId' => $this->getUser()->getUserName())))
            ->setMethod('DELETE')
            ->getForm();
    }
}