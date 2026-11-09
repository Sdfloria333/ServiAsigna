package com.serviasigna.proyecto.controllers;

import com.serviasigna.proyecto.models.users.Central;
import com.serviasigna.proyecto.models.users.Status;
import com.serviasigna.proyecto.services.CentralService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/centrals")
public class CentralController {

    private final CentralService centralService;

    public CentralController(CentralService centralService) {
        this.centralService = centralService;
    }

    // endpoint para crear central 
    @PostMapping
    public ResponseEntity<Central> createCentral(@RequestBody Central central) {
        return ResponseEntity.status(HttpStatus.CREATED).body(centralService.createCentral(central));
    }

    // endpoint para traer las centrales
    @GetMapping
    public ResponseEntity<List<Central>> getAllCentrals() {
        return ResponseEntity.ok(centralService.getAllCentrals());
    }

   // Traer por cédula/documento
@GetMapping("/{document}")
public ResponseEntity<Central> getCentralById(@PathVariable String document) {
    return ResponseEntity.ok(centralService.getCentralById(document));
}

// Cambiar estado
@PatchMapping("/{document}/status")
public ResponseEntity<Central> updateCentralStatus(
        @PathVariable String document,
        @RequestParam Status status) {
    return ResponseEntity.ok(centralService.updateCentralStatus(document, status));
}
}
