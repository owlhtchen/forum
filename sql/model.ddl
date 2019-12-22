DROP SCHEMA IF EXISTS forum cascade;
CREATE SCHEMA forum;
SET search_path to forum;

CREATE TABLE Account (
  accountID serial primary key,
  password varchar(100) not null,
  gender char(1) check (gender in ('M', 'F')),
  joinDate timestamp not null,
  lastLoginDate timestamp not null,
  isDeleted boolean default 'f',
  browseHistory json,
  favorite json
);
/* json browseHistory
  [
    '1': [1000, 1001, ... postID]
    '2': [... (postID)]
  ]
*/

-- Friendship is mutual
CREATE TABLE Friendship (
  first integer 
    references Account(accountID) not null,
  second integer
    references Account(accountID) not null,
  primary key (first, second),
  check (second > first)
);

CREATE TABLE Block (
  account integer
   references Account(accountID) not null,
  victim integer
    references Account(accountID) not null,
  primary key (account, victim)   
);

CREATE TYPE postTypeDomain AS ENUM (
    'column',
    'timeline',
    'post',
    'comment'
);

-- Post implements Column, Timeline, Post, Comment
CREATE TABLE Post (
  postID serial primary key,
  title varchar(100) not null,
  createDate timestamp,
  content text,
  postType postTypeDomain not null,
  authorID integer not null
    references Account(accountID)
);

CREATE TABLE Upvote (
  accountID integer
    references Account(accountID),
  postID integer
    references Post(postID),
  primary key (accountID, postID)
);


CREATE TABLE Message (
  first integer 
    references Account(accountID) not null,
  second integer
    references Account(accountID) not null,
  chat json,
  primary key (first, second),
  check (second > first)
);
/* json
  [
    {
      'date':
      'sender':
      'content':
    }
  ]
*/


CREATE TABLE Category (
  categoryID serial primary key,
  name varchar(100) not null
);

CREATE TABLE JoinCategory (
  accountID integer
    references Account(accountID),
  categoryID integer not null
    references Category(categoryID),
  primary key (accountID, categoryID)
);

CREATE TABLE ManageCategory (
  accountID integer,
  categoryID integer not null,
  primary key (accountID, categoryID),
  foreign key (accountID, categoryID) references JoinCategory(accountID, categoryID)
);

CREATE TABLE Notification (
  receiver integer 
    references Account(accountID),
  content text
);