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

import com.serviasigna.proyecto.models.users.Central;
import com.serviasigna.proyecto.models.users.Status;
import com.serviasigna.proyecto.services.CentralService;

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
