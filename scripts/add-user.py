from pymongo import MongoClient
import datetime
from random import randint
from string import ascii_lowercase
client = MongoClient('localhost', 27017)

db = client['forum']
users = db['users']
passwords = db['passwords']
users.drop()
passwords.drop()
for ch in ascii_lowercase:
    for i in range(1, 6):
        username = ch * i
        email = "{}@{}.com".format(ch, ch)
        user = {
            'username': username,
            'email':email
        }
        userID = users.insert_one(user).inserted_id
        password = {
            "userID": userID,
            "password": ch
        }
        passwords.insert_one(password)

