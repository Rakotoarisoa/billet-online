<?php


namespace AppBundle\Repository;


use Doctrine\ORM\EntityRepository;

class CategorieEvenementRepository extends EntityRepository
{
    /** @function searchUsedCategories
     */
    public function searchUsedCategories()
    {
        return $this->getEntityManager()
            ->createQuery('SELECT cat.libelle FROM AppBundle:CategorieEvenement cat
            LEFT JOIN AppBundle:Evenement evt WITH cat.id=evt.categorieEvenement
           WHERE evt.isPublished = 1 GROUP BY cat.libelle')
            ->getResult();
    }
}