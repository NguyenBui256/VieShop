package edu.proptit.vieshop.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String userId, Notification notifcation) {
        log.info("Sending WS noti to {} with payload {}", userId, notifcation);
        messagingTemplate.convertAndSendToUser(
                userId,
                "/notification",
                notifcation
        );
    }
}
