CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `livestockmanagementschema`.`pasture_maintenance_view` AS
    SELECT 
        `livestockmanagementschema`.`pasture_maintenance`.`location` AS `location`,
        `livestockmanagementschema`.`pasture_maintenance`.`maintenance_id` AS `maintenance_id`,
        `livestockmanagementschema`.`pasture_maintenance`.`maintenance_type` AS `pasture_type`,
        `livestockmanagementschema`.`pasture_maintenance`.`cost` AS `cost`,
        `livestockmanagementschema`.`pasture_maintenance`.`notes` AS `notes`
    FROM
        (`livestockmanagementschema`.`pasture_maintenance`
        JOIN `livestockmanagementschema`.`pasture_view`)
    WHERE
        (`livestockmanagementschema`.`pasture_maintenance`.`location` = `pasture_view`.`pasture_id`)