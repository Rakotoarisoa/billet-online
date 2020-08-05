<?php


namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\UniqueConstraint;
/**
 * Class EventOptions : please insert needed options to manage and configure each events..
 * @package AppBundle\Entity
 * @ORM\Entity(repositoryClass="AppBundle\Repository\EventOptionsRepository")
 * @ORM\Table(name="event_options",uniqueConstraints={@UniqueConstraint(name="unique_evt", columns={"evenement"})})
 *
 */
class EventOptions
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
     * @var boolean
     * @ORM\Column(type="boolean")
     */
    private $usePaypalMethodPayment;
    /**
     * @var boolean
     * @ORM\Column(type="boolean")
     */
    private $useOrangeMoneyMethodPayment;

    /**
     * @return bool
     */
    public function isUsePaypalMethodPayment()
    {
        return $this->usePaypalMethodPayment;
    }

    /**
     * @param bool $usePaypalMethodPayment
     */
    public function setUsePaypalMethodPayment(bool $usePaypalMethodPayment): void
    {
        $this->usePaypalMethodPayment = $usePaypalMethodPayment;
    }

    /**
     * @return bool
     */
    public function isUseOrangeMoneyMethodPayment()
    {
        return $this->useOrangeMoneyMethodPayment;
    }

    /**
     * @param bool $useOrangeMoneyMethodPayment
     */
    public function setUseOrangeMoneyMethodPayment(bool $useOrangeMoneyMethodPayment): void
    {
        $this->useOrangeMoneyMethodPayment = $useOrangeMoneyMethodPayment;
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
     * @ORM\OneToOne(targetEntity="Evenement", mappedBy="options")
     * @ORM\JoinColumn(name="evenement", referencedColumnName="id")
     */
    private $evenement;
}
