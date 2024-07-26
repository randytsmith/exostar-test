
package com.example.demo.dto;

import com.example.demo.model.User;
import java.util.List;

public class GetUsersResponse extends ApiResponse {
    private List<User> users;

    public GetUsersResponse() {
    }

    public GetUsersResponse(String status, String message, List<User> users) {
        super(status, message);
        this.users = users;
    }

    // Getters and Setters

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}