package edu.proptit.vieshop.controller;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.dto.UserDTO;
import edu.proptit.vieshop.model.users.User;
import edu.proptit.vieshop.service.UserService;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/v1/users/personal-info")
    public CustomResponse<?> getUserById() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User tokenUser = (User) authentication.getPrincipal();
        return new CustomResponse<>().data(new UserDTO(userService.getUserById(tokenUser.getId())));
    }

    @GetMapping("/admin/users")
    public CustomResponse<Page<User>> findAll(
            @RequestParam(required = false, defaultValue = "20") Integer size,
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "id") String sortBy,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {
        
        if (search != null && !search.isEmpty()) {
            return new CustomResponse<Page<User>>().data(userService.searchUsers(search, role, size, page, sortBy));
        } else if (role != null && !role.isEmpty()) {
            return new CustomResponse<Page<User>>().data(userService.findByRole(role, size, page, sortBy));
        } else {
            return new CustomResponse<Page<User>>().data(userService.findAll(size, page, sortBy));
        }
    }

    @PutMapping("/v1/users/fix-personal-info")
    public CustomResponse<?> updateUser(@RequestBody UserDTO userDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User tokenUser = (User) authentication.getPrincipal();
        return new CustomResponse<>().message(userService.updateUser(tokenUser.getId(), userDTO));
    }

    @PutMapping("/v1/users/update-password")
    public CustomResponse<?> updatePassword(@RequestBody Map<String,String> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User tokenUser = (User) authentication.getPrincipal();
        String oldPassword = request.getOrDefault("oldPassword", "");
        String newPassword = request.getOrDefault("newPassword", "");
        return new CustomResponse<>().message(userService.updatePassword(tokenUser.getId(), oldPassword, newPassword));
    }
    
    @DeleteMapping("/admin/users/{id}")
    public CustomResponse<?> deleteUser(@PathVariable("id") Long id) {
        return new CustomResponse<>().message(userService.deleteUser(id));
    }
    
    // New endpoints for admin dashboard
    @GetMapping("/admin/users/{id}")
    public CustomResponse<?> getUserByIdAdmin(@PathVariable("id") Long id) {
        return new CustomResponse<>().data(userService.getUserById(id));
    }
    
    @PostMapping("/admin/users")
    public CustomResponse<?> createUser(@RequestBody UserDTO userDTO) {
        return new CustomResponse<>().data(userService.createUserByAdmin(userDTO));
    }
    
    @PutMapping("/admin/users/{id}")
    public CustomResponse<?> updateUserByAdmin(@PathVariable("id") Long id, @RequestBody UserDTO userDTO) {
        return new CustomResponse<>().message(userService.updateUserByAdmin(id, userDTO));
    }
}
