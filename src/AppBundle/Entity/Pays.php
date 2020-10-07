<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Pays
 *
 * @ORM\Table(name="pays")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\PaysRepository")
 */
class Pays
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string|null
     *
     * @ORM\Column(name="code", type="string", length=255, nullable=true)
     */
    private $code;
    /**
     * @var string|null
     *
     * @ORM\Column(name="alpha2", type="string", length=2, nullable=true)
     */
    private $alpha2;
    /**
     * @var string|null
     *
     * @ORM\Column(name="alpha3", type="string", length=3, nullable=true)
     */
    private $alpha3;
    /**
     * @var string|null
     *
     * @ORM\Column(name="libelle_en", type="string", length=255, nullable=true)
     */
    private $libelle_en;

    /**
     * @return mixed
     */
    public function getAlpha2()
    {
        return $this->alpha2;
    }

    /**
     * @param mixed $alpha2
     */
    public function setAlpha2($alpha2): void
    {
        $this->alpha2 = $alpha2;
    }

    /**
     * @return mixed
     */
    public function getAlpha3()
    {
        return $this->alpha3;
    }

    /**
     * @param mixed $alpha3
     */
    public function setAlpha3($alpha3): void
    {
        $this->alpha3 = $alpha3;
    }

    /**
     * @return mixed
     */
    public function getLibelleEn()
    {
        return $this->libelle_en;
    }

    /**
     * @param mixed $libelle_en
     */
    public function setLibelleEn($libelle_en): void
    {
        $this->libelle_en = $libelle_en;
    }

    /**
     * @var string
     *
     * @ORM\Column(name="libelle", type="string", length=255)
     */
    private $libelle;


    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set code.
     *
     * @param string|null $code
     *
     * @return Pays
     */
    public function setCode($code = null)
    {
        $this->code = $code;

        return $this;
    }

    /**
     * Get code.
     *
     * @return string|null
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * Set libelle.
     *
     * @param string $libelle
     *
     * @return Pays
     */
    public function setLibelle($libelle)
    {
        $this->libelle = $libelle;

        return $this;
    }

    /**
     * Get libelle.
     *
     * @return string
     */
    public function getLibelle()
    {
        return $this->libelle;
    }
}
