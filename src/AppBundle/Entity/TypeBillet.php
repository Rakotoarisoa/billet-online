<?php


namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;
/**
 * @ORM\Entity
 * @ORM\Table(name = "typebillet")
 * @Serializer\ExclusionPolicy("none")
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
    /**
     * @ORM\ManyToOne(targetEntity="Evenement",inversedBy="typeBillets")
     * @ORM\JoinColumn(name="id_evenement", referencedColumnName="id")
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
     * @ORM\OneToMany(targetEntity="Billet", mappedBy="typeBillet")
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
     * @ORM\Column(type="text")
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
    private $active;

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