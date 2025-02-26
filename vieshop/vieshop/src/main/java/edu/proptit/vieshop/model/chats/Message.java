package edu.proptit.vieshop.model.chats;

import edu.proptit.vieshop.common.MessageType;
import edu.proptit.vieshop.common.ReceiverType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "chat_messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "receiver_id", nullable = false)
    private Long receiverId;

    @Column(name = "receiver_type", nullable = false)
    private String receiverType;

    @Column(name = "receiver_name", nullable = false)
    private String receiverName;

    @Column(name = "message_type", nullable = false)
    private String messageType;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_delete", nullable = false)
    private Boolean isDelete;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

