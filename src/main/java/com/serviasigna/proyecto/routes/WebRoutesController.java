package com.serviasigna.proyecto.routes;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.serviasigna.proyecto.services.CentralService;
import com.serviasigna.proyecto.services.ClientService;
import com.serviasigna.proyecto.services.CourierService;

@Controller
public class WebRoutesController {

    private final CentralService centralService;
    private final CourierService courierService;
    private final ClientService clientService;

    public WebRoutesController(CentralService centralService, CourierService courierService, ClientService clientService) {
        this.centralService = centralService;
        this.courierService = courierService;
        this.clientService = clientService;
    }

    @GetMapping("/")
    public String inicio() {
        return "redirect:/dashboard";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
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
}
