INSERT INTO department (name)
VALUES  ('Sales'),
        ('Finance'),
        ('Legal'),
        ('Engineering'),
        ('Human Resources');

-- values from sample video
INSERT INTO role (title,salary, department_id)
VALUES  ("Salesperson", 80000, 1),
        ("Sales Lead", 100000, 1),
        -- Accounting Team
        ("Accountant", 125000, 2),
        ("Account Manager", 160000, 2),
        -- Law Team
        ("Lawyer", 190000, 3),
        ("Legal Team Lead", 250000,3),
        -- Engineering Team
        ("Software Developer", 120000, 4),
        ("Quality Assurance Tester", 60000, 4),
        ("Lead Engineer", 150000, 4),
        -- HR Team
        ("Human Resources Manager", 80000, 5),
        ("Human Resources Representative", 60000, 5);

-- originally from video (initially)
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 2, null),
       ("Mike", "Chan", 1, 1),
       ("Ashly", "Rodriguez", 1, 1),
       ("Kevin", "Tupik", 1, 1),
       
       -- Accounting Team
       ("Kunal", "Singh", 4, null), 
       ("Malia", "Brown", 3, 5),

       -- Law Team    
       ("Sarah", "Lourd",6, null),
       ("Tom", "Allen", 5, 7),

       -- Engineering Team
       ("Tim", "Apple", 9, null),
       ("Clark", "Kent", 7, 9),
       ("Tony", "Stark", 7, 9),
       ("Albert", "Einstein", 7, 9),
       ("Bucky", "Barnes", 8, 9),
       ("Bruce", "Banner", 8, 9),
       
       -- HR Team  
       ("Bruce", "Wayne", 10, null),
       ("Steve", "Rodgers", 11, 15),
       ("Jack", "Torrance", 11, 15);
   
       