USE livestockmanagementschema;

CREATE TABLE Passwd(
    user_id INT NOT NULL UNIQUE,
    passwd CHAR(44) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);