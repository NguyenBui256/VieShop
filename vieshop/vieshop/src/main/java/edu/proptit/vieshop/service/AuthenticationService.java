package edu.proptit.vieshop.service;


import edu.proptit.vieshop.dto.UserDTO;

import java.util.Map;

public interface AuthenticationService {
    void signUp(UserDTO user);

    Map<String, Object> signIn(Map<String, Object> request);

    Map<String, Object> refreshToken(Map<String, Object> request);

    String logout(String token);
}

