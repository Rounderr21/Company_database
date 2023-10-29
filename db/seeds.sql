-- Purpose of this is to: Seed data for the employee tracker database
INSERT INTO employees (id, first_name, last_name, title, department, salary, manager)
VALUES (1, "Nathan", "Tilman", "Lead Technician", "Service", "83000", "Null"),
       (2, "Robert", "Hanes", "Service Technician", "Service", "68000", "Nathan Tilman"),
       (3, "Emily", "Smith", "Project Coordinator", "Sales", "120000", "Ethan Miller"),
       (4, "Liam", "Johnson", "Project Coordinator", "Sales", "120000", "Ethan Miller"),
       (5, "Noah", "Davis", "Service Technician", "Service", "68000", "Nathan Tilman"),
       (6, "Cody", "West", "Service Technician", "Service", "68000", "Nathan Tilman"),
       (7, "Sophia", "Taylor", "Project Coordinator", "Sales", "120000", "Ethan Miller"),
       (8, "Ethan", "Miller", "Project Manager", "Sales", "185000", "Null"),
       (9, "Mia", "Jones", "Rental Coordinator", "Rental", "60000", "Benjamin White"),
       (10, "Benjamin", "White", "Rental Manager", "Rental", "11000", "Null");

-- Purpose of this is to: Seed data for the employee tracker database
INSERT INTO departments (id, department_name)
VALUES (1, "Service"),
       (2, "Sales"),
       (3, "Rental");

-- Purpose of this is to: Seed data for the employee tracker database
INSERT INTO roles (id, title, department, salary)
VALUES (1, "Lead Technician", "Service", "83000"),
       (2, "Service Technician", "Service", "68000"),
       (3, "Project Coordinator", "Sales", "120000"),
       (4, "Project Manager", "Sales", "185000"),
       (5, "Rental Coordinator", "Rental", "60000"),
       (6, "Rental Manager", "Rental", "110000");
