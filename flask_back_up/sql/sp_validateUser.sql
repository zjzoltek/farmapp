
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `validateLogin`(
IN p_email VARCHAR(244)
)
BEGIN
    select * from users where email = p_email;
END$$
DELIMITER ;