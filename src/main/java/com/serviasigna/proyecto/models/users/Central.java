package com.serviasigna.proyecto.models.users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "CENTRAL")
public class Central {

    @Id
    @Column(name = "CEDULA", length = 20, nullable = false)
    private String document;
    @Column(name = "NOMBRE", length = 15, nullable = false)
    private String name;
    @Column(name = "TELEFONO", length = 10, nullable = false)
    private String phone;
    @Column(name = "ESTADO", length = 10, nullable = false)
    private String state;

    public Central() {
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

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

}
