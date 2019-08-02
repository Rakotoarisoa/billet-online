<?php


namespace AppBundle\DataFixtures;


use AppBundle\Entity\User;
use Doctrine\Common\Persistence\ObjectManager;

class UserFixture extends BaseFixture
{
    public function loadData(ObjectManager $manager)
    {
        $this->createMany(User::class, 10, function(User $user,$count) {
        $user->setNom($this->faker->firstName);
        $user->setUsername($this->faker->userName);
        $user->setUsernameCanonical($this->faker->userName);
        $user->setEmail($this->faker->freeEmail);
        $user->setPrenom($this->faker->firstName);
        $user->setLastLogin(new \DateTime());
        $user->setDateDeNaissance(new \DateTime());
        $user->setPassword($this->faker->password);
        $user->setAdresse($this->faker->address);
        $user->setMobilePhone($this->faker->phoneNumber);
        $user->setPhone($this->faker->phoneNumber);
        $user->setSexe($this->faker->randomElement(array('M','F')));
        $user->setPays($this->faker->country);
        $user->setCodePostal($this->faker->postCode);
        $user->setRegion($this->faker->name);
        $user->setWebsite($this->faker->domainName);
        $user->setBlog($this->faker->domainName);
        $user->setImage($this->faker->imageUrl($width = 640, $height = 480));
            $user->setrole('Guest');

        });
        $manager->flush();
    }
}