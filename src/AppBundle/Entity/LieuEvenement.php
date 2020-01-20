<?php

namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
/**
 * @ORM\Entity
 * @ORM\Table(name = "lieu_evenement")
 */
class LieuEvenement
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $adresse;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $pays;

    /**
     * @ORM\Column(type="string", length=25)
     */
    private $codePostal;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $nomSalle;

    /**
     * @ORM\Column(type="integer", length=255)
     */
    private $capacite;
    /**
     * @ORM\OneToMany(targetEntity="Evenement", mappedBy="lieuEvenement")
     */
    private $evenement;
    /**
     * @ORM\Column(type="json", length=255)
     */
    private $structureSalle;

    /**
     * @return mixed
     */
    public function getStructureSalle()
    {
        return $this->structureSalle;
    }

    /**
     * @param mixed $structureSalle
     */
    public function setStructureSalle($structureSalle): void
    {
        $this->structureSalle = $structureSalle;
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
     * Set adresse
     *
     * @param string $adresse
     *
     * @return LieuEvenement
     */
    public function setAdresse($adresse)
    {
        $this->adresse = $adresse;

        return $this;
    }

    /**
     * Get adresse
     *
     * @return string
     */
    public function getAdresse()
    {
        return $this->adresse;
    }

    /**
     * Set pays
     *
     * @param string $pays
     *
     * @return LieuEvenement
     */
    public function setPays($pays)
    {
        $this->pays = $pays;

        return $this;
    }

    /**
     * Get pays
     *
     * @return string
     */
    public function getPays()
    {
        return $this->pays;
    }

    /**
     * Set codePostal
     *
     * @param string $codePostal
     *
     * @return LieuEvenement
     */
    public function setCodePostal($codePostal)
    {
        $this->codePostal = $codePostal;

        return $this;
    }

    /**
     * Get codePostal
     *
     * @return string
     */
    public function getCodePostal()
    {
        return $this->codePostal;
    }

    /**
     * Set nomSalle
     *
     * @param string $nomSalle
     *
     * @return LieuEvenement
     */
    public function setNomSalle($nomSalle)
    {
        $this->nomSalle = $nomSalle;

        return $this;
    }

    /**
     * Get nomSalle
     *
     * @return string
     */
    public function getNomSalle()
    {
        return $this->nomSalle;
    }

    /**
     * Set capacite
     *
     * @param integer $capacite
     *
     * @return LieuEvenement
     */
    public function setCapacite($capacite)
    {
        $this->capacite = $capacite;

        return $this;
    }

    /**
     * Get capacite
     *
     * @return int
     */
    public function getCapacite()
    {
        return $this->capacite;
    }
}

