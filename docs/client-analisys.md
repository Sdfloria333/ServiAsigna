# Análisis: Módulo Cliente

## 1. Descripción
Gestión de los clientes que solicitan los servicios de domicilio a través del sistema.

## 2. Requerimientos Funcionales
- **RF-CL01 - Crear Cliente:** Registrar un nuevo cliente incluyendo su dirección.
- **RF-CL02 - Listar Clientes:** Consultar el listado de todos los clientes.
- **RF-CL03 - Buscar por ID:** Obtener la información de un cliente mediante su cédula.
- **RF-CL04 - Cambiar Estado:** Alternar el `status` del cliente (borrado lógico).

## 3. Reglas de Negocio
- Un cliente con `status = INACTIVE` no puede solicitar nuevos servicios en la plataforma.

## 4. Estructura de Datos (Variables)
- `document`: String (Cédula/Identificación)
- `name`: String (Nombre completo)
- `phone`: String (Teléfono de contacto)
- `address`: String (Dirección de residencia/entrega)
- `status`: Enum (`ACTIVE`, `INACTIVE`)