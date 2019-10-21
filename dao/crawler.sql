use crawler;
-- -----------------------------------------------------
-- Table `crawler`.`product_c`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `crawler`.`product_c` (
  `id` BIGINT(20) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `link` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subTitle` VARCHAR(255) NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  `price` FLOAT(10) NOT NULL,
  `discount` FLOAT(10) NOT NULL,
  `originPrice` FLOAT(10) NOT NULL,
  `store` VARCHAR(50) NOT NULL,
  `barcode` BIGINT(20) NULL,
  INDEX `category` (`link` ASC),
  INDEX `title` (`title` ASC),
  INDEX `subTitle` (`title` ASC),
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;
ALTER TABLE product_c
MODIFY `id` VARCHAR(20);

CREATE TABLE IF NOT EXISTS `crawler`.`product_w` (
  `id` VARCHAR(20) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `link` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subTitle` VARCHAR(255) NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  `price` FLOAT(10) NOT NULL,
  `discount` FLOAT(10) NOT NULL,
  `originPrice` FLOAT(10) NOT NULL,
  `store` VARCHAR(50) NOT NULL,
  `barcode` BIGINT(20) NULL,
  INDEX `category` (`link` ASC),
  INDEX `title` (`title` ASC),
  INDEX `subTitle` (`title` ASC),
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `crawler`.`product_b` (
  `id` VARCHAR(20) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `link` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subTitle` VARCHAR(255) NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  `price` FLOAT(10) NOT NULL,
  `discount` FLOAT(10) NOT NULL,
  `originPrice` FLOAT(10) NOT NULL,
  `store` VARCHAR(50) NOT NULL,
  `barcode` BIGINT(20) NULL,
  INDEX `category` (`link` ASC),
  INDEX `title` (`title` ASC),
  INDEX `subTitle` (`title` ASC),
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `crawler`.`product_co` (
  `id` VARCHAR(20) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `link` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subTitle` VARCHAR(255) NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  `price` FLOAT(10) NOT NULL,
  `discount` FLOAT(10) NOT NULL,
  `originPrice` FLOAT(10) NOT NULL,
  `store` VARCHAR(50) NOT NULL,
  `barcode` BIGINT(20) NULL,
  INDEX `category` (`link` ASC),
  INDEX `title` (`title` ASC),
  INDEX `subTitle` (`title` ASC),
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


CREATE TABLE IF NOT EXISTS `crawler`.`product_p` (
  `id` VARCHAR(20) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `link` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subTitle` VARCHAR(255) NOT NULL,
  `img` VARCHAR(255) NOT NULL,
  `price` FLOAT(10) NOT NULL,
  `discount` FLOAT(10) NOT NULL,
  `originPrice` FLOAT(10) NOT NULL,
  `store` VARCHAR(50) NOT NULL,
  `barcode` BIGINT(20) NULL,
  INDEX `category` (`link` ASC),
  INDEX `title` (`title` ASC),
  INDEX `subTitle` (`title` ASC),
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `crawler`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `crawler`.`user` (
  `id` INT(50) NOT NULL AUTO_INCREMENT,
  `provider` VARCHAR(50) NULL DEFAULT NULL,
  `name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `token` VARCHAR(100) NOT NULL,
  `token_expired` VARCHAR(100) NOT NULL,
  `picture` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `user` (`provider` ASC, `email` ASC, `password` ASC),
  INDEX `token` (`token` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci; 



-- -----------------------------------------------------
-- Table `crawler`.`wishlist`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `crawler`.`wishlist` (
  `id` INT(50) NOT NULL AUTO_INCREMENT,
  `user_id` INT(50) NOT NULL,
  `product_id` VARCHAR(20) NOT NULL,
  `store` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_wishlist_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_wishlist_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `crawler`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `crawler`.`tracklist`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `crawler`.`tracklist` (
  `id` INT(50) NOT NULL AUTO_INCREMENT,
  `user_id` INT(50) NOT NULL,
  `product_id` VARCHAR(20) NOT NULL,
  `store` VARCHAR(45) NOT NULL,
  `price` FLOAT(10) NOT NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_tracklist_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_tracklist_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `crawler`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `crawler`.`error`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `crawler`.`error` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;
