# demo app - CSV data parsing and saving in the SQL db

### Requirements

1. SQL running
2. Java 22

### Change needed

1. Update the db config in src/main/resources/application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/users
spring.datasource.username=<username>
spring.datasource.password=<password>

### Run backend

1. mvn clean install
2. mvn spring-boot:run

#### CSV Upload Request Endpoint

Request type: POST
Request url: http://localhost:8080/upload

Request Body type: form-data
Key = "file"
Upload Value type = "File"
Value = valid csv file

#### Response

status: success | error
message: appropriate message
