package com.ptt.mini_project.backend.services;

import com.ptt.mini_project.backend.entities.Item;
import com.ptt.mini_project.backend.entities.enums.Category;
import com.ptt.mini_project.backend.exceptions.ResourceNotFoundException;
import com.ptt.mini_project.backend.repositories.ItemsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItemsService {

    private final ItemsRepository itemsRepository;

    public List<Item> getAllItems() {
        List<Item> itemList = itemsRepository.findAll();
        log.info("Fetching all items present in item repository");
        return itemList;
    }

    public Item getItemById(Long itemId) {
        log.info("Fetching item from repository : " + itemId);
        Item item = itemsRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id : " + itemId));

        log.info("Item fetched");
        return item;
    }

    public Item createNewItem(Item item) {
        log.info("Creating new Item");
        Item savedItem = itemsRepository.save(item);
        return savedItem;
    }

    public Item toggleAvailability(Long itemId) {
        Item item = itemsRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id : " + itemId));

        item.setIsAvailable(!item.getIsAvailable());

        Item savedItem = itemsRepository.save(item);

        return savedItem;

    }

    public List<Item> getItemsByCategory(Category category) {
        return itemsRepository.findAllByCategory(category);
    }

    public List<Item> getItemsAvailableByCategory(Category category) {
        return itemsRepository.findAllByCategoryAndIsAvailableTrue(category);
    }


    public void deleteItemById(Long itemId) {
        itemsRepository.deleteById(itemId);
    }
}
