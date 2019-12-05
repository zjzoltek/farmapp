from flask import Flask, render_template, request, json, redirect, session
from flaskext.mysql import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import yaml
import os

__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
# if this file isn't found then use the exampleconfig.yml and copy it to config.yml
with open(os.path.join(__location__, "config.yml"), 'r') as ymlfile:
    cfg = yaml.load(ymlfile)

app = Flask(__name__)
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = cfg['mysql']['user']
app.config['MYSQL_DATABASE_PASSWORD'] = cfg['mysql']['passwd']
app.config['MYSQL_DATABASE_DB'] = cfg['mysql']['db']
app.config['MYSQL_DATABASE_HOST'] = cfg['mysql']['host']
app.secret_key = cfg['other']['secret_key']
mysql.init_app(app)


@app.route("/")
def home():
    return render_template('home.html')

@app.route('/showSignUp')
def showSignUp():
    return render_template('signup.html')

@app.route('/signUp', methods=['POST'])
def signUp():
    conn = mysql.connect()
    cursor = conn.cursor()
    try:
        _first_name = request.form['inputFirstName']
        _last_name = request.form['inputLastName']
        _email = request.form['inputEmail']
        _address = request.form['inputAddress']
        _zipcode = request.form['inputZipcode']
        _phonenum = request.form['inputPhonenumber']
        _password = request.form['inputPassword']


        if _first_name and _last_name and _address and _email and _password:
            _hashed_password = generate_password_hash(str(_password))
            cursor.callproc('createUser', (_first_name, _last_name, _email, _address, int(_zipcode), int(_phonenum),  _hashed_password))
            data = cursor.fetchall()
            if len(data) is 0:
                conn.commit()
                return redirect('/showSignIn')
            else:
                return str(data[0])
        else:
            return json.dumps({'html':'<span>Enter the required fields</span>'})
    except Exception as e:
        return str(e)
    finally:
        cursor.close() 
        conn.close()

@app.route('/showSignIn')
def showSignin():
    return render_template('signin.html')

@app.route('/validateLogin', methods=['POST'])
def validateLogin():
    conn = mysql.connect()
    cursor = conn.cursor()
    try:
        _username = request.form['inputEmail']
        _password = request.form['inputPassword']
    # connect to mysql
        cursor.callproc('validateLogin',(_username,))
        data = cursor.fetchall()
        if len(data) > 0:
            if check_password_hash(str(data[0][8]),_password):
                session['user'] = data[0][0]
                return redirect('/userHome')
            else:
                return render_template('error.html',error = 'Wrong Email address or Password.')
        else:
            return render_template('error.html',error = 'Wrong Email address or Password.')
 
 
    except Exception as e:
        return render_template('error.html',error = str(e))
    finally:
        cursor.close()
        conn.close()

@app.route('/userHome')
def userHome():
    if session.get('user'):
        return render_template('userHome.html')
    else:
        return render_template('error.html', error = 'Unauthorized Access')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')

@app.route('/showAllLivestockView')
def showAllLivestockView():
    con = mysql.connect()
    cursor = con.cursor()
    cursor.callproc('Get_All_Livestock',[session.get('user')])
    data = cursor.fetchall()
    cursor.close()
    return render_template('showAllLivestockView.html', livestockdata=data, ownerID=session.get('user'))

@app.route('/add_Livestock', methods=['POST'])
def add_Livestock():
    if session.get('user'):
        if request.method == 'POST':
            ownerID = request.form['OwnerID']
            bornDate = request.form['input_born_date']
            subType = request.form['input_sub_type']
            health = request.form['input_health']
            notes = request.form['input_notes']
            weight = request.form['input_weight']
            market_date = request.form['input_market_date']
            goal = request.form['input_goal_price']
            sale = request.form['input_sale_price']
            location = request.form['input_location']
            con = mysql.connect()
            cursor = con.cursor()
            cursor.callproc('Get_All_Livestock',[1]) # 1 is hard coded
            data = cursor.fetchall()
            cursor.close()
            return render_template('showAllLivestockView.html', livestockdata=data, ownerID=session.get('user'))
    else:
        return render_template('error.html', error = 'Unauthorized Access')
        


@app.route('/deleteLiverstockRecord/<string:livestockID>', methods=['POST'])
def deleteLiverstockRecord(livestockID):
    if session.get('user'):
        if request.method == 'POST':
            con = mysql.connect()
            cursor = con.cursor()
            cursor.callproc('Delete_livestock_Record',[livestockID])
            con.commit()
            cursor.close()
        return json.dumps({'message':'record created successfully !'})
    else:
        return render_template('error.html', error = 'Unauthorized Access')

@app.route('/showMedicalRecords/<string:id>', methods=['GET', 'POST'])
def showMedicalRecords(id):
    if session.get('user'):
        con = mysql.connect()
        cursor = con.cursor()
        cursor.callproc('Get_ALL_Medication_Records',[id])
        medicationRecord = cursor.fetchall()
        cursor.callproc('Get_all_Vaccination_Records', [id])
        vaccinationRecord = cursor.fetchall()
        cursor.callproc('Get_all_vetvisits_records', [id])
        vetVisits = cursor.fetchall()
        cursor.close()
        return render_template('showMedicalRecords.html', livestockID = id, medRecord = medicationRecord, vaccinRecord = vaccinationRecord, vetRecord = vetVisits)
    else:
        return render_template('error.html', error = 'Unauthorized Access')

@app.route('/add_Medication', methods=['POST'])
def add_Medication():
    if session.get_id('user'):
        if request.method == 'POST':
            livestockID = request.form['livestockID']
            medicationName = request.form['input_medication_name']
            start_date = request.form['input_start_date']
            end_date = request.form['input_end_date']
            med_interval = request.form['input_medication_interval']
            con = mysql.connect()
            cursor = con.cursor()
            cursor.callproc('Insert_new_Medication_Record',(livestockID, medicationName, start_date, end_date, med_interval))
            con.commit()
            cursor.close()
        return json.dumps({'message':'record created successfully !'})
    else:
        return render_template('error.html', error = 'Unauthorized Access')

@app.route('/delete_medicationRecord/<string:medID>', methods=['POST'])
def delete_medicationRecord(medID):
    if session.get_id('user'):
        if request.method == 'POST':
            con = mysql.connect()
            cursor = con.cursor()
            cursor.callproc('Delete_Medication_Record',[medID])
            con.commit()
            cursor.close()
        return json.dumps({'message':'record created successfully !'})
    else:
        return render_template('error.html', error = 'Unauthorized Access')

@app.route('/add_Vaccination', methods=['POST'])
def add_Vaccination():
    if session.get_id('user'):
        if request.method == 'POST':
            livestockID = request.form['livestockID']
            vaccinType = request.form['input_vaccin_type']
            vaccinDate = request.form['input_date_given']
            print(livestockID, vaccinType, vaccinDate)
            con = mysql.connect()
            cursor = con.cursor()
            cursor.callproc('Insert_new_Vaccination_Record', (livestockID, vaccinType, vaccinDate))
            con.commit()
            con.close()
        return json.dumps({'message':'record created successfully !'})
    else:
        return render_template('error.html', error = 'Unauthorized Access')

@app.route('/delete_vaccineRecord/<string:vaccID>', methods=['POST'])
def delete_vaccineRecord(vaccID):
    if session.get('user'):
        if request.method == 'POST':
            con = mysql.connect()
            cursor = con.cursor()
            cursor.callproc('Delete_Vaccination_Record',[vaccID])
            con.commit()
            cursor.close()
        return json.dumps({'message':'record created successfully !'})
    else:
        return render_template('error.html', error = 'Unauthorized Access')

@app.route('/add_vetVisit', methods=['POST'])
def add_vetVisit():

    if session.get('user'):
        if request.method == 'POST':
            livestockID = request.form['livestockID']
            visitDate =  request.form['input_visit_date']
            vetName =  request.form['input_vet_name']
            cost = request.form['input_visit_cost']
            reason = request.form['input_visit_reason']
            notes =  request.form['input_visit_notes']
            print(livestockID, visitDate, vetName, cost, reason, notes)
            con = mysql.connect()
            cursor = con.cursor()
            cursor.callproc('Insert_new_VetVist_Record',(livestockID, visitDate, vetName, cost, reason, notes))
            con.commit()
            con.close()
        return json.dumps({'message':'record created successfully !'})
    else:
        return render_template('error.html', error = 'Unauthorized Access')

@app.route('/delete_vetRecord/<string:vetID>', methods=['POST'])
def delete_vetRecord(vetID):
    if session.get('user'):
        if request.method == 'POST':
            con = mysql.connect()
            cursor = con.cursor()
            cursor.callproc('Delete_VetVisit_Record',[vetID])
            con.commit()
            cursor.close()
        return json.dumps({'message':'record created successfully !'})
    else:
        return render_template('error.html', error = 'Unauthorized Access')

@app.route('/viewPastures')
def viewPastures():

    con = mysql.connect()
    cursor = con.cursor()
    cursor.callproc('Get_all_pastures',[session.get('user')])
    data = cursor.fetchall()
    cursor.close()
    return render_template('showAllPastures.html', pastures=data, ownerID=session.get('user'))

@app.route('/add_Pasture', methods=['POST'])
def add_Pasture():
    if request.method == 'POST':
        nickname = request.form['input_nickname']
        ownerID = request.form['ownerID']
        notes = request.form['input_notes']
        con = mysql.connect()
        cursor = con.cursor()
        cursor.callproc('Insert_new_pasture',(nickname, ownerID, notes))
        con.commit()
        con.close()
    return json.dumps({'message':'record created successfully !'})

@app.route('/delete_pasture/<string:pastureID>', methods=['POST'])
def delete_pasture(pastureID):
    if request.method == 'POST':
        con = mysql.connect()
        cursor = con.cursor()
        cursor.callproc('Delete_pasture',[pastureID])
        con.commit()
        cursor.close()
    return json.dumps({'message':'record created successfully !'})

@app.route('/showMaintenanceRecords/<string:id>', methods=['GET', 'POST'])
def showMaintenanceRecords(id):
    con = mysql.connect()
    cursor = con.cursor()
    cursor.callproc('Get_all_maintenance_items',[id])
    mintenanceRecords = cursor.fetchall()
    cursor.close()
    return render_template('showMaintenanceRecords.html', pastureID = id, maintRecords = mintenanceRecords)

@app.route('/add_maintenanceitem', methods=['POST'])
def add_maintenanceitem():
    if request.method == 'POST':
        mtype = request.form['input_type']
        location = request.form['pastureID']
        cost = request.form['input_cost']
        notes = request.form['input_notes']
        con = mysql.connect()
        cursor = con.cursor()
        cursor.callproc('insert_new_maintenance_item',(location, mtype, cost, notes))
        con.commit()
        con.close()
    return json.dumps({'message':'record created successfully !'})

@app.route('/delete_maintenance/<string:itemID>', methods=['POST'])
def delete_maintenance(itemID):
    if request.method == 'POST':
        con = mysql.connect()
        cursor = con.cursor()
        cursor.callproc('Delete_maintenance_item',[itemID])
        con.commit()
        cursor.close()
    return json.dumps({'message':'record created successfully !'})


if __name__ == "__main__":
    app.run()