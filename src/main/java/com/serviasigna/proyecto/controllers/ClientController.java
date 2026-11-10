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

import com.serviasigna.proyecto.models.users.Client;
import com.serviasigna.proyecto.models.users.Status;
import com.serviasigna.proyecto.services.ClientService;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody Client client) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.createClient(client));
    }

    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @GetMapping("/{document}")
    public ResponseEntity<Client> getClientById(@PathVariable String document) {
        return ResponseEntity.ok(clientService.getClientById(document));
    }

    @PatchMapping("/{document}/status")
    public ResponseEntity<Client> updateClientStatus(
            @PathVariable String document,
            @RequestParam Status status) {
        return ResponseEntity.ok(clientService.updateClientStatus(document, status));
    }
}
