# compose/mysql/init/init.sql
Alter user 'dbuser'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
GRANT ALL PRIVILEGES ON project.* TO 'dbuser'@'%';
FLUSH PRIVILEGES;
