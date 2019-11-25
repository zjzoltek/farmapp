CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `livestockmanagement`.`cow_calf_view` AS
    SELECT 
        `livestock_view`.`livestock_id` AS `livestock_id`,
        `livestock_view`.`sub_type` AS `sub_type`,
        `livestockmanagement`.`calves`.`calf_id` AS `calf_id`,
        `livestockmanagement`.`calves`.`calf_subtype` AS `calf_subtype`
    FROM
        (`livestockmanagement`.`livestock_view`
        JOIN `livestockmanagement`.`calves`)
    WHERE
        (`livestock_view`.`livestock_id` = `livestockmanagement`.`calves`.`cow_id`)