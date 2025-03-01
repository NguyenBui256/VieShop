package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.UserAddressesRepository;
import edu.proptit.vieshop.dto.CustomException;
import edu.proptit.vieshop.model.users.UserAddress;
import edu.proptit.vieshop.service.UserAddressService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class UserAddressImpl implements UserAddressService {
    private final UserAddressesRepository userAddressesRepository;

    @Override
    public List<UserAddress> findUserAddress(Long userId) {
        return userAddressesRepository.findUserAddressByUser(userId);
    }

    @Override
    public String addUserAddress(UserAddress userAddress) {
        userAddressesRepository.save(userAddress);
        return "Success";
    }

    @Override
    public String updateUserAddress(Long addressId, UserAddress userAddress) {
        UserAddress usrAdr = userAddressesRepository.findById(addressId)
                .orElseThrow(() -> new CustomException().notFound("User Address"));
        usrAdr.setUpdatedAt(LocalDateTime.now());
        usrAdr.setAddressTitle(userAddress.getAddressTitle());
        usrAdr.setStreetAddress(userAddress.getStreetAddress());
        usrAdr.setDistrict(userAddress.getDistrict());
        usrAdr.setPhone(userAddress.getPhone());
        usrAdr.setProvince(userAddress.getProvince());
        usrAdr.setRecipientName(userAddress.getRecipientName());
        userAddressesRepository.save(usrAdr);
        return "Success";
    }

    @Override
    public String deleteUserAddress(Long addressId) {
        UserAddress usrAdr = userAddressesRepository.findById(addressId)
                .orElseThrow(() -> new CustomException().notFound("User Address"));
        usrAdr.setIsDelete(true);
        userAddressesRepository.save(usrAdr);
        return "Success";
    }
}
