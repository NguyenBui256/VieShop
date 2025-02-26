package edu.proptit.vieshop.service.websocket;

import edu.proptit.vieshop.common.NotificationStatus;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notification {
    private NotificationStatus status;
    private String message;
    private String title;
}
