USE livestockmanagement;

CREATE TABLE users(
	user_id INT NOT NULL AUTO_INCREMENT,
    user_type VARCHAR(30) NOT NULL,
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL,
    address VARCHAR(244) NOT NULL,
    zip_code INT,
    phone_num INT,
    email VARCHAR(244),
    PRIMARY KEY (user_id)
    );