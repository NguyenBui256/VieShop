package edu.proptit.vieshop.service.impl;

import edu.proptit.vieshop.dao.ProductsRepository;
import edu.proptit.vieshop.model.products.Products;
import edu.proptit.vieshop.service.ProductsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductsServiceImpl implements ProductsService {
    private final ProductsRepository productsRepository;

    public ProductsServiceImpl(ProductsRepository productsRepository) {
        this.productsRepository = productsRepository;
    }

    @Override
    public List<Products> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageRequest.of(Math.max(page,0), Math.min(Math.max(size,1),20), Sort.Direction.ASC, sortBy);
        List<Products> list = productsRepository.findAll();
        for(Products products : list) {
            System.out.println(products.getName() + products.getDescription());
        }
        return list;
    }

    @Override
    public Products findById(int id) {
        return null;
    }

    @Override
    public List<Products> findByUsername(String name) {
        return List.of();
    }

    @Override
    public Products save(Products user) {
        return null;
    }

    @Override
    public void deleteById(int id) {

    }
}
