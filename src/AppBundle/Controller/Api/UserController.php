<?php


namespace AppBundle\Controller\Api;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\AbstractFOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\View\View;
use AppBundle\Entity\User;


class UserController extends AbstractFOSRestController
{
    //TODO: Récupérer données de la carte
    /**
     * @Rest\Get("/api/users/list")
     */
    public function getAllUsers()
    {
        $restResult = $this->getDoctrine()->getRepository(User::class)->findAll();
        if ($restResult === null) {
            return new View("there are no users exist", Response::HTTP_NOT_FOUND);
        }
        return $restResult;
    }
    /**
     * @Rest\Get("/api/user/{id}")
     * @param $id
     * @return View|object|null
     */
    public function setEventSeatMap($id){
        $restResult = $this->getDoctrine()->getRepository(User::class)->find($id);
        return $restResult;
    }
}