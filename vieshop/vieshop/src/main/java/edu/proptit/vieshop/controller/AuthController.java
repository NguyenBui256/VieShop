package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.dto.UserDTO;
import edu.proptit.vieshop.model.users.User;
import edu.proptit.vieshop.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class AuthController {
    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/auth/sign-up")
    public CustomResponse<?> signUp(@RequestBody @Valid UserDTO user) {
        return new CustomResponse<>().message(authenticationService.signUp(user));
    }

    @PostMapping("/auth/sign-in")
    public CustomResponse<?> signIn(@RequestBody Map<String, Object> request) {
        return new CustomResponse<>().data(authenticationService.signIn(request));
    }

    @PostMapping("/refresh")
    public CustomResponse<?> refresh(@RequestBody Map<String, Object> request) {
        return new CustomResponse<>().data(authenticationService.refreshToken(request));
    }

    @PostMapping("/logout")
    public CustomResponse<?> logout(HttpServletRequest request) {
        final String jwt = request.getHeader("Authorization").substring(7);
        return new CustomResponse<>().message(authenticationService.logout(jwt));
    }
}
