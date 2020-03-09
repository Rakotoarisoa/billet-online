<?php


namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\BilletRepository")
 * @ORM\Table(name = "billet",uniqueConstraints={@ORM\UniqueConstraint(name="UNIQUE", columns={"identifiant", "id_billet"})})
 * @UniqueEntity(fields={"identifiant","typeBillet"})
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
    public function __construct(){
        $this->checked= false;
        $this->identifiant=substr(str_shuffle("0123456789"), 0, 5);
    }

    /**
     * @ORM\Column(type="string", length=5)
     */
    private $identifiant;
    /**
     * @ORM\ManyToOne(targetEntity="TypeBillet", inversedBy="billets")
     * @ORM\JoinColumn(name="id_billet", referencedColumnName="id")
     */
    private $typeBillet;
    /**
     * @ORM\ManyToOne(targetEntity="Reservation",inversedBy="billet")
     * @ORM\JoinColumn(name="id_reservation", referencedColumnName="id")
     * @Serializer\Exclude
     */
    private $reservation;
    /**
     * @ORM\Column(type="string", length=10,nullable=true)
     */
    private $place_id;
    /**
     * @ORM\Column(type="string", length=10,nullable=true)
     */
    private $section_id;
    /**
     * @ORM\Column(type="boolean")
     */
    private $isMapped;
    /**
     * @ORM\Column(type="boolean")
     */
    private $checked ;
    /**
     * @ORM\Column(type="datetime",nullable=true)
     */
    private $checkDate;

    /**
     * @return mixed
     */
    public function getCheckDate()
    {
        return $this->checkDate;
    }

    /**
     * @param mixed $check_date
     */
    public function setCheckDate($check_date): void
    {
        $this->checkDate = $check_date;
    }

    /**
     * @return mixed
     */
    public function getDevice()
    {
        return $this->device;
    }

    /**
     * @param mixed $device
     */
    public function setDevice($device): void
    {
        $this->device = $device;
    }
    /**
     * @ORM\Column(type="string",nullable=true)
     */
     private $device;

    /**
     * @return mixed
     */
    public function getChecked()
    {
        return $this->checked;
    }

    /**
     * @param mixed $checked
     */
    public function setChecked($checked): void
    {
        $this->checked = $checked;
    }


    /**
     * @return mixed
     */
    public function getIsMapped()
    {
        return $this->isMapped;
    }

    /**
     * @param mixed $isMapped
     */
    public function setIsMapped($isMapped): void
    {
        $this->isMapped = $isMapped;
    }
    /**
     * @return mixed
     */
    public function getSectionId()
    {
        return $this->section_id;
    }

    /**
     * @param mixed $section_id
     */
    public function setSectionId($section_id): void
    {
        $this->section_id = $section_id;
    }
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