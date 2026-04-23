package tn.fsegt.foyer.RestControllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.fsegt.foyer.Services.ChatService;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@CrossOrigin("*")
public class ChatController {

    @Autowired
    ChatService chatService;

    @PostMapping
    public String chat(@RequestBody Map<String, String> body) {
        return chatService.getResponse(body.get("message"));
    }
}
