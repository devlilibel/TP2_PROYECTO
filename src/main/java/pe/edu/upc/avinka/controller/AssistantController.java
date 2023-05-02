package pe.edu.upc.avinka.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.reactive.function.client.WebClient;

import pe.edu.upc.avinka.init.Message;
import pe.edu.upc.avinka.model.entity.Product;

@Controller
@RequestMapping("/assistant")
public class AssistantController {

	@PostMapping("/sendMessage")
	public String sendMessage(@ModelAttribute("message") Message message, Model model) {
		
		try {
			Product productSearch = new Product();
			model.addAttribute("productSearch",productSearch);
			
			WebClient.Builder builder = WebClient.builder();
			
			//enviar mensaje de usuario a dialogflow mediante servidor node
			builder.build().post().uri("localhost:5000").bodyValue(message).retrieve().bodyToMono(String.class).block();
			
			System.out.println("----------------------------------------------");
			System.out.println("Enviado: " + message.getMessage());
			
			//obtener respuesta de dialogflow desde servidor node
			String res = builder.build().get().uri("localhost:5000").retrieve().bodyToMono(String.class).block();
			
			System.out.println("----------------------------------------------");
			System.out.println("Recibido: " + res);
			
			model.addAttribute("message", new Message());
			model.addAttribute("response", res);
			

			
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println(e.getMessage());
		}
				
		return "index";
	}
	
	@GetMapping("/getResponse")
	public String getResponse(Model model) {
		String res = null;
		try {
			Product productSearch = new Product();
			model.addAttribute("productSearch",productSearch);
			
			WebClient.Builder builder = WebClient.builder();
			
			//obtener respuesta de dialogflow desde servidor node
			res = builder.build().get().uri("localhost:5000").retrieve().bodyToMono(String.class).block();
			
			System.out.println("----------------------------------------------");
			System.out.println("Recibido: " + res);
			
			model.addAttribute("response", res);
			
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println(e.getMessage());
		}
		
		if (res == "Aquí te muestro nuestras principales zonas de reparto en Lima y Callao." || res == "Aquí te muestro  la información acerca de las zonas de cobertura en Lima y Callao" || res == "Aquí te muestro información de los distritos de cobertura en Lima y Callao.")
			return "map";
		if (res == "redirect:https://wa.me/51970865569?text=Buen%20dia%20equipo%20Avinka!%20tengo%20una%20consulta")
			return "redirect:https://wa.me/51970865569?text=Buen%20dia%20equipo%20Avinka!%20tengo%20una%20consulta";
		if (res == "Aquí puedes iniciar sesión! Ingresa tu correo, tu contraseña y luego deberá hacer click en Ingresar. Si aún no tiene una cuenta, seleccione el botón Regístrate.")
			return "login";
		if (res == "Lamentamos lo sucedido. Ingrese todos los datos correspondientes para atender su reclamo.")
			return "reclamaciones";
		if (res == "Aquí te puedes registrar. Escriba su nombre, apellido, número de celular, correo electrónico y cree una contraseña con el que podrá ingresar a su cuenta. Acepte los términos y condiciones y la Política de privacidad y luego haga click en registrarse para crear su cuenta.")
			return "signup";
		if (res == "Ayúdanos a mejorar, ingresa tu correo y el detalle de tu sugerencia y luego haga click en Enviar. Tu opinión es importante para nosotros.")
			return "recomendacion";
		
		return "index";
	}
}
