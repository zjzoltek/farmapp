CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `livestockmanagementschema`.`pasture_view` AS
    SELECT 
        `livestockmanagementschema`.`pastures`.`pasture_id` AS `pasture_id`,
        `livestockmanagementschema`.`pastures`.`nickname` AS `nickname`,
        `livestockmanagementschema`.`pastures`.`notes` AS `notes`
    FROM
        (`livestockmanagementschema`.`pastures`
        JOIN `livestockmanagementschema`.`users`)
    WHERE
        (`livestockmanagementschema`.`pastures`.`owner_id` = `livestockmanagementschema`.`users`.`user_id`)