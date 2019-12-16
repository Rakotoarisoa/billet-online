<?php


namespace AppBundle\Events\Reservation;
use AppBundle\Utils\Cart;
use Dompdf\Dompdf;
use Dompdf\Options;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Session\Attribute\NamespacedAttributeBag;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\NativeSessionStorage;

class RegisteredReservationSubscriber implements EventSubscriberInterface
{
    private $mailer;
    private $engine;
    private $codeGen;
    private $domPdf;
    private $domOptions;
    private $cart;
    private $session;
    private $container;
    private $eventDispatcher;
    public function __construct(\Swift_Mailer $mailer,EngineInterface $engine, ContainerInterface $container,EventDispatcherInterface $eventDispatcher){
        $this->eventDispatcher=$eventDispatcher;
        $this->mailer= $mailer;
        $this->engine=$engine;
        $this->domOptions=new Options();
        $this->domPdf=new Dompdf();
        $this->container=$container;
        $this->codeGen=$this->container->get('skies_barcode.generator');
        $storage = new NativeSessionStorage();
        $attributes = new NamespacedAttributeBag();
        $this->session = new Session($storage, $attributes);
        $this->cart = new Cart($this->session);
    }

    public static function getSubscribedEvents()
    {
        // TODO: Implement getSubscribedEvents() method.
        return [
            RegisteredReservationEvent::NAME => 'onReservationRegistered'
        ];
    }


    public function onReservationRegistered(RegisteredReservationEvent $reservation){
        $html = '';
        $logger = new \Swift_Plugins_Loggers_ArrayLogger();
        $this->domOptions->set('isRemoteEnabled', TRUE);
        $this->domOptions->set('isHtml5ParserEnabled', true);
        $this->domPdf->setOptions($this->domOptions);
        $this->domPdf->setPaper('A4', 'landscape');
        /*foreach ($reservation->getReservation()->getBillet() as $item) {
            $code_billet=$reservation->getReservation()->getRandomCodeCommande().'-'.$reservation->getReservation()->getEvenement()->getRandomCodeEvent().'-'.$item->getIdentifiant();
            $options = array(
                'code' => $code_billet,
                'type' => 'qrcode',
                'format' => 'png',
                'width' => 100,
                'height' => 100,
                'color' => array(0, 0, 0),
            );
            $barcode = $this->codeGen->generate($options);
            $qr_code = "data:image/png;base64,' . $barcode";

        }*/
        $html .= $this->engine->render('emails/attachments/attachment_email.html.twig', ['event' => $reservation->getReservation()->getEvenement(), 'reservation' => $reservation->getReservation(), 'qr' => $this->codeGen]);
        $html .= '';
        $this->domPdf->loadHtml($html);
        $this->domPdf->render();
        $attachment = new \Swift_Attachment($this->domPdf->output(), 'commande_' . $reservation->getReservation()->getRandomCodeCommande() . date('dmY') . '.pdf', 'application/pdf');
        $message = (new \Swift_Message('Votre commande'))
            ->setSubject('Ivenco Réservation - Votre commande n° ' . $reservation->getReservation()->getRandomCodeCommande() . ' du ' . date('d M Y'))
            ->setFrom('andry163.nexthope@gmail.com')
            ->setTo($reservation->getReservation()->getUserCheckout()->getEmail())
            ->setBody(
                $this->engine->render(// app/Resources/views/Emails/registration.html.twig
                    'emails/template_clients/template_email.html.twig', ['event' => $reservation->getReservation()->getEvenement(), 'reservation' => $reservation->getReservation()]
                ),
                'text/html'
            )
            ->attach($attachment);
        $this->mailer->registerPlugin(new \Swift_Plugins_LoggerPlugin($logger));
        if(!$this->mailer->send($message,$errors)){
            //$this->eventDispatcher->dispatch('mai')
        };
        $this->session->remove('buyer_data');
        $this->cart->clear();

    }
}