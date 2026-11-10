package com.serviasigna.proyecto.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.serviasigna.proyecto.models.users.Courier;
import com.serviasigna.proyecto.models.users.Status;
import com.serviasigna.proyecto.repositories.CourierRepository;

@Service
public class CourierService {

    private final CourierRepository courierRepository;

    public CourierService(CourierRepository courierRepository) {
        this.courierRepository = courierRepository;
    }

    public Courier createCourier(Courier courier) {
        if (courier.getStatus() == null) {
            courier.setStatus(Status.ACTIVE);
        }
        return courierRepository.save(courier);
    }

    public List<Courier> getAllCouriers() {
        return courierRepository.findAll();
    }

    public Courier getCourierById(String document) {
        return courierRepository.findById(document)
                .orElseThrow(() -> new RuntimeException("Domiciliario no encontrado con cédula: " + document));
    }

    public Courier updateCourierStatus(String document, Status status) {
        Courier courier = getCourierById(document);
        courier.setStatus(status);
        return courierRepository.save(courier);
    }
}
