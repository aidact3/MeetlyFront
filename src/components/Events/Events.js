//!Es un componente de nivel superior que maneja una colección de eventos y renderiza múltiples EventCard.
import { fetchData } from "../../utils/api/fetchData";
import { showErrorMessage, clearMessage } from "../../utils/functions/messages";
import { navigateEventPage } from "../../utils/functions/NavigateEventPage";
import { EventCard } from "../EventCard/EventCard";
import "./Events.css";

//? Exportamos una función asíncrona que renderiza una lista de eventos.
// El argumento isCarousel activa el modo carrusel si es true.
export const Events = async (parentDiv, options = {}, isCarousel = false) => {
  const { endpoint = "/api/v1/events", title = "Eventos disponibles:" } = options;

  const container = document.createElement("div"); // Contenedor principal.
  container.className = "events-container-wrapper";

  //! Crear el campo de búsqueda
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Buscar eventos...";
  searchInput.className = "events-search-input";

  const eventsDiv = document.createElement("div");
  eventsDiv.className = isCarousel ? "slider" : "events-container"; // Asignamos una clase según si es carrusel o no.

  const errorDiv = document.createElement("div"); // Contenedor exclusivo para mensajes de error.
  errorDiv.className = "events-error-message";
  errorDiv.style.display = "none"; // Oculto por defecto.

  const p = document.createElement("p"); // Creamos el título de la sección.
  p.textContent = title;

  container.append(p, searchInput, errorDiv, eventsDiv); // Añadimos el título, el campo de búsqueda, el contenedor de errores y el contenedor de eventos.

  parentDiv.appendChild(container); // Añadimos el contenedor principal al elemento padre.

  let allEvents = []; // Guardaremos todos los eventos aquí.

  //! Función para normalizar texto y hacer el filtro más robusto.
  const normalizeText = (text) =>
    text
      .toLowerCase()
      .normalize("NFD") // Descompone caracteres especiales como á, é, í en a, e, i
      .replace(/[\u0300-\u036f]/g, ""); // Elimina las tildes y diacríticos.

  //! Renderiza los eventos filtrados
  const renderFilteredEvents = (filterTerm) => {
    clearMessage(errorDiv); // Limpia cualquier mensaje de error previo.

    eventsDiv.innerHTML = ""; // Limpia los eventos actuales.

    const normalizedFilterTerm = normalizeText(filterTerm); // Normalizamos el término de búsqueda.

    const filteredEvents = allEvents.filter((event) => {
      // Normalizamos los datos del evento para que coincidan con la búsqueda.
      const normalizedTitle = normalizeText(event.title);
      const normalizedDescription = normalizeText(event.description || "");
      const normalizedLocation = normalizeText(event.location);

      return (
        normalizedTitle.includes(normalizedFilterTerm) ||
        normalizedDescription.includes(normalizedFilterTerm) ||
        normalizedLocation.includes(normalizedFilterTerm)
      );
    });

    if (filteredEvents.length === 0) {
      showErrorMessage(errorDiv, "No hay eventos que coincidan con tu búsqueda.");
      return;
    }

    filteredEvents.forEach((event) => {
      const eventCard = EventCard(event, () => {
        const isAuthenticated = !!localStorage.getItem("token");
        if (isAuthenticated) {
          navigateEventPage(event);
        }
      });
      eventsDiv.appendChild(eventCard);
    });
  };

  //! Carga y renderiza los eventos
  try {
    const events = await fetchData(endpoint);
    if (!events || events.length === 0) {
      showErrorMessage(errorDiv, "No hay eventos disponibles.");
      return;
    }

    allEvents = events; // Guardamos todos los eventos.
    renderFilteredEvents(""); // Renderizamos todos los eventos inicialmente.

    //! Evento para el campo de búsqueda
    searchInput.addEventListener("input", (e) => {
      const filterTerm = e.target.value.trim();
      renderFilteredEvents(filterTerm);
    });
  } catch (error) {
    console.error("Error al cargar los eventos:", error);
    showErrorMessage(errorDiv, "Hubo un error al cargar los eventos. Intenta más tarde.");
  }
};