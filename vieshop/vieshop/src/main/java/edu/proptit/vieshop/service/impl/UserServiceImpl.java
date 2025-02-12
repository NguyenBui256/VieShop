package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.UserRepository;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.dto.UserDTO;
import edu.proptit.vieshop.model.products.Product;
import edu.proptit.vieshop.model.users.User;
import edu.proptit.vieshop.service.UserService;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


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
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Username: " + username + " not found"));
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
}
