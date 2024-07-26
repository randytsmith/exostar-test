package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    /**
     * Save users from the CSV file.
     *
     * @param file CSV file containing user data
     * @throws Exception if any validation or parsing error occurs
     */
    public void save(MultipartFile file) throws Exception {
        List<User> users = parseCSVFile(file);
        for (User user : users) {
            validateUser(user);

            // Add user only if not present, else update it
            Optional<User> existingUserOpt = userRepository.findByEmail(user.getEmail());

            if (existingUserOpt.isPresent()) {
                // Update existing user
                User existingUser = existingUserOpt.get();
                existingUser.setName(user.getName());
                existingUser.setAge(user.getAge());
                userRepository.save(existingUser);
                logger.info("Updated user: {}", user.getEmail());
            } else {
                // Add new user
                userRepository.save(user);
                logger.info("Saved user: {}", user.getEmail());
            }
        }
    }

    /**
     * Parse the CSV file to extract user data, skipping the first line (header).
     *
     * @param file CSV file
     * @return list of users
     * @throws Exception if any parsing error occurs
     */
    private List<User> parseCSVFile(MultipartFile file) throws Exception {
        List<User> users = new ArrayList<>();

        // To skip the first line of the CSV
        CSVFormat format = CSVFormat.Builder.create(CSVFormat.DEFAULT)
                .setHeader()
                .setSkipHeaderRecord(true)
                .build();

        try (Reader reader = new InputStreamReader(file.getInputStream());

                CSVParser csvParser = new CSVParser(reader, format)) {
            for (CSVRecord csvRecord : csvParser) {
                User user = new User(
                        csvRecord.get("Name"),
                        csvRecord.get("Email"),
                        Integer.parseInt(csvRecord.get("Age")));
                users.add(user);
                logger.info("Parsed user: {}", user);
            }
        } catch (Exception e) {
            logger.info("Error parsing csv file", e);
            throw new Exception("Something went wrong on server");
        }
        return users;
    }

    /**
     * Validate the user data.
     *
     * @param user user data
     * @throws IllegalArgumentException if any validation error occurs
     */
    private void validateUser(User user) throws IllegalArgumentException {
        if (user.getName() == null || user.getName().isEmpty()) {
            logger.error("Invalid user name: {}", user.getName());
            throw new IllegalArgumentException(String.format(
                    "Uploaded CSV contains invalid name for this email: %s, please correct it and re-upload.",
                    user.getEmail()));
        }
        if (user.getEmail() == null || !user.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            logger.error("Invalid email format: {}", user.getEmail());
            throw new IllegalArgumentException(String.format(
                    "Uploaded CSV contains invalid email for this email: %s, please correct it and re-upload.",
                    user.getEmail()));
        }
        if (user.getAge() < 0 || user.getAge() > 120) {
            logger.error("Invalid age: {}", user.getAge());
            throw new IllegalArgumentException(String.format(
                    "Uploaded CSV contains invalid age for this email: %s. Age can only be betweek 1-120, please correct it and re-upload",
                    user.getEmail()));
        }
    }

    /**
     * Get all users.
     *
     * @return list of users
     */
    public List<User> getAllUsers() throws Exception {
        try {
            return userRepository.findAll();
        } catch (Exception e) {
            logger.info("Error getting all users", e);
            throw new Exception("Something went wrong on server");
        }
    }
}
