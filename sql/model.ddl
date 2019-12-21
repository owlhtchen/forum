DROP SCHEMA IF EXISTS forum cascade;
CREATE SCHEMA forum;
SET search_path TO forum;

CREATE TABLE "User" (
  userID integer primary key,
  password varchar(100) not null,
  gender char(1) check (gender in ('M', 'F')),
  joinDate timestamp not null 
);

CREATE TABLE "Friendship" (
  first integer 
    references "User"(userID) not null,
  second integer
    references "User"(userID) not null
);