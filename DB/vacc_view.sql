CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `livestockmanagement`.`vacc_view` AS
    SELECT 
        `livestockmanagement`.`vaccinations`.`vacc_id` AS `vacc_id`,
        `livestockmanagement`.`vaccinations`.`animal_id` AS `animal_id`,
        `livestockmanagement`.`vaccinations`.`vac_type` AS `vac_type`,
        `livestockmanagement`.`vaccinations`.`date_given` AS `date_given`
    FROM
        (`livestockmanagement`.`vaccinations`
        JOIN `livestockmanagement`.`livestock_view`)
    WHERE
        (`livestockmanagement`.`vaccinations`.`animal_id` = `livestock_view`.`livestock_id`)