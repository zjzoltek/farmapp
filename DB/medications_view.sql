CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `livestockmanagement`.`medications_view` AS
    SELECT 
        `livestockmanagement`.`medication`.`livestock_id` AS `livestock_id`,
        `livestock_view`.`sub_type` AS `sub_type`,
        `livestockmanagement`.`medication`.`med_id` AS `med_id`,
        `livestockmanagement`.`medication`.`medication_name` AS `medication_name`,
        `livestockmanagement`.`medication`.`start_date` AS `start_date`,
        `livestockmanagement`.`medication`.`end_date` AS `end_date`,
        `livestockmanagement`.`medication`.`med_interval` AS `med_interval`
    FROM
        (`livestockmanagement`.`medication`
        JOIN `livestockmanagement`.`livestock_view`)
    WHERE
        (`livestockmanagement`.`medication`.`livestock_id` = `livestock_view`.`livestock_id`)