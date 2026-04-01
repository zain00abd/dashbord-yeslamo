export function showAppAlert(message, title = "تنبيه") {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
        new CustomEvent("yaslamo:alert", {
            detail: {
                title,
                message: String(message || ""),
            },
        })
    );
}

