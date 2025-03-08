package edu.proptit.vieshop.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.proptit.vieshop.dto.CustomResponse;
import edu.proptit.vieshop.service.AdminService;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/statistics")
    public CustomResponse<?> getStatistics() {
        Map<String, Object> statistics = adminService.getStatistics();
        return new CustomResponse<>().data(statistics);
    }
} 