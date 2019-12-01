USE livestockmanagementschema;

CREATE TABLE Users(
	user_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    user_type VARCHAR(30) NOT NULL,
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL,
    address VARCHAR(244) NOT NULL,
    zip_code INT,
    phone_num INT,
    email VARCHAR(244),
    passwd_hash CHAR(44) NOT NULL,
    PRIMARY KEY (user_id)
);

INSERT INTO Users(user_id, user_type, first_name, last_name, address, zip_code, phone_num, email, passwd_hash)
VALUES(1, 'reg_usr', 'Bob', 'Dunlap', '1239 E 117th, FarmVille MO', 64004, 816-666-7777, 'bobsFarm@email.com', 'pbkdf2:sha256:150000$EoL3AeBB$fa87532fd3358ed3c2a6168f5ef75352525d86a3edc46523bdf520a638056737');

CREATE TABLE Pastures(
	nickname VARCHAR(244),
    pasture_id INT NOT NULL AUTO_INCREMENT UNIQUE, 
    owner_id INT NOT NULL, 
    notes 	TEXT,
	PRIMARY KEY(pasture_id),
    FOREIGN KEY(owner_id) REFERENCES Users(user_id)
);

INSERT INTO Pastures(nickname, pasture_id, owner_id, notes)
VALUES('East Pasture', 1, 1, 'For Cattle');
INSERT INTO Pastures(nickname, pasture_id, owner_id, notes)
VALUES('South Pasture', 2, 1, 'For Cattle');

CREATE TABLE Pasture_Maintenance(
	maintenance_id INT NOT NULL AUTO_INCREMENT UNIQUE, 
    location INT NOT NULL, 
    maintenance_type INT NOT NULL, 
    cost REAL(9,2), 
    notes TEXT, 
    PRIMARY KEY(maintenance_id), 
    FOREIGN KEY(location) REFERENCES Pastures(pasture_id)
    );
    
INSERT INTO Pasture_Maintenance(maintenance_id,location, maintenance_type, cost, notes)
VALUES(1, 1, 3, 24375,'Annual Care');
 
CREATE TABLE livestock(
	livestock_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    owner_id INT NOT NULL, 
    born_date DATE NULL,
    sub_type VARCHAR(244),
    health_status CHAR,
    notes TEXT NULL, 
    weight REAL(6,1), 
    market_date DATE,
    goal_sale_price REAL(5,1),
    sale_price REAL(5,1),
    location INT NOT NULL,
    PRIMARY KEY (livestock_id),
	FOREIGN KEY(owner_id) REFERENCES Users(user_id),
    FOREIGN KEY(location) REFERENCES Pastures(pasture_id)
);

ALTER TABLE livestock MODIFY weight REAL(6,1);

INSERT INTO livestock(livestock_id, owner_id, born_date, sub_type, health_status, notes, weight, market_date, goal_sale_price, sale_price, location)
VALUES(77, 1, '2019-10-10','calf', 'H', NULL, 2820, '2020-06-20', 1000, NULL, 1);
INSERT INTO livestock(livestock_id, owner_id, born_date, sub_type, health_status, notes, weight, market_date, goal_sale_price, sale_price, location)
VALUES(68, 1, '2019-09-22','calf', 'H', NULL, 200, '2020-06-20', 1000, NULL, 1);
INSERT INTO livestock(livestock_id, owner_id, born_date, sub_type, health_status, notes, weight, market_date, goal_sale_price, sale_price, location)
VALUES(21, 1, '2016-10-10','cow', 'H', NULL, 19730, NULL, 3000, NULL, 1);
INSERT INTO livestock(livestock_id, owner_id, born_date, sub_type, health_status, notes, weight, market_date, goal_sale_price, sale_price, location)
VALUES(23, 1, '2016-09-11','cow', 'H', NULL, 1770, NULL, 3000, NULL, 1);
INSERT INTO livestock(livestock_id, owner_id, born_date, sub_type, health_status, notes, weight, market_date, goal_sale_price, sale_price, location)
VALUES(99, 1, '2017-01-06','bull', 'M', NULL, 21500, NULL , 1000, NULL, 1);
INSERT INTO livestock(livestock_id, owner_id, born_date, sub_type, health_status, notes, weight, market_date, goal_sale_price, sale_price, location)
VALUES(24, 1, '2017-4-28','cow', 'H', NULL, 1700, NULL, 2000, NULL, 2);
INSERT INTO livestock(livestock_id, owner_id, born_date, sub_type, health_status, notes, weight, market_date, goal_sale_price, sale_price, location)
VALUES(26, 1, '2019-04-15','cow', 'H', NULL, 1750, '2020-06-20', 2000, NULL, 2);
INSERT INTO livestock(livestock_id, owner_id, born_date, sub_type, health_status, notes, weight, market_date, goal_sale_price, sale_price, location)
VALUES(30, 1, '2017-05-13','cow', 'H', NULL, 1600, NULL , 2000, NULL, 2);


CREATE TABLE Calves(
	calf_id INT NOT NULL, 
    cow_id INT NULL, 
    sired_id INT NULL,
    calf_subtype VARCHAR(244), 
    vaccine_complete BOOLEAN,
    water_complete BOOLEAN,
    feeder_complete BOOLEAN,
	FOREIGN KEY(calf_id) REFERENCES Livestock(livestock_id)
);

INSERT INTO Calves(calf_id, cow_id, sired_id, calf_subtype, vaccine_complete, water_complete, feeder_complete)
VALUES(77, 21, 99, 'B', TRUE, TRUE, FALSE);
INSERT INTO Calves(calf_id, cow_id, sired_id, calf_subtype, vaccine_complete, water_complete, feeder_complete)
VALUES(68, 23, 99, 'H', TRUE, TRUE, FALSE);

CREATE TABLE Vaccinations(
	vacc_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    animal_id INT NOT NULL,
    vac_type VARCHAR(244),
    date_given DATE,
    PRIMARY KEY(vacc_id),
    FOREIGN KEY(animal_id) REFERENCES Livestock(livestock_id)
);
ALTER TABLE Vaccinations MODIFY vac_type VARCHAR(244);
ALTER TABLE Vaccinations MODIFY date_given DATE;

INSERT INTO Vaccinations(vacc_id, animal_id, vac_type, date_given)
VALUES(22, 77, 'IBR', '2019-11-12');
INSERT INTO Vaccinations(vacc_id, animal_id, vac_type, date_given)
VALUES(23, 77, 'BVD', '2019-11-12');
INSERT INTO Vaccinations(vacc_id, animal_id, vac_type, date_given)
VALUES(24, 77, 'BRSV', '2019-11-12');
INSERT INTO Vaccinations(vacc_id, animal_id, vac_type, date_given)
VALUES(25, 77, 'P13', '2019-11-12');
INSERT INTO Vaccinations(vacc_id, animal_id, vac_type, date_given)
VALUES(26, 77, 'LEPT', '2019-11-12');
INSERT INTO Vaccinations(vacc_id, animal_id, vac_type, date_given)
VALUES(27, 77, 'VIBR', '2019-11-12');
INSERT INTO Vaccinations(vacc_id, animal_id, vac_type, date_given)
VALUES(28, 77, 'CLOST', '2019-11-12');
INSERT INTO Vaccinations(vacc_id, animal_id, vac_type, date_given)
VALUES(29, 77, 'BRUC', '2019-11-12');

CREATE TABLE Medication(
	livestock_id INT NOT NULL,
    med_id REAL NOT NULL AUTO_INCREMENT UNIQUE,
	medication_name VARCHAR(244) NOT NULL,
    start_date DATE NOT NULL, 
    end_date DATE NOT NULL,
    med_interval TEXT,
    PRIMARY KEY(med_id),
    FOREIGN KEY(livestock_id) REFERENCES Livestock(livestock_id)
);

INSERT INTO Medication(livestock_id, med_id, medication_name, start_date, end_date, med_interval)
VALUES(99, 41, 'Penicillin', '2019-11-07', '2019-11-30', '48 hrs');

CREATE TABLE VetVisit(
	livestock_id INT NOT NULL,
    visit_date DATETIME NOT NULL, 
    visit_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    vet_name VARCHAR(244), 
    cost REAL(9,2), 
    reason VARCHAR(244), 
    notes TEXT,
    PRIMARY KEY(visit_id),
    FOREIGN KEY(livestock_id) REFERENCES Livestock(livestock_id)
);

INSERT INTO VetVisit(livestock_id, visit_date, visit_id, vet_name, cost, reason, notes)
VALUES(77, '2019-11-12', 12, 'Will Smith', '38950', 'vaccinatins', 'Annual');
INSERT INTO VetVisit(livestock_id, visit_date, visit_id, vet_name, cost, reason, notes)
VALUES(99, '2019-11-07', 04, 'Will Smith', '11050', 'checkup', 'Unexpected');

SELECT * FROM bull_calf_view;
SELECT * FROM calves_view;
SELECT * FROM cow_calf_view;
SELECT * FROM livestock_pasture_view;
SELECT * FROM livestock_view;
SELECT * FROM medications_view;
SELECT * FROM pasture_maintenance_view;
SELECT * FROM pasture_view;
SELECT * FROM vacc_view;
SELECT * FROM vet_visit_view;




