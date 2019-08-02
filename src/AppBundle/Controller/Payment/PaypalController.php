<?php
// src/AppBundle/Controller/LuckyController.php
namespace AppBundle\Controller\Payment;


use AppBundle\AppBundle;
use AppBundle\Entity\PaypalTransaction;
use Beelab\PaypalBundle\Paypal\Exception;
use Beelab\PaypalBundle\Paypal\Service;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class PaypalController extends Controller
{
    /**
     * @Route("/payment", name="paypalPay")
     * @param Service $service
     * @return mixed
     */
    public function payment(Service $service)
    {
        $amount = 5000;  // get an amount, e.g. from your cart
        $transaction = new PaypalTransaction($amount);
        $array = array(
            ['name'=>'kiraro','quantity'=>5,'price'=>1000]
        );
        $transaction->setItems($array);
        $transaction->setDescription('Test');
        try {
            $response = $service->setTransaction($transaction)->start();
            $this->getDoctrine()->getManager()->persist($transaction);
            $this->getDoctrine()->getManager()->flush();
            return $this->redirect($response->getRedirectUrl());
        } catch (Exception $e) {
            throw new HttpException(503, 'Payment error', $e);
        }
    }

    /**
     * The route configured in "cancel_route" (see above) should point here
     */
    public function canceledPayment(Request $request)
    {
        $token = $request->query->get('token');
        $transaction = $this->getDoctrine()->getRepository(PaypalTransaction::class)->findOneByToken($token);
        if (null === $transaction) {
            throw $this->createNotFoundException(sprintf('Transaction with token %s not found.', $token));
        }
        $transaction->cancel(null);
        $this->getDoctrine()->getManager()->flush();

        return []; // or a Response...
    }

    /**
     * The route configured in "return_route" (see above) should point here
     */
    public function completedPayment(Service $service, Request $request)
    {
        $token = $request->query->get('token');
        $transaction = $this->getDoctrine()->getRepository(PaypalTransaction::class)->findOneByToken($token);
        if (null === $transaction) {
            throw $this->createNotFoundException(sprintf('Transaction with token %s not found.', $token));
        }
        $service->setTransaction($transaction)->complete();
        $this->getDoctrine()->getManager()->flush();
        if (!$transaction->isOk()) {
            return []; // or a Response (in case of error)
        }

        return []; // or a Response (in case of success)
    }
}