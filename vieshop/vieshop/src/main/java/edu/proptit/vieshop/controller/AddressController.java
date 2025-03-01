package edu.proptit.vieshop.controller;

import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.model.users.User;
import edu.proptit.vieshop.model.users.UserAddress;
import edu.proptit.vieshop.service.UserAddressService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/address")
public class AddressController {
    private final UserAddressService userAddressService;

    @GetMapping("/personal-address")
    public CustomResponse<?> getPersonalAddress() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User tokenUser = (User) authentication.getPrincipal();
        return new CustomResponse<>().data(userAddressService.findUserAddress(tokenUser.getId()));
    }

    @PostMapping("")
    public CustomResponse<?> addPersonalAddress(@Valid @RequestBody UserAddress userAddress) {
        return new CustomResponse<>().data(userAddressService.addUserAddress(userAddress));
    }

    @PutMapping("/{addressId}")
    public CustomResponse<?> updateAddress(@PathVariable Long addressId, @RequestBody @Valid UserAddress userAddress) {
        return new CustomResponse<>().data(userAddressService.updateUserAddress(addressId, userAddress));
    }

    @DeleteMapping("/{addressId}")
    public CustomResponse<?> updateAddress(@PathVariable Long addressId) {
        return new CustomResponse<>().data(userAddressService.deleteUserAddress(addressId));
    }

}
