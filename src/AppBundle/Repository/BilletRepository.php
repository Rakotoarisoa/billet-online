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
        return $this->getEntityManager()->createQuery('SELECT count(tb) AS nombreBillets, tb.libelle, b.prix as prix
            from AppBundle:TypeBillet tb
            JOIN AppBundle:Billet b WITH b.typeBillet=tb.id
            LEFT JOIN AppBundle:Evenement evt WITH evt.id=b.evenement
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
            LEFT JOIN AppBundle:Evenement evt WITH evt.id=b.evenement
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
            from AppBundle:TypeBillet tb
            JOIN AppBundle:Billet b WITH b.typeBillet=tb.id
            LEFT JOIN AppBundle:Evenement evt WITH evt.id=b.evenement
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
    public function generateTickets($prix, $number, TypeBillet $typeBillet, Evenement $event)
    {
        $em = $this->getEntityManager();

        for ($i = 0; $i < $number; $i++) {
            $newTicket = new Billet();
            $newTicket->setEstVendu(0);
            $newTicket->setPrix($prix);
            $newTicket->setIdentifiant($event->getTitreEvenementSlug() + date_timestamp_set($event->getDateDebutEvent(), 3));
            $newTicket->setEvenement($event);
            $newTicket->setTypeBillet($typeBillet);
            //register to entityManager
            $em->persist($newTicket);
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
            return $this->getEntityManager()->createQuery('SELECT b.id as id,b.place_id as place_id,b.identifiant as identifiant,b.estVendu as est_vendu, tb.libelle as libelle, b.prix as prix
            from AppBundle:Billet b
            JOIN AppBundle:TypeBillet tb WITH b.typeBillet=tb.id
            LEFT JOIN AppBundle:Evenement evt WITH evt.id=b.evenement
            WHERE evt.id= :idEvent
            ORDER BY b.id DESC
            ')
                ->setParameter('idEvent', $event->getId());
        } else {
            $identifiant = trim($request->request->has('identifiant'));
            $type_billet = $request->request->has('identifiant');
            $est_vendu = $request->request->has('identifiant');
            return $this->getEntityManager()->createQuery('SELECT b.id as id,b.place_id as place_id,b.identifiant as identifiant,b.estVendu as est_vendu, tb.libelle as libelle, b.prix as prix
            from AppBundle:Billet b
            JOIN AppBundle:TypeBillet tb WITH b.typeBillet=tb.id
            LEFT JOIN AppBundle:Evenement evt WITH evt.id=b.evenement
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
    public function getTicketsToBuy($event_id, $nbr, $type_billet, $updateBillet = false)
    {
        $rs = $queryBillet = $this->getEntityManager()->createQuery('SELECT b.id,b.identifiant,b.prix,b.place_id,tb.libelle FROM AppBundle:Billet b 
JOIN AppBundle:Evenement e WITH e.id=b.evenement 
JOIN AppBundle:Typebillet tb WITH tb.id=b.typeBillet 
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
        return $rs;
    }

}
