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


select * from wishlist left join product_c on wishlist.product_id = product_c.id and wishlist.store = product_c.store left join product_b on wishlist.product_id = product_b.id and wishlist.store = product_b.store left join product_w on wishlist.product_id = product_w.id and wishlist.store = product_w.store;
select * from wishlist inner join product_b on wishlist.product_id = product_b.id and wishlist.store = product_b.store and user_id ='1';
select * from wishlist inner join product_w on wishlist.product_id = product_w.id and wishlist.store = product_w.store;
select * from wishlist inner join product_c on wishlist.product_id = product_c.id and wishlist.store = product_c.store;
USE crawler;
select * from product_c where id = '90716'; 
select * from product_w where category = "DEODORANT & TALC";  		
select * from product_p;
select * from wishlist;
select * from user;
select * from tracklist;
select count(*) as total from product_w  where title like '%carusos%' union all select count(*) as total from product_c  where title like '

DELETE FROM tracklist WHERE product_id = '819953' AND store = 'woolworths';
SET SQL_SAFE_UPDATES=0;
select * from product_b order by discount desc limit 0,500;
create table test (`id` varchar(10),`string` varchar(10));
select * from test;
insert into test(`id`,`string`) values ('600pk','w'),('600','c')

cenovis-guarana-2000-ginseng-500mg-60-tablets				
cenovis-guarana-2000mg-ginseng-500mg-60pk
cenovis%guarana%2000%amp%ginseng%500mg%60%tablets%   ok w & c7

SELECT `column` FROM `table` where `condition` like '%keyword%';
select * from `product_c` where find_in_set('cenovis,guarana,2000mg,ginseng,500mg,60pk',`title`);
SELECT * from `product_c` where locate('cenovis-guarana-2000mg-ginseng-500mg%60pk%',`subTitle`)>0;
select * from product_c where soundex(`subTitle`) = soundex('cenovis-guarana-2000mg-ginseng-500mg%60pk%'); 
select * from product_c where subTitle like 'cenovis%guarana%2000%amp%ginseng%500mg%60%tablets%' or subTitle like 'cenovis-guarana-2000mg-ginseng-500mg%' or id = '117843'; 
select * from product_c where subTitle like '%cenovis%guarana%';
select * from product_c where subTitle like '%cenovis%guarana%';


show variables like 'autocommit';

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


select * from product_w where subTitle like '%moisturiser%'; 
select count(*) as total from product_w where discount > 0 and price > 0 and category ='COSMETICS';
select * from product_w where discount >= price and price > 0;
select * from product_w where discount >= price and price > 0 and category ='DIET & SPORT NUTRITION';

select * from product_w where discount >= price and price > 0 limit 0,9;


CREATE TABLE IF NOT EXISTS `crawler`.`product_p` (
  `title` VARCHAR(255) NOT NULL,
  `discount` FLOAT(10) NOT NULL
)ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

select * from product_p;
SET SQL_SAFE_UPDATES=0;
update product_p set discount='10000' where title='Sukin Facial Moisturiser 125 mL';
delete from product_p where title='Freezeframe RevitalEYES 15 mL';
count(*) as total
SELECT * FROM product_c  WHERE subTitle like '%Moisturiser%' UNION ALL SELECT * FROM product_w WHERE subTitle like '%Moisturiser%' UNION ALL SELECT * FROM product_b WHERE subTitle like '%Moisturiser%' order by discount desc;
SELECT count(*) as totle FROM product_c  WHERE subTitle like '%moisturiser%' UNION ALL SELECT count(*) as totle FROM product_w WHERE subTitle like '%moisturiser%' UNION ALL SELECT count(*) as totle FROM product_b WHERE subTitle like '%moisturiser%';
select distinct category from product_w;


select count(*) as total from product_w  where title like '%carusos%' union all select count(*) as total from product_c  where title like '%carusos%' union all select count(*) as total from product_b where title like '%carusos%';
select * from product_w where title like '%carusos%';

SELECT * FROM tracklist inner join product_b on tracklist.product_id = product_b.id and tracklist.store = product_b.store and user_id ='1' UNION ALL SELECT * FROM tracklist inner join product_c on tracklist.product_id = product_c.id and tracklist.store = product_c.store and user_id ='1' UNION ALL SELECT * FROM tracklist inner join product_w on tracklist.product_id = product_w.id and tracklist.store = product_w.store and user_id ='1';