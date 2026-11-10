package com.serviasigna.proyecto.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.serviasigna.proyecto.models.service.ServiceOrder;
import com.serviasigna.proyecto.models.service.ServiceStatus;

public interface ServiceOrderRepository extends JpaRepository<ServiceOrder, Long> {

    List<ServiceOrder> findByStatus(ServiceStatus status);

    List<ServiceOrder> findByCourierId(String courierDocument);

    List<ServiceOrder> findByCentralId(String centralDocument);
}
