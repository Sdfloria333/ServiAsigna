# Análisis: Módulo ServiceOrder (Servicio)

## 1. Descripción
Gestión del ciclo de vida de los pedidos o servicios de domicilio, desde su creación hasta la entrega final.

## 2. Requerimientos Funcionales
- **RF-S01 - Crear Servicio:** Registrar una nueva orden (Inicia en `PENDING`).
- **RF-S02 - Listar Servicios:** Consultar el historial del día, filtrando por estado, central o domiciliario.
- **RF-S03 - Asignar Domiciliario:** Asignar un repartidor a la orden (Pasa a `ASSIGNED`).
- **RF-S04 - Actualizar Ciclo:** Cambiar estados operativos del servicio (`IN_TRANSIT` -> `DELIVERED`).
- **RF-S05 - Cancelar Servicio:** Cancelar orden (`CANCELLED`) y liberar automáticamente al domiciliario.

## 3. Reglas de Negocio
- Si `payAtPickup = true`, el domiciliario debe pagar el `itemValue` en el punto de recogida.
- Al pasar a `DELIVERED`, se registra automáticamente la fecha y hora en `deliveredAt`.

## 4. Estructura de Datos (Variables)
- `pickupAddress`: String 
- `deliveryAddress`: String 
- `shippingCost`: Double 
- `itemValue`: Double 
- `payAtPickup`: Boolean 
- `description`: String 
- `status`: Enum (`PENDING`, `ASSIGNED`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED`)
- `createdAt`: LocalDateTime 
- `deliveredAt`: LocalDateTime 
- `clientId`: String
- `centralId`: String
- `courierId`: String