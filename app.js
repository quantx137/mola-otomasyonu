(function () {
  "use strict";

  // ---------------- VERİ ----------------
  var PALETTES = {
    altin:   { label: "Siyah Altın",   bg: "#0f0f10", surface: "#1a1a1c", text: "#f2efe9", muted: "#a9a39a", accent: "#c9a24b" },
    bakir:   { label: "Lacivert",      bg: "#0e1624", surface: "#16213a", text: "#eef1f6", muted: "#9aa6bb", accent: "#c77d4a" },
    zumrut:  { label: "Zümrüt",        bg: "#0d1f1a", surface: "#143029", text: "#eef3ef", muted: "#9db3aa", accent: "#d4af37" },
    bordo:   { label: "Bordo",         bg: "#1a0d10", surface: "#2a1418", text: "#f5ecec", muted: "#b39a9d", accent: "#c8404d" },
    beyaz:   { label: "Beyaz Siyah",   bg: "#ffffff", surface: "#f3f3f3", text: "#111111", muted: "#666666", accent: "#111111" },
    krem:    { label: "Krem Kahve",    bg: "#f6f0e8", surface: "#ece3d6", text: "#2b211a", muted: "#7a6a5c", accent: "#8b5a2b" },
    pudra:   { label: "Pudra",         bg: "#fbf5f4", surface: "#f3e6e4", text: "#3a2a2c", muted: "#8a7477", accent: "#c07a86" },
    ozel:    { label: "Özel" }
  };

  var SERVICES = {
    erkek: [
      ["Saç Kesimi", "Yüz hattınıza uygun modern ve klasik kesimler.", 400],
      ["Sakal Tıraşı", "Sıcak havlu eşliğinde ustura ile sakal şekillendirme.", 250],
      ["Saç + Sakal", "Komple bakım paketi, yıkama ve şekillendirme dahil.", 600],
      ["Çocuk Tıraşı", "Minik misafirlerimiz için sabırlı ve özenli kesim.", 300],
      ["Cilt Bakımı", "Maske, buhar ve peeling ile derinlemesine temizlik.", 500],
      ["Damat Tıraşı", "Özel gününüz için eksiksiz hazırlık paketi.", 2500]
    ],
    kadin: [
      ["Kesim & Fön", "Yüz şeklinize uygun kesim ve profesyonel fön.", 600],
      ["Saç Boyama", "Kaliteli ürünlerle kalıcı ve canlı renkler.", 1500],
      ["Röfle & Balayage", "Doğal geçişli, ışıltılı renk teknikleri.", 3000],
      ["Keratin Bakım", "Yıpranmış saçlar için yoğun onarım.", 2500],
      ["Gelin Saçı", "Özel gününüz için prova dahil gelin paketi.", 5000],
      ["Manikür & Pedikür", "El ve ayak bakımı, kalıcı oje seçenekleri.", 700]
    ],
    unisex: [
      ["Kadın Kesim & Fön", "Yüz şeklinize uygun kesim ve profesyonel fön.", 600],
      ["Erkek Saç Kesimi", "Modern ve klasik erkek kesimleri.", 400],
      ["Sakal Tıraşı", "Ustura ile sakal şekillendirme.", 250],
      ["Saç Boyama", "Kaliteli ürünlerle canlı ve kalıcı renkler.", 1500],
      ["Keratin Bakım", "Yıpranmış saçlar için yoğun onarım.", 2500],
      ["Cilt Bakımı", "Buhar, maske ve peeling ile temizlik.", 500]
    ]
  };

  var TYPE_LABEL = { erkek: "Erkek Kuaförü", kadin: "Bayan Kuaförü", unisex: "Kuaför & Güzellik" };
  var ABOUT = {
    erkek: "Yılların tecrübesiyle, her müşterimize kendini özel hissettiren bir deneyim sunuyoruz. Hijyenik ortamımız, kaliteli ürünlerimiz ve güler yüzlü ekibimizle tarzınızı birlikte şekillendiriyoruz.",
    kadin: "Güzelliğinizi ortaya çıkarmak için en güncel teknikleri ve kaliteli ürünleri kullanıyoruz. Samimi ve hijyenik salonumuzda kendinize ayırdığınız zamanın keyfini çıkarın.",
    unisex: "Kadın ve erkek tüm misafirlerimize, uzman ekibimizle kişiye özel saç ve bakım hizmetleri sunuyoruz. Hijyen, kalite ve memnuniyet önceliğimizdir."
  };
  var GALLERY_LABELS = ["Kesim", "Stil", "Bakım", "Salonumuz", "Renk", "Detay"];

  var DEFAULTS = {
    name: "", tagline: "", phone: "", address: "", city: "", insta: "",
    type: "erkek", tpl: "klasik", pal: "altin", prices: "1",
    cBg: "#101418", cText: "#f5f5f5", cAccent: "#e0a526"
  };
  var PLACEHOLDER = {
    name: "Salon Adınız", tagline: "Tarzınız bizim işimiz.", phone: "0555 555 55 55",
    address: "Örnek Mah. Kuaför Sk. No: 1", city: "İlçe / Şehir"
  };

  var HEX = /^#[0-9a-f]{6}$/i;
  var state = Object.assign({}, DEFAULTS);
  var photos = []; // yalnızca bellekte, object URL listesi

  // ---------------- YARDIMCILAR ----------------
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var site = $("#site");
  var form = $("#form");

  function val(key) { return (state[key] || "").trim() || PLACEHOLDER[key] || ""; }

  function phoneDigits() {
    var d = (state.phone || "").replace(/\D/g, "");
    if (!d) return "";
    if (d.indexOf("90") === 0 && d.length === 12) return d;
    if (d.charAt(0) === "0") d = d.slice(1);
    return d.length === 10 ? "90" + d : d;
  }

  function hexToRgb(h) { var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function luminance(h) {
    var c = hexToRgb(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function mix(a, b, t) {
    var x = hexToRgb(a), y = hexToRgb(b);
    return "#" + x.map(function (v, i) { return Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0"); }).join("");
  }

  function currentColors() {
    if (state.pal !== "ozel") return PALETTES[state.pal] || PALETTES.altin;
    var bg = HEX.test(state.cBg) ? state.cBg : DEFAULTS.cBg;
    var text = HEX.test(state.cText) ? state.cText : DEFAULTS.cText;
    var accent = HEX.test(state.cAccent) ? state.cAccent : DEFAULTS.cAccent;
    return { bg: bg, text: text, accent: accent, surface: mix(bg, text, 0.06), muted: mix(text, bg, 0.4) };
  }

  // ---------------- RENDER ----------------
  function render() {
    // Şablon
    site.className = "tpl-" + state.tpl;

    // Renkler
    var c = currentColors();
    site.style.setProperty("--bg", c.bg);
    site.style.setProperty("--surface", c.surface);
    site.style.setProperty("--text", c.text);
    site.style.setProperty("--muted", c.muted);
    site.style.setProperty("--accent", c.accent);
    site.style.setProperty("--on-accent", luminance(c.accent) > 0.35 ? "#111111" : "#ffffff");

    // Metinler (textContent -> XSS yok)
    var texts = {
      name: val("name"),
      tagline: val("tagline"),
      phone: val("phone"),
      address: val("address"),
      city: val("city"),
      typeLabel: TYPE_LABEL[state.type],
      about: ABOUT[state.type],
      instaLabel: state.insta ? "@" + state.insta.replace(/^@/, "") : ""
    };
    $$("[data-bind]", site).forEach(function (el) { el.textContent = texts[el.getAttribute("data-bind")]; });

    // Linkler
    var digits = phoneDigits() || "905555555555";
    var msg = encodeURIComponent("Merhaba, " + texts.name + " için randevu almak istiyorum.");
    var insta = (state.insta || "").replace(/^@/, "").replace(/[^a-zA-Z0-9._]/g, "");
    var links = {
      tel: "tel:+" + digits,
      wa: "https://wa.me/" + digits + "?text=" + msg,
      insta: insta ? "https://instagram.com/" + insta : ""
    };
    $$("[data-href]", site).forEach(function (el) {
      var h = links[el.getAttribute("data-href")];
      if (h) { el.href = h; el.hidden = false; } else { el.removeAttribute("href"); if (el.getAttribute("data-href") === "insta") el.hidden = true; }
      if (/^https/.test(h || "")) { el.target = "_blank"; el.rel = "noopener"; }
    });

    renderServices();
    renderGallery();
    renderMap();
    document.title = (state.name.trim() ? state.name.trim() + " · " : "") + "Kuaför Site Tasarımcısı";
    syncControls();
  }

  function renderServices() {
    var box = $("#services");
    box.textContent = "";
    SERVICES[state.type].forEach(function (s, i) {
      var card = document.createElement("article");
      card.className = "s-card";
      var num = document.createElement("span"); num.className = "num"; num.textContent = String(i + 1).padStart(2, "0");
      var h = document.createElement("h3"); h.textContent = s[0];
      var p = document.createElement("p"); p.textContent = s[1];
      card.append(num, h, p);
      if (state.prices === "1") {
        var pr = document.createElement("span"); pr.className = "price";
        pr.textContent = s[2].toLocaleString("tr-TR") + " ₺";
        card.append(pr);
      }
      box.append(card);
    });
  }

  function renderGallery() {
    var box = $("#gallery");
    box.textContent = "";
    var gal = photos.slice(1);
    for (var i = 0; i < 6; i++) {
      var f = document.createElement("figure");
      if (gal[i]) {
        var img = document.createElement("img"); img.src = gal[i]; img.alt = ""; f.append(img);
      } else {
        var cap = document.createElement("figcaption"); cap.textContent = GALLERY_LABELS[i]; f.append(cap);
      }
      box.append(f);
    }
    var hero = $("#heroMedia");
    if (photos[0]) {
      hero.style.backgroundImage = 'url("' + photos[0] + '")';
      hero.classList.add("has-photo");
    } else {
      hero.style.backgroundImage = "";
      hero.classList.remove("has-photo");
    }
  }

  var lastMapQuery = null;
  function renderMap() {
    var q = [state.address, state.city].map(function (s) { return (s || "").trim(); }).filter(Boolean).join(", ");
    if (q === lastMapQuery) return;
    lastMapQuery = q;
    var box = $("#map");
    box.textContent = "";
    if (!q) { box.textContent = "Adres girildiğinde harita burada görünür"; return; }
    var ifr = document.createElement("iframe");
    ifr.loading = "lazy";
    ifr.referrerPolicy = "no-referrer-when-downgrade";
    ifr.title = "Harita";
    ifr.src = "https://maps.google.com/maps?q=" + encodeURIComponent(q) + "&output=embed";
    box.append(ifr);
  }

  // ---------------- PANEL ----------------
  function buildPalettes() {
    var box = $("#palettes");
    Object.keys(PALETTES).forEach(function (key) {
      var p = PALETTES[key];
      var b = document.createElement("button");
      b.type = "button"; b.className = "pal"; b.dataset.value = key;
      var sw = document.createElement("span"); sw.className = "pal-swatch";
      var cols = key === "ozel" ? ["conic-gradient(red,yellow,lime,cyan,blue,magenta,red)"] : [p.bg, p.surface, p.accent];
      cols.forEach(function (col) { var i = document.createElement("i"); i.style.background = col; sw.append(i); });
      var t = document.createElement("span"); t.textContent = p.label;
      b.append(sw, t);
      b.addEventListener("click", function () { state.pal = key; commit(); });
      box.append(b);
    });
  }

  function syncControls() {
    $$(".seg").forEach(function (seg) {
      var g = seg.dataset.group;
      $$("button", seg).forEach(function (b) { b.classList.toggle("active", b.dataset.value === state[g]); });
    });
    $$(".pal").forEach(function (b) { b.classList.toggle("active", b.dataset.value === state.pal); });
    $("#customColors").hidden = state.pal !== "ozel";
  }

  function fillForm() {
    ["name", "tagline", "phone", "address", "city", "insta"].forEach(function (k) { form.elements[k].value = state[k]; });
    ["cBg", "cText", "cAccent"].forEach(function (k) { form.elements[k].value = HEX.test(state[k]) ? state[k] : DEFAULTS[k]; });
    form.elements.prices.checked = state.prices === "1";
  }

  // ---------------- URL (paylaşım) ----------------
  function toHash() {
    var p = new URLSearchParams();
    Object.keys(DEFAULTS).forEach(function (k) { if (state[k] !== DEFAULTS[k]) p.set(k, state[k]); });
    var s = p.toString();
    history.replaceState(null, "", s ? "#" + s : location.pathname + location.search);
  }

  function fromHash() {
    var p = new URLSearchParams(location.hash.slice(1));
    var s = Object.assign({}, DEFAULTS);
    Object.keys(DEFAULTS).forEach(function (k) { if (p.has(k)) s[k] = p.get(k).slice(0, 120); });
    // Doğrulama
    if (!SERVICES[s.type]) s.type = DEFAULTS.type;
    if (["klasik", "modern", "lux"].indexOf(s.tpl) < 0) s.tpl = DEFAULTS.tpl;
    if (!PALETTES[s.pal]) s.pal = DEFAULTS.pal;
    if (s.prices !== "0" && s.prices !== "1") s.prices = DEFAULTS.prices;
    ["cBg", "cText", "cAccent"].forEach(function (k) { if (!HEX.test(s[k])) s[k] = DEFAULTS[k]; });
    state = s;
  }

  var hashTimer;
  function commit() {
    render();
    clearTimeout(hashTimer);
    hashTimer = setTimeout(toHash, 300);
  }

  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  // ---------------- OLAYLAR ----------------
  form.addEventListener("input", function (e) {
    var el = e.target;
    if (!el.name) return;
    state[el.name] = el.type === "checkbox" ? (el.checked ? "1" : "0") : el.value;
    commit();
  });
  form.addEventListener("submit", function (e) { e.preventDefault(); });

  $$(".seg").forEach(function (seg) {
    seg.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      state[seg.dataset.group] = b.dataset.value;
      commit();
    });
  });

  $("#photos").addEventListener("change", function (e) {
    photos.forEach(URL.revokeObjectURL);
    photos = Array.prototype.slice.call(e.target.files)
      .filter(function (f) { return /^image\//.test(f.type); })
      .slice(0, 7)
      .map(function (f) { return URL.createObjectURL(f); });
    renderGallery();
  });

  $("#presentBtn").addEventListener("click", function () {
    document.body.classList.add("presenting");
    document.body.classList.remove("panel-open");
    site.scrollTop = 0; window.scrollTo(0, 0);
    var el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(function () {});
  });

  $("#panelOpen").addEventListener("click", function () {
    if (document.body.classList.contains("presenting")) {
      document.body.classList.remove("presenting");
      if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    } else {
      document.body.classList.add("panel-open");
    }
  });
  $("#panelClose").addEventListener("click", function () { document.body.classList.remove("panel-open"); });

  document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreenElement) document.body.classList.remove("presenting");
  });

  $("#shareBtn").addEventListener("click", function () {
    toHash();
    var url = location.href;
    if (navigator.share && matchMedia("(max-width: 860px)").matches) {
      navigator.share({ title: val("name"), url: url }).catch(function () {});
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { toast("Link kopyalandı"); }, function () { prompt("Linki kopyalayın:", url); });
    } else {
      prompt("Linki kopyalayın:", url);
    }
  });

  $("#resetBtn").addEventListener("click", function () {
    if (!confirm("Tüm ayarlar sıfırlansın mı?")) return;
    state = Object.assign({}, DEFAULTS);
    photos.forEach(URL.revokeObjectURL); photos = [];
    $("#photos").value = "";
    fillForm();
    commit();
  });

  // Önizleme içindeki menü linkleri: sadece önizleme alanında kaydır
  site.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#s-"]');
    if (!a) return;
    e.preventDefault();
    var t = $(a.getAttribute("href"));
    if (t) t.scrollIntoView({ behavior: "smooth" });
  });

  // ---------------- BAŞLAT ----------------
  $("#year").textContent = new Date().getFullYear();
  buildPalettes();
  fromHash();
  fillForm();
  render();
})();
