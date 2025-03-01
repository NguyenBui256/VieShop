package edu.proptit.vieshop.dto;

import edu.proptit.vieshop.common.MessageType;
import edu.proptit.vieshop.common.ReceiverType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
    private String createdAt;
}
