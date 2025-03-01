package edu.proptit.vieshop.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for MapStruct mappers.
 */
@Configuration
@ComponentScan(basePackages = "edu.proptit.vieshop.mapper")
public class MapperConfig {
    // This class is intentionally empty. It's used to enable component scanning for MapStruct mappers.
} 