CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `livestockmanagement`.`pasture_view` AS
    SELECT 
        `livestockmanagement`.`pastures`.`pasture_id` AS `pasture_id`,
        `livestockmanagement`.`pastures`.`nickname` AS `nickname`,
        `livestockmanagement`.`pastures`.`notes` AS `notes`
    FROM
        (`livestockmanagement`.`pastures`
        JOIN `livestockmanagement`.`users`)
    WHERE
        (`livestockmanagement`.`pastures`.`owner_id` = `livestockmanagement`.`users`.`user_id`)