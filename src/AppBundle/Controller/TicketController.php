<?php


namespace AppBundle\Controller;

use AppBundle\Datatables\BilletDatatable;
use AppBundle\Entity\Billet;
use AppBundle\Entity\Place;
use AppBundle\Entity\TypeBillet;
use AppBundle\Form\RechercheBilletType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Omines\DataTablesBundle\Controller\DataTablesTrait;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\Evenement;
use AppBundle\Entity\User;
use AppBundle\Repository\EvenementRepository;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

class TicketController extends Controller
{
    use DataTablesTrait;

    /**
     * Formulaire de création d'évènements
     * @Route("/tickets/list", name="ticketList")
     * @param Request $request
     * @return null
     */
    public function getListBillets(Request $request)
    {
        return $this->render('Tickets/view-buy-list.html.twig', array());
    }

    /**
     * Displays a form to edit an existing billet entity.
     *
     * @Route("/{userId}/tickets/edit/{id}", name="billet_edit")
     * @ParamConverter("event", options={"mapping":{"userId" = "user.id","id"="id"}})
     * @Security("has_role('ROLE_USER')")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, Billet $billet)
    {
        $deleteForm = $this->createDeleteForm($billet);
        $editForm = $this->createForm('AppBundle\Form\BilletType', $billet);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();
            return $this->redirectToRoute('billet_show', array('id' => $billet->getId(), 'userId' => $this->getUser()->getId(), 'event' => $billet->getEvenement()->getId()));
        }

        return $this->render('event_admin/billet/edit.html.twig', array(
            'event' => $billet->getEvenement(),
            'billet' => $billet,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a billet entity.
     *
     * @Route("/{userId}/event/{event}/tickets/delete/{id}", name="billet_delete")
     * @ParamConverter("event", options={"mapping":{"userId" = "user.id","event"="id","id"="id"}})
     * @Method("DELETE")
     * @Security("has_role('ROLE_USER')")
     */
    public function deleteAction(Request $request, Billet $billet)
    {
        $form = $this->createDeleteForm($billet);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($billet);
            $em->flush();
        }

        return $this->redirectToRoute('billet_index', array('userId' => $this->getUser()->getId(), 'event' => $billet->getEvenement()->getId()));
    }

    /**
     * Finds and displays a billet entity.
     *
     * @Route("/{userId}/{event}/tickets/{id}", name="billet_show")
     * @ParamConverter("event", options={"mapping":{"userId" = "user.id","id"="id"}})
     * @Method("GET")
     * @Security("has_role('ROLE_USER')")
     */
    public function showAction(Billet $billet)
    {
        $deleteForm = $this->createDeleteForm($billet);

        return $this->render('event_admin/billet/show.html.twig', array(
            'event' => $billet->getEvenement(),
            'billet' => $billet,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Creates a new billet entity.
     *
     * @Route("/{userId}/event/{event}/billets/create", name="billet_new")
     * @ParamConverter("event", options={"mapping":{"userId" = "user.id","event"="id"}})
     * @Method({"GET", "POST"})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param Evenement $event
     * @return RedirectResponse|Response
     */
    public function newAction(Request $request, Evenement $event)
    {
        $billet = new Billet();
        $form = $this->createForm('AppBundle\Form\BilletType', $billet);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $billet->setEvenement($event);
            $em->persist($billet);
            $em->flush();
            return $this->redirectToRoute('billet_show', array('id' => $billet->getId(), 'event' => $event->getId(), 'userId' => $this->getUser()->getId()));
        }
        return $this->render('event_admin/billet/new.html.twig', array(
            'billet' => $billet,
            'event' => $event,
            'form' => $form->createView(),
        ));
    }

    /**
     * @Route("/{userId}/event/{event}/billets/list", name="billet_index")
     * @ParamConverter("event", options={"mapping":{"userId" = "user.id","event"="id"}})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param Evenement $event
     * @return null
     */
    public function getListBilletsByUser(Request $request, Evenement $event)
    {
        $repo = $this->getDoctrine()->getRepository(Billet::class);
        $billet=new Billet();
        $searchForm = $this->createForm(RechercheBilletType::class);
        $searchForm->handleRequest($request);
        $data=$searchForm->getData();
        $billets='';
        if($searchForm->isSubmitted() && $searchForm->isValid())
        {
            if($request->request->has('identifiant')){
                $billets = $repo->getListBilletByUser($event,$request);//Query Billets
            }
        }
        else{
            $billets = $repo->getListBilletByUser($event);//Query Billets
        }
        $paginator = $this->get('knp_paginator');
        $pagination = $paginator->paginate(
            $billets, /* query NOT result */
            $request->query->getInt('page', 1), /*page number*/
            5 /*limit per page*/
        );
        $queryTicketsState = $repo->countPurchasedTickets($event);
        return $this->render('event_admin/billet/view-billet-list.html.twig', array('event' => $event, 'ticketState' => $queryTicketsState, 'billets' => $pagination, 'searchForm' => $searchForm->createView()));
    }

    /**
     * Supprimer un billet par ID
     * @Route("/{eventId}/ticket/delete/", name="deleteTicket")
     * */
    public function deleteTicketsById(Request $request)
    {

    }

    /**
     * Supprimer des billets par ID
     * @Route("/{eventId}/tickets/delete/", name="deleteTicketType")
     * */
    public function deleteTicketsByType(Request $request)
    {

    }

    /**
     * Modifier des billets
     * @Route("/{eventId}/tickets/update/", name="updateTicket")
     * */
    public function updateTicketByType()
    {

    }

    /**
     * Générer des billets
     * @Route("/{userId}/{event}/tickets/generate/", name="generateTickets")
     * @ParamConverter("event", options={"mapping":{"userId" = "usernameCanonical","event"="titreEvenementSlug"}})
     * @param Request $request
     * @param Evenement $event
     */
    public function generate(Request $request,Evenement $event)
    {
        $repo = $this->getDoctrine()->getRepository(Billet::class);
        $queryTicketsState = $repo->countPurchasedTickets($event);
            $repo=$this->getDoctrine()->getRepository(Billet::class);
            if($request->request->has('type_billet') && $request->request->has('nombre') && $request->request->has('prix')){
                $nbr_b=(int)$request->request->get('nombre');
                $type_b=trim(ucfirst($request->request->get('type_billet')));
                $prix=(float)$request->request->get('prix');
                $repo->generateTickets($prix,$nbr_b,$type_b,$event);
                $this->addFlash('success','Billets Ajouté avec succès');
                return $this->redirectToRoute('billet_index',array('userId'=>$this->getUser()->getId(),'event'=>$event->getId()));
            }

        return $this->render('event_admin/billet/view-billet-generate.html.twig',array('event'=>$event,'ticketState'=>$queryTicketsState));
    }

    /**
     * Creates a form to delete a billet entity.
     *
     * @param Billet $billet The billet entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Billet $billet)
    {

        return $this->createFormBuilder()
            ->setAction($this->generateUrl('billet_delete', array('id' => $billet->getId(), 'userId' => $this->getUser()->getUserName(), 'event' => $billet->getEvenement()->getTitreEvenementSlug())))
            ->setMethod('DELETE')
            ->getForm();
    }
}