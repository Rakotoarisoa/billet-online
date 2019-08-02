<?php


namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Beelab\PaypalBundle\Entity\Transaction as BaseTransaction;
/**
 * @ORM\Entity
 * @ORM\Table(name = "paypalTransaction")
 */
class PaypalTransaction extends BaseTransaction
{
    /**
     * @ORM\Column(type="decimal")
     */
    private $shipAmount;
    /**
     * @ORM\Column(type="array")
     */
    private $items;
    /**
     * @ORM\Column(type="text")
     */
    private $description;
    public function setDescription($desc){
        $this->description=$desc;
    }
    public function getDescription(): ?string
    {
        return $this->description;
        // here you can return a generic description, if you don't want to list items
    }

    /**
     * @param $items
     */
    public function setItems($items){
        $this->items=$items;
    }
    public function getItems(): array
    {
        return $this->items;
        // here you can return an array of items, with each item being an array of name, quantity, price
        // Note that if the total (price * quantity) of items doesn't match total amount, this won't work
    }

    public function getShippingAmount(): string
    {
        $this->shipAmount=0;
        return $this->shipAmount;
        // here you can return shipping amount. This amount MUST be already in your total amount
    }
}