const sampleProperties = [
  {
    id: 1, title: "Appartement lumineux avec balcon", type: "Appartement", transaction: "Louer", neighborhood: "Cocody",
    address: "Cocody Angré, Abidjan", price: 350000, priceLabel: "350 000", rooms: 3, area: 92, badge: "Exemple", featured: true,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    agent: "Awa Traoré", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
  },
  {
    id: 2, title: "Villa familiale avec jardin", type: "Villa", transaction: "Louer", neighborhood: "Riviera",
    address: "Riviera Palmeraie, Abidjan", price: 850000, priceLabel: "850 000", rooms: 5, area: 210, badge: "Exemple",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    agent: "Serge Kouassi", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
  },
  {
    id: 3, title: "Studio cosy, prêt à vivre", type: "Studio", transaction: "Louer", neighborhood: "Marcory",
    address: "Marcory Zone 4, Abidjan", price: 180000, priceLabel: "180 000", rooms: 1, area: 38, badge: "Exemple",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    agent: "Nadia Koffi", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80"
  },
  {
    id: 4, title: "Appartement moderne, belle vue", type: "Appartement", transaction: "Acheter", neighborhood: "Plateau",
    address: "Le Plateau, Abidjan", price: 78000000, priceLabel: "78 M", rooms: 4, area: 128, badge: "Exemple", featured: true,
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
    agent: "Yann Diabaté", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80"
  },
  {
    id: 5, title: "Villa contemporaine et piscine", type: "Villa", transaction: "Acheter", neighborhood: "Bingerville",
    address: "Bingerville, Abidjan", price: 145000000, priceLabel: "145 M", rooms: 6, area: 285, badge: "Exemple",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80",
    agent: "Awa Traoré", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
  },
  {
    id: 6, title: "Terrain viabilisé, belle opportunité", type: "Terrain", transaction: "Terrain", neighborhood: "Bingerville",
    address: "Bingerville, Abidjan", price: 28000000, priceLabel: "28 M", rooms: null, area: 500, badge: "Terrain",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",
    agent: "Serge Kouassi", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
  },
  {
    id: 7, title: "Appartement 2 pièces, calme et sécurisé", type: "Appartement", transaction: "Louer", neighborhood: "Cocody",
    address: "Cocody Danga, Abidjan", price: 260000, priceLabel: "260 000", rooms: 2, area: 67, badge: "Exemple",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
    agent: "Nadia Koffi", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80"
  },
  {
    id: 8, title: "Villa avec terrasse et vue dégagée", type: "Villa", transaction: "Louer", neighborhood: "Marcory",
    address: "Marcory résidentiel, Abidjan", price: 650000, priceLabel: "650 000", rooms: 4, area: 175, badge: "Exemple",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=900&q=80",
    agent: "Yann Diabaté", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80"
  },
  {
    id: 9, title: "Appartement neuf proche des commerces", type: "Appartement", transaction: "Louer", neighborhood: "Riviera",
    address: "Riviera 3, Abidjan", price: 450000, priceLabel: "450 000", rooms: 3, area: 105, badge: "Exemple",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    agent: "Awa Traoré", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
  }
];

let properties = [...sampleProperties];
let supabaseClient = null;
const grid = document.querySelector("#listing-grid");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const locationFilter = document.querySelector("#location-filter");
const typeFilter = document.querySelector("#type-filter");
const budgetFilter = document.querySelector("#budget-filter");
const dialog = document.querySelector("#listing-dialog");
const favorites = new Set();
let activeTransaction = "Louer";
let activeQuickType = "";
let visibleCount = 6;
let sortByPrice = false;
let toastTimer;

function getVisibleProperties() {
  const budget = Number(budgetFilter.value);
  const matches = properties.filter((property) => {
    const transactionMatches = activeTransaction === "Terrain"
      ? property.type === "Terrain"
      : property.transaction === activeTransaction;
    return transactionMatches
      && (!locationFilter.value || property.neighborhood === locationFilter.value)
      && (!typeFilter.value || property.type === typeFilter.value)
      && (!activeQuickType || property.type === activeQuickType)
      && (!budget || property.price <= budget);
  });
  return sortByPrice ? matches.sort((a, b) => a.price - b.price) : matches;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR").format(Number(price)) + " FCFA";
}

function getWhatsAppNumber(value) {
  const phone = String(value ?? "").trim();
  if (!/^\+?[\d\s().-]{8,24}$/.test(phone)) return "";
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith("0")) digits = `225${digits}`;
  if (digits.length < 10 || digits.length > 15) return "";
  return digits;
}

const placeholderImage = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><rect width="400" height="260" fill="#e4e0d9"/><path d="M150 150l50-42 50 42v40h-100z" fill="#c9c3b8"/><text x="200" y="220" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#8a8478">Photo non fournie</text></svg>');

function propertyCard(property) {
  const propertyId = String(property.id);
  const roomFeature = property.rooms ? `<span><b>⌂</b>${property.rooms} pièces</span>` : "";
  const priceSuffix = property.transaction === "Louer" ? "<small> / mois</small>" : "";
  const title = escapeHTML(property.title);
  const agentName = escapeHTML(property.agent);
  const contactPhone = getWhatsAppNumber(property.contactPhone);
  const contactAction = contactPhone
    ? `<a class="contact-link" href="https://wa.me/${contactPhone}?text=${encodeURIComponent(`Bonjour, je vous contacte au sujet de votre annonce : ${property.title}`)}" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>`
    : `<button class="contact-link" type="button" data-contact="${escapeHTML(property.agent)}">Contacter →</button>`;
  const image = property.image && /^https:\/\//i.test(property.image) ? property.image : (property.isLive ? placeholderImage : sampleProperties[0].image);
  const avatar = property.avatar
    ? `<img class="agent-avatar" src="${escapeHTML(property.avatar)}" alt="" loading="lazy" />`
    : `<span class="agent-avatar agent-initials" aria-hidden="true">${escapeHTML(String(property.agent || "?").split(/\s+/).slice(0, 2).map((part) => part[0] || "").join(""))}</span>`;
  return `<article class="property-card">
    <div class="property-image-wrap">
      <img class="property-image" src="${escapeHTML(image)}" alt="${title}" loading="lazy" onerror="this.onerror=null;this.src=placeholderImage" />
      <span class="property-badge ${property.featured ? "featured" : ""}">${escapeHTML(property.badge)}</span>
      <button class="favorite-button ${favorites.has(propertyId) ? "is-favorite" : ""}" type="button" data-favorite="${escapeHTML(propertyId)}" aria-label="${favorites.has(propertyId) ? "Retirer des favoris" : "Ajouter aux favoris"}">${favorites.has(propertyId) ? "♥" : "♡"}</button>
    </div>
    <div class="property-content">
      <span class="property-kind">${escapeHTML(property.type)} · ${property.transaction === "Louer" ? "Location" : property.transaction === "Terrain" ? "Terrain" : "Vente"}</span>
      <div class="property-title-row"><h3 class="property-title">${title}</h3><span class="property-price">${escapeHTML(property.priceLabel || formatPrice(property.price))}${priceSuffix}</span></div>
      <p class="property-address">⌖ &nbsp;${escapeHTML(property.address)}</p>
      <div class="property-features">${roomFeature}<span><b>↗</b>${escapeHTML(property.area)} m²</span><span><b>✓</b>${property.isLive ? "Annonce publiée" : "Exemple"}</span></div>
      <div class="property-footer"><div class="agent-info">${avatar}<span class="agent-name">${agentName}${property.isLive ? "" : " · Exemple"}</span></div>${contactAction}</div>
    </div>
  </article>`;
}

function renderProperties() {
  const visible = getVisibleProperties();
  const shown = visible.slice(0, visibleCount);
  grid.innerHTML = shown.map(propertyCard).join("");
  resultCount.textContent = String(visible.length).padStart(2, "0");
  emptyState.hidden = visible.length > 0;
  document.querySelector("#show-more").hidden = visible.length <= visibleCount;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3000);
}

function setListingStatus(message, state) {
  const status = document.querySelector("#listing-status");
  status.textContent = message;
  status.dataset.state = state;
  document.querySelector("#retry-listings").hidden = state !== "error";
}

function isSupabaseConfigured() {
  const url = window.IMMOLINK_SUPABASE_URL;
  const key = window.IMMOLINK_SUPABASE_ANON_KEY?.trim();
  return typeof url === "string" && /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)
    && typeof key === "string" && key.length > 20 && !key.includes("YOUR_");
}

function normalizeListing(row) {
  return {
    id: row.id,
    title: row.title,
    type: row.property_type,
    transaction: row.transaction_type,
    neighborhood: row.neighborhood,
    address: row.address,
    price: Number(row.price),
    rooms: row.rooms,
    area: Number(row.area),
    badge: "Annonce publiée",
    image: row.image_url || "",
    agent: row.seller_name,
    contactPhone: row.contact_phone,
    avatar: "",
    isLive: true
  };
}

async function loadPublishedListings() {
  if (!supabaseClient) {
    properties = [...sampleProperties];
    setListingStatus("Aperçu de démonstration · aucune annonce réelle", "demo");
    renderProperties();
    return;
  }

  setListingStatus("Chargement des annonces publiées…", "loading");
  try {
    const { data, error } = await supabaseClient
      .from("listings")
      .select("id,title,property_type,transaction_type,neighborhood,address,price,rooms,area,image_url,seller_name,contact_phone")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;

    properties = (data || []).map(normalizeListing);
    if (properties.length && !properties.some((item) => (activeTransaction === "Terrain" ? item.type === "Terrain" : item.transaction === activeTransaction))) {
      const first = properties[0];
      const targetTab = first.type === "Terrain" ? "Terrain" : first.transaction;
      document.querySelector(`.search-tab[data-transaction="${targetTab}"]`)?.click();
    }
    setListingStatus(`${properties.length} annonce${properties.length > 1 ? "s" : ""} publiée${properties.length > 1 ? "s" : ""} sur ImmoLink`, "live");
    renderProperties();
  } catch (error) {
    properties = [...sampleProperties];
    setListingStatus("Supabase est inaccessible : aperçu de démonstration affiché.", "error");
    console.error("Impossible de charger les annonces Supabase.", error);
    renderProperties();
  }
}

async function initializeSupabase() {
  if (!isSupabaseConfigured()) {
    await loadPublishedListings();
    return;
  }

  if (!window.supabase?.createClient) {
    properties = [...sampleProperties];
    setListingStatus("La bibliothèque Supabase n'a pas pu être chargée. Vérifiez votre connexion puis actualisez.", "error");
    renderProperties();
    return;
  }

  try {
    supabaseClient = window.supabase.createClient(window.IMMOLINK_SUPABASE_URL, window.IMMOLINK_SUPABASE_ANON_KEY);
  } catch (error) {
    properties = [...sampleProperties];
    setListingStatus("La connexion à Supabase a échoué. Vérifiez l'URL et la clé publique.", "error");
    console.error("Impossible d'initialiser Supabase.", error);
    renderProperties();
    return;
  }
  await loadPublishedListings();
}

document.querySelector("#retry-listings").addEventListener("click", () => initializeSupabase());

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  visibleCount = 6;
  renderProperties();
  document.querySelector("#annonces").scrollIntoView({ behavior: "smooth", block: "start" });
});

for (const filter of [locationFilter, typeFilter, budgetFilter]) {
  filter.addEventListener("change", () => {
    visibleCount = 6;
    renderProperties();
  });
}

document.querySelectorAll(".search-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    activeTransaction = tab.dataset.transaction;
    document.querySelectorAll(".search-tab").forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    document.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.quickType === "");
    });
    activeQuickType = "";
    typeFilter.value = "";
    updateBudgetOptions(activeTransaction);
    visibleCount = 6;
    renderProperties();
  });
});

function updateBudgetOptions(transaction) {
  const options = transaction === "Louer"
    ? [["", "Sans limite"], ["250000", "250 000 FCFA"], ["500000", "500 000 FCFA"], ["1000000", "1 000 000 FCFA"]]
    : [["", "Sans limite"], ["50000000", "50 M FCFA"], ["100000000", "100 M FCFA"], ["200000000", "200 M FCFA"]];
  const selectedBudget = budgetFilter.value;
  budgetFilter.replaceChildren(...options.map(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  }));
  budgetFilter.value = options.some(([value]) => value === selectedBudget) ? selectedBudget : "";
}

document.querySelectorAll("[data-quick-location]").forEach((button) => {
  button.addEventListener("click", () => {
    locationFilter.value = button.dataset.quickLocation;
    visibleCount = 6;
    renderProperties();
    document.querySelector("#annonces").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll(".filter-chip").forEach((button) => {
  button.addEventListener("click", () => {
    activeQuickType = button.dataset.quickType;
    typeFilter.value = "";
    document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.toggle("active", chip === button));
    visibleCount = 6;
    renderProperties();
  });
});

grid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const contactButton = event.target.closest("[data-contact]");
  if (favoriteButton) {
    const id = favoriteButton.dataset.favorite;
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    renderProperties();
  }
  if (contactButton) showToast(`Contact direct indisponible pour cette annonce de démonstration.`);
});

document.querySelector("#show-more").addEventListener("click", () => {
  visibleCount += 3;
  renderProperties();
});

document.querySelector("#sort-button").addEventListener("click", (event) => {
  sortByPrice = !sortByPrice;
  event.currentTarget.querySelector("span").textContent = sortByPrice ? "Trier : prix croissant" : "Trier : pertinence";
  renderProperties();
});

document.querySelector("#reset-filters").addEventListener("click", () => {
  locationFilter.value = "";
  typeFilter.value = "";
  budgetFilter.value = "";
  activeQuickType = "";
  activeTransaction = "Louer";
  updateBudgetOptions(activeTransaction);
  document.querySelectorAll(".search-tab").forEach((tab) => {
    const selected = tab.dataset.transaction === "Louer";
    tab.classList.toggle("selected", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
  document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.toggle("active", chip.dataset.quickType === ""));
  renderProperties();
});

document.querySelectorAll("[data-open-listing]").forEach((button) => {
  button.addEventListener("click", () => dialog.showModal());
});

document.querySelectorAll("[data-toast]").forEach((button) => {
  button.addEventListener("click", () => showToast(button.dataset.toast));
});

document.querySelector("#listing-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector("#listing-form-status");
  const submitButton = form.querySelector('button[type="submit"]');
  if (!supabaseClient) {
    status.textContent = "Le dépôt en ligne n'est pas encore activé. Configurez Supabase pour recevoir des annonces.";
    status.dataset.state = "error";
    return;
  }

  const formData = new FormData(event.currentTarget);
  const sellerName = String(formData.get("sellerName")).trim();
  const contactPhone = String(formData.get("contactPhone")).trim();
  const propertyType = String(formData.get("propertyType"));
  const transactionType = String(formData.get("transactionType"));
  const neighborhood = String(formData.get("neighborhood")).trim();
  const address = String(formData.get("address")).trim();
  const title = String(formData.get("title")).trim();
  const price = Number(formData.get("price"));
  const area = Number(formData.get("area"));
  const roomValue = String(formData.get("rooms") || "").trim();
  const rooms = roomValue ? Number(roomValue) : null;
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  if (!sellerName || !contactPhone || !getWhatsAppNumber(contactPhone) || !neighborhood || !address || !title
    || !Number.isSafeInteger(price) || price < 1 || price > 10000000000
    || !Number.isFinite(area) || area < 1 || area > 100000
    || (rooms !== null && (!Number.isInteger(rooms) || rooms < 1 || rooms > 100))
    || !formData.has("phoneConsent")
    || (propertyType !== "Terrain" && !rooms)
    || (imageUrl && !/^https:\/\//.test(imageUrl))) {
    status.textContent = "Vérifiez votre numéro (format +225), le prix, la surface, les pièces et le lien photo HTTPS.";
    status.dataset.state = "error";
    return;
  }

  submitButton.disabled = true;
  status.textContent = "Envoi de votre annonce…";
  status.dataset.state = "loading";
  try {
    const { error } = await supabaseClient.from("listings").insert({
      seller_name: sellerName,
      contact_phone: contactPhone,
      property_type: propertyType,
      transaction_type: transactionType,
      neighborhood,
      address,
      title,
      price,
      area,
      rooms,
      image_url: imageUrl || null,
      contact_phone_consent_at: new Date().toISOString()
    });
    if (error) throw error;
  } catch (error) {
    status.textContent = "L'annonce n'a pas pu être envoyée. Réessayez dans quelques instants.";
    status.dataset.state = "error";
    submitButton.disabled = false;
    console.error("Impossible d'envoyer l'annonce à Supabase.", error);
    return;
  }

  dialog.close();
  form.reset();
  status.textContent = "";
  status.dataset.state = "";
  submitButton.disabled = false;
  showToast("Annonce reçue. Elle sera visible après vérification.");
});

const menuToggle = document.querySelector(".menu-toggle");
menuToggle.addEventListener("click", () => {
  const nav = document.querySelector(".main-nav");
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  nav.classList.toggle("open", !expanded);
});
document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".main-nav").classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

initializeSupabase();
