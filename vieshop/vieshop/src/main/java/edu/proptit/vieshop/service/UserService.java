package edu.proptit.vieshop.service;

import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;

import edu.proptit.vieshop.dto.UserDTO;
import edu.proptit.vieshop.model.users.User;

public interface UserService {
    Page<User> findAll(int size, int page, String sortBy);
    void createUser(User user);
    String updateUser(Long id, UserDTO userDTO);
    String updatePassword(Long id, String oldPassword, String newPassword);
    User getUserById(Long id);
    UserDetailsService userDetailsService();
    boolean existsByUsername(String username);
    String deleteUser(Long id);
    
    // New methods for admin dashboard
    Page<User> findByRole(String role, int size, int page, String sortBy);
    Page<User> searchUsers(String query, String role, int size, int page, String sortBy);
    User createUserByAdmin(UserDTO userDTO);
    String updateUserByAdmin(Long id, UserDTO userDTO);
    User getUserByUsername(String username);
}
