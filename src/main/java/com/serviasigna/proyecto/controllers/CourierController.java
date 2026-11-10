package com.serviasigna.proyecto.controllers;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.serviasigna.proyecto.models.users.Courier;
import com.serviasigna.proyecto.models.users.Status;
import com.serviasigna.proyecto.services.CourierService;

@RestController
@RequestMapping("/api/couriers")
public class CourierController {

    private final CourierService courierService;

    public CourierController(CourierService courierService) {
        this.courierService = courierService;
    }

    @PostMapping
    public ResponseEntity<Courier> createCourier(@RequestBody Courier courier) {
        return ResponseEntity.status(HttpStatus.CREATED).body(courierService.createCourier(courier));
    }

    @GetMapping
    public ResponseEntity<List<Courier>> getAllCouriers() {
        return ResponseEntity.ok(courierService.getAllCouriers());
    }

    @GetMapping("/{document}")
    public ResponseEntity<Courier> getCourierById(@PathVariable String document) {
        return ResponseEntity.ok(courierService.getCourierById(document));
    }

    @PatchMapping("/{document}/status")
    public ResponseEntity<Courier> updateCourierStatus(
            @PathVariable String document,
            @RequestParam Status status) {
        return ResponseEntity.ok(courierService.updateCourierStatus(document, status));
    }
}
