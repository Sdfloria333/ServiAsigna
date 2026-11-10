package com.serviasigna.proyecto.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.serviasigna.proyecto.models.service.ServiceOrder;
import com.serviasigna.proyecto.models.service.ServiceStatus;
import com.serviasigna.proyecto.models.users.Courier;
import com.serviasigna.proyecto.repositories.ServiceOrderRepository;

@Service
public class ServiceOrderService {

    private final ServiceOrderRepository orderRepository;

    public ServiceOrderService(ServiceOrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Busca un servicio por id o lanza un error claro si no existe
    private ServiceOrder findOrderOrThrow(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException(
                        "No se encontró el servicio con id: " + orderId));
    }

    // Crea un servicio de domicilio
    @Transactional
    public ServiceOrder createOrder(ServiceOrder order) {
        order.setStatus(ServiceStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    // Trae todos los servicios de domicilio
    @Transactional(readOnly = true)
    public List<ServiceOrder> getAllOrders() {
        return orderRepository.findAll();
    }

    // Asigna un domiciliario a un servicio
    @Transactional
    public ServiceOrder assignCourier(Long orderId, Courier courier) {
        if (courier == null) {
            throw new IllegalArgumentException("El domiciliario no puede ser nulo");
        }

        ServiceOrder order = findOrderOrThrow(orderId);

        if (order.getStatus() != ServiceStatus.PENDING) {
            throw new IllegalStateException(
                    "Solo se puede asignar domiciliario a un servicio PENDING. Estado actual: "
                            + order.getStatus());
        }

        order.setCourier(courier);
        order.setStatus(ServiceStatus.ASSIGNED);
        return orderRepository.save(order);
    }

    // FR-S04: Actualiza el estado (IN_TRANSIT -> DELIVERED)
    @Transactional
    public ServiceOrder updateStatus(Long orderId, ServiceStatus newStatus) {
        if (newStatus != ServiceStatus.IN_TRANSIT && newStatus != ServiceStatus.DELIVERED) {
            throw new IllegalArgumentException(
                    "Solo se permite cambiar a IN_TRANSIT o DELIVERED. Recibido: " + newStatus);
        }

        ServiceOrder order = findOrderOrThrow(orderId);

        if (order.getStatus() == ServiceStatus.CANCELLED
                || order.getStatus() == ServiceStatus.DELIVERED) {
            throw new IllegalStateException(
                    "No se puede cambiar el estado de un servicio " + order.getStatus());
        }

        order.setStatus(newStatus);

        if (newStatus == ServiceStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        return orderRepository.save(order);
    }

    // FR-S05: Cancela el servicio y libera al domiciliario
    @Transactional
    public ServiceOrder cancelOrder(Long orderId) {
        ServiceOrder order = findOrderOrThrow(orderId);

        if (order.getStatus() == ServiceStatus.DELIVERED) {
            throw new IllegalStateException("No se puede cancelar un servicio ya entregado");
        }
        if (order.getStatus() == ServiceStatus.CANCELLED) {
            throw new IllegalStateException("El servicio ya está cancelado");
        }

        order.setStatus(ServiceStatus.CANCELLED);
        order.setCourier(null); // Libera al domiciliario
        return orderRepository.save(order);
    }
}