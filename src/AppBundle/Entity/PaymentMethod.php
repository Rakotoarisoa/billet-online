<?php


namespace AppBundle\Entity;


use Gedmo\Timestampable\Traits\TimestampableEntity;

abstract class PaymentMethod
{
    use TimestampableEntity;
    /**
     * @ORM\Column(type="string", length=100)
     */
    protected $name; // e.g Orange Money , Paypal
    /**
     * @ORM\Column(type="string", length=100)
     */
    protected $code; // e.g orange_money, paypal
    /**
     * @var int
     *
     * @ORM\Column(type="boolean", options={"default": 1})
     */
    protected $isActive = 1;
    /**
     * @ORM\Column(type="text")
     */
    protected $description;
    public function setDescription($desc){
        $this->description=$desc;
    }
    public function getDescription(): ?string
    {
        return $this->description;
        // here you can return a generic description, if you don't want to list items
    }
}
