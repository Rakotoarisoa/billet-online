<?php


namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use JMS\Serializer\Annotation as Serializer;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Acl\Exception\Exception;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ShopRepository")
 * @ORM\Table(name = "shop",uniqueConstraints={@ORM\UniqueConstraint(name="UNIQUE", columns={"identifiant", "nom"})})
 * @UniqueEntity(fields={"identifiant"})
 * @Serializer\ExclusionPolicy("none")
 *
 */
class Shop
{
    use TimestampableEntity;
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;
    public function __construct(){
        $this->identifiant=substr(str_shuffle("0123456789"), 0, 5);
    }

    /**
     * @ORM\Column(type="string", length=5)
     */
    private $identifiant;

    /**
     * @ORM\OneToMany(targetEntity="Reservation",mappedBy="point_de_vente")
     * @Serializer\Exclude
     */
    private $reservations;
    /**
     * @ORM\OneToOne(targetEntity="User",mappedBy="pointDeVente")
     */
    private $user;
    /**
     * @ORM\Column(type="string", length=255)
     */
    private $nom;
    /**
     * @ORM\Column(type="boolean",options={"default":"1"})
     */
    private $active;
    public function __toString()
    {
        // TODO: Implement __toString() method.
        return $this->nom;
    }

    /**
     * @return mixed
     */
    public function getActive()
    {
        return $this->active;
    }

    /**
     * @param mixed $active
     */
    public function setActive($active): void
    {
        $this->active = $active;
    }

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
     * @return \DateTime
     */
    public function getCreatedAt(): \DateTime
    {
        return $this->createdAt;
    }

    /**
     * @param \DateTime $createdAt
     */
    public function setCreatedAt(\DateTime $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    /**
     * @return \DateTime
     */
    public function getUpdatedAt(): \DateTime
    {
        return $this->updatedAt;
    }

    /**
     * @param \DateTime $updatedAt
     */
    public function setUpdatedAt(\DateTime $updatedAt): void
    {
        $this->updatedAt = $updatedAt;
    }

    /**
     * @return mixed
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param mixed $users
     */
    public function setUser(User $user = null): void
    {
        if(isset($user) && in_array('ROLE_USER_SHOP',$user->getRoles()))
            $this->user = $user;
        else
            throw  new Exception('L\'utilisateur ne peut pas être ajouté');
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
    public function setId($id): void
    {
        $this->id = $id;
    }

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
    /**
     * @ORM\Column(type="string", length=10,nullable=true)
     */
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