```mermaid
classDiagram
  class ServiceOrder {
    +Long id
    +String pickupAddress
    +String deliveryAddress
    +Double shippingCost
    +Double itemValue
    +Boolean payAtPickup
    +String description
    +ServiceStatus status
    +LocalDateTime createdAt
    +LocalDateTime deliveredAt
    +Customer customer
    +Central central
    +Courier courier
  }

  class ServiceStatus {
    <<enumeration>>
    PENDING
    ASSIGNED
    IN_TRANSIT
    DELIVERED
    CANCELLED
  }

  ServiceOrder --> ServiceStatus