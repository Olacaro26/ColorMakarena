/* ============================================================
   ColorMakarena · lógica de la tienda
   - Catálogo con búsqueda, categorías y orden
   - Carrito guardado en localStorage
   - Pedido por WhatsApp
   ============================================================ */
(function () {
  "use strict";

  // ---------- Utilidades ----------
  const $ = (s, el = document) => el.querySelector(s);
  const money = (n) => "$" + Math.round(n).toLocaleString("es-CO");
  const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const LOGO = "img/logo.webp";
  const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

  // ---------- localStorage seguro ----------
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* modo privado o lleno */ }
    }
  };

  // ---------- Estado ----------
  // cart: { [idProducto]: cantidad }
  let cart = sanitizeCart(store.get(CART_STORAGE_KEY, {}));
  const state = { category: "Todos", query: "", sort: "default", draftQty: {} };
  // Si el inventario no fue informado, se permite agregar productos sin afirmar existencias.
  const stockLimit = (p) => Number.isFinite(p.stock) ? Math.max(0, p.stock) : Number.MAX_SAFE_INTEGER;

  function sanitizeCart(raw) {
    const clean = {};
    if (!raw || typeof raw !== "object") return clean;
    for (const [id, q] of Object.entries(raw)) {
      const p = byId.get(Number(id));
      const qty = Math.min(Math.floor(Number(q)) || 0, p ? stockLimit(p) : 0);
      if (p && qty > 0) clean[id] = qty;
    }
    return clean;
  }
  function saveCart() { store.set(CART_STORAGE_KEY, cart); }
  const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = () => Object.entries(cart).reduce((t, [id, q]) => t + byId.get(Number(id)).price * q, 0);

  // ---------- Catálogo ----------
  const grid = $("#productGrid");
  const chipsEl = $("#chips");
  const categories = ["Todos", "Belleza", "Cuidado personal", "Accesorios", "Juguetería", "Productos importados", "Pijamas"];

  function renderChips() {
    chipsEl.innerHTML = categories.map((c) =>
      `<button class="chip${c === state.category ? " active" : ""}" data-cat="${esc(c)}" role="tab" aria-selected="${c === state.category}">${esc(c)}</button>`
    ).join("");
  }

  function filtered() {
    const q = norm(state.query.trim());
    let list = PRODUCTS.filter((p) =>
      (state.category === "Todos" || p.category === state.category) &&
      (!q || norm(p.name + " " + p.ref + " " + p.category + " " + (p.subcategory || "") + " " + (p.description || "")).includes(q))
    );
    if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "es"));
    return list;
  }

  function cardHTML(p) {
    const knownStock = Number.isFinite(p.stock);
    const out = knownStock && p.stock <= 0;
    const low = knownStock && !out && p.stock <= LOW_STOCK_THRESHOLD;
    const inCart = cart[p.id] || 0;
    const q = Math.max(1, Math.min(state.draftQty[p.id] || 1, stockLimit(p)));
    const img = p.image || LOGO;
    return `
    <article class="card" data-id="${p.id}">
      <button class="card-img" data-action="zoom" aria-label="Ver ${esc(p.name)}">
        <img src="${img}" alt="${esc(p.name)}" loading="lazy"${p.image ? "" : ' class="placeholder"'}>
        ${out ? '<span class="badge out">Agotado</span>' : low ? '<span class="badge">¡Últimas unidades!</span>' : ""}
      </button>
      <div class="card-body">
        <span class="tag">${esc(p.category)}</span>
        <h3 class="card-title">${esc(p.name)}</h3>
        <p class="card-description">${esc(p.description || "")}</p>
        <p class="price">${money(p.price)}</p>
        <div class="card-actions">
          <div class="qty" aria-label="Cantidad">
            <button data-action="dec" aria-label="Menos">−</button>
            <span>${q}</span>
            <button data-action="inc" aria-label="Más">+</button>
          </div>
          <button class="add-btn" data-action="add"${out ? " disabled" : ""}>${out ? "Agotado" : inCart ? "Agregar más" : "Agregar"}</button>
        </div>
      </div>
    </article>`;
  }

  function renderGrid() {
    const list = filtered();
    grid.innerHTML = list.map(cardHTML).join("");
    $("#emptyState").hidden = list.length > 0;
    $("#resultsInfo").textContent = list.length === 1 ? "1 producto" : list.length + " productos";
  }

  // actualiza solo una tarjeta (evita recargar toda la grilla)
  function refreshCard(id) {
    const el = grid.querySelector(`.card[data-id="${id}"]`);
    if (!el) return;
    const tmp = document.createElement("div");
    tmp.innerHTML = cardHTML(byId.get(id)).trim();
    el.replaceWith(tmp.firstElementChild);
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = Number(btn.closest(".card").dataset.id);
    const p = byId.get(id);
    const action = btn.dataset.action;
    if (action === "inc") { state.draftQty[id] = Math.min((state.draftQty[id] || 1) + 1, stockLimit(p)); refreshCard(id); }
    else if (action === "dec") { state.draftQty[id] = Math.max((state.draftQty[id] || 1) - 1, 1); refreshCard(id); }
    else if (action === "add") { addToCart(id, state.draftQty[id] || 1); state.draftQty[id] = 1; refreshCard(id); }
    else if (action === "zoom") openModal(id);
  });

  chipsEl.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    state.category = b.dataset.cat;
    renderChips(); renderGrid();
  });
  $("#searchInput").addEventListener("input", (e) => { state.query = e.target.value; renderGrid(); });
  $("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });

  // ---------- Carrito ----------
  function addToCart(id, qty) {
    const p = byId.get(id);
    const current = cart[id] || 0;
    const next = Math.min(current + qty, stockLimit(p));
    if (next === current) {
      if (Number.isFinite(p.stock)) toast(`Solo hay ${p.stock} unidad${p.stock === 1 ? "" : "es"} disponible${p.stock === 1 ? "" : "s"} 🌸`);
      return;
    }
    cart[id] = next;
    saveCart(); renderCart();
    toast(`Agregado: ${p.name}`);
    const btn = $("#openCart"); btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
  }

  function setQty(id, qty) {
    const p = byId.get(id);
    if (qty <= 0) delete cart[id];
    else if (qty > stockLimit(p)) {
      cart[id] = stockLimit(p);
      if (Number.isFinite(p.stock)) toast(`Máximo disponible: ${p.stock}`);
    }
    else cart[id] = qty;
    saveCart(); renderCart(); refreshCard(id);
  }

  function renderCart() {
    $("#cartCount").textContent = cartCount();
    const ids = Object.keys(cart);
    const body = $("#cartItems");
    $("#cartFoot").hidden = ids.length === 0;
    if (!ids.length) {
      body.innerHTML = `<div class="cart-empty"><img src="${LOGO}" alt=""><p>Tu carrito está vacío.<br>¡Agrega algo bonito! 💖</p></div>`;
      return;
    }
    body.innerHTML = ids.map((id) => {
      const p = byId.get(Number(id)); const q = cart[id];
      return `
      <div class="cart-item" data-id="${p.id}">
        <img src="${p.image || LOGO}" alt="${esc(p.name)}"${p.image ? "" : ' class="placeholder"'}>
        <div>
          <p class="ci-name">${esc(p.name)}</p>
          <p class="ci-price">${money(p.price)} c/u</p>
          <div class="ci-controls">
            <div class="qty">
              <button data-act="dec" aria-label="Menos">−</button><span>${q}</span><button data-act="inc" aria-label="Más">+</button>
            </div>
          </div>
        </div>
        <div>
          <p class="ci-sub">${money(p.price * q)}</p>
          <button class="ci-remove" data-act="remove">Quitar</button>
        </div>
      </div>`;
    }).join("");
    $("#cartTotal").textContent = money(cartTotal());
  }

  $("#cartItems").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const id = Number(b.closest(".cart-item").dataset.id);
    if (b.dataset.act === "inc") setQty(id, (cart[id] || 0) + 1);
    if (b.dataset.act === "dec") setQty(id, (cart[id] || 0) - 1);
    if (b.dataset.act === "remove") setQty(id, 0);
  });

  $("#clearCart").addEventListener("click", () => {
    if (!confirm("¿Vaciar todo el carrito?")) return;
    const ids = Object.keys(cart).map(Number);
    cart = {}; saveCart(); renderCart(); ids.forEach(refreshCard);
  });

  // Datos del cliente (también en localStorage)
  const nameEl = $("#customerName");
  const phoneEl = $("#customerPhone");
  const cityEl = $("#customerCity");
  const addressEl = $("#customerAddress");
  const noteEl = $("#customerNote");
  const saved = store.get(CUSTOMER_STORAGE_KEY, { name: "", phone: "", city: "", address: "", note: "" });
  nameEl.value = saved.name || "";
  phoneEl.value = saved.phone || "";
  cityEl.value = saved.city || "";
  addressEl.value = saved.address || "";
  noteEl.value = saved.note || "";
  const saveCustomer = () => store.set(CUSTOMER_STORAGE_KEY, {
    name: nameEl.value,
    phone: phoneEl.value,
    city: cityEl.value,
    address: addressEl.value,
    note: noteEl.value
  });
  [nameEl, phoneEl, cityEl, addressEl, noteEl].forEach((field) => field.addEventListener("input", saveCustomer));

  // Abrir / cerrar el carrito
  const drawer = $("#drawer"), overlay = $("#overlay");
  function openCart() {
    overlay.hidden = false; requestAnimationFrame(() => overlay.classList.add("show"));
    drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    overlay.classList.remove("show"); drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true");
    setTimeout(() => (overlay.hidden = true), 250); document.body.style.overflow = "";
  }
  $("#openCart").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  // ---------- WhatsApp ----------
  function buildMessage() {
    const lines = [`¡Hola ${STORE_NAME}! 🌸 Quiero hacer este pedido:`, ""];
    Object.entries(cart).forEach(([id, q], i) => {
      const p = byId.get(Number(id));
      lines.push(`${i + 1}. ${p.name} x${q} — ${money(p.price * q)}`);
    });
    lines.push("", `*Total: ${money(cartTotal())}*`);
    lines.push(
      "",
      `Nombre: ${nameEl.value.trim()}`,
      `Celular: ${phoneEl.value.trim()}`,
      `Ciudad: ${cityEl.value.trim()}`,
      `Dirección: ${addressEl.value.trim()}`
    );
    if (noteEl.value.trim()) lines.push(`Nota: ${noteEl.value.trim()}`);
    lines.push("", "¡Gracias! 💖");
    return lines.join("\n");
  }

  $("#sendWhatsApp").addEventListener("click", () => {
    if (!cartCount()) { toast("Tu carrito está vacío"); return; }
    const requiredFields = [nameEl, phoneEl, cityEl, addressEl];
    const missingField = requiredFields.find((field) => !field.value.trim());
    if (missingField) {
      toast("Completa nombre, celular, ciudad y dirección");
      missingField.focus();
      return;
    }
    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER) || WHATSAPP_NUMBER === "573000000000") {
      alert("Falta configurar el número de WhatsApp.\n\nAbre js/config.js y cambia WHATSAPP_NUMBER por tu número (ej: 573001234567).");
      return;
    }
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank", "noopener");
  });

  // ---------- Vista ampliada ----------
  const modal = $("#modal");
  let modalId = null;
  function openModal(id) {
    const p = byId.get(id); modalId = id;
    const img = $("#modalImg");
    img.src = p.image || LOGO; img.alt = p.name; img.className = p.image ? "" : "placeholder";
    $("#modalCat").textContent = p.category;
    $("#modalTitle").textContent = p.name;
    $("#modalRef").textContent = p.subcategory || (p.ref ? "Ref. " + p.ref : "");
    $("#modalDescription").textContent = p.description || "";
    $("#modalPrice").textContent = money(p.price);
    const st = $("#modalStock");
    st.textContent = !Number.isFinite(p.stock)
      ? "Disponibilidad por confirmar"
      : p.stock <= 0
        ? "Agotado"
        : p.stock <= LOW_STOCK_THRESHOLD
          ? `¡Últimas ${p.stock} unidades!`
          : `${p.stock} unidades disponibles`;
    st.className = "stock" + (Number.isFinite(p.stock) && p.stock <= LOW_STOCK_THRESHOLD ? " low" : "");
    $("#modalAdd").disabled = Number.isFinite(p.stock) && p.stock <= 0;
    modal.hidden = false; document.body.style.overflow = "hidden";
  }
  function closeModal() { modal.hidden = true; document.body.style.overflow = ""; }
  $("#closeModal").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  $("#modalAdd").addEventListener("click", () => { addToCart(modalId, 1); refreshCard(modalId); closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeCart(); } });

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  // Sincroniza el carrito si hay otra pestaña abierta
  window.addEventListener("storage", (e) => {
    if (e.key === CART_STORAGE_KEY) { cart = sanitizeCart(store.get(CART_STORAGE_KEY, {})); renderCart(); renderGrid(); }
  });

  // ---------- Inicio ----------
  renderChips(); renderGrid(); renderCart();
})();
