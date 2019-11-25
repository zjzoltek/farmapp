CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `livestockmanagement`.`calves_view` AS
    SELECT 
        `livestockmanagement`.`calves`.`calf_id` AS `calf_id`,
        `livestockmanagement`.`calves`.`cow_id` AS `cow_id`,
        `livestockmanagement`.`calves`.`sired_id` AS `sired_id`,
        `livestockmanagement`.`calves`.`calf_subtype` AS `calf_subtype`,
        `livestockmanagement`.`calves`.`vaccine_complete` AS `vaccine_complete`,
        `livestockmanagement`.`calves`.`water_complete` AS `water_complete`,
        `livestockmanagement`.`calves`.`feeder_complete` AS `feeder_complete`
    FROM
        (`livestockmanagement`.`calves`
        JOIN `livestockmanagement`.`livestock_view`)
    WHERE
        (`livestockmanagement`.`calves`.`calf_id` = `livestock_view`.`livestock_id`)