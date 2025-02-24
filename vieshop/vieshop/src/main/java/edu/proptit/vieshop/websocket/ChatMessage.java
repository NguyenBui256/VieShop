package edu.proptit.vieshop.websocket;

import edu.proptit.vieshop.common.MessageType;
import edu.proptit.vieshop.common.ReceiverType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    private String messageId;
    private MessageType messageType;
    private String content;
    private String senderName;
    private String senderId;
    private String receiverName;
    private String receiverId;
    private ReceiverType receiverType;
    private LocalDateTime timestamp;
}
