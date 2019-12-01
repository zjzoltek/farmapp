USING farmappdb;
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `validateLogin`(
IN p_username VARCHAR(20)
)
BEGIN
    select * from tbl_user where user_username = p_username;
END$$
DELIMITER ;