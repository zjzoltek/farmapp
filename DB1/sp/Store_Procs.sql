DELIMITER //
CREATE PROCEDURE Get_User_info(
	IN param_user_id INT
)
BEGIN
	SELECT first_name 
		,last_name 
        ,address 
        ,zip_code 
        ,phone_num 
        ,email
        FROM Users
        WHERE user_id = param_user_id;
END//

DELIMITER //
CREATE PROCEDURE Get_User_id(
	IN param_First_Name VARCHAR(30),
    IN param_Last_Name VARCHAR(30),
    IN param_email VARCHAR(244)
)
BEGIN
	SELECT user_id FROM Users WHERE first_name = param_First_Name AND last_name = param_Last_Name AND email = param_email;
END//

DELIMITER //
create PROCEDURE Get_Pasture_Notes(
IN selected_pasture_id INT 
)
BEGIN
	select notes from pasture_view where pasture_id = selected_pasture_id;
END//

DELIMITER //
create procedure Insert_Pasture_Note(
IN selected_pasture_id INT,
IN new_note text)
BEGIN
	update pastures
    set notes = notes + '; ' + new_notes
    where pasture_id = selected_pasture_id;
END//

DELIMITER //
create procedure Insert_new_pasture(
	IN param_nickname VARCHAR(244),
    IN param_owner_id INT, 
    IN param_notes TEXT)
BEGIN
	IF param_nickname = '' THEN SET param_nickname = 'No nickname'; END iF;
    INSERT INTO pastures(nickname, owner_id, notes) VALUES( param_nickname, owner_id, param_notes);
END//

DELIMITER //
create procedure Delete_pasture(
 IN param_pasture_id INT
)
BEGIN
	DELETE FROM pastures WHERE pasture_id = param_pasture_id;
END//

DELIMITER //
create procedure Get_all_pastures(
	IN param_ownerID INT
)
BEGIN
	SELECT nickname, pasture_id FROM pastures WHERE owner_id =  param_ownerID;
END //

DELIMITER //    
create procedure insert_new_maintenance_item(
	IN param_Location INT,
    IN param_maintenance_type INT,
    IN param_cost REAL(9, 2),
    IN param_notes TEXT
)
BEGIN
	INSERT INTO pasture_maintenance(location, maintenance_type, cost, notes) 
    VALUES (param_Location, param_maintenance_type, param_cost, param_notes);
END//

DELIMITER //
create procedure Get_all_maintenance_items(
	IN param_Location INT
)
BEGIN
	SELECT maintenance_type, cost, notes FROM pasture_maintenance WHERE location = param_Location;
END //

DELIMITER //
create procedure Get_total_maintenance_cost(
	IN param_Location INT
)
BEGIN
	SELECT SUM(cost) FROM pasture_maintenance_view WHERE location = param_Location;
END //

DELIMITER //
create procedure Get_All_Livestock(
 IN param_owner_id INT
)
BEGIN
	SELECT livestock_id
		, born_date
        , sub_type
        , health_status
        , weight
        , location
        , market_date
		, goal_sale_price
        , sale_price
	FROM livestock
    WHERE owner_id = param_owner_id;
END//

DELIMITER //
create procedure Insert_new_livestock_Record(
IN param_owner_id INT, 
IN param_born_date DATE,
IN param_sub_type VARCHAR(244),
IN param_health_status CHAR,
IN param_notes TEXT, 
IN param_weight REAL(6,1), 
IN param_market_date DATE,
IN param_goal_sale_price REAL(5,1),
IN param_sale_price REAL(5,1),
IN param_location INT)
BEGIN
	INSERT INTO livestock(owner_id, born_date, sub_type, health_status, notes, weight, market_date, goal_sale_price, sale_price, location)
	VALUES(param_owner_id, param_born_date, param_sub_type, param_health_status, param_notes, param_weight, param_market_date, param_goal_sale_price, param_sale_price, param_location);
END //

DELIMITER //
create procedure Delete_livestock_Record(
IN param_livestock_id INT)
BEGIN
	DELETE FROM livestock WHERE livestock_id = param_livestock_id;
END //

DELIMITER //
create procedure Get_ALL_Medication_Records(
IN param_Livestock_id INT)
BEGIN
SELECT med_id
,medication_name
, start_date
, end_date
, med_interval
FROM medication
WHERE livestock_id = param_Livestock_id;
END //

DELIMITER //
create procedure Insert_new_Medication_Record(
IN param_Livestock_id INT
, IN param_medication_name VARCHAR(244)
, IN param_start_date Date
, IN param_end_date Date
, IN param_med_interval TEXT)
BEGIN
INSERT INTO medication(livestock_id, medication_name, start_date, end_date, med_interval)
VALUES(param_Livestock_id, param_medication_name, param_start_date, param_end_date, param_med_interval);
END//

DELIMITER //
create procedure Delete_Medication_Record(
IN param_medication_id INT)
BEGIN
	DELETE FROM medication WHERE med_id = param_medication_id;
END //

DELIMITER //
create procedure Get_all_Vaccination_Records(
IN param_livestock_id int)
BEGIN
	SELECT vacc_id
    , vac_type
    , date_given
    FROM vaccinations WHERE animal_id = param_livestock_id;
END //

DELIMITER //
create procedure Insert_new_Vaccination_Record(
IN param_livestock_id int,
IN param_vacc_type VARCHAR(244),
IN param_date_given DATE)
BEGIN
	INSERT INTO vaccinations(animal_id, vac_type, date_given)VALUES(param_livestock_id, param_vacc_type, param_date_given );
END//

DELIMITER //
create procedure Delete_Vaccination_Record(
IN param_vacc_id INT)
BEGIN
	DELETE FROM vaccinations WHERE vacc_id = param_vacc_id;
END//

DELIMITER //
create procedure Get_all_vetvisits_records(
IN param_livestock_id INT)
BEGIN
	SELECT visit_id
    , visit_date
    , vet_name
    , cost
    , reason
    , notes
    FROM vetvisit WHERE livestock_id = param_livestock_id;
END //

DELIMITER //
create procedure Insert_new_VetVist_Record(
IN param_livestock_id INT,
IN param_visit_date DATETIME, 
IN param_vet_name VARCHAR(244), 
IN param_cost REAL(9,2), 
IN param_reason VARCHAR(244), 
IN param_notes TEXT)
BEGIN
	INSERT INTO vetvisit(livestock_id, visit_date, vet_name, cost, reason, notes)
    VALUES(param_livestock_id, param_visit_date, param_vet_name, param_cost, param_reason, param_notes);
END //

DELIMITER //
create procedure Delete_VetVisit_Record(
IN param_visit_id INT)
BEGIN
	DELETE FROM vetvisit WHERE visit_id = param_visit_id;
END //