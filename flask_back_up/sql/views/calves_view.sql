CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `livestockmanagementschema`.`calves_view` AS
    SELECT 
        `livestockmanagementschema`.`calves`.`calf_id` AS `calf_id`,
        `livestockmanagementschema`.`calves`.`cow_id` AS `cow_id`,
        `livestockmanagementschema`.`calves`.`sired_id` AS `sired_id`,
        `livestockmanagementschema`.`calves`.`calf_subtype` AS `calf_subtype`,
        `livestockmanagementschema`.`calves`.`vaccine_complete` AS `vaccine_complete`,
        `livestockmanagementschema`.`calves`.`water_complete` AS `water_complete`,
        `livestockmanagementschema`.`calves`.`feeder_complete` AS `feeder_complete`
    FROM
        (`livestockmanagementschema`.`calves`
        JOIN `livestockmanagementschema`.`livestock_view`)
    WHERE
        (`livestockmanagementschema`.`calves`.`calf_id` = `livestock_view`.`livestock_id`)