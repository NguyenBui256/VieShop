package edu.proptit.vieshop.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import edu.proptit.vieshop.dao.OrderRepository;
import edu.proptit.vieshop.dao.ProductsRepository;
import edu.proptit.vieshop.dao.ShopRepository;
import edu.proptit.vieshop.dao.UserRepository;
import edu.proptit.vieshop.model.orders.Order;
import edu.proptit.vieshop.model.users.User;
import edu.proptit.vieshop.service.AdminService;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ProductsRepository productsRepository;
    private final OrderRepository orderRepository;

    @Override
    public Map<String, Object> getStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // Count total users, shops, products, and orders
        long totalUsers = userRepository.count();
        long totalShops = shopRepository.count();
        long totalProducts = productsRepository.count();
        long totalOrders = orderRepository.count();
        
        statistics.put("totalUsers", totalUsers);
        statistics.put("totalShops", totalShops);
        statistics.put("totalProducts", totalProducts);
        statistics.put("totalOrders", totalOrders);
        
        // Generate sales data for the last 30 days
        List<Map<String, Object>> salesData = generateSalesData();
        statistics.put("salesData", salesData);
        
        // Generate user growth data for the last 12 months
        List<Map<String, Object>> userGrowthData = generateUserGrowthData();
        statistics.put("userGrowthData", userGrowthData);
        
        return statistics;
    }
    
    private List<Map<String, Object>> generateSalesData() {
        List<Map<String, Object>> salesData = new ArrayList<>();
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");
        
        // Get all orders
        List<Order> allOrders = orderRepository.findAll();
        
        // Create a map to store sales by date
        Map<LocalDate, Double> salesByDate = new HashMap<>();
        
        // Group orders by date and sum the total amounts
        for (Order order : allOrders) {
            LocalDate orderDate = order.getCreatedAt().toLocalDate();
            if (orderDate.isAfter(today.minusDays(31))) {
                Double currentAmount = salesByDate.getOrDefault(orderDate, 0.0);
                salesByDate.put(orderDate, currentAmount + order.getTotalAmount());
            }
        }
        
        // Create data points for each day in the last 30 days
        for (int i = 30; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String formattedDate = date.format(formatter);
            double amount = salesByDate.getOrDefault(date, 0.0);
            
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("date", formattedDate);
            dataPoint.put("amount", amount);
            
            salesData.add(dataPoint);
        }
        
        return salesData;
    }
    
    private List<Map<String, Object>> generateUserGrowthData() {
        List<Map<String, Object>> userGrowthData = new ArrayList<>();
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        
        // Get all users
        List<User> allUsers = userRepository.findAll();
        
        // Create a map to store user counts by month
        Map<String, Integer> usersByMonth = new HashMap<>();
        
        // Group users by month
        for (User user : allUsers) {
            LocalDateTime createdAt = user.getCreatedAt();
            if (createdAt != null && createdAt.toLocalDate().isAfter(today.minusMonths(12))) {
                String monthKey = createdAt.format(DateTimeFormatter.ofPattern("yyyy-MM"));
                usersByMonth.put(monthKey, usersByMonth.getOrDefault(monthKey, 0) + 1);
            }
        }
        
        // Create data points for each month in the last 12 months
        for (int i = 11; i >= 0; i--) {
            LocalDate date = today.withDayOfMonth(1).minusMonths(i);
            String monthKey = date.format(DateTimeFormatter.ofPattern("yyyy-MM"));
            String formattedDate = date.format(formatter);
            int count = usersByMonth.getOrDefault(monthKey, 0);
            
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("date", formattedDate);
            dataPoint.put("count", count);
            
            userGrowthData.add(dataPoint);
        }
        
        return userGrowthData;
    }
} 