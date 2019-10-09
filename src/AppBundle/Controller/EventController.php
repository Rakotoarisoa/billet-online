<?php


namespace AppBundle\Controller;
use AppBundle\FileLoader\ImageEventUploader;
use AppBundle\Utils\Slugger;
use Doctrine\ORM\EntityManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\Evenement;
use AppBundle\Entity\User;
use Symfony\Component\HttpFoundation\Response;

class EventController extends Controller
{
    private $em;

    public function __construct(EntityManager $em = null)
    {
        $this->em = $em;
    }

    /**
     * @Route("/events/list", name="event_shows")
     */
    public function showAction()
    {
        $eventsList = $this->getDoctrine()
            ->getRepository(Evenement::class)
            ->findAll();
        $data = $this->get('jms_serializer')->serialize($eventsList, 'json');

        $response = new Response($data);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    /**
     * Formulaire de création d'évènements
     * @Route("/{userId}/events/create", name="createEvent")
     * @ParamConverter("user",options={"mapping":{"userId" = "id"}})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param User $user
     * @return Response
     * @throws \Doctrine\ORM\ORMException
     */
    public function createFormEvent(Request $request, User $user)
    {
        if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED') || !$this->isGranted('IS_AUTHENTICATED_FULLY')) {
            $this->redirect('/login?src=create');
        };
        $event = new Evenement();
        $flow = $this->get('app.form.flow.create_event'); // must match the flow's service id
        $flow->bind($event);
        $form = $flow->createForm();
        if ($flow->isValid($form)) {
            $flow->saveCurrentStepData($form);
            if ($flow->nextStep()) {
                // form for the next step
                $form = $flow->createForm();
            } else {
                try {
                    // flow finished
                    $em = $this->getDoctrine()->getManager();
                    if( null != $event->getImageEvent())
                    {
                        $uploaded_image=new ImageEventUploader($event->getImageEvent(),$this->container);
                        $event->setImageEvent($uploaded_image->upload());
                    }
                    $event->setUser($user);
                    $slugger = new Slugger();
                    $event->setTitreEvenementSlug($slugger->slugify($event->getTitreEvenement()));
                    $em->persist($event);
                    $em->flush();
                    $flow->reset(); // remove step data from the session
                    $this->addFlash('success', 'Evènement enregistré avec succès.');
                    return $this->redirectToRoute('viewEventAdmin', array('user' => $user->getId(), 'id' => (string)$event->getId(), 'event' => $event));// redirect when done
                } catch (\Exception $e)
                    {
                        $this->addFlash('error','Une erreur s\'est produite : '+$e->getMessage());
                    }
            }
        }
        return $this->render('event_admin/event/event-register.html.twig', array('form' => $form->createView(), 'flow' => $flow, 'user' => $user, 'event' => $event));
    }

    /**
     * Gestion des évènements de l'utilisateur
     * @Route("/{userId}/events/list", name="viewListUser")
     * @ParamConverter("user",options={"mapping":{"userId" = "id"}})
     * @param Request $request
     * @param User $user
     * @return Response
     */
    public function getListEventByUser(Request $request, User $user)
    {
        if ($lieu = $request->request->has('lieu'))
            $lieu = $request->request->get('lieu');
        if ($titre = $request->request->has('titre'))
            $titre = $request->request->get('titre');
        if ($date = $request->request->has('date'))
            $date = $request->request->get('date');
        $eventsList = $this->getDoctrine()
            ->getRepository(Evenement::class)
            ->getEventsByUser($user, $titre, $lieu, $date);
        return $this->render('event_admin/event/view-event-user.html.twig', array('events' => $eventsList, 'lieu' => $lieu, 'nbEvents' => count($eventsList)));
    }

    /**
     * @Route("/{userId}/event/create-map/{slugEvent}/{id}", name="viewCreateMap")
     * @ParamConverter("event",options={"mapping":{"id" = "id","slugEvent":"titreEvenementSlug"}})
     * @param Evenement $event
     * @return Response
     */
    public function createMap(Evenement $event)
    {
        return $this->render('event_admin/event/view-create-map.html.twig', array('event' => $event));
    }

    /**
     * Supprimer un évènement
     * @Route("/{user}/events/delete/{id}", name="viewEventDelete")
     * */
    public function deleteEventById(Request $request, Evenement $event)
    {
        $deleteForm = $this->createDeleteForm($event);
        $this->addFlash('success', 'Vous avez supprimé l\'évènement ' . $event->getTitreEvenement() . " de manière définitive.");
        $deleteForm->handleRequest($request);

        if ($deleteForm->isSubmitted() && $deleteForm->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($event);
            $em->flush();
        }

        return $this->redirectToRoute('viewListUser', array(
            'user' => $event->getUser()
        ));
    }

    /**
     * Creates a form to delete a categorie entity.
     *
     * @param categorie $categorie The categorie entity
     *
     * @return
     */
    private function createDeleteForm(Evenement $event)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('viewEventDelete', array('id' => $event->getId(), 'user' => $this->getUser()->getUserName())))
            ->setMethod('DELETE')
            ->getForm();
    }

    /**
     * Modifier un évènement
     * @Route("/{user}/event/manage/{id}", name="viewEventUpdate")
     * */
    public function updateEvent(Request $request, Evenement $event)
    {
        $event = $this->getDoctrine()->getRepository(Evenement::class)->find($event->getId());
        $deleteForm = $this->createDeleteForm($event);
        $editForm = $this->createForm('AppBundle\Form\EventType', $event);
        $editForm->handleRequest($request);
        $slug = new Slugger();
        if ($editForm->isSubmitted() && $editForm->isValid()) {
            if ($editForm->get('save_create_map')->isClicked()) {
                try {
                    $event->setTitreEvenementSlug($slug->slugify($event->getTitreEvenement()));
                    if (!$event->getImageEvent()) {
                        $event->setImageEvent('/web/img/events/e2.jpg');
                    }
                    $this->getDoctrine()->getManager()->persist($event);
                    $this->getDoctrine()->getManager()->flush();
                    $this->addFlash('success', 'Evènement ' . $event->getTitreEvenement() . ' créé avec succès, créez ou visualisez le plan de salle');
                    return $this->redirectToRoute('viewCreateMap', array('id' => $event->getId(), 'userId' => $this->getUser()->getUsername(), 'slugEvent' => $event->getTitreEvenementSlug()));
                } catch (\ErrorException $e) {
                    $this->addFlash('error', 'Erreur pendant l\'enregistrement');
                }
            } else if ($editForm->get('save_create_billet')->isClicked()) {
                try {
                    $event->setTitreEvenementSlug($slug->slugify($event->getTitreEvenement()));
                    if (!$event->getImageEvent()) {
                        $event->setImageEvent('/web/img/events/e2.jpg');
                    }
                    $this->getDoctrine()->getManager()->persist($event);

                    $this->getDoctrine()->getManager()->flush();
                    $this->addFlash('success', 'Evènement ' . $event->getTitreEvenement() . ' créé avec succès, créez ou visualisez vos billets ici');
                    return $this->redirectToRoute('billet_index', array('event' => $event->getId(), 'userId' => $this->getUser()->getId()));
                } catch (\ErrorException $e) {
                    $this->addFlash('error', 'Erreur pendant l\'enregistrement');
                }
            } else {
                $entityManager = $this->getDoctrine()->getManager();
                $event->setImageEvent('/web/img/events/e2.jpg');
                $event->setIsPublished(1);
                $event->setTitreEvenementSlug($slug->slugify($event->getTitreEvenement()));
                $entityManager->persist($event);
                $entityManager->flush();
                $this->addFlash('success', 'Evènement ' . $event->getTitreEvenement() . ' crée avec suuccès');
                return $this->redirectToRoute('viewEventAdmin', array('user' => $this->getUser()->getUserName(), 'id' => $event->getId(), 'event' => $event));
            }

        }
        return $this->render('event_admin/event/event-update.html.twig', array(
            'event' => $event,
            'form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));


    }

    /**
     * Creates a view for event.
     *
     * @param Evenement $event The event entity
     *
     * @return Response
     */
    /**
     * Modifier un évènement
     * @Route("/{user}/event/view/{id}", name="viewEventAdmin")
     * */
    public function viewEventUser(Evenement $event)
    {
        return $this->render('event_admin/event/event-view.html.twig', array('event' => $event));
    }

    /**
     * Modifier un évènement
     * @Route("/{userId}/event/view/{id}/map", name="viewEventMapAdmin")
     * */
    public function viewStateUserMap(Evenement $event)
    {
        return $this->render('event_admin/event/view-map-admin.html.twig', array('event' => $event));
    }

}