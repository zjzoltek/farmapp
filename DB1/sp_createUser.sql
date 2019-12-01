
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `createUser`(
    IN p_first_name VARCHAR(30),
    IN p_last_name VARCHAR(30),
    IN p_email VARCHAR(244),
    IN p_address VARCHAR(244),
    IN p_zip_code INT,
    IN p_phone_num INT,
    IN passwd VARCHAR(44)
)
BEGIN
    if ( select exists (select 1 from users where email = p_email) ) THEN
     
        select 'Username Exists !!';
     
    ELSE
        insert into users
        (
            user_type,
            first_name,
            last_name,
            address,
            zip_code,
            phone_num,
            email,
            passwd_hash
        )
        values
        (
            "reg_usr",
            p_first_name,
            p_last_name,
            p_address,
            p_zip_code,
            p_phone_num,
            p_email,
            passwd
        );
     
    END IF;
END$$
DELIMITER ;
    