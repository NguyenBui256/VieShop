package edu.proptit.vieshop.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import edu.proptit.vieshop.dao.UserRepository;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.dto.UserDTO;
import edu.proptit.vieshop.model.users.User;
import edu.proptit.vieshop.service.UserService;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Page<User> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageRequest.of(Math.max(page,0), Math.min(Math.max(size,1),20), Sort.Direction.ASC, sortBy);
        List<User> list = userRepository.findAll();
        return new PageImpl<>(list, pageable, list.size());
    }

    @Override
    public void createUser(User user) {
        user.setPasswordHash(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    public String updateUser(Long id, UserDTO userDTO) {
        User userInDB = userRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Username not found"));
        userInDB.setFullName(userDTO.getFullName());
        userInDB.setEmail(userDTO.getEmail());
        userInDB.setPhoneNumber(userDTO.getPhoneNumber());
        userRepository.save(userInDB);
        return "User information updated successfully";
    }

    @Override
    public String updatePassword(Long id, String oldPassword, String newPassword) {
        User userInDB = userRepository.findById(id).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "User not found"));
        boolean isOldPasswordValid = passwordEncoder.matches(oldPassword, userInDB.getPasswordHash());
        if (!isOldPasswordValid) throw new CustomException(HttpStatus.FORBIDDEN, "Old password does not match");
        userInDB.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(userInDB);
        return "Password updated successfully";
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(
                () -> new CustomException(HttpStatus.NOT_FOUND, "User not found")
        );
    }

    @Override
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username: " + username + " not found"));
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public String deleteUser(Long id) {
        User userInDB = userRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Username not found"));
        if(userInDB.getIsDelete()) throw new CustomException(HttpStatus.NOT_FOUND, "Username not found");
        userInDB.setIsDelete(true);
        userRepository.save(userInDB);
        return "User deleted!";
    }
    
    // New methods for admin dashboard
    
    @Override
    public Page<User> findByRole(String role, int size, int page, String sortBy) {
        Pageable pageable = PageRequest.of(Math.max(page,0), Math.min(Math.max(size,1),20), Sort.Direction.ASC, sortBy);
        // Since there's no direct findByRole method, we'll filter the results manually
        List<User> allUsers = userRepository.findAll();
        List<User> filteredUsers = allUsers.stream()
                .filter(user -> user.getRole() != null && user.getRole().toString().equalsIgnoreCase(role))
                .collect(Collectors.toList());
        
        return new PageImpl<>(filteredUsers, pageable, filteredUsers.size());
    }
    
    @Override
    public Page<User> searchUsers(String query, String role, int size, int page, String sortBy) {
        Pageable pageable = PageRequest.of(Math.max(page,0), Math.min(Math.max(size,1),20), Sort.Direction.ASC, sortBy);
        
        List<User> allUsers = userRepository.findAll();
        List<User> filteredUsers;
        
        if (role != null && !role.isEmpty()) {
            // Filter by role and search query
            filteredUsers = allUsers.stream()
                    .filter(user -> user.getRole() != null && user.getRole().toString().equalsIgnoreCase(role))
                    .filter(user -> 
                        user.getUsername().contains(query) || 
                        (user.getFullName() != null && user.getFullName().contains(query)))
                    .collect(Collectors.toList());
        } else {
            // Just search by username or full name
            filteredUsers = allUsers.stream()
                    .filter(user -> 
                        user.getUsername().contains(query) || 
                        (user.getFullName() != null && user.getFullName().contains(query)))
                    .collect(Collectors.toList());
        }
        
        return new PageImpl<>(filteredUsers, pageable, filteredUsers.size());
    }
    
    @Override
    public User createUserByAdmin(UserDTO userDTO) {
        // Check if username already exists
        if (existsByUsername(userDTO.getUsername())) {
            throw new CustomException(HttpStatus.CONFLICT, "Username already exists");
        }
        
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));
        user.setEmail(userDTO.getEmail());
        user.setFullName(userDTO.getFullName());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        
        // Note: Role handling would need to be implemented based on the actual User model
        // For now, we'll leave it to the default value set by the User constructor
        
        user.setIsDelete(false);
        
        return userRepository.save(user);
    }
    
    @Override
    public String updateUserByAdmin(Long id, UserDTO userDTO) {
        User user = getUserById(id);
        
        // Update user fields
        if (userDTO.getUsername() != null && !userDTO.getUsername().equals(user.getUsername())) {
            // Check if new username already exists
            if (existsByUsername(userDTO.getUsername())) {
                return "Username already exists";
            }
            user.setUsername(userDTO.getUsername());
        }
        
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));
        }
        
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail());
        }
        
        if (userDTO.getFullName() != null) {
            user.setFullName(userDTO.getFullName());
        }
        
        if (userDTO.getPhoneNumber() != null) {
            user.setPhoneNumber(userDTO.getPhoneNumber());
        }
        
        // Note: Role handling would need to be implemented based on the actual User model
        
        userRepository.save(user);
        return "User updated successfully";
    }
    
    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
