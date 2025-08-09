const catalogoContainer = document.getElementById('catalogo');
const search = document.getElementById('search');
const catButtons = document.querySelectorAll('.btn-cat');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const closeModal = document.getElementById('closeModal');
const modalClose2 = document.getElementById('modalClose2');

let cards = [];

// Cargar catálogo desde JSON
fetch('resto.json')
  .then(res => res.json())
  .then(data => {
    catalogoContainer.innerHTML = '';

    data.forEach(item => {
      const card = document.createElement('article');
      card.className = "card bg-white rounded-2xl shadow p-4 flex flex-col";
      card.dataset.category = item.categoria;
      card.dataset.name = item.nombre.toLowerCase();

      card.innerHTML = `
        <img class="w-full h-40 object-cover rounded-lg mb-4" src="${item.imagen}" alt="${item.nombre}" />
        <div class="flex-1">
          <h3 class="text-lg font-semibold">${item.nombre}</h3>
          <p class="text-sm text-gray-500 mt-1">${item.descripcion}</p>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <div class="text-2xl font-bold">$${item.precio.toLocaleString()}</div>
          <div class="flex gap-2 items-center">
            <button class="btn-detail px-3 py-1 border rounded-md text-sm">Ver</button>
          </div>
        </div>
      `;
      catalogoContainer.appendChild(card);
    });

    // Actualizamos la variable cards ya que ahora existen en el DOM
    cards = document.querySelectorAll('.card');

    // Asignar evento a los botones "Ver" para abrir modal
    cards.forEach(card => {
      const btnDetail = card.querySelector('.btn-detail');
      btnDetail.addEventListener('click', () => {
        modalImg.src = card.querySelector('img').src;
        modalTitle.innerText = card.querySelector('h3').innerText;
        modalDesc.innerText = card.querySelector('p').innerText;
        modalPrice.innerText = card.querySelector('.text-2xl').innerText;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      });
    });

    // Activar filtro "Todos" al cargar
    document.querySelector('[data-cat="all"]').click();
  })
  .catch(err => console.error("Error cargando el catálogo:", err));

// Función para obtener la categoría activa
function getActiveCategory() {
  const active = document.querySelector('.btn-cat.bg-primary');
  return active ? active.dataset.cat : 'all';
}

// Función para filtrar catálogo según categoría y búsqueda
function filterCatalog(category, q) {
  const query = (q || '').toLowerCase().trim();

  cards.forEach(card => {
    const name = card.dataset.name;
    const cat = card.dataset.category;
    const matchesCat = (category === 'all') || (cat === category);
    const matchesQuery = !query || name.includes(query) || card.textContent.toLowerCase().includes(query);
    card.style.display = (matchesCat && matchesQuery) ? '' : 'none';
  });
}

// Asignar eventos a botones de categoría
catButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    catButtons.forEach(b => b.classList.remove('bg-primary', 'text-gray-300'));
    btn.classList.add('bg-primary', 'text-gray-300');
    filterCatalog(cat, search.value);
  });
});

// Buscar en input
search?.addEventListener('input', (e) => filterCatalog(getActiveCategory(), e.target.value));

// Eventos modal cerrar
closeModal.addEventListener('click', () => { modal.classList.add('hidden'); modal.classList.remove('flex'); });
modalClose2.addEventListener('click', () => { modal.classList.add('hidden'); modal.classList.remove('flex'); });
modal.addEventListener('click', (e) => { if (e.target === modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); } });

// Script para el ChatBot 

const chatbotBtn = document.getElementById('chatbotBtn');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');

// Abrir/cerrar chatbot
chatbotBtn.addEventListener('click', () => {
  chatbotWindow.classList.toggle('hidden');
});

chatbotSend.addEventListener('click', () => {
  const query = chatbotInput.value.trim().toLowerCase();
  if (!query) return;

  // Mostrar pregunta del usuario
  chatbotMessages.innerHTML += `<div class="bg-red-500 text-white p-2 rounded self-end">${chatbotInput.value}</div>`;

  // Respuestas predeterminadas según palabras clave
  const saludos = ['hola', 'buenas', 'buen día', 'buenas tardes', 'buenas noches'];
  const despedidas = ['adiós', 'chau', 'nos vemos', 'hasta luego'];
  const gratitud = ['gracias', 'agradezco', 'muy amable', 'estupendo'];
  const consultas = ['precio', 'costo', 'cuánto', 'valor'];

  if (saludos.some(saludo => query.includes(saludo))) {
    chatbotMessages.innerHTML += `<div class="bg-gray-100 p-2 rounded">¡Hola! ¿En qué puedo ayudarte con nuestro menú?</div>`;
  } else if (despedidas.some(despedida => query.includes(despedida))) {
    chatbotMessages.innerHTML += `<div class="bg-gray-100 p-2 rounded">¡Hasta luego! Que tengas un buen día.</div>`;
  } else if (consultas.some(consulta => query.includes(consulta))) {
    chatbotMessages.innerHTML += `<div class="bg-gray-100 p-2 rounded">Si quieres saber el precio de algún plato, escríbeme su nombre.</div>`;
  } else if (gratitud.some(gratitud => query.includes(gratitud))) {
    chatbotMessages.innerHTML += `<div class="bg-gray-100 p-2 rounded">¡Espero haberte ayudado!¡Muchas gracias!</div>`;
  } else {
    // Buscar plato en el catálogo
    let found = null;
    document.querySelectorAll('.card').forEach(card => {
      const name = card.dataset.name.toLowerCase();
      if (name.includes(query)) {
        const price = card.querySelector('.text-2xl').innerText;
        const desc = card.querySelector('p').innerText;
        found = `El plato <strong>${card.dataset.name}</strong> cuesta ${price} y se prepara así: ${desc}`;
      }
    });

    // Respuesta
    const respuesta = found || "No encontré ese plato en nuestro menú, ¿puedes escribirlo diferente?";
    chatbotMessages.innerHTML += `<div class="bg-gray-100 p-2 rounded">${respuesta}</div>`;
  }

  // Limpiar y scrollear
  chatbotInput.value = '';
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
});