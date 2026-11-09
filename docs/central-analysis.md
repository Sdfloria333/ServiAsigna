# Análisis: Módulo Central

## 1. Descripción
Gestión de las centrales o sedes operativas encargadas de despachar pedidos y asignar domiciliarios.

## 2. Requerimientos Funcionales
- **RF-C01 - Crear Central:** Registrar una nueva central con sus datos básicos.
- **RF-C02 - Listar Centrales:** Consultar todas las sedes registradas.
- **RF-C03 - Buscar por ID:** Obtener los datos de una central por su `id`.
- **RF-C04 - Cambiar Estado:** Cambiar el `status` entre `ACTIVE` e `INACTIVE`.

## 3. Reglas de Negocio
- Una central con `status = INACTIVE` no puede despachar servicios ni tener repartidores asignados.

## 4. Estructura de Datos (Variables)
- `document`:String (Identificacion natural)
- `name`: String (Nombre de la sede)
- `phone`: String (Teléfono de contacto)
- `status`: Enum (`ACTIVE`, `INACTIVE`)