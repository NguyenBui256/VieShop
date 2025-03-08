package edu.proptit.vieshop.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import edu.proptit.vieshop.dao.InvalidatedTokenRepository;
import edu.proptit.vieshop.dao.UserRepository;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.dto.UserDTO;
import edu.proptit.vieshop.model.InvalidatedToken;
import edu.proptit.vieshop.model.users.User;
import edu.proptit.vieshop.service.AuthenticationService;
import edu.proptit.vieshop.service.JWTService;
import edu.proptit.vieshop.service.UserService;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final InvalidatedTokenRepository invalidatedRepository;
    
    public AuthenticationServiceImpl(UserRepository userRepository, UserService userService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JWTService jwtService, InvalidatedTokenRepository invalidatedRepository) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.invalidatedRepository = invalidatedRepository;
    }
    
    @Override
    public String signUp(UserDTO user) {
        log.info("Request: {}", user);
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "Username already exists");
        }
        User toSaveUser = new User(user);
        toSaveUser.setPasswordHash(passwordEncoder.encode(user.getPassword()));
        log.info("User: {}", user);
        userService.createUser(toSaveUser);
        return "OK";
    }
    
    @Override
    public Map<String, Object> signIn(Map<String, Object> request) {
        String username = request.getOrDefault("username", "").toString();
        String password = request.getOrDefault("password", "").toString();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );
        User signInUser = userRepository.findByUsername(username).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "User not found"));
        String accessToken = jwtService.generateToken(signInUser);
        String refreshToken = jwtService.generateRefreshToken(signInUser);
        
        Map<String, Object> response = new HashMap<>();
        response.put("access_token", accessToken);
        response.put("refresh_token", refreshToken);
        response.put("user", signInUser);
        response.put("message", "Success");
        return response;
    }
    
    @Override
    public Map<String, Object> refreshToken(Map<String, Object> request) {
        String refreshToken = request.getOrDefault("refresh_token", "").toString();
        if (refreshToken.isEmpty() || !jwtService.validateToken(refreshToken)) {
            throw new CustomException(HttpStatus.UNAUTHORIZED, "Invalid Refresh Token");
        }
        String jwt = jwtService.generateToken(jwtService.extractUser(refreshToken));
        Map<String, Object> response = new HashMap<>();
        response.put("access_token", jwt);
        response.put("refresh_token", refreshToken);
        return response;
    }

    @Override
    public String logout(String token) {
//        if(jwtService.validateToken(token)) throw new CustomException(HttpStatus.UNAUTHORIZED, "Invalidate token");
        Claims claims = jwtService.extractAllClaims(token);
        String jit = claims.getId();
        System.out.println(jit);
        Date expirationTime = claims.getExpiration();
        invalidatedRepository.save(new InvalidatedToken(jit, expirationTime));
        return "Logged out successfully!";
    }
}
