package com.ptt.mini_project.backend.controllers;

import com.ptt.mini_project.backend.entities.Item;
import com.ptt.mini_project.backend.entities.enums.Category;
import com.ptt.mini_project.backend.services.ItemsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemsController {

    private final ItemsService itemsService;

    @GetMapping("/getAllItems")
    public ResponseEntity<List<Item>> getAllItems() {
        return ResponseEntity.ok(itemsService.getAllItems());
    }

    @GetMapping("/getItemById/{itemId}")
    public ResponseEntity<Item> getItemById(@PathVariable Long itemId) {
        return ResponseEntity.ok(itemsService.getItemById(itemId));
    }

    @PostMapping("/postItem")
    public ResponseEntity<Item> postNewItem(@RequestBody Item item) {
        return ResponseEntity.ok(itemsService.createNewItem(item));
    }

    @PutMapping("/toggleAvailability/{itemId}")
    public ResponseEntity<Item> toggleAvailability(@PathVariable Long itemId) {
        return ResponseEntity.ok(itemsService.toggleAvailability(itemId));
    }

    @GetMapping("/getAllItemsByCategory/{category}")
    public ResponseEntity<List<Item>> getItemsByCategory(@PathVariable Category category) {
        return ResponseEntity.ok(itemsService.getItemsByCategory(category));
    }

    @GetMapping("/getItemsAvailableByCategory/{category}")
    public ResponseEntity<List<Item>> getItemsAvailableByCategory(@PathVariable Category category) {
        return ResponseEntity.ok(itemsService.getItemsAvailableByCategory(category));
    }

    @DeleteMapping("/deleteItem/{itemId}")
    public ResponseEntity<Void> deleteItemById(@PathVariable Long itemId) {
        itemsService.deleteItemById(itemId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
