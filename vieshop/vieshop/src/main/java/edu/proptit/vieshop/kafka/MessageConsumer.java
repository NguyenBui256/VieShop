package edu.proptit.vieshop.kafka;

import edu.proptit.vieshop.dto.ChatMessageDTO;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@KafkaListener(id="groupA", topics = {"message"})
public class MessageConsumer {
    @KafkaHandler
    public void listenMessage(ChatMessageDTO message) {
        System.out.println("Received: " + message);
    }

    @KafkaHandler(isDefault = true)
    public void listenDefault(ChatMessageDTO message) {
        System.out.println("Received unknown: " + message);
    }
}
