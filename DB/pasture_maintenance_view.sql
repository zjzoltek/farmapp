CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `livestockmanagement`.`pasture_maintenance_view` AS
    SELECT 
        `livestockmanagement`.`pasture_maintenance`.`pasture_id` AS `pasture_id`,
        `livestockmanagement`.`pasture_maintenance`.`maintainance_id` AS `maintainance_id`,
        `livestockmanagement`.`pasture_maintenance`.`pasture_type` AS `pasture_type`,
        `livestockmanagement`.`pasture_maintenance`.`cost` AS `cost`,
        `livestockmanagement`.`pasture_maintenance`.`note` AS `note`
    FROM
        (`livestockmanagement`.`pasture_maintenance`
        JOIN `livestockmanagement`.`pasture_view`)
    WHERE
        (`livestockmanagement`.`pasture_maintenance`.`pasture_id` = `pasture_view`.`pasture_id`)