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
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

class CategorieController extends Controller
{

    /**
     * @Route("/{userId}/{event}/categorie/list", name="cat_index")
     * @ParamConverter("event", options={"mapping":{"userId" = "username","event"="titreEvenementSlug"}})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param Evenement $event
     * @return null
     */
    public function getListBilletsByUser(Request $request, Evenement $event)
    {
        $categorie = $this->getDoctrine()->getRepository(CategorieEvenement::class)->findAll();


        //$categorie = $repo->getListBilletByUser($event);//Query Billets
        $paginator = $this->get('knp_paginator');
        $pagination = $paginator->paginate(
            $categorie, /* query NOT result */
            $request->query->getInt('page', 1), /*page number*/
            5 /* limit per page */
        );

        return $this->render('event_admin/categorieevenement/index.html.twig', array('event' => $event, 'categories' => $pagination));
    }
    /**
     * Displays a form to edit an existing categorie entity.
     *
     * @Route("/{userId}/{event}/categorie/edit/{id}", name="cat_edit")
     * @ParamConverter("event", options={"mapping":{"userId" = "username","event"="titreEvenementSlug","id"="id"}})
     * @Security("has_role('ROLE_USER')")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, CategorieEvenement $categorie)
    {
        $deleteForm = $this->createDeleteForm($categorie);
        $editForm = $this->createForm('AppBundle\Form\CategorieEvenementType', $categorie);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('cat_show', array('id' => $categorie->getId(), 'userId' => $this->getUser()->getUserName(), 'event' => $categorie->getEvenement()->getTitreEvenementSlug()));
        }

        return $this->render('event_admin/categorieevenement/edit.html.twig', array(
            'event' => $categorie->getEvenement(),
            'categorie' => $categorie,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a categorie entity.
     *
     * @Route("/{userId}/{event}/categorie/delete/{id}", name="cat_delete")
     * @ParamConverter("event", options={"mapping":{"userId" = "username","event"="titreEvenementSlug","id"="id"}})
     * @Method("DELETE")
     * @Security("has_role('ROLE_USER')")
     */
    public function deleteAction(Request $request, CategorieEvenement $categorie)
    {
        $form = $this->createDeleteForm($categorie);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($categorie);
            $em->flush();
        }

        return $this->redirectToRoute('cat_index', array('userId' => $this->getUser()->getUserName(), 'event' => $categorie->getEvenement()->getTitreEvenementSlug()));
    }

    /**
     * Finds and displays a categorie entity.
     *
     * @Route("/{userId}/{event}/categorie/{id}", name="cat_show")
     * @ParamConverter("event", options={"mapping":{"userId" = "username","event"="titreEvenementSlug","id"="id"}})
     * @Method("GET")
     * @Security("has_role('ROLE_USER')")
     * @param CategorieEvenement $categorie
     * @param Evenement $event
     * @return Response
     */
    public function showAction(CategorieEvenement $categorie)
    {
        $deleteForm = $this->createDeleteForm($categorie);

        return $this->render('event_admin/categorieevenement/show.html.twig', array(
            'event' => $categorie->getEvenement(),
            'categorie' => $categorie,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     *.
     *
     * @Route("/{userId}/{event}/categorie/create", name="cat_new")
     * @ParamConverter("event", options={"mapping":{"userId" = "username","event"="titreEvenementSlug"}})
     * @Method({"GET", "POST"})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param Evenement $event
     * @return RedirectResponse|Response
     */
    public function newAction(Request $request, CategorieEvenement $event)
    {
        $categorie = new CategorieEvenement();
        $form = $this->createForm('AppBundle\Form\CategorieEvenementType', $categorie);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $categorie->setEvenement($event);
            $em->persist($categorie);
            $em->flush();
            return $this->redirectToRoute('cat_show', array('id' => $categorie->getId(), 'event' => $event->getTitreEvenementSlug(), 'userId' => $this->getUser()->getUserName()));
        }
        return $this->render('event_admin/categorieevenement/new.html.twig', array(
            'categorie' => $categorie,
            'event' => $event,
            'form' => $form->createView(),
        ));
    }


    /**
     * Creates a form to delete a categorie entity.
     *
     * @param categorie $categorie The categorie entity
     *
     * @return
     */
    private function createDeleteForm(CategorieEvenement $categorie)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('cat_delete', array('id' => $categorie->getId(), 'userId' => $this->getUser()->getUserName())))
            ->setMethod('DELETE')
            ->getForm();
    }
}
