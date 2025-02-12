package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.UserAddressesRepository;
import edu.proptit.vieshop.model.users.UserAddress;
import edu.proptit.vieshop.service.UserAddressService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UserAddressImpl implements UserAddressService {
    private final UserAddressesRepository userAddressesRepository;

    @Override
    public List<UserAddress> findAllUserAddress(Long userId) {
        return userAddressesRepository.findUserAddressByUser(userId);
    }

    @Override
    public String addUserAddress(UserAddress userAddress) {
        return "";
    }

    @Override
    public String updateUserAddress(UserAddress userAddress) {
        return "";
    }

    @Override
    public String deleteUserAddress(UserAddress userAddress) {
        return "";
    }
}
