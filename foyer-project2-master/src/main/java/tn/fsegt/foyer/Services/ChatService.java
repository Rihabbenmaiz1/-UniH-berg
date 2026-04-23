package tn.fsegt.foyer.Services;

import org.springframework.stereotype.Service;

@Service
public class ChatService {

    public String getResponse(String message) {
        message = message.toLowerCase();

        if (message.contains("stress") || message.contains("anxieu") || message.contains("calme")) {
            return "Ne vous inquiétez pas ! 😊 Pour plus de tranquillité, je vous recommande une chambre SIMPLE dans le Bloc A. C'est le plus calme du foyer !";
        }
        if (message.contains("bloc")) {
            return "🏢 Le Bloc A est idéal pour le calme, le Bloc B est plus animé et social !";
        }
        if (message.contains("chambre") || message.contains("disponible") || message.contains("libre")) {
            return "📋 Consultez la section Chambres pour voir les disponibilités. Types disponibles : SIMPLE, DOUBLE, TRIPLE !";
        }
        if (message.contains("réserv") || message.contains("reserver")) {
            return "📝 Pour réserver : choisissez votre chambre dans la section Chambres puis contactez l'administration !";
        }
        if (message.contains("simple")) {
            return "🛏️ Chambre SIMPLE : idéale pour plus de tranquillité et de concentration dans vos études !";
        }
        if (message.contains("double")) {
            return "🛏️🛏️ Chambre DOUBLE : parfaite pour partager avec un(e) ami(e), plus économique !";
        }
        if (message.contains("triple")) {
            return "🛏️🛏️🛏️ Chambre TRIPLE : idéale pour un groupe d'amis, la plus économique !";
        }
        if (message.contains("bonjour") || message.contains("salut") || message.contains("hello")) {
            return "👋 Bonjour ! Je suis votre assistant UniHéberg. Comment puis-je vous aider ? 😊";
        }
        if (message.contains("1ère année") || message.contains("nouveau") || message.contains("premiere")) {
            return "🎓 Bienvenue en 1ère année ! Pour bien démarrer, optez pour une chambre SIMPLE dans le Bloc A pour étudier dans le calme. Courage ! 💪";
        }
        if (message.contains("merci")) {
            return "😊 Avec plaisir ! Bonne chance dans vos études ! 🎓";
        }

        return "🤖 Je suis votre assistant UniHéberg ! Je peux vous aider avec :\n• 🛏️ Chambres (Simple, Double, Triple)\n• 🏢 Les blocs\n• 📝 Réservations\n\nQue souhaitez-vous savoir ? 😊";
    }
}

