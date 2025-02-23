package edu.proptit.vieshop.websocket;

import edu.proptit.vieshop.dto.ChatMessageDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebsocketService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String userId, Notification notifcation) {
        log.info("Sending WS noti to {} with payload {}", userId, notifcation);
        messagingTemplate.convertAndSendToUser(
                userId,
                "/notification",
                notifcation
        );
    }

    @MessageMapping("chat")
    @SendTo("/topic/messages")
    public void sendMessage(String userId, ChatMessageDTO messageDTO) {
        String time = new SimpleDateFormat("HH:mm").format(new Date());

    }
}
