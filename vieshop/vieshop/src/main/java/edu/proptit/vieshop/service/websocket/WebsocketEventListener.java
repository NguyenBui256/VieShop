package edu.proptit.vieshop.service.websocket;

import edu.proptit.vieshop.common.MessageType;
import edu.proptit.vieshop.dto.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebsocketEventListener {
    private final SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String userId = (String) headerAccessor.getSessionAttributes().get("userId");
        if (username != null) {
            log.info("user disconnected: {}", username);
            var chatMessageDTO = ChatMessage.builder()
                    .messageType(MessageType.LEAVE)
                    .senderName(username)
                    .senderId(userId)
                    .build();
            messagingTemplate.convertAndSend("/user/public", chatMessageDTO);
        }
    }
}
