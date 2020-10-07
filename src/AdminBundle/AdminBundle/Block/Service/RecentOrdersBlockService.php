<?php
namespace AdminBundle\AdminBundle\Block\Service;

use Doctrine\ORM\EntityManagerInterface;
use Sonata\AdminBundle\Admin\Pool;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\CoreBundle\Validator\ErrorElement;
use Sonata\BlockBundle\Block\Service\AbstractBlockService;
use Sonata\BlockBundle\Block\BlockContextInterface;
use Sonata\BlockBundle\Model\BlockInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bundle\TwigBundle\TwigEngine;

class RecentOrdersBlockService extends AbstractBlockService
{
    private $entityManager;
    private $pool;

    public function __construct(
        $serviceId,
        TwigEngine $templating,
        EntityManagerInterface $entityManager,
        Pool $pool

    )
    {
        $this->entityManager = $entityManager;
        parent::__construct($serviceId, $templating);
        $this->pool=$pool;
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'Recent Orders Block';
    }

    /**
     * {@inheritdoc}
     */
    public function configureSettings(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'entity' => 'AppBundle\Entity\Reservation',
            'repository_method' => 'getRecentOrdersByDate',
            'title' => 'Réservations récentes',
            'template' => 'AdminBundle:admin:recent_orders.html.twig',

        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function buildEditForm(
        FormMapper $formMapper,
        BlockInterface $block
    )
    {
        $formMapper->add(
            'settings',
            'sonata_type_immutable_array',
            [
                'keys' => [
                    ['entity', 'text', ['required' => false]],
                    ['repository_method', 'text'],
                    ['title', 'text', ['required' => false]],
                ]
            ]
        );
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
        $admin = $this->pool->getAdminByAdminCode("admin.reservation");
        $settings = $blockContext->getSettings();
        $entity = $settings['entity'];
        $method = $settings['repository_method'];
        $rows = $this->entityManager
            ->getRepository($entity)
            ->$method();
        return $this->templating
            ->renderResponse($blockContext->getTemplate(), [
                'res' => $rows,
                'block' => $blockContext->getBlock(),
                'settings' => $settings,
                'admin' => $admin
            ],
                $response);
    }
}
