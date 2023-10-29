-- dropped database if it exists and created new database
DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

-- database we are using for this project
USE company_db;

-- create table for employees
CREATE TABLE employees(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  title VARCHAR(100) NOT NULL,
  department VARCHAR(30) NOT NULL,
  salary INT NOT NULL,
  manager VARCHAR(30) NOT NULL
);

-- create table for departments
CREATE TABLE departments(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);

-- create table for roles
CREATE TABLE roles(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  department VARCHAR(30) NOT NULL,
  salary INT NOT NULL
)
