from pymongo import MongoClient
import datetime
from random import randint
from string import ascii_lowercase
client = MongoClient('localhost', 27017)

db = client['forum']
users = db['users']
passwords = db['passwords']
tags = db['tags']
users.drop()
passwords.drop()
tags.drop()

for i in range(1, 6):
    for ch in ascii_lowercase:
        username = ch * i
        email = "{}@{}.com".format(username, ch)
        user = {
            'username': username,
            'email':email,
            'gender': "male",
            'joinDate': datetime.datetime.utcnow(),
            'lastLoginDate': datetime.datetime.utcnow(),
            'isDeleted': False,
            'browseHistory': [],
            'favorite': [],
            'isAdmin': False,
            'bio': "Hi, I am {}.".format(username),
            'avatarFile': "default_{}.jpg".format(randint(0, 9)),
        }
        userID = users.insert_one(user).inserted_id
        password = {
            "userID": userID,
            "password": ch
        }
        passwords.insert_one(password)

for i in range(100):
    tag = {
        "name": 'tag{}'.format(i),
        "postIDs": []
    }
    tags.insert_one(tag)