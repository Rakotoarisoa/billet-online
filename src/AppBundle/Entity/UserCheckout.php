<?php


namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity
 * @ORM\Table(name = "user_checkout",uniqueConstraints={@ORM\UniqueConstraint(name="UNIQUE_EMAIL", columns={"email"})})
 * @UniqueEntity(fields={"email"})
 */
class UserCheckout
{
    use TimestampableEntity;
    public function __construct()
    {
        $this->dateInsert = new \DateTime();
    }

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
     * @ORM\Column(type="string", length=100,nullable=false)
     */
    private $nom;

    /**
     * @return mixed
     */
    public function getNom()
    {
        return $this->nom;
    }

    /**
     * @param mixed $nom
     */
    public function setNom($nom): void
    {
        $this->nom = $nom;
    }

    /**
     * @return mixed
     */
    public function getPrenom()
    {
        return $this->prenom;
    }

    /**
     * @param mixed $prenom
     */
    public function setPrenom($prenom): void
    {
        $this->prenom = $prenom;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param mixed $email
     */
    public function setEmail($email): void
    {
        $this->email = $email;
    }

    /**
     * @return mixed
     */
    public function getAdresse1()
    {
        return $this->adresse1;
    }

    /**
     * @param mixed $adresse1
     */
    public function setAdresse1($adresse1): void
    {
        $this->adresse1 = $adresse1;
    }

    /**
     * @return mixed
     */
    public function getAdresse2()
    {
        return $this->adresse2;
    }

    /**
     * @param mixed $adresse2
     */
    public function setAdresse2($adresse2): void
    {
        $this->adresse2 = $adresse2;
    }

    /**
     * @return mixed
     */
    public function getIsRegisteredUser()
    {
        return $this->isRegisteredUser;
    }

    /**
     * @param mixed $isRegisteredUser
     */
    public function setIsRegisteredUser($isRegisteredUser): void
    {
        $this->isRegisteredUser = $isRegisteredUser;
    }

    /**
     * @return mixed
     */
    public function getPays()
    {
        return $this->pays;
    }

    /**
     * @param mixed $pays
     */
    public function setPays($pays): void
    {
        $this->pays = $pays;
    }
    /**
     * @return mixed
     */
    public function getRegion()
    {
        return $this->region;
    }

    /**
     * @param mixed $region
     */
    public function setRegion($region): void
    {
        $this->region = $region;
    }

    /**
     * @return mixed
     */
    public function getZipCode()
    {
        return $this->zipCode;
    }

    /**
     * @param mixed $zipCode
     */
    public function setZipCode($zipCode): void
    {
        $this->zipCode = $zipCode;
    }
    /**
     * @ORM\Column(type="string",length=100,nullable=false)
     */
    private $prenom;
    /**
     * @ORM\Column(type="string", length=100,nullable=false)
     */
    private $email;
    /**
     * @ORM\Column(type="string", length=100,nullable=true)
     */
    private $adresse1;
    /**
     * @ORM\Column(type="string", length=100,nullable=true)
     */
    private $adresse2;
    /**
     * @ORM\Column(type="boolean",nullable=false)
     */
    private $isRegisteredUser =false;
    /**
     * @ORM\Column(type="string", length=100,nullable=true)
     */
    private $pays;
    /**
     * @ORM\Column(type="string", length=100,nullable=true)
     */
    private $region;
    /**
     * @ORM\Column(type="string", length=10,nullable=true)
     */
    private $zipCode;
    /**
     * @ORM\OneToMany(targetEntity="Reservation", mappedBy="user_checkout")
     * @ORM\JoinColumn(name="reservation", referencedColumnName="id",nullable=false)
     */
    private $reservations;

    /**
     * @return mixed
     */
    public function getReservations()
    {
        return $this->reservations;
    }

    /**
     * @param mixed $reservations
     */
    public function setReservations($reservations): void
    {
        $this->reservations = $reservations;
    }

}
