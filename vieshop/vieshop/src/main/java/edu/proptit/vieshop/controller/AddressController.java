package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.model.users.User;
import edu.proptit.vieshop.service.UserAddressService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/address")
public class AddressController {
    private final UserAddressService userAddressService;

    @GetMapping("/personal-address")
    public CustomResponse<?> getPersonalAddress() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User tokenUser = (User) authentication.getPrincipal();
        return new CustomResponse<>().data(userAddressService.findAllUserAddress(tokenUser.getId()));
    }
}
