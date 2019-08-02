<?php


namespace AppBundle\Controller;
use AppBundle\Form\EventType;
use Doctrine\ORM\EntityManager;
use FOS\UserBundle\Event\FilterUserResponseEvent;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\FOSUserEvents;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\Evenement;
use AppBundle\Entity\User;
use AppBundle\Repository\EvenementRepository;
use Symfony\Component\HttpFoundation\Response;

class EventController extends Controller
{
    private $em;
    public function __construct(EntityManager $em = null)
    {

    }

    /**
     * Formulaire de création d'évènements
     * @Route("/{userId}/events/create", name="createEvent")
     * @ParamConverter("user",options={"mapping":{"userId" = "username"}})
     * @param Request $request
     * @param User $user
     * @return Response
     * @throws \Doctrine\ORM\ORMException
     */
    public function createFormEvent(Request $request, User $user){
        if(!$this->isGranted('IS_AUTHENTICATED_REMEMBERED') || !$this->isGranted('IS_AUTHENTICATED_FULLY')){
            $this->redirect('/login?src=create');
        };
        $event = new Evenement();
        $form = $this->createForm(EventType::class, $event);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            if ($form->isValid()) {
                /** @var UploadedFile $imageFile */
                $imageFile = $form['image']->getData();

                // this condition is needed because the 'brochure' field is not required
                // so the PDF file must be processed only when a file is uploaded
                if ($imageFile) {
                    $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                    // this is needed to safely include the file name as part of the URL
                    $safeFilename = transliterator_transliterate('Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()', $originalFilename);
                    $newFilename = $safeFilename . '-' . uniqid() . '.' . $imageFile->guessExtension();

                    // Move the file to the directory where brochures are stored
                    try {
                        $imageFile->move(
                            $this->getParameter('image_events'),
                            $newFilename
                        );
                        $user->setImage($newFilename);
                        $this->em->persist($user);
                    } catch (FileException $e) {
                        // ... handle exception if something happens during file upload
                    }

                }

                if (null !== $response = $event->getResponse()) {
                    return $response;
                }

            }
        }
        return $this->render('event_admin/event/event-register.html.twig',array('form'=> $form->createView(), 'user'=>$user,'event'=>$event));
    }

    /**
     * Gestion des évènements de l'utilisateur
     * @Route("/{userId}/events/list", name="viewListUser")
     * @ParamConverter("user",options={"mapping":{"userId" = "username"}})
     * @param Request $request
     * @param User $user
     * @return Response
     */
    public function getListEventByUser(Request $request, User $user)
    {
        if($lieu=$request->request->has('lieu'))
            $lieu=$request->request->get('lieu');
        if($titre=$request->request->has('titre'))
            $titre=$request->request->get('titre');
        if($date=$request->request->has('date'))
            $date=$request->request->get('date');
        $eventsList = $this->getDoctrine()
            ->getRepository(Evenement::class)
            ->getEventsByUser($user,$titre,$lieu,$date);
        return $this->render('event_admin/event/view-event-user.html.twig', array('events' => $eventsList,'lieu'=>$lieu,'nbEvents'=>count($eventsList)));
    }

    /**
     * Supprimer un évènement
     * @Route("/{user]/events/delete/{id}", name="viewList")
     * */
    public function deleteEventById(){

    }
    /**
     * Modifier un évènement
     * @Route("/{user]/events/update/{id}", name="viewList")
     * */
    public function updateEventById(){

    }
}