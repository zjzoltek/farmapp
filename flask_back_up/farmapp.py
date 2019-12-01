from flask import Flask, render_template, request, json
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
mysql.init_app(app)


@app.route("/")
def home():
    return render_template('home.html')

@app.route('/showSignUp')
def showSignUp():
    return render_template('signup.html')

@app.route('/signUp', methods=['POST'])
def signUp():
    try:
        _name = request.form['inputName']
        _email = request.form['inputEmail']
        _password = request.form['inputPassword']


        if _name and _email and _password:
            conn = mysql.connect()
            cursor = conn.cursor()
            _hashed_password = generate_password_hash(_password)
            cursor.callproc('createUser', (_name, _email))
            data = cursor.fetchall()
            if len(data) is 0:
                conn.commit()
                return json.dumps({'message':'User created successfully !'})
            else:
                return json.dumps({'error':str(data[0])})
        else:
            return json.dumps({'html':'<span>Enter the required fields</span>'})
    except Exception as e:
        return json.dumps({'error':str(e)})
    finally:
        cursor.close() 
        conn.close()

@app.route('/showSignIn')
def showSignin():
    return render_template('signin.html')

@app.route('/validateLogin', methods=['POST'])
def validateLogin():
    try:
        _username = request.form['inputEmail']
        _password = request.form['inputPassword']
    # connect to mysql
        con = mysql.connect()
        cursor = con.cursor()
        cursor.callproc('sp_validateLogin',(_username,))
        data = cursor.fetchall()

        if len(data) > 0:
            if check_password_hash(str(data[0][3]),_password):
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
        con.close()

@app.route('/userHome')
def userHome():
    return render_template('userHome.html')

@app.route('/viewLivestock')
def viewLivestock():
    return render_template('viewLivestock.html')

@app.route('/showAllLivestockView')
def showAllLivestockView():
    con = mysql.connect()
    cursor = con.cursor()
    cursor.callproc('Get_All_Livestock',[1]) # 1 is hard coded
    data = cursor.fetchall()
    cursor.close()
    return render_template('showAllLivestockView.html', livestockdata=data)

@app.route('/showMedicalRecords/<string:id>', methods=['GET', 'POST'])
def showMedicalRecords(id):
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

@app.route('/add_Medication', methods=['POST'])
def add_Medication():
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

@app.route('/delete_medicationRecord/<string:medID>', methods=['POST'])
def delete_medicationRecord(medID):
    if request.method == 'POST':
        con = mysql.connect()
        cursor = con.cursor()
        cursor.callproc('Delete_Medication_Record',[medID])
        con.commit()
        cursor.close()
    return json.dumps({'message':'record created successfully !'})

@app.route('/add_Vaccination', methods=['POST'])
def add_Vaccination():
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

@app.route('/delete_vaccineRecord/<string:vaccID>', methods=['POST'])
def delete_vaccineRecord(vaccID):
    if request.method == 'POST':
        con = mysql.connect()
        cursor = con.cursor()
        cursor.callproc('Delete_Vaccination_Record',[vaccID])
        con.commit()
        cursor.close()
    return json.dumps({'message':'record created successfully !'})

@app.route('/add_vetVisit', methods=['POST'])
def add_vetVisit():
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

@app.route('/delete_vetRecord/<string:vetID>', methods=['POST'])
def delete_vetRecord(vetID):
    if request.method == 'POST':
        con = mysql.connect()
        cursor = con.cursor()
        cursor.callproc('Delete_VetVisit_Record',[vetID])
        con.commit()
        cursor.close()
    return json.dumps({'message':'record created successfully !'})
    
@app.route('/viewPastures')
def viewPastures():
    return render_template('viewPastures.html')

if __name__ == "__main__":
    app.run()