from pymongo import MongoClient 
import datetime
from random import randint
from faker import Faker
import datetime
fake = Faker()
client = MongoClient('localhost', 27017)

db = client['forum']

userColl = db['users']
postColl = db['posts']
tagColl = db['tags']
postColl.drop()

allUsers = userColl.find()

i = 0

template = """
[#aaaaa](/tags/tag-by-id/5ee97b218a1eed08e47b64ba) [@Huiting_Chen](/users/profile/5ee911e9cf7c13102c16e0ae)

# Heading

[google](https://www.google.com/)    


![flower](https://source.unsplash.com/KJGBY76mmS4/500x350)
"""

for user in allUsers:
    # postType, authorID, content, title, tagIDs
    # print(" ------------------------------ ")
    # print(user)
    title = fake.text()[:10]
    content = ""
    if i % 5 != 0 and i % 7 != 0:
        content = ' '.join([fake.text() for i in range(10)])
    else:
        content = template + ' '.join([fake.text() for i in range(3)])
    authorID = user["_id"]
    postType = "post"
    sampleSize = randint(2, 5)
    tags = tagColl.aggregate([ { "$sample": { "size": sampleSize } } ])
    tags = list(tags)
    tagIDs = [tag["_id"] for tag in tags]
    # print(tagIDs)
    post = {
        "title": title,
        "content": content,
        "authorID": authorID,
        "postType": postType,
        "tagIDs": tagIDs,
        "isDeleted": False,
        "likedBy": [],
        "commentIDs": [],
        "createDate": datetime.datetime.utcnow()
    }
    postID = postColl.insert_one(post).inserted_id

    myquery = { "_id": postID }
    newvalues = { "$set": { "ancestorID": postID } }
    postColl.update_one(myquery, newvalues)

    i += 1
    # print(" ------------------------------ ")