CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `livestockmanagement`.`vet_visit_view` AS
    SELECT 
        `livestockmanagement`.`vetvisit`.`livestock_id` AS `livestock_id`,
        `livestock_view`.`sub_type` AS `sub_type`,
        `livestockmanagement`.`vetvisit`.`visit_date` AS `visit_date`,
        `livestockmanagement`.`vetvisit`.`vet_name` AS `vet_name`,
        `livestockmanagement`.`vetvisit`.`cost` AS `cost`,
        `livestockmanagement`.`vetvisit`.`reason` AS `reason`,
        `livestockmanagement`.`vetvisit`.`notes` AS `notes`
    FROM
        (`livestockmanagement`.`vetvisit`
        JOIN `livestockmanagement`.`livestock_view` ON ((`livestockmanagement`.`vetvisit`.`livestock_id` = `livestock_view`.`livestock_id`)))