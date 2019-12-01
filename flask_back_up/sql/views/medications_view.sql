CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `livestockmanagementschema`.`medications_view` AS
    SELECT 
        `livestockmanagementschema`.`medication`.`livestock_id` AS `livestock_id`,
        `livestock_view`.`sub_type` AS `sub_type`,
        `livestockmanagementschema`.`medication`.`med_id` AS `med_id`,
        `livestockmanagementschema`.`medication`.`medication_name` AS `medication_name`,
        `livestockmanagementschema`.`medication`.`start_date` AS `start_date`,
        `livestockmanagementschema`.`medication`.`end_date` AS `end_date`,
        `livestockmanagementschema`.`medication`.`med_interval` AS `med_interval`
    FROM
        (`livestockmanagementschema`.`medication`
        JOIN `livestockmanagementschema`.`livestock_view`)
    WHERE
        (`livestockmanagementschema`.`medication`.`livestock_id` = `livestock_view`.`livestock_id`)