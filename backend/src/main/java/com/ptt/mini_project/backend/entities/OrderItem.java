package com.ptt.mini_project.backend.entities;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    private String itemName;
    private Double price;
    private Integer quantity;
}
