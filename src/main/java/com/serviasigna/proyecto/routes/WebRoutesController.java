package com.serviasigna.proyecto.routes;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.serviasigna.proyecto.services.CentralService;
import com.serviasigna.proyecto.services.ClientService;
import com.serviasigna.proyecto.services.CourierService;
import com.serviasigna.proyecto.services.ServiceOrderService;

@Controller
public class WebRoutesController {

    private final CentralService centralService;
    private final CourierService courierService;
    private final ClientService clientService;
    private final ServiceOrderService orderService;

    public WebRoutesController(CentralService centralService, CourierService courierService,
            ClientService clientService, ServiceOrderService orderService) {
        this.centralService = centralService;
        this.courierService = courierService;
        this.clientService = clientService;
        this.orderService = orderService;
    }

    @GetMapping("/")
    public String inicio() {
        return "redirect:/dashboard";
    }

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("listaCentrales", centralService.getAllCentrals());
        return "login";
    }

    @GetMapping("/register")
    public String register(Model model) {
        model.addAttribute("listaCentrales", centralService.getAllCentrals());
        return "register";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("listaPedidos", orderService.getAllOrders());
        model.addAttribute("listaDomiciliarios", courierService.getAllCouriers());
        model.addAttribute("listaCentrales", centralService.getAllCentrals());
        return "dashboard";
    }

    @GetMapping("/centrales")
    public String centrales(Model model) {
        model.addAttribute("listaCentrales", centralService.getAllCentrals());
        return "centrales";
    }

    @GetMapping("/domiciliarios")
    public String domiciliarios(Model model) {
        model.addAttribute("listaDomiciliarios", courierService.getAllCouriers());
        return "domiciliarios";
    }

    @GetMapping("/clientes")
    public String clientes(Model model) {
        model.addAttribute("listaClientes", clientService.getAllClients());
        return "clientes";
    }

    @GetMapping("/pedidos")
    public String pedidos(Model model) {
        model.addAttribute("listaPedidos", orderService.getAllOrders());
        model.addAttribute("listaClientes", clientService.getAllClients());
        model.addAttribute("listaCentrales", centralService.getAllCentrals());
        model.addAttribute("listaDomiciliarios", courierService.getAllCouriers());
        return "pedidos";
    }
}