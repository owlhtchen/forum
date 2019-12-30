from pymongo import MongoClient 
import datetime
client = MongoClient('localhost', 27017)

db = client['forum']

user = db['users'].find_one()
posts = db['posts']

user_id = user['_id']

for i in range(100):
    post = {
        'title': 'post #{0}'.format(i),
        'createDate':datetime.datetime.now(),
        'content':'test #{0}'.format(i),
        'postType': 'post',
        'authorID':user_id
    }
    posts.insert_one(post)
    
