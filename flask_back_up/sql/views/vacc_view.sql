CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `livestockmanagementschema`.`vacc_view` AS
    SELECT 
        `livestockmanagementschema`.`vaccinations`.`vacc_id` AS `vacc_id`,
        `livestockmanagementschema`.`vaccinations`.`animal_id` AS `animal_id`,
        `livestockmanagementschema`.`vaccinations`.`vac_type` AS `vac_type`,
        `livestockmanagementschema`.`vaccinations`.`date_given` AS `date_given`
    FROM
        (`livestockmanagementschema`.`vaccinations`
        JOIN `livestockmanagementschema`.`livestock_view`)
    WHERE
        (`livestockmanagementschema`.`vaccinations`.`animal_id` = `livestock_view`.`livestock_id`)