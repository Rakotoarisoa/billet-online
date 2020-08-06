<?php

namespace AppBundle\Utils;

use AppBundle\Entity\Reservation;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Response;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\DependencyInjection\ContainerInterface;


/**
 *
 * @author Andry
 */
class OmApi
{
    /**
     * Orange Money  API Base url
     */
    const STATUS_OK = 201;
    const BASE_URL = "https://api.orange.com/";
    /**
     * The Query to run against the FileSystem
     * @var Client;
     */
    private $client ;
    /**
     * @var string or null
     */
    private  $auth_header;
    /**
     * @var string or null
     */
    private  $credentials;
    /**
     * @var string or null
     */
    private  $merchant_key;

     /**
     * @var string or null
     */
    private  $return_url;
     /**
     * @var string or null
     */
    private  $cancel_url;
     /**
     * @var string or null
     */
    private  $notif_url;
    /**
     * @var string or null
     */
    private $reservation;

    /**
     * @return string
     */
    public function getReservation(): Reservation
    {
        return $this->reservation;
    }

    /**
     * Constructor
     * @param string $userid
     * @param string $password
     */
    public function __construct(ContainerInterface $container)
    {
        // Credentials: <Base64 value of UTF-8 encoded “username:password”>
        $this->client = new Client([
            'base_uri' => self::BASE_URL
        ]);
        $this->reservation = new Reservation();
        $this->reservation->setModePaiement('OrangeMoney');

        $this->auth_header  =  $container->getParameter('orange_money_auth_header');
        $this->merchant_key =  $container->getParameter('orange_money_merchant_key');
        $this->return_url   =  $container->getParameter('orange_money_return_url');
        $this->cancel_url   =  $container->getParameter('orange_money_cancel_url');
        $this->notif_url    =  $container->getParameter('orange_money_notif_url');

    }

    /**
     * Create API query and execute a GET/POST request
     * @param string $httpMethod GET/POST
     * @param string $endpoint
     * @param string $options
     */
    private function apiCall($httpMethod, $endpoint, $options)
    {
        // POST method or GET method
        try{
            if(strtolower($httpMethod) === "post") {

                /** @var Response $response */
                $response = $this->client->request('post',$endpoint,$options);

            } else {
                $response = $this->client->get($endpoint);

            }
            /** @var $response Response */
//            $response = $request->send();

            /** @var $body EntityBody */
//            $body = $response->getBody();

            return  $response;
        }catch (Exception $exception){
            return  $exception->getMessage();
        };

    }
    /**
     * Call GET request
     * @param string $endpoint
     * @param string $options
     */
    private function get($endpoint, $options = null) {
        return $this->apiCall("get", $endpoint, $options);
    }
    /**
     * Call POST request
     * @param string $endpoint
     * @param string $options
     */
    private function post($endpoint, $options = null)
    {
        return $this->apiCall("post", $endpoint, $options);
    }
    /**
     * Get Token
     */
    public function getToken()
    {

        $options = [
            'headers'=> [
                'Authorization' => 'Basic '.$this->auth_header,
                'Accept'        =>'application/json'
            ],
            'form_params' => [
                 'grant_type'=>'client_credentials',
            ]
        ];

        return $this->post('oauth/v2/token',$options);
    }


    public function Payment($token,$body)
    {

        //$id = "OM_0".rand(100000,900000)."_00".rand(10000,90000);
        $id=$this->reservation->getNomReservation();
        $b = [
            "merchant_key"  => $this->merchant_key,
            "currency"      => "OUV",
            "order_id"      => $id,
            "amount"        => 500,
            "return_url"    => $this->return_url,
            "cancel_url"    => $this->cancel_url,
            "notif_url"     => $this->notif_url,
            "lang"          => "fr"
        ];

        $b = array_merge($b,$body);
        $b = json_encode($b);

        $options = [
            'headers'=> [
                'Authorization' => 'Bearer '.$token,
                'Accept'        =>'application/json',
                'Content-Type'  =>'application/json'
            ],
            'body' => $b
        ];

        return $this->post('orange-money-webpay/dev/v1/webpayment',$options);
    }

    public function checkTransactionStatus($token, $data)
    {

        $b = [
            "order_id"  => $data["order_id"],
            "amount"    => $data["amount"],
            "pay_token" => $data["pay_token"]
        ];

        $b = json_encode($b);

        /* var_dump($b);
         die();*/
        $options = [
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
                'Accept'        => 'application/json',
                'Content-Type'  => 'application/json'
            ],
            'body' => $b
        ];

        return $this->post('orange-money-webpay/dev/v1/transactionstatus', $options);
    }
}
