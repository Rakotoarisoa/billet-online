<?php

namespace AppBundle\Entity;

use AppBundle\Utils\Slugger;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serializer;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\EvenementRepository")
 * @ORM\Table(name="evenement")
 * @Serializer\ExclusionPolicy("none")
 */
class Evenement
{

    public function __construct()
    {
        $slugger= new Slugger();
            $this->setTitreEvenementSlug($slugger->slugify($this->getTitreEvenement()));
    }

    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;
    /**
     * @ORM\Column(type="string", length=100)
     */
    private $titreEvenementSlug;

    /**
     * @return mixed
     */
    public function getTitreEvenementSlug()
    {
        return $this->titreEvenementSlug;
    }

    /**
     * @param mixed $titreEvenementSlug
     */
    public function setTitreEvenementSlug($titreEvenementSlug): void
    {
        $this->titreEvenementSlug = $titreEvenementSlug;
    }

    /**
     * @ORM\Column(type="string", length=100)
     */
    private $titreEvenement;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateDebutEvent;

    /**
     * @ORM\Column(type="datetime", length=100,nullable=true)
     */
    private $dateFinEvent;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isPublished;
    /**
     * @ORM\Column(type="boolean")
     */
    private $isUsingSeatMap;

    /**
     * @return mixed
     */
    public function getIsUsingSeatMap()
    {
        return $this->isUsingSeatMap;
    }

    /**
     * @param mixed $isUsingSeatMap
     */
    public function setIsUsingSeatMap($isUsingSeatMap): void
    {
        $this->isUsingSeatMap = $isUsingSeatMap;
    }

    /**
     * @return mixed
     */
    public function getIsPublished()
    {
        return $this->isPublished;
    }

    /**
     * @param mixed $isPublished
     */
    public function setIsPublished($isPublished): void
    {
        $this->isPublished = $isPublished;
    }

    /**
     * @ORM\Column(type="string", length=255,nullable=true)
     */
    private $imageEvent;

    /**
     * @ORM\Column(type="text")
     */
    private $description;
    /**
    * @ORM\Column(type="string",length=255)
     */
    private $organisation;
    /**
     * @return mixed
     */
    public function getOrganisation()
    {
        return $this->organisation;
    }

    /**
     * @param mixed $organisation
     */
    public function setOrganisation($organisation): void
    {
        $this->organisation = $organisation;
    }

    /**
     * @ORM\ManyToOne(targetEntity="CategorieEvenement", inversedBy="evenement")
     * @ORM\JoinColumn(name="id_categorie_evt", referencedColumnName="id")
     * @Serializer\Exclude
     */
    private $categorieEvenement;
    /**
     * @ORM\ManyToOne(targetEntity="User", inversedBy="evenements")
     * @ORM\JoinColumn(name="id_user", referencedColumnName="id")
     * @Serializer\Exclude
     */
    private $user;
    /**
     * @ORM\ManyToOne(targetEntity="LieuEvenement", inversedBy="evenement")
     * @ORM\JoinColumn(name="id_lieu_evt", referencedColumnName="id")
     * @Serializer\Exclude
     */
    private $lieuEvenement;
    /**
     * @ORM\OneToMany(targetEntity="Reservation", mappedBy="evenement")
     * @Serializer\Exclude
     */
    private $reservation;
    /**
     * @ORM\OneToMany(targetEntity="TypeBillet", mappedBy="evenement")
     * @Serializer\Exclude
     */
    private $typeBillets;

    /**
     * @return mixed
     */
    public function getTypeBillets()
    {
        return $this->typeBillets;
    }

    /**
     * @param mixed $typeBillets
     */
    public function setTypeBillets($typeBillets): void
    {
        $this->typeBillets = $typeBillets;
    }


    /**
     * @ORM\Column(type="json", length=255,nullable=true)
     */
    private $etatSalle;

    /**
     * @return mixed
     */
    public function getEtatSalle()
    {
        return $this->etatSalle;
    }

    /**
     * @param mixed $etatSalle
     */
    public function setEtatSalle($etatSalle): void
    {
        $this->etatSalle = $etatSalle;
    }

    /**
     * @return mixed
     */
    public function getReservation()
    {
        return $this->reservation;
    }

    /**
     * @param mixed $reservation
     */
    public function setReservation($reservation)
    {
        $this->reservation = $reservation;
    }

    /**
     * @return mixed
     */
    public function getLieuEvenement()
    {
        return $this->lieuEvenement;
    }

    /**
     * @param mixed $lieuEvenement
     */
    public function setLieuEvenement($lieuEvenement)
    {
        $this->lieuEvenement = $lieuEvenement;
    }

    /**
     * @return mixed
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param mixed $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * @return mixed
     */
    public function getCategorieEvenement()
    {
        return $this->categorieEvenement;
    }

    /**
     * @param mixed $categorieEvenement
     */
    public function setCategorieEvenement($categorieEvenement)
    {
        $this->categorieEvenement = $categorieEvenement;
    }

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set titreEvenement
     *
     * @param string $titreEvenement
     *
     * @return Evenement
     */
    public function setTitreEvenement($titreEvenement)
    {
        $this->titreEvenement = $titreEvenement;

        return $this;
    }

    /**
     * Get titreEvenement
     *
     * @return string
     */
    public function getTitreEvenement()
    {
        return $this->titreEvenement;
    }

    /**
     * Set dateDebutEvent
     *
     * @param \DateTime $dateDebutEvent
     *
     * @return Evenement
     */
    public function setDateDebutEvent($dateDebutEvent)
    {
        $this->dateDebutEvent = $dateDebutEvent;

        return $this;
    }

    /**
     * Get dateDebutEvent
     *
     * @return \DateTime
     */
    public function getDateDebutEvent()
    {
        return $this->dateDebutEvent;
    }

    /**
     * Set dateFinEvent
     *
     * @param \DateTime $dateFinEvent
     *
     * @return Evenement
     */
    public function setDateFinEvent($dateFinEvent)
    {
        $this->dateFinEvent = $dateFinEvent;

        return $this;
    }

    /**
     * Get dateFinEvent
     *
     * @return \DateTime
     */
    public function getDateFinEvent()
    {
        return $this->dateFinEvent;
    }


    /**
     * Set imageEvent
     *
     *
     * @param string $imageEvent
     *
     * @return Evenement
     */
    public function setImageEvent($imageEvent)
    {
        $this->imageEvent = $imageEvent;

        return $this;
    }

    /**
     * Get imageEvent
     *
     * @return string
     */
    public function getImageEvent()
    {
        return $this->imageEvent;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Evenement
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }
}

