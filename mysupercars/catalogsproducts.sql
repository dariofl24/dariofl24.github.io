
CREATE TABLE MasterProduct (
	ID VARCHAR(128) NOT NULL,
	name VARCHAR(128) NOT NULL,
	description BLOB DEFAULT NULL,
	PRIMARY KEY ( ID )
) ENGINE=InnoDB;

CREATE TABLE Product (
	ID VARCHAR(128) NOT NULL,
	name VARCHAR(128) NOT NULL,
	MasterProduct_ID VARCHAR(128) DEFAULT NULL,
	description BLOB DEFAULT NULL,
	FOREIGN KEY (MasterProduct_ID) REFERENCES MasterProduct(ID),
	PRIMARY KEY ( ID )
) ENGINE=InnoDB;

# ---------

CREATE TABLE Catalog (
	ID VARCHAR(128) NOT NULL,
	name VARCHAR(128) NOT NULL,
	description BLOB DEFAULT NULL,
	PRIMARY KEY ( ID )
) ENGINE=InnoDB;

CREATE TABLE Category (
	ID VARCHAR(128) NOT NULL,
	name VARCHAR(128) NOT NULL,
	description BLOB DEFAULT NULL,
	Catalog_ID VARCHAR(128) NOT NULL,
	Parent_Category_ID VARCHAR(128) DEFAULT NULL,
	PRIMARY KEY ( ID )
) ENGINE=InnoDB;

ALTER TABLE Category ADD FOREIGN KEY (Catalog_ID) REFERENCES Catalog(ID);
ALTER TABLE Category ADD FOREIGN KEY (Parent_Category_ID) REFERENCES Category(ID);

ALTER TABLE Product ADD column Category_ID VARCHAR(128) DEFAULT NULL;

ALTER TABLE Product ADD FOREIGN KEY (Category_ID) REFERENCES Category(ID);

# ---------

CREATE TABLE Property_varchar256_name (
	ID int NOT NULL AUTO_INCREMENT,
	name VARCHAR(128) NOT NULL UNIQUE,
	description VARCHAR(128),
	default_value VARCHAR(256) DEFAULT NULL,
	default_value_lov int DEFAULT NULL,
	multyval BOOLEAN NOT NULL DEFAULT false,
	lov BOOLEAN NOT NULL DEFAULT false,
	PRIMARY KEY ( ID )
) ENGINE=InnoDB;

CREATE TABLE Product_Property_varchar256_value (
	Property_ID int NOT NULL,
	Product_ID VARCHAR(128) NOT NULL,
	value VARCHAR(256) DEFAULT NULL,
	FOREIGN KEY (Property_ID) REFERENCES Property_varchar256_name(ID),
	FOREIGN KEY (Product_ID) REFERENCES Product(ID)
) ENGINE=InnoDB;

CREATE TABLE LOV_Property_varchar256 (
	ID int NOT NULL AUTO_INCREMENT,
	value VARCHAR(256) NOT NULL,
	Property_ID int NOT NULL,
	FOREIGN KEY (Property_ID) REFERENCES Property_varchar256_name(ID),
	PRIMARY KEY ( ID )
) ENGINE=InnoDB;

ALTER TABLE Property_varchar256_name ADD FOREIGN KEY (default_value_lov) REFERENCES LOV_Property_varchar256(ID);

# ---------

CREATE TABLE Property_boolean_name (
	ID int NOT NULL AUTO_INCREMENT,
	name VARCHAR(128) NOT NULL UNIQUE,
	description VARCHAR(128) DEFAULT NULL,
	default_value BOOLEAN DEFAULT NULL,
	default_value_lov int DEFAULT NULL,
	multyval BOOLEAN NOT NULL DEFAULT false,
	lov BOOLEAN NOT NULL DEFAULT false,
	PRIMARY KEY ( ID )
) ENGINE=InnoDB;

CREATE TABLE Product_Property_boolean_value (
	Property_ID int NOT NULL,
	Product_ID VARCHAR(128) NOT NULL,
	value BOOLEAN DEFAULT NULL,
	FOREIGN KEY (Property_ID) REFERENCES Property_boolean_name(ID),
	FOREIGN KEY (Product_ID) REFERENCES Product(ID)
) ENGINE=InnoDB;

CREATE TABLE LOV_Property_boolean (
	ID int NOT NULL AUTO_INCREMENT,
	value BOOLEAN NOT NULL,
	Property_ID int NOT NULL,
	FOREIGN KEY (Property_ID) REFERENCES Property_boolean_name(ID),
	PRIMARY KEY ( ID )
) ENGINE=InnoDB;

ALTER TABLE Property_boolean_name ADD FOREIGN KEY (default_value_lov) REFERENCES LOV_Property_boolean(ID);

# ---------

CREATE TABLE Property_int_name (
	ID int NOT NULL AUTO_INCREMENT,
	name VARCHAR(128) NOT NULL UNIQUE,
	description VARCHAR(128) DEFAULT NULL,
	default_value INT DEFAULT NULL,
	default_value_lov int DEFAULT NULL,
	multyval BOOLEAN NOT NULL DEFAULT false,
	lov BOOLEAN NOT NULL DEFAULT false,
	PRIMARY KEY ( ID )
) ENGINE=InnoDB;

CREATE TABLE Product_Property_int_value (
	Property_ID INT NOT NULL,
	Product_ID VARCHAR(128) NOT NULL,
	value INT DEFAULT NULL
) ENGINE=InnoDB;

ALTER TABLE Product_Property_int_value ADD FOREIGN KEY (Property_ID) REFERENCES Property_int_name(ID);
ALTER TABLE Product_Property_int_value ADD FOREIGN KEY (Product_ID) REFERENCES Product(ID);

CREATE TABLE LOV_Property_int (
	ID int NOT NULL AUTO_INCREMENT,
	value INT NOT NULL,
	Property_ID int NOT NULL,
	FOREIGN KEY (Property_ID) REFERENCES Property_int_name(ID),
	PRIMARY KEY ( ID )
) ENGINE=InnoDB;

ALTER TABLE Property_int_name ADD FOREIGN KEY (default_value_lov) REFERENCES LOV_Property_int(ID);

# ---------

CREATE TABLE Property_double_name (
	ID int NOT NULL AUTO_INCREMENT,
	name VARCHAR(128) NOT NULL UNIQUE,
	description VARCHAR(128) DEFAULT NULL,
	default_value DOUBLE DEFAULT NULL,
	default_value_lov int DEFAULT NULL,
	multyval BOOLEAN NOT NULL DEFAULT false,
	lov BOOLEAN NOT NULL DEFAULT false,
	PRIMARY KEY ( ID )
) ENGINE=InnoDB;

CREATE TABLE Product_Property_double_value (
	Property_ID INT NOT NULL,
	Product_ID VARCHAR(128) NOT NULL,
	value DOUBLE DEFAULT NULL
) ENGINE=InnoDB;

ALTER TABLE Product_Property_double_value ADD FOREIGN KEY (Property_ID) REFERENCES Property_double_name(ID);
ALTER TABLE Product_Property_double_value ADD FOREIGN KEY (Product_ID) REFERENCES Product(ID);

CREATE TABLE LOV_Property_double (
	ID int NOT NULL AUTO_INCREMENT,
	value DOUBLE NOT NULL,
	Property_ID int NOT NULL,
	FOREIGN KEY (Property_ID) REFERENCES Property_double_name(ID),
	PRIMARY KEY ( ID )
) ENGINE=InnoDB;

ALTER TABLE Property_double_name ADD FOREIGN KEY (default_value_lov) REFERENCES LOV_Property_double(ID);


# --------- BLOB

CREATE TABLE Property_blob_name (
	ID int NOT NULL AUTO_INCREMENT,
	name VARCHAR(128) NOT NULL UNIQUE,
	description VARCHAR(128) DEFAULT NULL,
	default_value BLOB DEFAULT NULL,
	default_value_lov int DEFAULT NULL,
	multyval BOOLEAN NOT NULL DEFAULT false,
	lov BOOLEAN NOT NULL DEFAULT false,
	PRIMARY KEY ( ID )
) ENGINE=InnoDB;

CREATE TABLE Product_Property_blob_value (
	Property_ID INT NOT NULL,
	Product_ID VARCHAR(128) NOT NULL,
	value BLOB DEFAULT NULL
) ENGINE=InnoDB;

ALTER TABLE Product_Property_blob_value ADD FOREIGN KEY (Property_ID) REFERENCES Property_blob_name(ID);
ALTER TABLE Product_Property_blob_value ADD FOREIGN KEY (Product_ID) REFERENCES Product(ID);

CREATE TABLE LOV_Property_blob (
	ID int NOT NULL AUTO_INCREMENT,
	value BLOB NOT NULL,
	Property_ID int NOT NULL,
	FOREIGN KEY (Property_ID) REFERENCES Property_blob_name(ID),
	PRIMARY KEY ( ID )
) ENGINE=InnoDB;

ALTER TABLE Property_blob_name ADD FOREIGN KEY (default_value_lov) REFERENCES LOV_Property_blob(ID);





