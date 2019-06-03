# drop view records;
# drop table cards;
# drop table bonuses;
# drop table games;
# drop table users;
# drop table colors;
# drop table types;

create database animalspirits character set utf8mb4 collate utf8mb4_general_ci;
use animalspirits;
create user 'animal'@'%' identified by 'shit';
grant all privileges on animalspirits.* to 'animal'@'%' with grant option;
flush privileges;

use animalspirits;

CREATE TABLE bonuses (
	id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY(id),
  description VARCHAR(1000) NOT NULL
);


CREATE TABLE colors (
  id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id),
  name VARCHAR(50) NOT NULL
);


CREATE TABLE types (
  id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id),
  name VARCHAR(255) NOT NULL
);


INSERT INTO types (id, name) VALUES (1, 'Кінь'), (2, 'Ведмідь'), (3, 'Вівця'), (4,'Кабан'), (5, 'Бик');


CREATE TABLE cards (
  color_id INT NOT NULL,
  type_id INT NOT NULL,
  FOREIGN KEY (color_id) references colors (id),
  FOREIGN KEY (type_id) references types (id),
  primary key(color_id, type_id)
);


CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id),
  username VARCHAR(100) NOT NULL,
  age INT,
  sex VARCHAR(2),
  region VARCHAR(255),
  password VARCHAR(255) NOT NULL
);


CREATE TABLE games (
  id INT NOT NULL AUTO_INCREMENT,
  winner_id INT NULL DEFAULT NULL,
  FOREIGN KEY (winner_id) references users(id),
  PRIMARY KEY (id),
  rounds INT not null DEFAULT 1
);


CREATE VIEW records
AS
SELECT g.id game_id,
       u.id winner_id
FROM games g
  LEFT JOIN users u
    ON u.id = g.winner_id

CREATE TABLE prices (
  game_id INT NOT NULL,
  round INT NOT NULL,
  type_id INT NOT NULL,
  price FLOAT NOT NULL,
  FOREIGN KEY (game_id) references games(id) ON DELETE CASCADE,
  FOREIGN KEY (type_id) references types(id),
  PRIMARY KEY (game_id, round, type_id)
);

CREATE TABLE results (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  game_id INT NOT NULL,
  FOREIGN KEY (game_id) references games(id) ON DELETE CASCADE,
  round INT NOT NULL DEFAULT 1,
  name VARCHAR(255) NOT NULL,
  user_id INT NULL,
  FOREIGN KEY (user_id) references users(id),
  result FLOAT NULL DEFAULT NULL
);