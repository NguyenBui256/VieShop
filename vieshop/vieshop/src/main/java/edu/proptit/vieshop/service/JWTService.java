package edu.proptit.vieshop.service;

import edu.proptit.vieshop.model.users.User;
import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

public interface JWTService {
    User extractUser(String token);
    String generateToken(User user);
    String generateRefreshToken(User user);
    boolean validateToken(String token);
    Claims extractAllClaims(String token);
}
