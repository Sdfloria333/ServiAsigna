package com.serviasigna.proyecto.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.serviasigna.proyecto.models.service.ServiceOrder;
import com.serviasigna.proyecto.models.service.ServiceStatus;
import com.serviasigna.proyecto.services.ServiceOrderService;

@RestController
@RequestMapping("/api/services")
public class ServiceOrderController {

    private final ServiceOrderService orderService;

    public ServiceOrderController(ServiceOrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ServiceOrder> createOrder(@RequestBody ServiceOrder order) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(order));
    }

    @GetMapping
    public ResponseEntity<List<ServiceOrder>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceOrder> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ServiceOrder> assignCourier(
            @PathVariable Long id,
            @RequestParam String courierDocument) {
        return ResponseEntity.ok(orderService.assignCourier(id, courierDocument));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ServiceOrder> updateStatus(
            @PathVariable Long id,
            @RequestParam ServiceStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ServiceOrder> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(id));
    }
}
