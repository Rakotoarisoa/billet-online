<?php
namespace AppBundle\Controller\FOSUserBundle;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

class SecurityController extends \FOS\UserBundle\Controller\SecurityController
{
    /**
     * We override loginAction to redirect the user depending on their role.
     * If they try to go to /login, they will be redirected accordingly based on their role
     *
     * @param Request $request
     * @return RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function loginAction(Request $request)
    {
        $auth_checker = $this->get('security.authorization_checker');
        $router = $this->get('router');
                // 307: Internal Redirect
        if ($auth_checker->isGranted(['ROLE_SUPER_ADMIN'])) {
            return new RedirectResponse($router->generate('sonata_admin_dashboard'), 307);
        }
        // 307: Internal Redirect
        if ($auth_checker->isGranted(['ROLE_ADMIN'])) {
            return new RedirectResponse($router->generate('sonata_admin_dashboard'), 307);
        }
        // 307: Internal Redirect
        if ($auth_checker->isGranted(['ROLE_USER_MEMBER'])) {
            return new RedirectResponse($router->generate('viewEventUserAdmin'), 307);
        }
        if ($auth_checker->isGranted('ROLE_USER_SHOP')) {
            return new RedirectResponse($router->generate('viewList'), 307);
        }
        // Always call the parent unless you provide the ENTIRE implementation
        return parent::loginAction($request);
    }
    public function checkAction()
    {        
        throw new \RuntimeException('You must configure the check path to be handled by the firewall using form_login in your security firewall configuration.');
    }
}
