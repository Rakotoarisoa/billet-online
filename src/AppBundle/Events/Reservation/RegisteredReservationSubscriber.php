<?php


namespace AppBundle\Events\Reservation;
use AppBundle\Manager\LogManager;
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
    private $log;
    public function __construct(\Swift_Mailer $mailer,EngineInterface $engine, ContainerInterface $container,EventDispatcherInterface $eventDispatcher,LogManager $lm){
        $this->eventDispatcher=$eventDispatcher;
        $this->mailer= $mailer;
        $this->engine=$engine;
        $this->domOptions=new Options();
        $this->domPdf=new Dompdf();
        $this->log=$lm;
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
        try {
            $html = '';
            $logger = new \Swift_Plugins_Loggers_ArrayLogger();
            $this->domOptions->set('isRemoteEnabled', TRUE);
            $this->domOptions->set('isHtml5ParserEnabled', true);
            $this->domPdf->setOptions($this->domOptions);
            $this->domPdf->setPaper('A4', 'landscape');
            $html .= $this->engine->render('emails/attachments/attachment_email.html.twig', ['event' => $reservation->getReservation()->getEvenement(), 'reservation' => $reservation->getReservation(), 'qr' => $this->codeGen,'buyer_data'=>$reservation->getBuyerData()]);
            $html .= '';
            $this->domPdf->loadHtml($html);
            $this->domPdf->render();
            if($reservation->getOrderMethod() == 'send_email'){
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
                if (!$this->mailer->send($message, $errors)) {
                    $this->eventDispatcher->dispatch();
                };
                $this->session->remove('buyer_data');
                $this->session->remove('_resa_');
                $this->session->remove('pay_token');
                $this->cart->clear();
                $this->log->logAction('Réservation','Mail pour nouvelle Réservation n° '.$reservation->getReservation()->getRandomCodeCommande().' au nom de '.$reservation->getReservation()->getUserCheckout()->getNom().' '.$reservation->getReservation()->getUserCheckout()->getPrenom(),$reservation->getReservation()->getEvenement()->getUser());
            }
            else if($reservation->getOrderMethod() == 'print') {
                $this->domPdf->stream("Commmande-".$reservation->getReservation()->getRandomCodeCommande()."-".$reservation->getReservation()->getEvenement()->getRandomCodeEvent().".pdf",["Attachment" => true]);
                $this->session->remove('buyer_data');
                $this->cart->clear();
                $this->log->logAction('Réservation','Impression pour nouvelle Réservation n° '.$reservation->getReservation()->getRandomCodeCommande().' au nom de '.$reservation->getReservation()->getUserCheckout()->getNom().' '.$reservation->getReservation()->getUserCheckout()->getPrenom(),$reservation->getReservation()->getEvenement()->getUser());
            }

        }
        catch(\Exception $e){
            $this->log->logAction('Erreur', "Réservation n° ".$reservation->getReservation()->getRandomCodeCommande(),$reservation->getReservation()->getEvenement()->getUser());
            throw new \Exception('Une erreur s\'est produite pendant l\'envoi du mail: '.$e->getMessage());
        }

    }
}
