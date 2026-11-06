package com.serviasigna.proyecto.models.usuarios;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "CENTRAL")
public class Central {

    @Id
    @Column(name = "CEDULA", length = 20, nullable = false)
    private String cedula;
    @Column(name = "NOMBRE", length = 15, nullable = false)
    private String nombre;
    @Column(name = "TELEFONO", length = 10, nullable = false)
    private String telefono;
    @Column(name = "ESTADO", length = 10, nullable = false)
    private String estado;

    public Central() {
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

}
