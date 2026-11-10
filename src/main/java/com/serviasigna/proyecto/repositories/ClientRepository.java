package com.serviasigna.proyecto.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.serviasigna.proyecto.models.users.Client;

public interface ClientRepository extends JpaRepository<Client, String> {

}
