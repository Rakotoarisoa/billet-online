<?php


namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\UniqueConstraint;
/**
 * @ORM\Entity
 * @ORM\Table(name="user_options",uniqueConstraints={@UniqueConstraint(name="unique_uOpt", columns={"user"})})
 */
class UserOptions
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
     * @ORM\OneToOne(targetEntity="User", mappedBy="options")
     * @ORM\JoinColumn(name="user", referencedColumnName="id")
     */
    private $user;
    /**
     * @ORM\Column(type="boolean")
    */
    private $isEventManager;

    /**
     * @return mixed
     */
    public function getIsEventManager()
    {
        return $this->isEventManager;
    }

    /**
     * @param mixed $isEventManager
     */
    public function setIsEventManager($isEventManager): void
    {
        $this->isEventManager = $isEventManager;
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
    public function setUser($user): void
    {
        $this->user = $user;
    }

    /**
     * @return mixed
     */
    public function getPaypalAccount()
    {
        return $this->paypal_account;
    }

    /**
     * @param mixed $paypal_account
     */
    public function setPaypalAccount($paypal_account): void
    {
        $this->paypal_account = $paypal_account;
    }

    /**
     * @return mixed
     */
    public function getOrangeMoneyConsumerId()
    {
        return $this->orange_money_consumer_id;
    }

    /**
     * @param mixed $orange_money_consumer_id
     */
    public function setOrangeMoneyConsumerId($orange_money_consumer_id): void
    {
        $this->orange_money_consumer_id = $orange_money_consumer_id;
    }

    /**
     * @return mixed
     */
    public function getOrangeMoneyBearerKey()
    {
        return $this->orange_money_bearer_key;
    }

    /**
     * @param mixed $orange_money_bearer_key
     */
    public function setOrangeMoneyBearerKey($orange_money_bearer_key): void
    {
        $this->orange_money_bearer_key = $orange_money_bearer_key;
    }

    /**
     * @return mixed
     */
    public function getOrangeMoneyConsumerBearerLifetime()
    {
        return $this->orange_money_consumer_bearer_lifetime;
    }

    /**
     * @param mixed $orange_money_consumer_bearer_lifetime
     */
    public function setOrangeMoneyConsumerBearerLifetime($orange_money_consumer_bearer_lifetime): void
    {
        $this->orange_money_consumer_bearer_lifetime = $orange_money_consumer_bearer_lifetime;
    }
    /**
     * @ORM\Column(type="string", length=100)
     */
    private $paypal_account;
    /**
     * @ORM\Column(type="string", length=100)
     */
    private $orange_money_consumer_id;
    /**
     * @ORM\Column(type="string", length=100)
     */
    private $orange_money_merchant_key;

    /**
     * @return mixed
     */
    public function getOrangeMoneyMerchantKey()
    {
        return $this->orange_money_merchant_key;
    }

    /**
     * @param mixed $orange_money_merchant_key
     */
    public function setOrangeMoneyMerchantKey($orange_money_merchant_key): void
    {
        $this->orange_money_merchant_key = $orange_money_merchant_key;
    }
    /**
     * @ORM\Column(type="string", length=100)
     */
    private $orange_money_bearer_key;
    /**
     * @ORM\Column(type="string", length=100)
     */
    private $orange_money_consumer_bearer_lifetime;
    /**
     * @ORM\Column(type="boolean")
     */
    private $usePaypal;
    /**
     * @ORM\Column(type="boolean")
     */
    private $useOrangeMoney;

    /**
     * @return mixed
     */
    public function getUsePaypal()
    {
        return $this->usePaypal;
    }

    /**
     * @param mixed $usePaypal
     */
    public function setUsePaypal($usePaypal): void
    {
        $this->usePaypal = $usePaypal;
    }

    /**
     * @return mixed
     */
    public function getUseOrangeMoney()
    {
        return $this->useOrangeMoney;
    }

    /**
     * @param mixed $useOrangeMoney
     */
    public function setUseOrangeMoney($useOrangeMoney): void
    {
        $this->useOrangeMoney = $useOrangeMoney;
    }
}
