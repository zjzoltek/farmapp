CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `bull_calf_view` AS
    SELECT 
        `calves_view`.`sired_id` AS `sired_id`,
        `calves_view`.`cow_id` AS `cow_id`,
        `calves_view`.`calf_id` AS `calf_id`,
        `calves_view`.`calf_subtype` AS `calf_subtype`,
        `calves_view`.`vaccine_complete` AS `vaccine_complete`,
        `calves_view`.`water_complete` AS `water_complete`,
        `calves_view`.`feeder_complete` AS `feeder_complete`
    FROM
        `calves_view`
    WHERE
        ((`calves_view`.`calf_subtype` = 'B')
            OR (`calves_view`.`calf_subtype` = 'S'))