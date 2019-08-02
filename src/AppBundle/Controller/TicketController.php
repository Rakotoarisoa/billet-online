<?php


namespace AppBundle\Controller;
use AppBundle\Datatables\BilletDatatable;
use AppBundle\Entity\Place;
use AppBundle\Entity\TypeBillet;
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

class TicketController extends Controller
{
    /**
     * Formulaire de création d'évènements
     * @Route("/tickets/list", name="ticketList")
     * @param Request $request
     * @return null
     */
    public function getListBillets(Request $request){


        return $this->render('Tickets/view-buy-list.html.twig',array());
    }

    /**
     * Supprimer un billet par ID
     * @Route("/{eventId}/ticket/delete/", name="deleteTicket")
     * */
    public function deleteTicketsById(Request $request){

    }
    /**
     * Supprimer des billets par ID
     * @Route("/{eventId}/tickets/delete/", name="deleteTicketType")
     * */
    public function deleteTicketsByType(Request $request){

    }
    /**
     * Modifier des billets
     * @Route("/{enventId}/tickets/update/", name="updateTicket")
     * */
    public function updateTicketByType(){

    }

    /**
     * Générer des billets
     * @Route("/{enventId}/tickets/generate/", name="generateTickets")
     * @param Request $request
     * @param TypeBillet $type_billet
     * @param $nbr
     */
    public function generate(Request $request,TypeBillet $type_billet,$nbr){

    }
}