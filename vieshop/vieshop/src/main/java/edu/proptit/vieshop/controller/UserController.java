package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.dto.UserDTO;
import edu.proptit.vieshop.model.users.User;
import edu.proptit.vieshop.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
            @RequestParam(required = false, defaultValue = "id") String sortBy) {
        return new CustomResponse<Page<User>>().data(userService.findAll(size, page, sortBy));
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
}
