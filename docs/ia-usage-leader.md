# Bitácora de uso de IA

**Proyecto:** ServiAsigna
**Herramienta:** Gemini pro

---

## Plantilla para cada módulo

### Módulo: [nombre] ([fases])

1. [consulta]
2. [consulta]
3. [consulta]

---

## Módulo Central (Configuración, Análisis y Desarrollo)

1. Estoy armando el proyecto en Spring Boot con Java 21 y quiero una carpeta `docs` dentro del repo para llevar los requerimientos y los diagramas en Markdown, uno por módulo. ¿Cómo la organizo?
2. Para el módulo Central tengo pensado: registrar sede, listar, buscar por identificación y cambiar estado. ¿Me ayudas a ponerlos como RF-C01 a RF-C04 y a redactar la regla de que una central inactiva no puede despachar ni tener repartidores asignados?
3. ¿Cómo represento en Mermaid la relación entre `Central` y su enum de estado (ACTIVE, INACTIVE)? No sé si va como composición o como dependencia.
4. ¿Qué dependencia de `ojdbc` va en el `pom.xml` para Java 21 y con qué scope? Ya tengo data-jpa, web y thymeleaf.
5. Quiero conectar a mi Oracle local (`localhost:1521/xepdb1`, usuario `admin_serviasigna`) y que Hibernate cree las tablas solo con `ddl-auto=update`. ¿Qué pongo en `application.properties`?
6. Usé la cédula como llave primaria (`String document`) en vez de un id autoincremental. ¿Me basta con `@Id` y `@Column(name = "CEDULA", length = 20, nullable = false)`?
7. Para no borrar registros y conservar el historial de despachos voy con borrado lógico. ¿Dejo el estado como `String` o creo un `enum Status` en `models.users`?
8. Mapeé `private Status status` a la columna `ESTADO` con `length = 10`. ¿Cómo lo guarda JPA por defecto y qué debo tener en cuenta?
9. Tengo `CentralRepository extends JpaRepository<Central, String>`. ¿`findById` ya sirve para buscar por cédula o necesito otro método?
10. En `CentralService` prefiero inyectar por constructor con `final` en lugar de `@Autowired` en el atributo. ¿Está bien así?
11. En `createCentral`, si el JSON llega sin estado quiero ponerle `ACTIVE` antes del `save()`. ¿Eso va en el servicio o en el modelo?
12. `findById` me devuelve un `Optional`. ¿Cómo uso `orElseThrow` con lambda para lanzar una excepción que diga qué cédula no se encontró?
13. Para RF-C04 pensé en reutilizar `getCentralById`, cambiar el estado con `setStatus` y volver a llamar `save()`. ¿JPA entiende que es un UPDATE y no un INSERT?
14. En `CentralController` (`/api/centrals`), ¿por qué conviene devolver `ResponseEntity<Central>` con 201 en el POST y no el objeto directo?
15. Como solo cambio el estado y no todo el registro, ¿tiene más sentido `@PatchMapping("/{document}/status")` con `@RequestParam` que un `@PutMapping`?
16. Quiero separar la API de las vistas de Thymeleaf con un `WebRoutesController` (`@Controller`). ¿Cómo hago que `/` redirija a `/dashboard` y que `/centrales` mande la lista al `Model`?

---

## Módulo Courier / Domiciliario (Análisis, Estandarización e Integración)

1. Voy a empezar `Courier`, que va a la tabla `DOMICILIARIO`. ¿Puedo repetir lo que hice en Central: cédula como llave (20), nombre (15), teléfono (10) y estado (10), para mantener el esquema consistente?
2. En mi primer borrador de `Courier.java` dejé `private String state`, pero en Central uso el enum `Status`. ¿Qué problemas me trae dejarlo como String y cómo lo cambio?
3. Al pasar de `String state` a `Status status`, ¿debo renombrar también los métodos a `getStatus()` y `setStatus(Status)` para que el JSON salga igual que en Central?
4. Mi `CourierRepository` extiende `JpaRepository<Courier, String>`. ¿Hay que ponerle `@Repository` o Spring ya lo detecta solo?
5. Estoy armando `CourierService` igual que `CentralService`. En `createCourier`, ¿cómo hago que todo domiciliario nuevo quede en ACTIVE si no se manda el estado?
6. En `getCourierById` voy a usar `.orElseThrow()` sobre el `Optional`. ¿Es buena práctica que el mensaje incluya la cédula del domiciliario?
7. En `updateCourierStatus` busco el domiciliario, le cambio el estado con `setStatus` y hago `save()`. ¿Eso actualiza bien en Oracle?
8. En `CourierController` (`/api/couriers`), ¿cómo estructuro el POST y el GET con `ResponseEntity` para que devuelvan los mismos códigos que Central (201 y 200)?
9. Para cambiar el estado usé `@PatchMapping("/{document}/status")` con `@PathVariable` y `@RequestParam Status status`. ¿Spring convierte solo el texto `ACTIVE` o `INACTIVE` al enum?
10. `WebRoutesController` ya recibe `CentralService` por constructor. ¿Cómo agrego `CourierService` sin romper las rutas que ya funcionan?
11. Quiero agregar `@GetMapping("/domiciliarios")` y pasar la lista con `model.addAttribute("listaDomiciliarios", ...)` para recorrerla con `th:each` en `domiciliarios.html`. ¿Cómo lo hago?
12. Te paso el comprimido del proyecto: revisa si las capas de Courier (entidad, repositorio, servicio, controlador y rutas web) quedaron bien conectadas frente a lo que ya funciona en Central.
13. Ya compila e integra todo el módulo Courier. ¿Qué mensaje de commit con Conventional Commits resume el servicio, el controlador y la ruta web?



## Módulo: Cliente (Desarrollo e Integración)
1. En el modelo de Cliente necesito guardar la dirección. ¿Basta con agregar private String address; y mapearlo con @Column(name = "DIRECCION", length = 100, nullable = false) para mantener el mismo estándar de la base de datos?

2. Voy a armar el ClientService y ClientController. ¿Puedo usar exactamente la misma lógica de Status.ACTIVE por defecto y la misma estructura de endpoints (/api/clients) que ya me funcionó en Central y Courier?

3. En el WebRoutesController ya tengo inyectados los servicios de Central y Courier. ¿Simplemente agrego el ClientService a ese mismo constructor y creo el @GetMapping("/clientes") para pasar los datos a la vista de Thymeleaf?