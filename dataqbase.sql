CREATE TABLE student (
    usn VARCHAR(20) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    student_email VARCHAR(100) NOT NULL,
    student_phone VARCHAR(15) NOT NULL,
    student_pass VARCHAR(100) NOT NULL,
    student_lat DECIMAL(10, 8) NOT NULL,
    student_long DECIMAL(11, 8) NOT NULL,
    student_place VARCHAR(100) NOT NULL,
    bus_id INT NOT NULL,
    PRIMARY KEY (usn),
    FOREIGN KEY (bus_id) REFERENCES driver(bus_id)
);


CREATE TABLE driver (
    bus_id INT NOT NULL ,
    driver_name VARCHAR(100) NOT NULL,
    driver_email VARCHAR(100) NOT NULL,
    driver_pass VARCHAR(100) NOT NULL,
    driver_phone VARCHAR(15) NOT NULL,
    PRIMARY KEY (bus_id)
);


INSERT INTO `driver` (`bus_id`, `driver_name`, `driver_email`, `driver_pass`, `driver_phone`)
VALUES ('1', 'Ramappa', 'ramappa@webex.com', 'ram1234', '987456321');

INSERT INTO `driver` (`bus_id`, `driver_name`, `driver_email`, `driver_pass`, `driver_phone`)
VALUES ('2', 'Doomappa', 'Doomappa@webex.com', 'doom1234', '688954723');

INSERT INTO `student` (`usn`, `student_name`, `student_email`, `student_phone`, `student_pass`, `student_lat`, `student_long`, `student_place`, `bus_id`) 
VALUES ('web111', 'varshini', 'vacchu@webex.com', '6598225848', 'vacchu123', '12.8083', '74.8936', 'Deralakatte', '1');

INSERT INTO `student` (`usn`, `student_name`, `student_email`, `student_phone`, `student_pass`, `student_lat`, `student_long`, `student_place`, `bus_id`) 
VALUES ('web222', 'Ashwin', 'ashwin@webex.com', '9987654232', 'ashwin123', '12.8029', '74.9642', 'Mudipu', '2'),
 ('web333', 'Swathi', 'swathi@webex.com', '65874921455', 'swathi123', '12.7790', '75.0145', 'salethur', '2'),
 ('web444', 'Munazza', 'munna@webex.com', '7975506626', 'munna123', '12.7636', '75.1016', 'vitla', '2');