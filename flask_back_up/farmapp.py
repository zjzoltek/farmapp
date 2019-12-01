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
                return redirect('/signIn')
            else:
                return render_template('error.html', error = str(data[0]))
        else:
            return json.dumps({'html':'<span>Enter the required fields</span>'})
    except Exception as e:
        return render_template('error.html', error = str(e))
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
            if check_password_hash(data[0][3],_password):
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
    print(medicationRecord)
    print(vaccinationRecord)
    return render_template('showMedicalRecords.html', medRecord = medicationRecord, vaccinRecord = vaccinationRecord, vetRecord = vetVisits)

@app.route('/viewPastures')
def viewPastures():
    return render_template('viewPastures.html')

if __name__ == "__main__":
    app.run()