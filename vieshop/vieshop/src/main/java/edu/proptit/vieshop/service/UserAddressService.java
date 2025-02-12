package edu.proptit.vieshop.service;

import edu.proptit.vieshop.model.users.UserAddress;

import java.util.List;

public interface UserAddressService {
    List<UserAddress> findAllUserAddress(Long userId);
    String addUserAddress(UserAddress userAddress);
    String updateUserAddress(UserAddress userAddress);
    String deleteUserAddress(UserAddress userAddress);
}
