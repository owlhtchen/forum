from pymongo import MongoClient 
import datetime
from random import randint
from faker import Faker
import datetime
from typing import List
fake = Faker()
client = MongoClient('localhost', 27017)

db = client['forum']

userColl = db['users']
postColl = db['posts']
tagColl = db['tags']
postColl.drop()

# allUsers = userColl.find()
allUsers = userColl.aggregate([
    {"$sample": { "size": 20 }}])
firstUser = userColl.find_one()

i = 0

template = """
[#aaaaa](/tags/tag-by-id/5ee97b218a1eed08e47b64ba) [@{}](/users/profile/{})

# Heading

[google](https://www.google.com/)    


![flower](https://source.unsplash.com/KJGBY76mmS4/500x350)
""".format(firstUser["username"], firstUser["_id"])


def newPostComment(authorID, content, ancestorID, parentID, title):
    # postType, authorID, content, ancestorID, parentID
    comment = {
        "postType": "post-comment",
        "authorID": authorID,
        "content": content,
        "ancestorID": ancestorID,
        "parentID": parentID,
        "title": title,
        "tagIDs": [],
        "isDeleted": False,
        "likedBy": [],
        "commentIDs": [],
        "createDate": datetime.datetime.utcnow()
    }
    return postColl.insert_one(comment).inserted_id

def newSubComment(authorID, content, ancestorID, parentID, title):
    # postType, authorID, content, ancestorID, parentID
    comment = {
        "postType": "sub-comment",
        "authorID": authorID,
        "content": content,
        "ancestorID": ancestorID,
        "parentID": parentID,
        "title": title,
        "tagIDs": [],
        "isDeleted": False,
        "likedBy": [],
        "commentIDs": [],
        "createDate": datetime.datetime.utcnow()
    }
    return postColl.insert_one(comment).inserted_id

def nestSubComments(depth, ancestorID, parentID, title) -> List:
    commentIDs = []
    if depth == 1:
        for i in range(randint(2, 3)):
            tempAuthorID = list(userColl.aggregate([ {"$sample": { "size": 1 } }]))[0]["_id"]
            temp = newSubComment(
                tempAuthorID, 
                "{}".format(i),
                ancestorID, parentID, title)
            commentIDs.append(temp)
        return commentIDs
    else:
        for i in range(randint(2, 3)):
            tempAuthorID = list(userColl.aggregate([ {"$sample": { "size": 1 } }]))[0]["_id"]
            tempID = newSubComment(
                tempAuthorID, 
                "{}".format(i),
                ancestorID, parentID, title)
            tempCommentIDs = nestSubComments(depth - 1,
                ancestorID, tempID, title
            )
            setPostCommentIDs(tempID, tempCommentIDs)         
            commentIDs.append(tempID)
        return commentIDs

def setPostCommentIDs(postID, commentIDs):
    myquery = { "_id": postID }
    newvalues = { "$set": { "commentIDs": commentIDs } }
    postColl.update_one(myquery, newvalues)      

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

    # add post comment
    commentIDs = []
    for i in range(randint(3, 5)):
        tempAuthorID = list(userColl.aggregate([ {"$sample": { "size": 1 } }]))[0]["_id"]
        commentID = newPostComment(
            tempAuthorID, 
            "{}".format(i),
            postID,
            postID,
            title
        )
        subCommentIDs = nestSubComments(
            2,
            commentID,
            commentID,
            title
        )
        setPostCommentIDs(commentID, subCommentIDs)
        commentIDs.append(commentID)
    setPostCommentIDs(postID, commentIDs)  

    i += 1
    # print(" ------------------------------ ")
