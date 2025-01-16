//! Messages.js: Componente reutilizable para mostrar mensajes de error, éxito e información

import "./Messages.css";

//! Renderiza un mensaje en el contenedor con un loader incluido.
const renderMessage = (container, message, type) => {
  if (!container) {
    console.error("El contenedor para mostrar el mensaje no existe.");
    return;
  }

  // Generamos el contenido del mensaje
  container.innerHTML = `
    <p>${message}</p>
    <div class="dot-spinner">
      ${Array(8).fill('<div class="dot-spinner__dot"></div>').join("")}
    </div>
  `;
  container.className = `message ${type}`;
  container.style.display = "block";
};

//! Muestra un mensaje de error
export const showErrorMessage = (container, message) => {
  if (!container) {
    console.error("El contenedor para mostrar el mensaje no existe.");
    return;
  }

  container.innerHTML = message; // Solo mostramos el texto del error
  container.className = "message error-message"; // Aplicamos clase de error
  container.style.display = "block"; // Aseguramos que sea visible

  // Desaparece automáticamente después de 5 segundos
  setTimeout(() => {
    clearMessage(container);
  }, 3000);
};

//! Muestra un mensaje de éxito
export const showSuccessMessage = (container, message) => {
  renderMessage(container, message, "success-message");
};

//! Muestra un mensaje de información
export const showInfoMessage = (container, message) => {
  renderMessage(container, message, "info-message");
};

//! Limpia cualquier mensaje mostrado
export const clearMessage = (container) => {
  if (!container) {
    console.error("El contenedor para limpiar el mensaje no existe.");
    return;
  }
  container.innerHTML = "";
  container.className = "";
  container.style.display = "none";
};