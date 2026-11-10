package com.serviasigna.proyecto.routes;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.serviasigna.proyecto.services.CentralService;

@Controller
public class WebRoutesController {

    private final CentralService centralService;

    public WebRoutesController(CentralService centralService) {
        this.centralService = centralService;
    }

    // 1. Pantalla por defecto
    @GetMapping("/")
    public String inicio() {
        return "redirect:/dashboard";
    }

    // 2. Vista Dashboard
    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard"; // Carga dashboard.html
    }

    // 3. Vista Centrales (Inyectando los datos de tu BD)
    @GetMapping("/centrales")
    public String centrales(Model model) {
        model.addAttribute("listaCentrales", centralService.getAllCentrals());
        return "centrales"; // Carga centrales.html
    }
}
