CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `livestockmanagementschema`.`livestock_view` AS
    SELECT 
        `livestockmanagementschema`.`livestock`.`livestock_id` AS `livestock_id`,
        `livestockmanagementschema`.`livestock`.`born_date` AS `born_date`,
        `livestockmanagementschema`.`livestock`.`sub_type` AS `sub_type`,
        `livestockmanagementschema`.`livestock`.`health_status` AS `health_status`,
        `livestockmanagementschema`.`livestock`.`weight` AS `weight`,
        `livestockmanagementschema`.`livestock`.`location` AS `location`,
        `livestockmanagementschema`.`livestock`.`market_date` AS `market_date`,
        `livestockmanagementschema`.`livestock`.`goal_sale_price` AS `goal_sale_price`,
        `livestockmanagementschema`.`livestock`.`sale_price` AS `sale_price`
    FROM
        (`livestockmanagementschema`.`livestock`
        JOIN `livestockmanagementschema`.`users`)
    WHERE
        (`livestockmanagementschema`.`livestock`.`owner_id` = `livestockmanagementschema`.`users`.`user_id`)