<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20190619060812 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE billet (id INT AUTO_INCREMENT NOT NULL, id_billet INT DEFAULT NULL, place_id INT DEFAULT NULL, identifiant VARCHAR(100) NOT NULL, prix NUMERIC(10, 2) NOT NULL, INDEX IDX_1F034AF63934FF1B (id_billet), UNIQUE INDEX UNIQ_1F034AF6DA6A219 (place_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE categorieEvenement (id INT AUTO_INCREMENT NOT NULL, libelle VARCHAR(100) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE evenement (id INT AUTO_INCREMENT NOT NULL, id_categorie_evt INT DEFAULT NULL, id_user INT DEFAULT NULL, id_lieu_evt INT DEFAULT NULL, titre_evenement VARCHAR(100) NOT NULL, date_debut_event DATETIME NOT NULL, date_fin_event VARCHAR(100) NOT NULL, statut VARCHAR(50) NOT NULL, image_event VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, INDEX IDX_B26681EFCFABE8 (id_categorie_evt), INDEX IDX_B26681E6B3CA4B (id_user), INDEX IDX_B26681E36E70302 (id_lieu_evt), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE lieuEvenement (id INT AUTO_INCREMENT NOT NULL, adresse VARCHAR(255) NOT NULL, pays VARCHAR(255) NOT NULL, code_postal VARCHAR(25) NOT NULL, nom_salle VARCHAR(255) NOT NULL, capacite INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE place (id INT AUTO_INCREMENT NOT NULL, id_reservation INT DEFAULT NULL, billet_id INT DEFAULT NULL, identifiant VARCHAR(100) NOT NULL, INDEX IDX_741D53CD5ADA84A2 (id_reservation), UNIQUE INDEX UNIQ_741D53CD44973C78 (billet_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reservation (id INT AUTO_INCREMENT NOT NULL, id_reservation INT DEFAULT NULL, nom_reservation VARCHAR(100) NOT NULL, date_reservation DATETIME NOT NULL, mode_paiement VARCHAR(100) NOT NULL, montant_total NUMERIC(10, 2) NOT NULL, INDEX IDX_42C849555ADA84A2 (id_reservation), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE typeBillet (id INT AUTO_INCREMENT NOT NULL, libelle VARCHAR(100) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(180) NOT NULL, username_canonical VARCHAR(180) NOT NULL, email VARCHAR(180) NOT NULL, email_canonical VARCHAR(180) NOT NULL, enabled TINYINT(1) NOT NULL, salt VARCHAR(255) DEFAULT NULL, password VARCHAR(255) NOT NULL, last_login DATETIME DEFAULT NULL, confirmation_token VARCHAR(180) DEFAULT NULL, password_requested_at DATETIME DEFAULT NULL, nom VARCHAR(100) NOT NULL, prenom VARCHAR(100) NOT NULL, adresse VARCHAR(100) NOT NULL, mobile_phone VARCHAR(100) NOT NULL, phone VARCHAR(100) NOT NULL, sexe VARCHAR(1) NOT NULL, date_de_naissance DATE NOT NULL, pays VARCHAR(100) NOT NULL, code_postal VARCHAR(100) NOT NULL, region VARCHAR(100) NOT NULL, website VARCHAR(250) NOT NULL, blog VARCHAR(255) NOT NULL, image VARCHAR(255) NOT NULL, date_enregistrement DATETIME NOT NULL, role VARCHAR(50) NOT NULL, UNIQUE INDEX UNIQ_1483A5E992FC23A8 (username_canonical), UNIQUE INDEX UNIQ_1483A5E9A0D96FBF (email_canonical), UNIQUE INDEX UNIQ_1483A5E9C05FB297 (confirmation_token), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE billet ADD CONSTRAINT FK_1F034AF63934FF1B FOREIGN KEY (id_billet) REFERENCES typeBillet (id)');
        $this->addSql('ALTER TABLE billet ADD CONSTRAINT FK_1F034AF6DA6A219 FOREIGN KEY (place_id) REFERENCES place (id)');
        $this->addSql('ALTER TABLE evenement ADD CONSTRAINT FK_B26681EFCFABE8 FOREIGN KEY (id_categorie_evt) REFERENCES categorieEvenement (id)');
        $this->addSql('ALTER TABLE evenement ADD CONSTRAINT FK_B26681E6B3CA4B FOREIGN KEY (id_user) REFERENCES users (id)');
        $this->addSql('ALTER TABLE evenement ADD CONSTRAINT FK_B26681E36E70302 FOREIGN KEY (id_lieu_evt) REFERENCES lieuEvenement (id)');
        $this->addSql('ALTER TABLE place ADD CONSTRAINT FK_741D53CD5ADA84A2 FOREIGN KEY (id_reservation) REFERENCES reservation (id)');
        $this->addSql('ALTER TABLE place ADD CONSTRAINT FK_741D53CD44973C78 FOREIGN KEY (billet_id) REFERENCES billet (id)');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C849555ADA84A2 FOREIGN KEY (id_reservation) REFERENCES evenement (id)');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE place DROP FOREIGN KEY FK_741D53CD44973C78');
        $this->addSql('ALTER TABLE evenement DROP FOREIGN KEY FK_B26681EFCFABE8');
        $this->addSql('ALTER TABLE reservation DROP FOREIGN KEY FK_42C849555ADA84A2');
        $this->addSql('ALTER TABLE evenement DROP FOREIGN KEY FK_B26681E36E70302');
        $this->addSql('ALTER TABLE billet DROP FOREIGN KEY FK_1F034AF6DA6A219');
        $this->addSql('ALTER TABLE place DROP FOREIGN KEY FK_741D53CD5ADA84A2');
        $this->addSql('ALTER TABLE billet DROP FOREIGN KEY FK_1F034AF63934FF1B');
        $this->addSql('ALTER TABLE evenement DROP FOREIGN KEY FK_B26681E6B3CA4B');
        $this->addSql('DROP TABLE billet');
        $this->addSql('DROP TABLE categorieEvenement');
        $this->addSql('DROP TABLE evenement');
        $this->addSql('DROP TABLE lieuEvenement');
        $this->addSql('DROP TABLE place');
        $this->addSql('DROP TABLE reservation');
        $this->addSql('DROP TABLE typeBillet');
        $this->addSql('DROP TABLE users');
    }
}
