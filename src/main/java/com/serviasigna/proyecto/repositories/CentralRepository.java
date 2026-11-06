package com.serviasigna.proyecto.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.serviasigna.proyecto.models.users.Central;

public interface CentralRepository extends JpaRepository<Central, String> {
}
