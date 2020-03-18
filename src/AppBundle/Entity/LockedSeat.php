<?php


namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;
use Doctrine\ORM\Mapping\UniqueConstraint;
/**
 * @ORM\Entity
 * @ORM\Table(name = "locked_seat",uniqueConstraints={@UniqueConstraint(name="unique_seat_lock", columns={"seat_id","section_id" ,"id_evenement"})})
 */
class LockedSeat
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

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
    public function setId($id): void
    {
        $this->id = $id;
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
    public function setEvenement($evenement): void
    {
        $this->evenement = $evenement;
    }

    /**
     * @return mixed
     */
    public function getSessId()
    {
        return $this->sess_id;
    }

    /**
     * @param mixed $sess_id
     */
    public function setSessId($sess_id): void
    {
        $this->sess_id = $sess_id;
    }

    /**
     * @return mixed
     */
    public function getSeatId()
    {
        return $this->seat_id;
    }

    /**
     * @param mixed $seat_id
     */
    public function setSeatId($seat_id): void
    {
        $this->seat_id = $seat_id;
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
     * @ORM\ManyToOne(targetEntity="Evenement")
     * @ORM\JoinColumn(name="id_evenement", referencedColumnName="id")
     * @Serializer\Exclude
     */
    private $evenement;
    /**
     * @ORM\Column(type="string",length=255)
     */
    private $sess_id;
    /**
     * @ORM\Column(type="string",length=100)
     */
    private $seat_id;
    /**
     * @ORM\Column(type="string",length=100)
     */
    private $section_id;
}