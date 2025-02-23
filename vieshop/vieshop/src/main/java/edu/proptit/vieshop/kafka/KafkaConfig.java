package edu.proptit.vieshop.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaConfig {
    @Bean
    NewTopic messageTopic() {
        return new NewTopic("message", 2, (short) 1);
    }
}
