<?php


namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;
/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\BilletRepository")
 * @ORM\Table(name = "billet")
 * @Serializer\ExclusionPolicy("none")
 *
 */
class Billet
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100,unique=true)
     */
    private $identifiant;
    /**
     * @ORM\ManyToOne(targetEntity="TypeBillet", inversedBy="billets")
     * @ORM\JoinColumn(name="id_billet", referencedColumnName="id")
     * @Serializer\Exclude
     */
    private $typeBillet;
    /**
     * @ORM\ManyToOne(targetEntity="Reservation",inversedBy="billet")
     * @ORM\JoinColumn(name="id_reservation", referencedColumnName="id")
     * @Serializer\Exclude
     */
    private $reservation;
    /**
     * @ORM\Column(type="string", length=10)
     */
    private $place_id;
    /**
     * @ORM\Column(type="boolean")
     *
     */
    private $estVendu;
    /**
     * @return mixed
     */
    public function getEstVendu()
    {
        return $this->estVendu;
    }

    /**
     * @param mixed $estVendu
     */
    public function setEstVendu($estVendu): void
    {
        $this->estVendu = $estVendu;
    }

    /**
     * @return mixed
     */
    public function getPlaceId()
    {
        return $this->place_id;
    }

    /**
     * @param mixed $place_id
     */
    public function setPlaceId($place_id): void
    {
        $this->place_id = $place_id;
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
    public function getIdentifiant()
    {
        return $this->identifiant;
    }

    /**
     * @param mixed $identifiant
     */
    public function setIdentifiant($identifiant)
    {
        $this->identifiant = $identifiant;
    }

    /**
     * @return mixed
     */
    public function getTypeBillet()
    {
        return $this->typeBillet;
    }

    /**
     * @param mixed $typeBillet
     */
    public function setTypeBillet($typeBillet)
    {
        $this->typeBillet = $typeBillet;
    }

    /**
     * @return mixed
     */
    public function getReservation()
    {
        return $this->reservation;
    }

    /**
     * @param $reservation
     */
    public function setReservation($reservation)
    {
        $this->reservation = $reservation;
    }


}