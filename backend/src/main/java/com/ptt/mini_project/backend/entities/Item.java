package com.ptt.mini_project.backend.entities;

import com.ptt.mini_project.backend.entities.enums.Category;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Table(name = "items_table")
@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String item;
    @Column(nullable = false)
    private Double price;
    private Boolean isAvailable;

    @Enumerated(EnumType.STRING)
    private Category category;
}
