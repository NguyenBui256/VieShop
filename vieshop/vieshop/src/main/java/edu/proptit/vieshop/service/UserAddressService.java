package edu.proptit.vieshop.service;

import edu.proptit.vieshop.model.users.UserAddress;

import java.util.List;

public interface UserAddressService {
    List<UserAddress> findUserAddress(Long userId);
    String addUserAddress(UserAddress userAddress);
    String updateUserAddress(Long addressId, UserAddress userAddress);
    String deleteUserAddress(Long addressId);
}
