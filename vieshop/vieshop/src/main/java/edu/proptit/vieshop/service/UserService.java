package edu.proptit.vieshop.service;

import edu.proptit.vieshop.dto.UserDTO;
import edu.proptit.vieshop.model.users.User;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService {
    Page<User> findAll(int size, int page, String sortBy);
    void createUser(User user);
    String updateUser(Long id, UserDTO userDTO);
    String updatePassword(Long id, String oldPassword, String newPassword);
    User getUserById(Long id);
    UserDetailsService userDetailsService();
    boolean existsByUsername(String username);
    String deleteUser(Long id);
}
