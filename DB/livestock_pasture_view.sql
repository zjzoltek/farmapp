CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `livestockmanagement`.`livestock_pasture_view` AS
    SELECT 
        `pasture_view`.`pasture_id` AS `pasture_id`,
        `pasture_view`.`nickname` AS `nickname`,
        `livestock_view`.`livestock_id` AS `livestock_id`,
        `livestock_view`.`sub_type` AS `sub_type`
    FROM
        (`livestockmanagement`.`pasture_view`
        JOIN `livestockmanagement`.`livestock_view`)
    WHERE
        (`pasture_view`.`pasture_id` = `livestock_view`.`location`)