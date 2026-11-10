package com.serviasigna.proyecto.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.serviasigna.proyecto.models.users.Client;
import com.serviasigna.proyecto.models.users.Status;
import com.serviasigna.proyecto.repositories.ClientRepository;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    //metodo crear cliente
    public Client createClient(Client client) {
        if (client.getStatus() == null) {
            client.setStatus(Status.ACTIVE);
        }
        return clientRepository.save(client);
    }

    //metodo para trear los clientes
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    //buscar clientes por cedula
    public Client getClientById(String document) {
        return clientRepository.findById(document)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con cédula: " + document));
    }

    //cambiar el estado del cliente
    public Client updateClientStatus(String document, Status status) {
        Client client = getClientById(document);
        client.setStatus(status);
        return clientRepository.save(client);
    }
}
