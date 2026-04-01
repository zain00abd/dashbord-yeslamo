export function showAppConfirm(message, title = "تأكيد") {
    if (typeof window === "undefined") return Promise.resolve(false);
    return new Promise((resolve) => {
        window.dispatchEvent(
            new CustomEvent("yaslamo:confirm", {
                detail: {
                    title,
                    message: String(message || ""),
                    onResult: resolve,
                },
            })
        );
    });
}

