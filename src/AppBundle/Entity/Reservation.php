<?php


namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use AppBundle\Entity\Traits\TimeStampTrait;
use Doctrine\ORM\Mapping\UniqueConstraint;
use JMS\Serializer\Annotation as Serializer;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ReservationRepository")
 * @ORM\Table(name = "reservation",uniqueConstraints={@UniqueConstraint(name="unique_reservation", columns={"random_code_commande", "id_reservation"})})
 *
 */
class Reservation
{
    use TimeStampTrait;
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100)
     */
    private $nomReservation;
    /**
     * @ORM\Column(type="string",length=5)
     */
    private $randomCodeCommande;

    /**
     * @return mixed
     */
    public function getRandomCodeCommande()
    {
        return $this->randomCodeCommande;
    }
    /**
     * @ORM\Column(type="datetime")
     */
    private $dateReservation;
    /**
     * @ORM\Column(type="string", length=100)
     */
    private $mode_paiement;
    /**
     * @ORM\Column(type="decimal", scale=2)
     */
    private $montant_total;
    /**
     * @ORM\ManyToOne(targetEntity="Evenement", inversedBy="reservation",cascade={"persist"})
     * @ORM\JoinColumn(name="id_reservation", referencedColumnName="id")
     * @Serializer\Exclude
     */
    private $evenement;
    /**
     * @ORM\OneToMany(targetEntity="Billet", mappedBy="reservation")
     * @Serializer\Exclude
     */
    private $billet;
    /**
     * * @ORM\ManyToOne(targetEntity="UserCheckout", inversedBy="reservations",cascade={"persist"})
     * * @ORM\JoinColumn(name="user_checkout_id", referencedColumnName="id",nullable=false)
     */
    private $user_checkout;

    /**
     * @return mixed
     */
    public function getUserCheckout()
    {
        return $this->user_checkout;
    }

    /**
     * @param mixed $user_checkout
     */
    public function setUserCheckout($user_checkout): void
    {
        $this->user_checkout = $user_checkout;
    }

    /**
     * @return mixed
     */
    public function getBillet()
    {
        return $this->billet;
    }

    /**
     * @param mixed $billet
     */
    public function setBillet($billet): void
    {
        $this->billet = $billet;
    }

    /**
     * Reservation constructor.
     */
    public function __construct()
    {
        $this->randomCodeCommande=substr(str_shuffle("0123456789"), 0, 5);
        $this->dateReservation = new \Datetime();
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getNomReservation()
    {
        return $this->nomReservation;
    }

    /**
     * @param mixed $nomReservation
     */
    public function setNomReservation($nomReservation)
    {
        if(!is_string($nomReservation) || strlen($nomReservation) == 0 )
        {
            throw new \InvalidArgumentException('Nom de Réservation invalide');
        }
        $this->nomReservation = $nomReservation;
    }

    /**
     * @return mixed
     */
    public function getDateReservation()
    {
        return $this->dateReservation;
    }

    /**
     * @param mixed $dateReservation
     */
    public function setDateReservation($dateReservation)
    {
        $this->dateReservation = $dateReservation;
    }

    /**
     * @return mixed
     */
    public function getModePaiement()
    {
        return $this->mode_paiement;
    }

    /**
     * @param mixed $mode_paiement
     */
    public function setModePaiement($mode_paiement)
    {
        if(!is_string($mode_paiement) || strlen($mode_paiement) == 0 )
        {
            throw new \InvalidArgumentException('Nom de Réservation invalide');
        }
        $this->mode_paiement = $mode_paiement;
    }

    /**
     * @return mixed
     */
    public function getMontantTotal()
    {
        return $this->montant_total;
    }

    /**
     * @param mixed $montant_total
     */
    public function setMontantTotal($montant_total)
    {
        if(!settype($montant_total,"float") )
        {
            throw new \InvalidArgumentException('Nom de Réservation invalide');
        }
        $this->montant_total = $montant_total;
    }

    /**
     * @return mixed
     */
    public function getEvenement()
    {
        return $this->evenement;
    }

    /**
     * @param mixed $evenement
     */
    public function setEvenement($evenement)
    {
        if(!$evenement instanceof Evenement)
        {
            throw new InvalidArgumentException('L\'objet n\'est pas du type Evenement' );
        }
        $this->evenement = $evenement;
    }

}