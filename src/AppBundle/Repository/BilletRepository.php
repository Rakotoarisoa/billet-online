<?php

namespace AppBundle\Repository;

use AppBundle\Entity\Billet;
use AppBundle\Entity\Evenement;
use AppBundle\Entity\TypeBillet;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\HttpFoundation\Request;

/**
 * EvenementRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class BilletRepository extends EntityRepository
{
    /** @function compter les tickets par Type de billets
     */
    public function getListTicketsByType(Evenement $event)
    {
        return $this->getEntityManager()->createQuery('SELECT count(tb) AS nombreBillets, tb.libelle, tb.prix as prix
            from AppBundle:TypeBillet tb
            JOIN AppBundle:Billet b WITH b.typeBillet=tb.id
            LEFT JOIN AppBundle:Evenement evt WITH evt.id=tb.evenement
            WHERE evt.id= :idEvent
            GROUP BY tb.id,prix
            ORDER BY tb.libelle DESC
            ')
            ->setParameter('idEvent', $event->getId())
            ->getResult();
    }

    /** @function compter les tickets VENDUS par Type de billets
     */
    public function getLeftTicketsByType(Evenement $event)
    {
        return $this->getEntityManager()->createQuery('SELECT count(tb) AS nombreBillets, tb.libelle, b.estVendu
            from AppBundle:TypeBillet tb
            JOIN AppBundle:Billet b WITH b.typeBillet=tb.id 
            LEFT JOIN AppBundle:Evenement evt WITH evt.id=tb.evenement
            WHERE evt.id= :idEvent and b.estVendu=0
            GROUP BY tb.id 
            ORDER BY tb.libelle DESC
            ')
            ->setParameter('idEvent', $event->getId())
            ->getResult();
    }

    public function getAllEvents()
    {
        return $this->getEntityManager()->createQuery('SELECT e FROM AppBundle:Evenement e ORDER BY e.dateDebutEvent ASC')->getResult();

    }

    /** @function compter les tickets restants et vendus
     */
    public function countPurchasedTickets(Evenement $event)
    {

        $queryBillet = $this->getEntityManager()->createQuery('SELECT count(tb.id) as billets,GROUP_CONCAT(DISTINCT b.estVendu) as estVendu 
            from AppBundle:Billet b
            JOIN AppBundle:TypeBillet tb WITH b.typeBillet=tb.id
            LEFT JOIN AppBundle:Evenement evt WITH evt.id=tb.evenement
            WHERE evt.id= :idEvent
            GROUP BY b.estVendu')
            ->setParameter('idEvent', $event->getId())
            ->getScalarResult();
        $result = array();
        foreach ($queryBillet as $billet) {
            if ($billet['estVendu'] == 1)
                $result['vendus'] = $billet['billets'];
            elseif ($billet['estVendu'] == 0) {
                $result['restants'] = $billet['billets'];
            }
        }
        return $result;
    }

    /** @function générer billets
     * TODO: Generation Identifiant pour billet
     */
    public function generateTickets($prix, $number, $typeBillet, Evenement $event)
    {
        $em = $this->getEntityManager();
        $type_billet_object = null;
        $object_type_billets = $em->getRepository(TypeBillet::class)->findOneBy(['libelle' => $typeBillet]);
        if ($object_type_billets) {
            if ($typeBillet == "Gratuit") {
                $prix = 0;
            }
            $type_billet_object = $object_type_billets;
        } else {
            $new_tb = new TypeBillet();
            $new_tb->setLibelle($typeBillet);
            $em->persist($new_tb);
            $em->flush();
            $type_billet_object = $new_tb;
        }

        for ($i = 0; $i < $number; $i++) {
            $ticketLeft = $em->getRepository(Billet::class)->countPurchasedTickets($event);
            if (isset($ticketLeft['vendus'])) {
                $nbr = (int)$ticketLeft['vendus'] + $ticketLeft['restants'];
            } else {
                $nbr = (int)$ticketLeft['restants'];
            }
            $newTicket = new Billet();
            $newTicket->setEstVendu(0);
            $newTicket->setPrix($prix);
            $id_billet = $event->getTitreEvenementSlug() . '-' . date_format($event->getDateDebutEvent(), 'Y-m-d-H-i-s') . '-' . strtolower($this->stripAccents($typeBillet) . '-' . ($nbr + 1));
            $newTicket->setIdentifiant($id_billet);
            $newTicket->setPlaceId('N/A');
            $newTicket->setEvenement($event);
            $newTicket->setTypeBillet($type_billet_object);
            $em->persist($newTicket);
            $em->flush();
        }
    }

    /** @fonction pour génerer le Dt
     */
    public function getDataForDatatables(Evenement $event)
    {
        $totalTickets = $this->getListTicketsByType($event);
        $resteTickets = $this->getLeftTicketsByType($event);
        $array_return = [];
        /**comparer les Types de billets et ajouter les billets restants*/
        foreach ($totalTickets as $typeTicket) {
            foreach ($resteTickets as $reste) {
                if ($typeTicket['libelle'] == $reste['libelle']) {
                    $typeTicket['reste_tickets'] = $reste['nombreBillets'];
                }
            }

            $array_return[] = $typeTicket;
        }
        return $array_return;
    }

    /** @function Lister les billets
     */
    public function getListBilletByUser(Evenement $event, Request $request = null)
    {
        if (is_null($request)) {
            return $this->getEntityManager()->createQuery('SELECT b.id as id,b.place_id as place_id,b.identifiant as identifiant,b.estVendu as est_vendu, tb.libelle as libelle, tb.prix as prix
            from AppBundle:Billet b
            JOIN AppBundle:TypeBillet tb WITH b.typeBillet=tb.id
            LEFT JOIN AppBundle:Evenement evt WITH evt.id=tb.evenement
            WHERE evt.id= :idEvent
            ORDER BY b.id DESC
            ')
                ->setParameter('idEvent', $event->getId());
        } else {
            $id = $request->request->has('identifiant');
            $identifiant = trim($id);
            $type_billet = $request->request->has($id);
            $est_vendu = $request->request->has($id);
            return $this->getEntityManager()->createQuery('SELECT b.id as id,b.place_id as place_id,b.identifiant as identifiant,b.estVendu as est_vendu, tb.libelle as libelle, tb.prix as prix
            from AppBundle:Billet b
            JOIN AppBundle:TypeBillet tb WITH b.typeBillet=tb.id
            JOIN AppBundle:Evenement evt WITH evt.id=tb.evenement
            WHERE evt.id= :idEvent 
            AND b.identifiant LIKE :identifiant
            AND b.estVendu LIKE :est_vendu
            AND tb.id LIKE :type_billet
            ORDER BY b.id DESC
            ')
                ->setParameter('idEvent', $event->getId())
                ->setParameter('identifiant', '%' . $identifiant . '%')
                ->setParameter('type_billet', '%' . $type_billet . '%')
                ->setParameter('est_vendu', '%' . $est_vendu . '%');
        }
    }

    /** @fonction pour récuperer les billets à reserver
     * @param Evenement $event
     * @param $nbr nombre de billets
     * @param $type_billets
     */
    public function getTicketsToBuy($event_id, $nbr = 1, $type_billet, $updateBillet = false)
    {
        $emBillet=$this->getEntityManager()->getRepository(Billet::class);
        $event = $this->getEntityManager()->getRepository(Evenement::class)->find($event_id);
        $result=array();
        for($i=0;$i<$nbr;$i++ )
        {
            $billet=new Billet();
            $identifiant = $i."-".date("ddmmY")."-".$event->getTitreEvenementSlug();//format nb-ddmmYYYY-event-slug
            $billet->setTypeBillet($type_billet);
            $billet->setIdentifiant($identifiant);
            $billet->setPlaceId("-");
            $billet->setSectionId("-");
            array_push($result,$billet);
        }
        return $result;

        /*$rs = $queryBillet = $this->getEntityManager()->createQuery('SELECT b.id,b.identifiant,tb.prix,b.place_id,tb.libelle FROM AppBundle:Billet b
JOIN AppBundle:Typebillet tb WITH tb.id=b.typeBillet 
JOIN AppBundle:Evenement e WITH e.id=tb.evenement 
WHERE e.id=:idEvent and b.estVendu=0 and tb.libelle=:libelle
ORDER BY b.id ASC')
            ->setParameter('idEvent', (integer)$event_id)
            ->setParameter('libelle', $type_billet)
            ->setMaxResults($nbr)
            ->getResult();
        if ($updateBillet) {
            foreach ($rs as $item) {
                $this->getEntityManager()->createQuery('UPDATE AppBundle:Billet b SET b.estVendu=1 WHERE b.id=:id')->setParameter('id', $item['id'])->execute();
            }
        }
        return $rs;*/
    }

    private function stripAccents($str)
    {
        return strtr(utf8_decode($str), utf8_decode('àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ'), 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY');
    }

    /** Liste des billets assignés sur la carte* */
    public function getMappedSeatMapTickets($id)
    {
        $rs = $queryBillet = $this->getEntityManager()->createQuery('SELECT b.id as id ,b.identifiant as identifiant,tb.prix as prix,b.place_id as place,b.section_id as section,tb.libelle as type FROM AppBundle:Billet b 
JOIN AppBundle:Typebillet tb WITH tb.id=b.typeBillet 
JOIN AppBundle:Evenement e WITH e.id=tb.evenement 
WHERE e.id=:idEvent and b.isMapped=1
ORDER BY b.id ASC')
            ->setParameter('idEvent', (integer)$id)
            ->getResult();
        return $rs;
    }

}
