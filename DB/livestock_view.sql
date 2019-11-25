CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `livestockmanagement`.`livestock_view` AS
    SELECT 
        `livestockmanagement`.`livestock`.`livestock_id` AS `livestock_id`,
        `livestockmanagement`.`livestock`.`born_date` AS `born_date`,
        `livestockmanagement`.`livestock`.`sub_type` AS `sub_type`,
        `livestockmanagement`.`livestock`.`health_status` AS `health_status`,
        `livestockmanagement`.`livestock`.`weight` AS `weight`,
        `livestockmanagement`.`livestock`.`location` AS `location`,
        `livestockmanagement`.`livestock`.`market_date` AS `market_date`,
        `livestockmanagement`.`livestock`.`goal_sale_price` AS `goal_sale_price`,
        `livestockmanagement`.`livestock`.`sale_price` AS `sale_price`
    FROM
        (`livestockmanagement`.`livestock`
        JOIN `livestockmanagement`.`users`)
    WHERE
        (`livestockmanagement`.`livestock`.`owner_id` = `livestockmanagement`.`users`.`user_id`)