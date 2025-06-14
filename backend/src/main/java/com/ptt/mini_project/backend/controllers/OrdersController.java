package com.ptt.mini_project.backend.controllers;

import com.ptt.mini_project.backend.entities.Order;
import com.ptt.mini_project.backend.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrdersController {

    private final OrderService orderService;

    @PostMapping("/postNewOrder")
    public ResponseEntity<Order> postNewOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.postNewOrder(order));
    }

    @GetMapping("/getOrderById/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PutMapping("/orderCompleted/{id}")
    public ResponseEntity<Void> markOrderCompletedById(@PathVariable Long id) {
        boolean updated = orderService.markOrderCompletedById(id);
        return updated ? new ResponseEntity<>(HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/getAllFinalizedOrders")
    public ResponseEntity<List<Order>> getAllFinalizedOrders(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(orderService.getAllFinalizedOrders(token));
    }

    @GetMapping("/getAllCompletedOrders")
    public ResponseEntity<List<Order>> getAllCompletedOrders(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(orderService.getAllCompletedOrders(token));
    }

}
