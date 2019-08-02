<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Billet;

use AppBundle\Repository\BilletRepository;
use Doctrine\ORM\Query;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\Evenement;
use Symfony\Component\HttpFoundation\Response;
use Omines\DataTablesBundle\Adapter\ArrayAdapter;
use Omines\DataTablesBundle\Column\TextColumn;
use Omines\DataTablesBundle\Controller\DataTablesTrait;
use Omines\DataTablesBundle\Adapter\Doctrine\ORMAdapter;

class HomeController extends Controller
{
    use DataTablesTrait;
    /**
     * Page d'accueil liste d'évènements
     * @Route("/", name="viewList")
     * TODO:Implémentation Liste Evenement
     */
    public function showListEvent(Request $request)
    {

        if($lieu=$request->request->has('lieu'))
            $lieu=$request->request->get('lieu');
        if($titre=$request->request->has('titre'))
            $titre=$request->request->get('titre');
        if($date=$request->request->has('date'))
            $date=$request->request->get('date');
        $eventsList = $this->getDoctrine()
            ->getRepository(Evenement::class)
            ->search($titre,$lieu,$date);
        return $this->render('default/index.html.twig', array('dataSearch'=>$request->request,'events' => $eventsList,'lieu'=>$lieu,'nbEvents'=>count($eventsList)));
    }
    /**
     * Page affichage évènement
     * @Route("/event/{date}/{slugEvent}", name="viewSingle")
     * @ParamConverter("event", options={"mapping":{"slugEvent" = "titreEvenementSlug","date"="dateDebutEvenement"}})
     * TODO:Implémentation Vue Evenement
     */
    public function showSingleEvent(Evenement $event)
    {
        $path = $this->get('kernel')->getRootDir() . '/../web/js/seat-map.json';
        $file=file_get_contents($path);
        $event->setEtatSalle(serialize(json_encode($file)));
        $this->getDoctrine()->getRepository(Evenement::class)->initMapEvent($event);
        return $this->render('default/view-single-event.html.twig',array('event'=>$event));
    }
    /**
     * Page création map
     * @Route("/create-map", name="viewCreateMap")
     * TODO:Implémentation Création Map
     */
    public function vueCreateMap(){
        return $this->render('default/view-create-map.html.twig');
    }
    /**
     * Page Seatmap , reservation de place
     * @Route("/event/{date}/{slugEvent}/{idEvent}/map", name="viewBuyMap")
     * @ParamConverter("event", options={"mapping":{"slugEvent" = "titreEvenementSlug","date"="dateDebutEvenement","idEvent"="id"}})
     * TODO:Implémentation Vue Map
     */
    public function vueMap(Evenement $event){

        return $this->render('default/view-buy-map.html.twig',array('event'=>$event));
    }

    /**
     * Page Seatmap , reservation de place, liste de billets
     * @Route("/{date}/{slugEvent}/listTicket", name="viewTicketList")
     * @ParamConverter("event", options={"mapping":{"slugEvent" = "titreEvenementSlug","date"="dateDebutEvenement"}})
     * TODO:Implémentation Liste billet
     * @param Request $request
     * @param Evenement $event
     * @return Response
     */
    public function listeBillet(Request $request,Evenement $event){
        $repo = $this->getDoctrine()->getRepository(Billet::class);
        $queryDt=$repo->getDataForDatatables($event);
        $queryTicketsState=$repo->countPurchasedTickets($event);
        $datatable = $this->createDataTable()
            ->add('nombreBillets', TextColumn::class,['label'=>'Nombre total de billets'])
            ->add('libelle', TextColumn::class,['label'=>'Type'])
            ->add('reste_tickets',TextColumn::class,['label'=>'Billets restants'])
            ->createAdapter(ArrayAdapter::class,
               $queryDt
            )
            ->handleRequest($request);

        if ($datatable->isCallback()) {
            return $datatable->getResponse();
        }
        return $this->render('default/view-buy-list.html.twig',array('event'=>$event,'datatable'=>$datatable,'ticketState'=>$queryTicketsState));

    }
    /**
     * @Route("/testQrCode", name="qc")
     * TODO:Implémentation QR Code
     */
    public function testQRCode(){
        $options = array(
            'code'   => 'string to encode',
            'type'   => 'qrcode',
            'format' => 'png',
            'width'  => 10,
            'height' => 10,
            'color'  => array(0,0,0),
        );

        $barcode =
            $this->get('skies_barcode.generator')->generate($options);

        return new Response('<img src="data:image/png;base64,'.$barcode.'" />');
    }
}