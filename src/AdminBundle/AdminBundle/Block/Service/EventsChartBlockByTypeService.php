<?php
namespace AdminBundle\AdminBundle\Block\Service;

use Doctrine\ORM\EntityManagerInterface;
use Sonata\BlockBundle\Block\BlockContextInterface;
use Sonata\BlockBundle\Block\Service\AbstractBlockService;
use Sonata\BlockBundle\Model\BlockInterface;
use Sonata\CoreBundle\Validator\ErrorElement;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Sonata\AdminBundle\Admin\Pool;

class EventsChartBlockByTypeService extends AbstractBlockService
{
    private $entityManager;
    protected $pool;

    public function __construct(
        $serviceId,
        TwigEngine $templating,
        EntityManagerInterface $entityManager,
        Pool $pool

    )
    {
        $this->entityManager = $entityManager;
        parent::__construct($serviceId, $templating);
        $this->pool= $pool;
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'Chart Block';
    }

    /**
     * {@inheritdoc}
     */
    public function configureSettings(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'entity' => 'AppBundle\Entity\Evenement',
            'repository_method' => 'getAllEventsByCategory',
            'title' => 'Evènements',
            'template' => 'AdminBundle:admin:chart_block_events_by_type.html.twig',

        ]);
    }
    /**
     * {@inheritdoc}
     */
    public function validateBlock(ErrorElement $errorElement, BlockInterface $block)
    {
        $errorElement
            ->with('settings[entity]')
            ->assertNotNull(array())
            ->assertNotBlank()
            ->end()
            ->with('settings[repository_method]')
            ->assertNotNull(array())
            ->assertNotBlank()
            ->end()
            ->with('settings[title]')
            ->assertNotNull(array())
            ->assertNotBlank()
            ->assertMaxLength(array('limit' => 50))
            ->end();
    }
    /**
     * {@inheritdoc}
     */
    public function execute(BlockContextInterface $blockContext, Response $response = null){
        $admin = $this->pool->getAdminByAdminCode("admin.evenement");
        $settings = $blockContext->getSettings();
        $entity = $settings['entity'];
        $method = $settings['repository_method'];
        $rows = $this->entityManager
            ->getRepository($entity)
            ->$method();
        return $this->templating
            ->renderResponse($blockContext->getTemplate(), [
                'events' => $rows,
                'block' => $blockContext->getBlock(),
                'settings' => $settings,
                'admin' => $admin
            ],
                $response);
    }

}
