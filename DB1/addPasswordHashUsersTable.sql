# ALTER TABLE users DROP passwd_hash;
ALTER TABLE users
ADD COLUMN passwd_hash CHAR(95) NOT NULL AFTER email;
