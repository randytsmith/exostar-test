package com.example.demo.controller;

import com.example.demo.service.UserService;
import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.GetUsersResponse;
import com.example.demo.model.User;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse> uploadCSV(@RequestParam("file") MultipartFile file) {
        try {
            // Only csv files are allowed
            if (!"text/csv".equals(file.getContentType())
                    && !"application/vnd.ms-excel".equals(file.getContentType())) {
                ApiResponse response = new ApiResponse("error", "Invalid file type. Only CSV files are allowed.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            userService.save(file);
            ApiResponse response = new ApiResponse("success", "User data saved successfully!");
            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (IllegalArgumentException e) {
            // Handle validation errors
            ApiResponse response = new ApiResponse("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            // Handle other exceptions
            ApiResponse response = new ApiResponse("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse> getUsers() {
        try {
            List<User> users = userService.getAllUsers();
            GetUsersResponse response = new GetUsersResponse("success", "User data get successfully!", users);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            // Handle other exceptions
            ApiResponse response = new ApiResponse("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }
}
