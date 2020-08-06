<?php


namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\UniqueConstraint;
use Gedmo\Timestampable\Traits\TimestampableEntity;

/**
 * @ORM\Entity
 * @ORM\Table(name = "payment_transaction",uniqueConstraints={@UniqueConstraint(name="unique_idtrans", columns={"txnid","pay_token"})})
 */
class PaymentTransaction
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
     * @return mixed
     */
    public function getTxnid()
    {
        return $this->txnid;
    }

    /**
     * @param mixed $txnid
     */
    public function setTxnid($txnid): void
    {
        $this->txnid = $txnid;
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
    public function setReservation($reservation): void
    {
        $this->reservation = $reservation;
    }

    /**
     * @return int
     */
    public function getStatus(): int
    {
        return $this->status;
    }

    /**
     * @param int $status
     */
    public function setStatus(int $status): void
    {
        $this->status = $status;
    }

    /**
     * @return int
     */
    public function getCurrency(): string
    {
        return $this->currency;
    }

    /**
     * @param int $currency
     */
    public function setCurrency(string $currency): void
    {
        $this->currency = $currency;
    }

    /**
     * @return int
     */
    public function getPaymentMethod(): string
    {
        return $this->payment_method;
    }

    /**
     * @param int $payment_method
     */
    public function setPaymentMethod(string $payment_method): void
    {
        $this->payment_method = $payment_method;
    }

    /**
     * @return int
     */
    public function getAmount(): int
    {
        return $this->amount;
    }

    /**
     * @param int $amount
     */
    public function setAmount(int $amount): void
    {
        $this->amount = $amount;
    }

    /**
     * @return mixed
     */
    public function getPayToken()
    {
        return $this->pay_token;
    }

    /**
     * @param mixed $pay_token
     */
    public function setPayToken($pay_token): void
    {
        $this->pay_token = $pay_token;
    }
    use TimestampableEntity;
    const STATUS_KO = -1;
    const STATUS_STARTED = 0;
    const STATUS_OK = 1;
    const STATUS_ERROR = 2;
    /**
     * @ORM\Column(type="string", length=100)
     */
    private $txnid;
    /**
     * @ORM\OneToOne(targetEntity="Reservation", mappedBy="payment_transaction")
     */
    private $reservation;
    /**
     * @var int
     *
     * @ORM\Column(type="smallint", options={"default": 0})
     */
    private $status = self::STATUS_STARTED;
    /**
     * @var int
     *
     * @ORM\Column(type="string",length=3, options={"default": "MGA"})
     */
    private $currency;
    /**
     * @var int
     *
     * @ORM\Column(type="string",length=100, options={"default": "shop"})
     */
    private $payment_method;
    /**
     * @var int
     *
     * @ORM\Column(type="decimal", precision=10, scale=2, options={"default": 0})
     */
    private $amount;
    /**
     * @ORM\Column(type="string", length=100)
     */
    private $pay_token;
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
}
