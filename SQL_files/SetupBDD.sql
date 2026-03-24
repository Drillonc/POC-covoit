CREATE DATABASE  IF NOT EXISTS `poc-covoit`;
USE `poc-covoit`;

--
-- Table structure for table `user`
--
DROP TABLE IF EXISTS `ride`;
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `pw` char(68) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Data for table `user`
--

INSERT INTO `user` VALUES 
	('John','Andrews','john@gmail.com','{bcrypt}$2y$10$IgyjADeg7V4K.MwEo85mQu6IB/HnGUJ5EZTL7jiqI0knHMseGhDMG'),
	('Mary','Baumgarten','mary@outlook.com','{bcrypt}$2a$10$qeS0HEh7urweMojsnwNAR.vcXJeXR1UcMRZ2WcGQl9YeuspUdgF.q'),
	('Susan','Gupta','susan@capgemini.com','{bcrypt}$2a$10$qeS0HEh7urweMojsnwNAR.vcXJeXR1UcMRZ2WcGQl9YeuspUdgF.q');



CREATE TABLE `ride` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start` varchar(45) NOT NULL,
  `end` varchar(45) NOT NULL,
  `seat` int NOT NULL,
  `date` date NOT NULL,
  `driver_email` varchar(45) DEFAULT NULL,
  KEY `FK_DRIVER_idx` (`driver_email`),  CONSTRAINT `FK_DRIVER` 
  FOREIGN KEY (`driver_email`) 
  REFERENCES `user` (`email`) 
  
  ON DELETE NO ACTION ON UPDATE NO ACTION,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

INSERT INTO `ride` VALUES 
	(1,'Montbonnot','Grenoble Hotel de ville',3,'2025-11-11 13:23:44','john@gmail.com');
	


