package edu.proptit.vieshop.dto;

import edu.proptit.vieshop.common.MessageType;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageDTO {

    private MessageType type;
    private String content;
    private String sender;

}