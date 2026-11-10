# Análisis: Módulo Courier (Domiciliario)

## 1. Descripción
Gestión de los domiciliarios encargados de realizar las entregas y atender los servicios despachados por la central.

## 2. Requerimientos Funcionales
- **RF-D01 - Crear Domiciliario:** Registrar un nuevo domiciliario con sus datos básicos.
- **RF-D02 - Listar Domiciliarios:** Consultar todos los repartidores registrados.
- **RF-D03 - Buscar por ID:** Obtener los datos de un domiciliario por su cédula (`document`).
- **RF-D04 - Cambiar Estado:** Alternar el `status` entre `ACTIVE` e `INACTIVE`.

## 3. Reglas de Negocio
- Un domiciliario con `status = INACTIVE` no puede ser asignado a nuevos servicios ni realizar entregas.

## 4. Estructura de Datos (Variables)
- `document`: String (Cédula/Identificación)
- `name`: String (Nombre del domiciliario)
- `phone`: String (Teléfono de contacto)
- `status`: Enum (`ACTIVE`, `INACTIVE`)