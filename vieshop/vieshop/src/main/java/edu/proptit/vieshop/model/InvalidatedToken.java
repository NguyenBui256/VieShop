package edu.proptit.vieshop.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name= "invalidate_tokens")
public class InvalidatedToken {
    @Id
    @Column(name = "id", nullable = false)
    String id;
    @Column(name = "expiration", nullable = false)
    Date expiryTime;
}
