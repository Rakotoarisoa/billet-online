<?php
namespace AdminBundle\Controller;;
use Sonata\AdminBundle\Controller\CRUDController;
class StatsCRUDController extends CRUDController
{

    public function listAction()
    {
        return $this->render('admin/stats.html.twig');
    }
}
