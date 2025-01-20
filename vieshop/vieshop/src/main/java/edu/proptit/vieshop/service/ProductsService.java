package edu.proptit.vieshop.service;

import edu.proptit.vieshop.model.products.Products;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductsService {
    List<Products> findAll(int size, int page, String sortBy);
    Products findById(int id);
    List<Products> findByUsername(String name);
    Products save(Products user);
    void deleteById(int id);
}
