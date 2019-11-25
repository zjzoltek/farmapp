USE livestockmanagement;

CREATE TABLE Users(
	user_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    user_type VARCHAR(30) NOT NULL,
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL,
    address VARCHAR(244) NOT NULL,
    zip_code INT,
    phone_num INT,
    email VARCHAR(244),
    PRIMARY KEY (user_id)
);

CREATE TABLE Pastures(
	nickname VARCHAR(244),
    pasture_id INT NOT NULL AUTO_INCREMENT UNIQUE, 
    owner_id INT NOT NULL, 
    notes 	TEXT,
	PRIMARY KEY(pasture_id),
    FOREIGN KEY(owner_id) REFERENCES Users(user_id)
);

CREATE TABLE Pasture_Maintenance(
	pasture_id INT NOT NULL,
    maintainance_id INT NOT NULL UNIQUE AUTO_INCREMENT,
    pasture_type VARCHAR(255),
    cost REAL(9,2),
    note  TEXT,
    PRIMARY KEY(maintainance_id),
    FOREIGN KEY(pasture_id) REFERENCES Pastures(pasture_id)
); 

CREATE TABLE livestock(
	livestock_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    owner_id INT NOT NULL, 
    born_date MEDIUMTEXT NULL,
    sub_type VARCHAR(244),
    health_status CHAR,
    notes TEXT NULL, 
    weight REAL(5,1), 
    market_date DATETIME,
    goal_sale_price REAL(5,1),
    sale_price REAL(5,1),
    location INT NOT NULL,
    PRIMARY KEY (livestock_id),
	FOREIGN KEY(owner_id) REFERENCES Users(user_id),
    FOREIGN KEY(location) REFERENCES Pastures(pasture_id)
);

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

CREATE TABLE Vaccinations(
	vacc_id INT NOT NULL AUTO_INCREMENT UNIQUE,
    animal_id INT NOT NULL,
    vac_type VARCHAR(255),
    date_given DATETIME,
    PRIMARY KEY(vacc_id),
    FOREIGN KEY(animal_id) REFERENCES Livestock(livestock_id)
);

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



