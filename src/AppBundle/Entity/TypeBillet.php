<?php


namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
/**
 * @ORM\Entity
 * @ORM\Table(name = "typebillet")
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
     */
    private $billets;
}