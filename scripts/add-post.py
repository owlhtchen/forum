from pymongo import MongoClient 
import datetime
from random import randint
client = MongoClient('localhost', 27017)

db = client['forum']

user = db['users'].find_one()
posts = db['posts']

user_id = user['_id']


for i in range(100):
    text = ''
    for j in range(randint(100,1000)):
        text += chr(randint(ord('A'),ord('z')))
    post = {
        'title': 'post #{0}'.format(i),
        'createDate':datetime.datetime.now(),
        'content':text,
        'postType': 'post',
        'authorID':user_id,
        'likedBy': []
    }
    posts.insert_one(post)
    
