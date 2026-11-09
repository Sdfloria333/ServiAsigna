package com.serviasigna.proyecto.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.serviasigna.proyecto.models.users.Central;
import com.serviasigna.proyecto.models.users.Status;
import com.serviasigna.proyecto.repositories.CentralRepository;

@Service
public class CentralService {

    private final CentralRepository centralRepository;

    public CentralService(CentralRepository centralRepository) {
        this.centralRepository = centralRepository;
    }

    // meotod para agregar central
    public Central createCentral(Central central) {
        if (central.getStatus() == null) {
            central.setStatus(Status.ACTIVE);
        }
        return centralRepository.save(central);
    }

    // meotodo para msotrar centrales
    public List<Central> getAllCentrals() {
        return centralRepository.findAll();
    }

    // buscar central por cedula
    public Central getCentralById(String document) {
        return centralRepository.findById(document)
                .orElseThrow(() -> new RuntimeException("Central no encontrada con ID: " + id));
    }

    // FR-C04: Cambiar estado (ACTIVE / INACTIVE)
    public Central updateCentralStatus(String document, Status status) {
        Central central = getCentralById(document);
        central.setStatus(status);
        return centralRepository.save(central);
    }
}
