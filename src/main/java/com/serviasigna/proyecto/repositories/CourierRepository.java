package com.serviasigna.proyecto.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.serviasigna.proyecto.models.users.Courier;

public interface CourierRepository extends JpaRepository<Courier, String> {
}
