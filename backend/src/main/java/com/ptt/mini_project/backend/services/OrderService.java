package com.ptt.mini_project.backend.services;

import com.ptt.mini_project.backend.entities.Item;
import com.ptt.mini_project.backend.entities.Order;
import com.ptt.mini_project.backend.entities.OrderItem;
import com.ptt.mini_project.backend.entities.User;
import com.ptt.mini_project.backend.exceptions.ResourceNotFoundException;
import com.ptt.mini_project.backend.repositories.ItemsRepository;
import com.ptt.mini_project.backend.repositories.OrderRepository;
import com.ptt.mini_project.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ItemsRepository itemsRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;


    public Order postNewOrder(Order order) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        if(user == null) {
            throw new RuntimeException("USER NOT FOUND... Login Again");
        }
//        System.out.println(user);
        order.setTotalPrice(computeTotalPrice(order.getOrderItems()));
        order.setUser(user);
        return orderRepository.save(order);
    }

    private Double computeTotalPrice(List<OrderItem> orderItems) {
        return orderItems.stream()
                .mapToDouble(item -> {
                    Double price = getPriceOfItem(item.getItemName());
                    return (price != null) ? price * item.getQuantity() : 0.0;
                })
                .sum();  // Sum up all item prices
    }
    private Double getPriceOfItem(String item) {

        Item itemExtracted = itemsRepository.findByItemIgnoreCase(item)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id : " + item));
        return itemExtracted.getPrice();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id : " + id));
    }

    public boolean markOrderCompletedById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id : " + id));

        order.setIsFinalized(false);
        order.setIsCompleted(true);
        orderRepository.save(order);
        return true;
    }

    public List<Order> getAllFinalizedOrders(String token) {
        String email = jwtService.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(email);
        if(user == null) {
            throw new RuntimeException("USER NOT FOUND... Login Again");
        }
        if(user.getRole().equalsIgnoreCase("ADMIN") || user.getRole().equalsIgnoreCase("KITCHEN")) return  orderRepository.findAllByIsFinalizedIsTrue();
        return user.getOrders().stream()
                .filter(order -> order.getIsFinalized().equals(true))
                .collect(Collectors.toList());
    }

    public List<Order> getAllCompletedOrders(String token) {
        String email = jwtService.extractUsername(token.substring(7));
        User user = userRepository.findByEmail(email);
        if(user == null) {
            throw new RuntimeException("USER NOT FOUND... Login Again");
        }
        if(user.getRole().equalsIgnoreCase("ADMIN")) return orderRepository.findAllByIsCompletedTrue();
        return user.getOrders().stream()
                .filter(order -> order.getIsCompleted().equals(true))
                .collect(Collectors.toList());
    }



}
