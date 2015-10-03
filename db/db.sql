CREATE TABLE `Points` (
  `Id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Time` datetime NOT NULL,
  `Lat` float(10,6) NOT NULL,
  `Lon` float(10,6) NOT NULL,
  `Speed` float(10,6) NOT NULL,
  `Name` varchar(64) NOT NULL,
  `Identifier` varchar(128) NOT NULL,
  `Tag` varchar(128) DEFAULT NULL,
  `Comment` varchar(128) DEFAULT NULL,
  `Accuracy` float(6,1) DEFAULT NULL
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
