use crawler;

-- -----------------------------------------------------
-- Table `test`.`product_c`
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
  INDEX `fk_wishlist_user_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_wishlist_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `crawler`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;
select * from wishlist inner join product_b on wishlist.product_id = product_b.id;

select * from product_c; 
select * from product_w; 		
select * from product_b;
select * from wishlist;
select * from user;


cenovis-guarana-2000-ginseng-500mg-60-tablets				
cenovis-guarana-2000mg-ginseng-500mg-60pk
117843  
select * from product_c where subTitle like '%cenovis%guarana%2000%ginseng%500%60%' or subTitle like 'cenovis-guarana-2000mg-ginseng-500mg%' or id = '117843'; 
select * from product_b where subTitle like '%cenovis%guarana%2000%ginseng%500%60%' or subTitle like 'cenovis-guarana-2000mg-ginseng-500mg%' or id = '117843'; 
select * from product_w where subTitle like '%cenovis%guarana%2000%ginseng%500%60%' or subTitle like 'cenovis-guarana-2000mg-ginseng-500mg%' or id = '117843'; 

HAIR CARE
ORAL CARE
DEODORANT & TALC
MEDICINAL
BABY - CARE
VITAMINS
SKIN CARE
SUN CARE
WOMENS HAIR REMOVAL
COSMETICS
DIET & SPORT NUTRITION
MENS TOILETRIES & RAZORS
PERSONAL WASH
FEMININE HYGIENE
HAIR COLOUR
HAIR ACCESSORIES
GIFTING
MISC GENERAL MERCHANDISE
DISINFECTANTS
BBQ
select * from user;
show tables;


select * from product_w where category ='MENS TOILETRIES & RAZORS'; 
select count(*) as total from product_w where discount > 0 and price > 0 and category ='COSMETICS';
select * from product_w where discount >= price and price > 0;
select * from product_w where discount >= price and price > 0 and category ='DIET & SPORT NUTRITION';

select * from product_w where discount >= price and price > 0 limit 0,9;