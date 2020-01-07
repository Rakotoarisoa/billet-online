<?php

namespace AppBundle\Manager;

use AppBundle\Entity\Log;
use AppBundle\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * Class LogManager
 */
class LogManager
{
    private $em;
    private $translator;

    /**
     * LogService constructor.
     *
     * @param EntityManagerInterface       $em
     * @param TranslatorInterface $translator
     */
    public function __construct(EntityManagerInterface $em, TranslatorInterface $translator)
    {
        $this->em         = $em;
        $this->translator = $translator;
    }

    /**
     * @param string $type
     * @param string $message
     * @param User   $user
     *
     * @return Log
     */
    public function logAction(string $type, string $message, User $user)
    {
        /** @var Log $log */
        $log = new Log();
        $log->setType($this->translator->trans($type))
            ->setMessage($this->translator->trans($message))
            ->setUser($user);
        $this->em->persist($log);
        $this->em->flush();

        return $log;
    }
}
