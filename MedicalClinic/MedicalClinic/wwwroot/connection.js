document.addEventListener("DOMContentLoaded", () => {
    const divConnection = document.getElementById("connectionStatus");
    const links = document.querySelectorAll("a");
    const buttons = document.querySelectorAll("button");

    function handleUpdateStatus() {
        if (navigator.onLine) {
            divConnection.style.display = "none";
            links.forEach(a => a.style.color = "");
            buttons.forEach(button => button.disabled = false);
        } else {
            divConnection.style.display = "block";
            links.forEach(a => a.style.color = "gray");
            buttons.forEach(button => button.disabled = true);
        }
    }

    handleUpdateStatus();

    window.addEventListener("online", handleUpdateStatus);
    window.addEventListener("offline", handleUpdateStatus);

    [...links, ...buttons].forEach(el => {
        el.addEventListener("click", e => {
            if (!navigator.onLine) {
                e.preventDefault();
                alert("No hay conexión a internet, por favor revise su conexión");
            }
        });
    });
});
