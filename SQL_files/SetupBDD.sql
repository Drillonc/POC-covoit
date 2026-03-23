CREATE DATABASE  IF NOT EXISTS `poc-covoit`;
USE `poc-covoit`;

--
-- Table structure for table `user`
--
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `pw` char(68) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Data for table `employee`
--

INSERT INTO `user` VALUES 
	('John','Andrews','john@gmail.com','{bcrypt}$2a$10$qeS0HEh7urweMojsnwNAR.vcXJeXR1UcMRZ2WcGQl9YeuspUdgF.q'),
	('Mary','Baumgarten','mary@outlook.com','{bcrypt}$2a$10$qeS0HEh7urweMojsnwNAR.vcXJeXR1UcMRZ2WcGQl9YeuspUdgF.q'),
	('Susan','Gupta','susan@capgemini.com','{bcrypt}$2a$10$qeS0HEh7urweMojsnwNAR.vcXJeXR1UcMRZ2WcGQl9YeuspUdgF.q');

