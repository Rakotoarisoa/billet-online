<?php


namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name = "reservation")
 */
class Reservation
{
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
     * @ORM\ManyToOne(targetEntity="Evenement", inversedBy="reservation")
     * @ORM\JoinColumn(name="id_reservation", referencedColumnName="id")
     */
    private $evenement;
    /**
     * @ORM\OneToMany(targetEntity="Billet", mappedBy="reservation")
     */
    private $billet;

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
     * @return mixed
     */
    public function getPlace()
    {
        return $this->place;
    }

    /**
     * @param mixed $place
     */
    public function setPlace($place)
    {
        $this->place = $place;
    }
    /**
     * Reservation constructor.
     */
    public function __construct()
    {
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
        $this->evenement = $evenement;
    }
}