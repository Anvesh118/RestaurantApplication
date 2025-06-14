package com.ptt.mini_project.backend.repositories;

import com.ptt.mini_project.backend.entities.Item;
import com.ptt.mini_project.backend.entities.enums.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemsRepository extends JpaRepository<Item, Long> {
    Optional<Item> findByItemContainingIgnoreCase(String item);
    List<Item> findAllByCategoryAndIsAvailableTrue(Category category);
    List<Item> findAllByCategory(Category category);
    Optional<Item> findByItemIgnoreCase(String itemName);

    boolean findByItem(String item);
}
