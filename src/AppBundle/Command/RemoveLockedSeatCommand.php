<?php
namespace AppBundle\Command;

use AppBundle\Entity\LockedSeat;
use InvalidArgumentException;
use Symfony\Component\DependencyInjection\ContainerInterface;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class RemoveLockedSeatCommand extends Command
{
// the name of the command (the part after "bin/console")
    protected static $defaultName = 'app:remove-locked-seat';
    private $container;
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        parent::__construct();
    }
    protected function configure()
    {
        $this
            // the short description shown while running "php bin/console list"
            ->setDescription('Efface les places en attente.')

            // the full command description shown when running the command with
            // the "--help" option
            ->setHelp('Efface les places en attente. A utiliser pour les tâches planifiées.')
            ->addArgument('time' , InputArgument::REQUIRED, 'Intervalle en milliseconde à supprimer')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $time=$input->getArgument('time');
        if($time && is_integer((int)$time*1)){
            $em=$this->container->get('doctrine')->getManager();
            $locked_repo=$em->getRepository(LockedSeat::class);
            $list_locked=$locked_repo->getLockedSeatToRemove($time);
            $em->flush();
            $output->writeln('Données supprimés: '.$list_locked);
        }
        else throw new InvalidArgumentException('Le paramètre time doit être de type Entier');
    }
}
