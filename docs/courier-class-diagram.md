# Diagrama de Clases: Módulo Courier

```mermaid
classDiagram
    class Status {
        <<enum>>
        ACTIVE
        INACTIVE
    }

    class Courier {
        -String document
        -String name
        -String phone
        -Status status
        +getDocument() String
        +setDocument(String document) void
        +getName() String
        +setName(String name) void
        +getPhone() String
        +setPhone(String phone) void
        +getStatus() Status
        +setStatus(Status status) void
    }

    Courier --> Status