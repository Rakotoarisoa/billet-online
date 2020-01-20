<?php


namespace AppBundle\Entity;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
/**
 * @ORM\Entity
 * @ORM\Table(name = "type_billet",uniqueConstraints={@ORM\UniqueConstraint(name="UNIQUE", columns={"id_evenement", "random_type_code"})})
 * @Serializer\ExclusionPolicy("none")
 * @UniqueEntity(
 *     fields={"evenement", "randomTypeCode"},
 *      message="Le billet existe déjà"
 *     )
 *
 */
class TypeBillet
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
     * @ORM\Column(type="string", length=100)
     */
    private $libelle;
    public function __construct(){
        $this->randomTypeCode = substr(str_shuffle("0123456789"), 0, 5);
    }
    /**
     * @ORM\Column(type="string", length=5)
     */
    private $randomTypeCode;

    /**
     * @return mixed
     */
    public function getRandomTypeCode()
    {
        return $this->randomTypeCode;
    }
    /**
     * @ORM\ManyToOne(targetEntity="Evenement",inversedBy="typeBillets")
     * @ORM\JoinColumn(name="id_evenement", referencedColumnName="id",nullable=false)
     */
    private $evenement;
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
    public function getLibelle()
    {
        return $this->libelle;
    }
    /**
     * @param mixed $libelle
     */
    public function setLibelle($libelle)
    {
        $this->libelle = $libelle;
    }
    /**
     * @return mixed
     */
    public function getBillets()
    {
        return $this->billets;
    }
    /**
     * @param mixed $billets
     */
    public function setBillets($billets)
    {
        $this->billets = $billets;
    }
    /**
     * @ORM\OneToMany(targetEntity="Billet", mappedBy="typeBillet",cascade={"remove"})
     * @Serializer\Exclude
     */
    private $billets;
    /**
     * @return mixed
     */
    /**
     * @ORM\Column(type="decimal",scale=2)
     */
    private $prix;
    public function getPrix()
    {
        return $this->prix;
    }
    /**
     * @param mixed $prix
     */
    public function setPrix($prix)
    {
        $this->prix = $prix;
    }
    /**
     * @ORM\Column(type="text",nullable=true)
     */
    private $description;
    /**
     * @ORM\Column(type="integer")
     */
    private $quantite;
    /**
     * @ORM\Column(type="datetime",nullable=true)
     */
    private $date_debut;
    /**
     * @ORM\Column(type="datetime",nullable=true)
     */
    private $date_fin;
    /**
     * @ORM\Column(type="boolean")
     */
    private $active = true;

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     */
    public function setDescription($description): void
    {
        $this->description = $description;
    }

    /**
     * @return mixed
     */
    public function getQuantite()
    {
        return $this->quantite;
    }

    /**
     * @param mixed $quantité
     */
    public function setQuantite($quantite): void
    {
        $this->quantite = $quantite;
    }

    /**
     * @return mixed
     */
    public function getDateDebut()
    {
        return $this->date_debut;
    }

    /**
     * @param mixed $date_debut
     */
    public function setDateDebut($date_debut): void
    {
        $this->date_debut = $date_debut;
    }

    /**
     * @return mixed
     */
    public function getDateFin()
    {
        return $this->date_fin;
    }

    /**
     * @param mixed $date_fin
     */
    public function setDateFin($date_fin): void
    {
        $this->date_fin = $date_fin;
    }

    /**
     * @return mixed
     */
    public function getActive()
    {
        return $this->active;
    }

    /**
     * @param mixed $activé
     */
    public function setActive($active): void
    {
        $this->active = $active;
    }


    public function __toString()
    {
        // TODO: Implement __toString() method.
        return $this->libelle;
    }
}