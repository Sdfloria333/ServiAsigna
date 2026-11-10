# Diagrama de Clases: Módulo Cliente

```mermaid
classDiagram
    class Status {
        <<enum>>
        ACTIVE
        INACTIVE
    }

    class Client {
        -String document
        -String name
        -String phone
        -String address
        -Status status
        +getDocument() String
        +setDocument(String document) void
        +getName() String
        +setName(String name) void
        +getPhone() String
        +setPhone(String phone) void
        +getAddress() String
        +setAddress(String address) void
        +getStatus() Status
        +setStatus(Status status) void
    }

    Client --> Status