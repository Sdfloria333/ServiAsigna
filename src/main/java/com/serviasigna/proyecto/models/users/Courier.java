package com.serviasigna.proyecto.models.users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "DOMICILIARIO")
public class Courier {
    @Id
    @Column(name = "CEDULA", length = 20, nullable = false)
    private String document;

    @Column(name = "NOMBRE", length = 15, nullable = false)
    private String name;

    @Column(name = "TELEFONO", length = 10, nullable = false)
    private String phone;

    @Column(name = "ESTADO", length = 10, nullable = false)
    private Status status;

    public Courier() {
    }

    public String getDocument() {
        return document;
    }

    public void setDocument(String document) {
        this.document = document;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}