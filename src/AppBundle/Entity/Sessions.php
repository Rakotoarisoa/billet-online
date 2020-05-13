<?php
namespace AppBundle\Entity;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\UniqueConstraint;
use JMS\Serializer\Annotation as Serializer;
/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\SessionsRepository")
 * @ORM\Table(name = "sessions",uniqueConstraints={@UniqueConstraint(name="unique_session", columns={"sess_id"})})
 *
 */
class Sessions
{
    /**
     * @ORM\Column(type="string", length=255)
     * @ORM\Id
     */
    private $sess_id;

    /**
     * @return mixed
     */
    public function getSessData()
    {
        return stream_get_contents($this->sess_data);//$this->sess_data;
    }
    
    /**
     * @param mixed $sess_data
     */
    public function setSessData($sess_data): void
    {
        $this->sess_data = $sess_data;
    }

    /**
     * @return mixed
     */
    public function getSessTime()
    {
        return $this->sess_time;
    }

    /**
     * @param mixed $sess_time
     */
    public function setSessTime($sess_time): void
    {
        $this->sess_time = $sess_time;
    }

    /**
     * @return mixed
     */
    public function getSessLifetime()
    {
        return $this->sess_lifetime;
    }

    /**
     * @param mixed $sess_lifetime
     */
    public function setSessLifetime($sess_lifetime): void
    {
        $this->sess_lifetime = $sess_lifetime;
    }

    /**
     * @return mixed
     */
    public function getSessId()
    {
        return $this->sess_id;
    }

    /**
     * @param mixed $sess_id
     */
    public function setSessId($sess_id): void
    {
        $this->sess_id = $sess_id;
    }
    /**
     * @ORM\Column(type="mediumblob")
     */
    private $sess_data;
    /**
     * @ORM\Column(type="string", length=255)
     */
    private $sess_time;
    /**
     * @ORM\Column(type="string", length=255)
     */
    private $sess_lifetime;

}
