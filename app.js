"use strict";

const BRAND = "JAJANANKU";
const BRAND_TAGLINE = "Makin Mudah, Makin Enak";

const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

/* ================= Helpers ================= */
function fmtPrice(n){ return "Rp " + Math.round(Number(n) || 0).toLocaleString("id-ID"); }
function fmtDateTime(d){ const dt = d instanceof Date ? d : new Date(d); if(isNaN(dt.getTime())) return String(d); return dt.toLocaleString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}); }
function toast(msg){ const el = $("#toast"); if(!el) return; el.textContent = msg; el.classList.add("show"); clearTimeout(window.__toastT); window.__toastT = setTimeout(()=>el.classList.remove("show"), 2400); }

function navigate(path){ if(location.hash === "#"+path) return; location.hash = path; }
function goHome(){ navigate("/home"); }
function goExplore(cat){ state.exploreCat = cat || "Semua"; navigate("/explore"); }
function openCart(){ navigate("/checkout"); }
function scrollProducts(){ const el = $("#exploreProducts"); if(el){ el.scrollIntoView({behavior:"smooth"}); } }

/* ================= Products ================= */
const CATEGORIES = ["Semua","Pedas","Manis","Gorengan","Minuman","Frozen","Snack Box"];
const PRODUCTS = [
  { id:"seblak-ceker", name:"Seblak Ceker Pedas", cat:"Pedas", price:15000, badge:"Best Seller", emoji:"🌶️", tint:"linear-gradient(135deg,#fee2e2,#fecaca)", desc:"Seblak ceker level pedas dengan kerupuk, makaroni, dan telur. Porsi kenyang.",
    features:["Level pedas 1-5", "Ceker empuk", "Kerupuk & makaroni"] },
  { id:"basreng-pedas", name:"Basreng Pedas Daun Jeruk", cat:"Pedas", price:12000, badge:"Populer", emoji:"🍟", tint:"linear-gradient(135deg,#ffedd5,#fed7aa)", desc:"Basreng (bakso goreng) renyah dengan bumbu pedas daun jeruk yang nagih.",
    features:["Renyah & gurih", "Bumbu daun jeruk", "Kemasan 100g"] },
  { id:"cilok-goang", name:"Cilok Goang Kuah Pedas", cat:"Pedas", price:10000, emoji:"🍢", tint:"linear-gradient(135deg,#fee2e2,#fca5a5)", desc:"Cilok kenyal dengan kuah goang pedas merah yang menggigit.",
    features:["Kuah goang pedas", "Cilok kenyal", "Porsi 8 pcs"] },
  { id:"mochi-lumer", name:"Mochi Strawberry Lumer", cat:"Manis", price:18000, badge:"New", emoji:"🍓", tint:"linear-gradient(135deg,#fce7f3,#fbcfe8)", desc:"Mochi lembut isi selai strawberry lumer dengan taburan wijen.",
    features:["Isi strawberry lumer", "Lembut & kenyal", "Isi 6 pcs"] },
  { id:"croffle-ck", name:"Croffle Cokelat Keju", cat:"Manis", price:22000, badge:"Populer", emoji:"🧇", tint:"linear-gradient(135deg,#fef3c7,#fde68a)", desc:"Croffle (croissant waffle) dengan topping cokelat dan keju parut.",
    features:["Croffle renyah", "Cokelat + keju", "Sajian hangat"] },
  { id:"tanghulu", name:"Tanghulu Buah Segar", cat:"Manis", price:15000, emoji:"🍬", tint:"linear-gradient(135deg,#dcfce7,#bbf7d0)", desc:"Tanghulu buah segar (anggur & strawberry) berlapis gula karamel renyah.",
    features:["Buah segar", "Lapisan karamel", "Isi 5 tusuk"] },
  { id:"corndog-mozz", name:"Korean Corn Dog Mozzarella", cat:"Gorengan", price:18000, badge:"Best Seller", emoji:"🌭", tint:"linear-gradient(135deg,#fef9c3,#fde68a)", desc:"Corn dog Korea dengan isian sosis & mozzarella lumer, balutan kentang.",
    features:["Mozzarella lumer", "Balutan kentang", "Saus mustard & ketchup"] },
  { id:"cireng-rujak", name:"Cireng Bumbu Rujak", cat:"Gorengan", price:12000, emoji:"\uD83C\uDF58", tint:"linear-gradient(135deg,#ffedd5,#fdba74)", desc:"Cireng renyah luar lembut dalam dengan bumbu rujak pedas manis.",
    features:["Renyah luar lembut dalam", "Bumbu rujak", "Isi 8 pcs"] },
  { id:"boba-brown", name:"Boba Brown Sugar", cat:"Minuman", price:20000, badge:"Best Seller", emoji:"🧋", tint:"linear-gradient(135deg,#e7e5e4,#d6d3d1)", desc:"Boba brown sugar dengan susu segar dan pearl kenyal.",
    features:["Pearl kenyal", "Brown sugar karamel", "Ukuran jumbo"] },
  { id:"thai-tea", name:"Thai Tea Jumbo", cat:"Minuman", price:15000, emoji:"🧃", tint:"linear-gradient(135deg,#fed7aa,#fdba74)", desc:"Thai tea jumbo dengan susu kental dan es batu.",
    features:["Ukuran jumbo 700ml", "Susu kental", "Less sugar option"] },
  { id:"dessert-box", name:"Dessert Box Tiramisu", cat:"Manis", price:35000, badge:"Populer", emoji:"🍰", tint:"linear-gradient(135deg,#e7e5e4,#a8a29e)", desc:"Dessert box tiramisu dengan lapisan mascarpone, kopi, dan cocoa.",
    features:["Mascarpone creamy", "Lapisan kopi", "Box 250ml"] },
  { id:"puding-mangga", name:"Puding Mangga Susu", cat:"Manis", price:12000, emoji:"🥭", tint:"linear-gradient(135deg,#fef9c3,#fde047)", desc:"Puding mangga segar dengan topping susu dan nata de coco.",
    features:["Mangga segar", "Topping susu", "Box 200ml"] },
  { id:"donat-kentang", name:"Donat Kentang Glaze", cat:"Manis", price:15000, emoji:"🍩", tint:"linear-gradient(135deg,#fce7f3,#f9a8d4)", desc:"Donat kentang lembut dengan glaze strawberry dan sprinkles.",
    features:["Donat kentang lembut", "Glaze strawberry", "Isi 4 pcs"] },
  { id:"churros", name:"Churros Cinnamon Sugar", cat:"Manis", price:18000, emoji:"🍫", tint:"linear-gradient(135deg,#fef3c7,#fcd34d)", desc:"Churros renyah dengan taburan cinnamon sugar dan saus cokelat.",
    features:["Renyah & hangat", "Cinnamon sugar", "Saus cokelat"] },
  { id:"dimsum-ayam", name:"Dimsum Ayam (isi 5)", cat:"Frozen", price:25000, emoji:"🥟", tint:"linear-gradient(135deg,#e0e7ff,#c7d2fe)", desc:"Dimsum ayam frozen siap kukus, isi 5 pcs dengan saus sambal.",
    features:["Ayam pilihan", "Siap kukus 10 menit", "Saus sambal included"] },
  { id:"siomay-bandung", name:"Siomay Bandung", cat:"Frozen", price:20000, emoji:"\uD83E\uDD5F", tint:"linear-gradient(135deg,#dcfce7,#86efac)", desc:"Siomay Bandung frozen dengan bumbu kacang dan kecap manis.",
    features:["Ikan tenggiri", "Bumbu kacang", "Isi 6 pcs"] },
  { id:"snack-box", name:"Snack Box Mix (isi 6)", cat:"Snack Box", price:30000, badge:"Populer", emoji:"📦", tint:"linear-gradient(135deg,#e0f2fe,#bae6fd)", desc:"Snack box mix: basreng, cireng, cilok, mochi, donat, dan boba.",
    features:["6 jenis jajanan", "Cocok untuk sharing", "Hemat 15%"] },
  { id:"kentang-goreng", name:"Kentang Goreng Crispy", cat:"Gorengan", price:15000, emoji:"🍟", tint:"linear-gradient(135deg,#fef9c3,#fde68a)", desc:"Kentang goreng crispy dengan bumbu BBQ dan saus sambal.",
    features:["Kentang crispy", "Bumbu BBQ", "Saus sambal"] },
];
function productImageURI(p){
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <radialGradient id="r" cx="50%" cy="40%" r="65%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.55)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
      </radialGradient>
    </defs>
    <rect width="200" height="200" fill="${p.tint}" rx="24"/>
    <rect width="200" height="200" fill="url(#r)" rx="24"/>
    <ellipse cx="100" cy="165" rx="60" ry="12" fill="rgba(0,0,0,0.08)"/>
    <text x="100" y="105" font-size="92" text-anchor="middle" dominant-baseline="middle" style="filter:drop-shadow(0 6px 10px rgba(0,0,0,0.18))">${p.emoji}</text>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
function getRecommended(n){ const sorted = [...PRODUCTS].sort((a,b)=>(b.badge?1:0)-(a.badge?1:0) || a.price-b.price); return sorted.slice(0,n); }
function getRelated(p, n){
  const others = PRODUCTS.filter(x => x.id !== p.id);
  const same = others.filter(x => x.cat === p.cat);
  const diff = others.filter(x => x.cat !== p.cat);
  return [...same, ...diff].slice(0, n);
}
function productCardHTML(p){
  const badge = p.badge ? `<span class="product-badge">${p.badge}</span>` : "";
  return `<article class="product-card" data-id="${p.id}">
    <div class="product-media" style="background:${p.tint}">
      ${badge}
      <img src="${productImageURI(p)}" alt="${p.name}" class="product-photo" loading="lazy">
    </div>
    <div class="product-body">
      <div class="product-cat">${p.cat}</div>
      <h3 class="product-name">${p.name}</h3>
      <p class="product-desc">${p.desc}</p>
      <div class="product-foot">
        <span class="price">${fmtPrice(p.price)}</span>
        <button class="btn btn-sm" type="button" data-add="${p.id}">Beli</button>
      </div>
    </div>
  </article>`;
}

/* ================= Cart ================= */
const CART_KEY = "jajananku_cart_v1";
const state = { exploreCat:"Semua", exploreQuery:"", coupon:null, payment:"bca", authMode:"login", checkoutStep:1 };
function getCart(){ try{ const v = JSON.parse(localStorage.getItem(CART_KEY)); return Array.isArray(v)?v:[]; }catch(e){ return []; } }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }
function addToCart(id, qty){ const c = getCart(); const i = c.findIndex(x=>x.id===id); if(i>=0) c[i].qty += qty; else c.push({id, qty}); saveCart(c); renderCart(); updateBadges(); toast("Produk masuk keranjang"); }
function setCartQty(id, qty){ const c = getCart(); const i = c.findIndex(x=>x.id===id); if(i<0) return; if(qty<=0) c.splice(i,1); else c[i].qty = qty; saveCart(c); renderCart(); updateBadges(); }
function clearCart(){ saveCart([]); renderCart(); updateBadges(); toast("Keranjang dikosongkan"); }
function cartDetailed(){ return getCart().map(x=>({id:x.id, qty:x.qty, product: productById(x.id)})).filter(x=>x.product); }
function cartSubtotal(){ return cartDetailed().reduce((s,x)=>s + x.product.price*x.qty, 0); }
function updateBadges(){ const n = cartDetailed().reduce((s,x)=>s+x.qty,0); $$(".head-badge").forEach(b=>{ b.textContent = n; }); const dot = $(".head-dot"); if(dot) dot.hidden = n===0; }

/* ================= Member / Auth / Panels ================= */
const MEMBER_KEY = "jajananku_member_v1";
function getMember(){ try{ const v = JSON.parse(localStorage.getItem(MEMBER_KEY)); return v && v.name ? v : null; }catch(e){ return null; } }
function saveMember(m){ localStorage.setItem(MEMBER_KEY, JSON.stringify(m)); }
function loginMember(name, pin){ saveMember({name, pin, level:"Explorer", points:120, joined:new Date().toISOString()}); closeModal("authModal"); toast("Selamat datang, "+name+"!"); renderAccountView(); }
function logoutMember(){ localStorage.removeItem(MEMBER_KEY); renderAccountView(); toast("Anda telah keluar dari JAJANANKU"); }

const WISHLIST_KEY = "jajananku_wishlist_v1";
function getWishlist(){ try{ const v = JSON.parse(localStorage.getItem(WISHLIST_KEY)); return Array.isArray(v)?v:[]; }catch(e){ return []; } }
function toggleWishlist(id){ const w = getWishlist(); const i = w.indexOf(id); if(i>=0) w.splice(i,1); else w.push(id); localStorage.setItem(WISHLIST_KEY, JSON.stringify(w)); updateBadges(); }

const MESSAGES = [
  { from:"Admin JAJANANKU", text:"Selamat datang di JAJANANKU! 🎉 Tim kami siap membantu Anda sejak hari ini.", time:"Baru saja" },
  { from:"CS JAJANANKU", text:"Untuk memeriksa status pesanan cukup gunakan Order ID dan nomor WhatsApp saat checkout.", time:"2 jam lalu" },
];
const VOUCHERS = [
  { code:"VJ-AN10", title:"Diskon 10%", desc:"Untuk semua produk AI pilihan", status:"Aktif", expires:"31 Des 2026" },
  { code:"VJ-AN20", title:"Diskon 20%", desc:"Untuk produk AI Content", status:"Aktif", expires:"30 Nov 2026" },
];

/* ================= Orders ================= */
const ORDERS_KEY = "jajananku_orders_v1";
function getOrders(){ try{ const v = JSON.parse(localStorage.getItem(ORDERS_KEY)); return Array.isArray(v)?v:[]; }catch(e){ return []; } }
function saveOrders(o){ localStorage.setItem(ORDERS_KEY, JSON.stringify(o)); }
function createOrder(){ const items = cartDetailed(); const subtotal = cartSubtotal(); const disc = state.coupon ? subtotal*Math.min(Number(state.coupon.pct)||0,100)/100 : 0; const total = Math.max(0, subtotal-disc); const member = getMember() || {name:"Member", phone:"6280000000000"}; const order = { id: "JNK"+(Math.random().toString(36).slice(2,8)+Date.now().toString(36)).slice(0,10).toUpperCase(), phone: member.phone || "6280000000000", items: items.map(x=>({id:x.product.id, name:x.product.name, price:x.product.price, qty:x.qty})), subtotal, discount:disc, total, payment: state.payment, status:"Pembayaran Terkonfirmasi", createdAt:new Date().toISOString() }; const orders=[order, ...getOrders()]; saveOrders(orders); return order; }
function findOrder(id, phone){ const key = (id||"").trim().toLowerCase(); const ph = (phone||"").replace(/\D/g,""); return getOrders().find(o => o.id.toLowerCase() === key && String(o.phone||"").replace(/\D/g,"") === ph) || null; }

/* ================= Info content ================= */
const INFO_CONTENT = {
  privacy:{ title:"Kebijakan Privasi", html:`
    <h2>Kebijakan Privasi</h2>
    <p>JAJANANKU ("kami") menghormati privasi member dan pembeli. Dokumen ini menjelaskan bagaimana data dikumpulkan, digunakan, dan dilindungi.</p>
    <h3>1. Data yang Kami Kumpulkan</h3>
    <ul><li>Data akun: nama login dan PIN (dikunci dengan aman).</li><li>Nomor WhatsApp untuk verifikasi pesanan dan pemulihan akun.</li><li>Data transaksi: Order ID, produk, jumlah, dan status pembayaran.</li></ul>
    <h3>2. Cara Penggunaan Data</h3>
    <p>Data digunakan untuk memproses pesanan, mengirim akses digital, dan menjaga keamanan transaksi. Kami tidak menjual data kepada pihak ketiga.</p>
    <h3>3. Penyimpanan & Keamanan</h3>
    <p>Data disimpan dengan enkripsi dan akses dibatasi. Data pesanan tetap privat dan hanya dapat dibuka oleh pembeli yang valid.</p>
    <h3>4. Hak Member</h3>
    <p>Member dapat memperbarui atau menghapus data akun melalui halaman Pengaturan Akun.</p>
    <p>Untuk pertanyaan, hubungi <a href="#/kontak">Kontak & Bantuan</a>.</p>` },
  terms:{ title:"Syarat & Ketentuan", html:`
    <h2>Syarat & Ketentuan</h2>
    <p>Syarat penggunaan layanan JAJANANKU. Dengan menggunakan layanan ini, Anda menyetujui ketentuan berikut.</p>
    <h3>1. Akun & PIN</h3>
    <p>Nama login dan PIN member digunakan untuk mengakses fitur akun. Jangan bagikan PIN atau credential kepada siapa pun.</p>
    <h3>2. Pesanan & Pembayaran</h3>
    <p>Pesanan produk digital diproses melalui alur pembayaran yang jelas. Status transaksi dicatat melalui sistem pembayaran.</p>
    <h3>3. Produk Digital</h3>
    <p>Akses produk digital diberikan setelah pembayaran berhasil dan tercatat pada sistem pesanan.</p>
    <p>Lihat juga <a href="#/informasi/refund">Kebijakan Refund</a>.</p>` },
  refund:{ title:"Kebijakan Refund", html:`
    <h2>Kebijakan Refund</h2>
    <p>Kebijakan refund JAJANANKU mengacu pada jenis produk yang dibeli.</p>
    <h3>Produk Digital</h3>
    <p>Akses produk digital umumnya tidak dapat dikembalikan setelah aktivasi, karena sifatnya yang non-fisik. Jika terjadi kendala akses, tim kami akan membantu melalui pusat bantuan.</p>
    <h3>Pembayaran</h3>
    <p>Pembayaran yang sudah benar dan terverifikasi dapat dipertahankan. Pembatalan dilakukan sebelum proses pembayaran selesai.</p>
    <p>Untuk kebijakan produk digital, lihat <a href="#/informasi/digital-products">Kebijakan Produk Digital</a>.</p>` },
  "digital-products":{ title:"Kebijakan Produk Digital", html:`
    <h2>Kebijakan Produk Digital</h2>
    <p>JAJANANKU adalah platform produk digital dan akses premium.</p>
    <h3>1. Akses Produk</h3>
    <p>Akses produk digital diberikan setelah pembayaran berhasil dan tercatat pada sistem pesanan.</p>
    <h3>2. Hak Penggunaan</h3>
    <p>Setiap produk memiliki lisensi penggunaan sesuai paket yang dibeli.</p>
    <h3>3. Status Pesanan</h3>
    <p>Status pesanan dapat dicek kapan saja melalui halaman Cek Pesanan dengan Order ID dan nomor WhatsApp yang valid.</p>
    <p>Untuk bantuan, hubungi <a href="#/kontak">Kontak & Bantuan</a>.</p>` },
};

/* ================= Modals ================= */
function openModal(id){ const el = $("#"+id); if(!el) return; el.classList.add("open"); document.body.classList.add("no-scroll"); }
function closeModal(id){ const el = $("#"+id); if(!el) return; el.classList.remove("open"); document.body.classList.remove("no-scroll"); }
function overlayClose(e, id){ if(e && e.target === e.currentTarget) closeModal(id); }

function openAuth(mode){
  state.authMode = mode || "login";
  $("#authTitle").textContent = mode === "register" ? "Buat Akun Member" : "Selamat Datang Kembali";
  $("#authText").textContent = mode === "register" ? "Daftar member untuk mendapatkan akses produk digital dan status pesanan." : "Masuk untuk melanjutkan belanja dan mengakses pesanan.";
  const submitBtn = $("#authSubmit"); if(submitBtn) submitBtn.textContent = mode === "register" ? "Daftar" : "Masuk";
  const switchBtn = $("#authSwitchBtn"); if(switchBtn) switchBtn.textContent = mode === "register" ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar";
  $("#authName").value = "";
  $("#authPin").value = "";
  $("#authPin2").value = "";
  $("#confirmPinWrap").hidden = mode !== "register";
  $("#authNotice").textContent = "";
  openModal("authModal");
}
function toggleAuthMode(){ openAuth(state.authMode === "login" ? "register" : "login"); }
function submitAuth(e){
  e.preventDefault();
  const name = ($("#authName")||{}).value ? ($("#authName").value||"").trim() : "";
  const pin = ($("#authPin")||{}).value || "";
  const notice = $("#authNotice");
  if(!name){ notice.textContent = "Masukkan nama login."; return; }
  if(pin.length < 6 || pin.length > 12){ notice.textContent = "PIN harus berupa 6–12 digit angka."; return; }
  if(state.authMode === "register"){
    const pin2 = ($("#authPin2")||{}).value || "";
    if(pin2 !== pin){ notice.textContent = "Ulangi PIN tidak cocok."; return; }
  }
  loginMember(name, pin);
}

function openRecovery(from){ openModal("recoveryModal"); }
function closeRecovery(){ closeModal("recoveryModal"); }
function submitRecovery(e){
  e.preventDefault();
  const name = ($("#recoveryName")||{}).value ? ($("#recoveryName").value||"").trim() : "";
  const phone = ($("#recoveryPhone")||{}).value || "";
  const notice = $("#recoveryNotice");
  const result = $("#recoveryResult");
  if(!name || !phone){ notice.textContent = "Nama login dan nomor WhatsApp wajib diisi."; return; }
  const ticket = "RCP-" + Math.random().toString(36).slice(2,8).toUpperCase();
  $("#recoveryTicket").textContent = ticket;
  result.hidden = false;
  openModal("recoveryModal");
}

function openPromo(){ openModal("promoModal"); }
function closePromo(){ closeModal("promoModal"); }

/* ================= Member panels ================= */
function showMemberPanel(section){
  const titles = {
    transactions:"Pusat Transaksi", orders:"Pesanan Saya", vouchers:"Voucher Saya",
    points:"Poin & Rewards", wishlist:"Wishlist Saya", inbox:"Pesan Masuk",
    developer:"Developer API", profile:"Pengaturan Akun", help:"Pusat Bantuan", benefits:"Keuntungan Member"
  };
  const t = $("#memberPanelTitle"); if(t) t.textContent = titles[section] || "Member";
  const root = $("#memberPanelBody"); if(!root) return;
  let html = "";
  if(section === "orders"){
    const orders = getOrders();
    html = orders.length ? orders.map(o=>`<div class="order-card"><div class="order-card-head"><span class="order-id">${o.id}</span><span class="status-pill ok">● ${o.status}</span></div><p class="muted small">Tanggal ${fmtDateTime(o.createdAt)} · ${o.items.reduce((s,i)=>s+i.qty,0)} item · ${fmtPrice(o.total)}</p></div>`).join("") : panelEmpty("Belum ada pesanan. Yuk mulai belanja!");
  } else if(section === "transactions"){
    const orders = getOrders();
    html = orders.length ? orders.map(o=>`<div class="panel-item"><div class="pi-icon" style="background:#e3edff">💳</div><div class="grow"><b>${o.payment}</b><small>Transaksi ${o.id}</small></div><div class="grow" style="text-align:right"><b>${fmtPrice(o.total)}</b><div><span class="status-pill ok">Tercatat</span></div></div></div>`).join("") : panelEmpty("Belum ada transaksi.");
  } else if(section === "vouchers"){
    html = VOUCHERS.map(v=>`<div class="panel-item"><div class="pi-icon" style="background:#fef3c7">🎟️</div><div class="grow"><b>${v.title}</b><small>${v.desc} · Berlaku ${v.expires}</small></div><span class="menu-pill">${v.status}</span></div>`).join("");
  } else if(section === "points"){
    const member = getMember() || {points:120};
    html = `<div class="panel-card"><h2>Poin & Rewards</h2><div class="spread mt-8"><span class="muted">Saldo poin</span><b style="font-size:28px;color:var(--blue)">${member.points||0}</b></div><h3 class="mt-24">Riwayat poin</h3><div class="panel-item"><div class="pi-icon" style="background:#fef3c7">⭐</div><div class="grow"><b>Pembelian produk</b><small>Didapat 10 poin per Rp 1.000</small></div><span class="menu-pill blue-pill">+120</span></div><div class="panel-item"><div class="pi-icon" style="background:#fce7f3">🎁</div><div class="grow"><b>Promo member</b><small>Bonus poin dari JAJANANKU</small></div><span class="menu-pill pink">+50</span></div></div></div>`;
  } else if(section === "wishlist"){
    const w = getWishlist();
    const items = w.map(id=>productById(id)).filter(Boolean);
    html = items.length ? items.map(p=>`<div class="panel-item"><div class="pi-icon" style="background:${p.tint}">${p.emoji}</div><div class="grow"><b>${p.name}</b><small>${p.cat} · ${fmtPrice(p.price)}</small></div><button class="btn btn-sm" data-add="${p.id}">Beli</button></div>`).join("") : panelEmpty("Wishlist kosong. Simpan produk favoritmu!");
  } else if(section === "inbox"){
    html = MESSAGES.map(m=>`<div class="panel-item"><div class="pi-icon" style="background:#e3edff">✉️</div><div class="grow"><b>${m.from}</b><small>${m.time}</small><p class="muted small" style="margin:6px 0 0">${m.text}</p></div></div>`).join("");
  } else if(section === "developer"){
    const key = getApiKey();
    html = `<div class="panel-card"><h2>Developer API</h2><p class="muted small">Akses API produk digital JAJANANKU untuk integrasi aplikasi Anda.</p><div class="mt-16" style="background:#0b1526;color:#fff;border-radius:14px;padding:16px;font-family:monospace;font-size:14px;word-break:break-all">🔑 ${key}</div><button class="btn mt-16" onclick="regenerateApiKey()">Regenerate API Key</button></div>`;
  } else if(section === "profile"){
    html = `<div class="panel-card"><h2>Pengaturan Akun</h2><p class="muted small">Kelola informasi member dan keamanan akun.</p><form id="profileForm" class="mt-16" onsubmit="saveProfile(event)"><label>Nama Login<input id="profileName" maxlength="40"></label><label>Nomor WhatsApp<input id="profilePhone" inputmode="tel" maxlength="20"></label><label>PIN Baru<input id="profilePin" type="password" inputmode="numeric" maxlength="12"></label><button class="btn" type="submit">Simpan Perubahan</button></form></div>`;
  } else if(section === "help"){
    html = `<div class="panel-card"><h2>Pusat Bantuan</h2><p class="muted small">Pertanyaan tentang produk, pembayaran, akses digital, atau akun? Tim JAJANANKU siap membantu.</p><div class="mt-16"><a class="btn" href="#/kontak">Hubungi Kontak & Bantuan <span>→</span></a></div></div>`;
  } else if(section === "benefits"){
    html = `<div class="panel-card"><h2>Keuntungan Member</h2><div class="mt-8"><div class="panel-item"><div class="pi-icon" style="background:#fef3c7">⭐</div><div class="grow"><b>Level Explorer</b><small>Akses awal ke produk digital AI</small></div></div><div class="panel-item"><div class="pi-icon" style="background:#e3edff">💎</div><div class="grow"><b>Level Premium</b><small>Diskon hingga 50% untuk semua produk</small></div></div><div class="panel-item"><div class="pi-icon" style="background:#f1e8fe">🚀</div><div class="grow"><b>Level Elite</b><small>Prioritas support & akses early beta</small></div></div></div></div>`;
  }
  root.innerHTML = html;
  if(section === "profile"){ const m = getMember(); if(m){ const n = $("#profileName"); if(n) n.value = m.name || ""; const ph = $("#profilePhone"); if(ph) ph.value = m.phone || ""; } }
}
function panelEmpty(msg){ return `<div class="panel-empty">${msg}</div>`; }
function getApiKey(){ let k = localStorage.getItem("jajananku_api_v1"); if(!k){ k = "jnk_live_"+Math.random().toString(36).slice(2,10); localStorage.setItem("jajananku_api_v1", k); } return k; }
function regenerateApiKey(){ localStorage.setItem("jajananku_api_v1", "jnk_live_"+Math.random().toString(36).slice(2,10)); toast("API key baru dibuat"); showMemberPanel("developer"); }
function saveProfile(e){ e.preventDefault(); const m = getMember(); if(!m){ toast("Belum login"); return; } const name = ($("#profileName")||{}).value ? ($("#profileName").value||"").trim() : ""; const phone = ($("#profilePhone")||{}).value ? ($("#profilePhone").value||"").trim() : ""; const pin = ($("#profilePin")||{}).value || ""; if(name) m.name = name; if(phone) m.phone = phone; if(pin.length>=6) m.pin = pin; saveMember(m); toast("Profil diperbarui"); }

function openMember(section){ showMemberPanel(section); activateView("memberPanelView"); }

/* ================= Router ================= */
function activateView(id){ $$(".view").forEach(v=>v.classList.remove("active")); const el = $("#"+id); if(el) el.classList.add("active"); }
function route(){
  const path = (location.hash || "#/home").replace(/^#/, "") || "/home";
  let m;
  if(m = path.match(/^\/produk\/([\w-]+)$/)) return renderProduct(m[1]);
  if(m = path.match(/^\/informasi\/([\w-]+)$/)) return renderInfo(m[1]);
  let viewId = "/home";
  if(path === "/explore") viewId = "exploreView";
  else if(path === "/checkout") viewId = "cartView";
  else if(path === "/akun") viewId = "accountView";
  else if(path === "/cek") viewId = "cekView";
  else if(path === "/kontak") viewId = "kontakView";
  else if(path === "/informasi") viewId = "infoView";
  if(path === "/home") viewId = "homeView";
  activateView(viewId);
  if(path === "/home") renderHome();
  else if(path === "/explore") renderExploreView();
  else if(path === "/checkout") renderCheckoutView();
  else if(path === "/akun") renderAccountView();
  else if(path === "/cek") renderCekView();
  else if(path === "/kontak") renderKontakView();
  const navKey = path === "/home" ? "home" : path === "/explore" ? "explore" : path === "/checkout" ? "cart" : path === "/akun" ? "account" : path === "/cek" ? "orders" : null;
  const nav = $("#bottomNav");
  if(nav) nav.querySelectorAll("button").forEach(b=>{ b.classList.toggle("active", b.getAttribute("data-nav") === navKey); });
}

window.addEventListener("hashchange", route);
window.addEventListener("popstate", route);

let currentProductId = null;
document.addEventListener("click", function(e){
  const t = e.target;
  if(!(t instanceof Element)) return;
  const action = t.closest("[data-action]");
  if(action){ const act = action.getAttribute("data-action"); if(act==="cart"){ openCart(); } else if(act==="inbox"){ openMember("inbox"); } else if(act==="profile"){ openMember("profile"); } return; }
  const addBtn = t.closest("[data-add]");
  if(addBtn){ e.preventDefault(); addToCart(addBtn.getAttribute("data-add")); return; }
  const buyBtn = t.closest("[data-buy]");
  if(buyBtn){ e.preventDefault(); addToCart(buyBtn.getAttribute("data-buy"),1); navigate("/checkout"); return; }
  const wishBtn = t.closest("[data-wishlist]");
  if(wishBtn){ e.preventDefault(); if(currentProductId) toggleWishlist(currentProductId); toast("Wishlist diperbarui"); return; }
  const shareBtn = t.closest("[data-share]");
  if(shareBtn){ e.preventDefault(); const url = location.href; if(navigator.share){ navigator.share({title:BRAND,url:url}).catch(()=>{}); } else { toast("Link produk: "+url); } return; }
  const card = t.closest(".product-card[data-id]");
  if(card){ navigate("/produk/"+card.getAttribute("data-id")); return; }
  const chip = t.closest("[data-cat]");
  if(chip){ e.preventDefault(); state.exploreCat = chip.getAttribute("data-cat"); renderExploreTabs(); renderExplore(); return; }
  const qtyBtn = t.closest("[data-qty]");
  if(qtyBtn){ e.preventDefault(); const line = qtyBtn.closest(".cart-line"); if(!line) return; const id = line.getAttribute("data-id"); const delta = parseInt(qtyBtn.getAttribute("data-qty"),10); const cur = cartDetailed().find(x=>x.id===id)?.qty || 0; setCartQty(id, cur+delta); return; }
  const rmBtn = t.closest("[data-remove]");
  if(rmBtn){ e.preventDefault(); setCartQty(rmBtn.getAttribute("data-remove"),0); return; }
  const panelBtn = t.closest("[data-panel]");
  if(panelBtn){ e.preventDefault(); showMemberPanel(panelBtn.getAttribute("data-panel")); activateView("memberPanelView"); return; }
  const payBtn = t.closest("[data-pay]");
  if(payBtn){ e.preventDefault(); state.payment = payBtn.getAttribute("data-pay"); renderPaymentMethods(); return; }
});
document.getElementById("checkoutButton")?.addEventListener("click", ()=>setCheckoutStep(2));
document.getElementById("payButton")?.addEventListener("click", payNow);

/* ================= Render: Home ================= */
function renderHome(){
  activateView("homeView");
  const rec = getRecommended(4);
  const grid = $("#recommendedGrid");
  if(grid) grid.innerHTML = rec.map(productCardHTML).join("");
  renderCategories();
}
function renderCategories(){
  const grid = $("#categoryGrid");
  if(!grid) return;
  grid.innerHTML = CATEGORIES.map(c=>`<button class="shortcut-chip" data-cat="${c}">
      <span class="ic" style="background:${c==="Semua"?"#e3edff":"#f1e8fe"}">${c==="Semua"?"✨":"✦"}</span>
      ${c}
    </button>`).join("");
}
function renderRecommendedView(){ const grid = $("#recommendedGrid"); if(grid) grid.innerHTML = getRecommended(4).map(productCardHTML).join(""); }

/* ================= Render: Explore ================= */
function renderExplore(){
  let list = [...PRODUCTS];
  const cat = state.exploreCat || "Semua";
  if(cat !== "Semua") list = list.filter(p=>p.cat === cat);
  const q = (state.exploreQuery || "").trim().toLowerCase();
  if(q){ list = list.filter(p=>(p.name+" "+p.desc+" "+p.cat).toLowerCase().includes(q)); }
  state.exploreList = list;
  const grid = $("#exploreGrid");
  if(grid) grid.innerHTML = list.map(productCardHTML).join("");
  const count = $("#exploreCount");
  if(count) count.textContent = list.length + (list.length===1 ? " Produk" : " Produk");
}
function renderExploreView(){ activateView("exploreView"); renderExploreTabs(); renderExplore(); const es = $("#exploreSearch"); if(es) es.value = state.exploreQuery || ""; }

function renderExploreTabs(){
  const wrap = $("#exploreTabs");
  if(!wrap) return;
  wrap.innerHTML = CATEGORIES.map(c=>`<button class="chip ${c===state.exploreCat?"active":""}" type="button" data-cat="${c}">${c}</button>`).join("");
}

/* ================= Render: Product ================= */
function renderProduct(id){
  const p = productById(id);
  currentProductId = id;
  if(!p){ activateView("homeView"); toast("Produk tidak ditemukan"); return; }
  activateView("productView");
  const root = $("#productDetail");
  if(root){
    root.innerHTML = `<div class="product-detail">
      <div class="pd-media" style="background:${p.tint}"><img src="${productImageURI(p)}" alt="${p.name}" class="product-photo"></div>
      <div class="pd-info">
        <span class="badge purple">${p.cat}</span>
        <h1 class="mt-8">${p.name}</h1>
        <div class="pd-price">${fmtPrice(p.price)}</div>
        <p class="muted mt-8">${p.desc}</p>
        <ul class="pd-features">${p.features.map(f=>`<li>✓ ${f}</li>`).join("")}</ul>
        <div class="pd-cta-row">
          <button class="btn" type="button" data-add="${p.id}">Masukkan Keranjang <span>→</span></button>
          <button class="btn btn-outline" type="button" data-buy="${p.id}">Beli Sekarang</button>
        </div>
        <div class="pd-meta"><span class="badge">Digital Instant</span><span class="badge cyan">Pembayaran Aman</span>${p.badge?`<span class="badge pink">${p.badge}</span>`:""}</div>
      </div>
    </div>`;
  }
  const rel = $("#relatedProducts");
  if(rel) rel.innerHTML = getRelated(p,4).map(productCardHTML).join("");
}

/* ================= Render: Cart / Checkout ================= */
function renderCart(){
  const items = cartDetailed();
  const lines = $("#cartLines");
  if(lines){
    lines.innerHTML = items.length ? items.map(x=>{
      const p = x.product;
      return `<div class="cart-line" data-id="${p.id}">
        <div class="cart-line-thumb" style="background:${p.tint}">${p.emoji}</div>
        <div class="cart-line-info">
          <div class="cart-line-name">${p.name}</div>
          <div class="cart-line-price">${fmtPrice(p.price)} / item</div>
        </div>
        <div class="qty-ctrl">
          <button class="qty-btn" type="button" data-qty="-1">−</button>
          <span class="qty-val">${x.qty}</span>
          <button class="qty-btn" type="button" data-qty="1">+</button>
        </div>
        <b style="min-width:96px;text-align:right">${fmtPrice(p.price*x.qty)}</b>
        <button class="qty-btn" type="button" data-remove="${p.id}" style="background:#ffe4e6;color:var(--danger)">×</button>
      </div>`;
    }).join("") : `<div class="panel-empty">Keranjang masih kosong.<br><a href="#/explore">Yuk mulai belanja →</a></div>`;
  }
  const subtotal = cartSubtotal();
  const disc = state.coupon ? subtotal*Math.min(Number(state.coupon.pct)||0,100)/100 : 0;
  const total = Math.max(0, subtotal - disc);
  const sum = $("#cartSummary");
  if(sum){
    sum.innerHTML = items.length ? `<div class="summary-row"><span>Subtotal</span><b>${fmtPrice(subtotal)}</b></div>
      <div class="summary-row"><span>Diskon${state.coupon?` (${state.coupon.code})`:""}</span><b style="color:var(--green)">−${fmtPrice(disc)}</b></div>
      <div class="summary-row"><span>Ongkir</span><b style="color:var(--green)">Gratis</b></div>
      <div class="summary-row total"><span>Total</span><span>${fmtPrice(total)}</span></div>` : `<div class="panel-empty">Belum ada produk di keranjang.</div>`;
  }
  const titleCount = $("#cartTitleCount"); if(titleCount) titleCount.textContent = "(" + items.reduce((s,x)=>s+x.qty,0) + ")";
}
function applyCoupon(){
  const input = $("#couponInput");
  const notice = $("#couponNotice");
  const code = (input?.value || "").trim().toUpperCase();
  const COUPONS = { JAJAN10:{pct:10,label:"Diskon 10%"} };
  if(!code){ notice.textContent = "Masukkan kode promo."; return; }
  if(COUPONS[code]){ state.coupon = {code, pct: COUPONS[code].pct}; notice.innerHTML = `<span class="ok">✓ Kode ${code} berhasil dipakai.</span>`; }
  else { state.coupon = null; notice.textContent = "Kode promo tidak valid."; }
  renderCart();
}
function setCheckoutStep(n){
  state.checkoutStep = n;
  ["coStepKeranjang","coStepPembayaran","coStepSelesai"].forEach((id,i)=>{ const el = $("#"+id); if(el) el.classList.toggle("hidden-step", n !== i+1); });
  ["coStepIndicator1","coStepIndicator2","coStepIndicator3"].forEach((id,i)=>{ const el = $(("#"+id)); if(el) el.classList.toggle("active", n === i+1); });
  const sticky = $(".cart-sticky-checkout"); if(sticky) sticky.classList.toggle("hidden-step", n === 3);
  if(n === 2){ const pt = $("#payTotal"); if(pt) pt.textContent = fmtPrice(state.coupon ? Math.max(0, cartSubtotal() - cartSubtotal()*Math.min(Number(state.coupon.pct)||0,100)/100) : cartSubtotal()); }
  if(n === 3) renderSuccess();
}

function renderSuccess(){
  const orders = getOrders();
  const order = orders[0];
  const el = $("#successOrderId"); if(el) el.textContent = order ? order.id : "-";
  const tot = $("#successTotal"); if(tot) tot.textContent = order ? fmtPrice(order.total) : "";
}

function payNow(){
  const btn = $("#payButton");
  if(btn){ btn.disabled = true; btn.textContent = "Memproses..."; }
  setTimeout(()=>{
    const order = createOrder();
    saveCart([]);
    updateBadges();
    setCheckoutStep(3);
    const sticky = $(".cart-sticky-checkout"); if(sticky) sticky.classList.add("hidden-step");
    toast("Pembayaran berhasil. Terima kasih!");
  }, 1400);
}
function renderPaymentMethods(){
  const wrap = $("#paymentMethods");
  if(!wrap) return;
  const methods = [
    {id:"bca", name:"BCA", note:"Transfer / Virtual Auto Number"},
    {id:"mandiri", name:"Mandiri", note:"Transfer / Virtual Auto Number"},
    {id:"bni", name:"BNI", note:"Transfer / Virtual Auto Number"},
    {id:"dana", name:"DANA", note:"Scan QRIS / Nomor Referensi"},
    {id:"qris", name:"QRIS", note:"Scan kode QR pembayaran"},
  ];
  wrap.innerHTML = methods.map(m=>`<button type="button" class="pm ${state.payment===m.id?"active":""}" data-pay="${m.id}" style="display:flex;align-items:center;gap:14px;width:100%;text-align:left;background:#fff;border:1.5px solid var(--line);border-radius:16px;padding:16px;margin-top:10px">
      <span style="width:42px;height:42px;border-radius:12px;background:var(--blue);color:#fff;display:grid;place-items:center;font-weight:800">${m.name[0]}</span>
      <span class="grow"><b style="font-size:15px">${m.name}</b><br><small class="muted">${m.note}</small></span>
      <span style="width:22px;height:22px;border-radius:50%;border:2px solid ${state.payment===m.id?"var(--blue)":"#cbd5e1"};background:${state.payment===m.id?"var(--blue)":"#fff"};display:grid;place-items:center;color:#fff;font-size:12px">✓</span>
    </button>`).join("");
}
function renderCheckoutView(){ activateView("cartView"); setCheckoutStep(1); renderCart(); }

/* ================= Render: Account / Panels ================= */
function renderAccountView(){
  activateView("accountView");
  const member = getMember();
  const statusEl = $("#memberStatusText"); if(statusEl) statusEl.textContent = "Member " + BRAND;
  const greetEl = $("#accountGreeting"); if(greetEl) greetEl.textContent = member ? "Halo, "+member.name+" 👋" : "Halo 👋";
  const subEl = $("#accountSub"); if(subEl) subEl.textContent = member ? "Selamat datang kembali di " + BRAND + "." : "Masuk untuk mendapatkan pengalaman belanja yang lebih lengkap.";
  const avatarEl = $("#avatarLetter"); if(avatarEl) avatarEl.textContent = (member && member.name) ? member.name.charAt(0).toUpperCase() : "J";
  const statOrders = $("#statOrders"); if(statOrders) statOrders.textContent = String(getOrders().length);
  const statVoucher = $("#statVoucher"); if(statVoucher) statVoucher.textContent = String(VOUCHERS.length);
  const statPoints = $("#statPoints"); if(statPoints) statPoints.textContent = String((member && member.points) || 0);
  const benefitLevel = $("#benefitBannerLevel"); if(benefitLevel) benefitLevel.textContent = "Member " + (member ? BRAND : BRAND);
  const benefitTitle = $("#memberWelcomeTitle"); if(benefitTitle) benefitTitle.textContent = member ? "Selamat Datang Kembali!" : "Selamat Datang!";
  const benefitText = $("#memberWelcomeText"); if(benefitText) benefitText.textContent = member ? "Dapatkan benefit khusus, promo spesial, dan akses lebih lengkap." : "Daftar member untuk mendapatkan benefit khusus, promo spesial, dan akses lebih lengkap.";
  const loginBtn = $("#accountLoginBtn"); if(loginBtn) loginBtn.hidden = !!member;
  const logoutBtn = $("#accountLogoutBtn"); if(logoutBtn) logoutBtn.hidden = !member;
}
function renderMemberMenu(){ const root = $("#accountMenu"); if(!root) return; root.innerHTML = [
  {key:"transactions", icon:"blue", label:"Pusat Transaksi", desc:"Pembelian, top up, dan riwayat pembayaran"},
  {key:"orders", icon:"blue", label:"Pesanan Saya", desc:"Lihat riwayat dan status pesanan"},
  {key:"vouchers", icon:"gold", label:"Voucher Saya", desc:"Voucher yang siap digunakan", pill:"0"},
  {key:"points", icon:"gold", label:"Poin & Rewards", desc:"Tukar poin dengan benefit menarik", pill:"0"},
  {key:"wishlist", icon:"pink", label:"Wishlist Saya", desc:"Produk yang ingin kamu beli"},
  {key:"inbox", icon:"cyan", label:"Pesan Masuk", desc:"Chat dan informasi resmi dari admin", pill:"0"},
  {key:"developer", icon:"blue", label:"Developer API", desc:"Ajukan akses dan kelola API key"},
  {key:"profile", icon:"gray", label:"Pengaturan Akun", desc:"Kelola informasi dan keamanan akun"},
  {key:"help", icon:"pale", label:"Pusat Bantuan", desc:"Pertanyaan dan bantuan pelanggan"},
  {key:"benefits", icon:"purple", label:"Keuntungan Member", desc:"Benefit menarik untuk kamu"},
].map(m=>`<button class="menu-item" type="button" data-panel="${m.key}">
    <span class="menu-icon ${m.icon}">${m.key==="transactions"?"↔":m.key==="orders"?"📦":m.key==="vouchers"?"🎟️":m.key==="points"?"⭐":m.key==="wishlist"?"❤️":m.key==="inbox"?"✉️":m.key==="developer"?"🔌":m.key==="profile"?"⚙️":m.key==="help"?"🛟":m.key==="benefits"?"🎁":""}</span>
    <div class="grow"><b>${m.label}</b><small>${m.desc}</small></div>
    ${m.pill?`<em class="menu-pill">${m.pill}</em>`:""}
    <span class="chev">›</span>
  </button>`).join("");
}

/* ================= Render: Cek Pesanan ================= */
function renderCekView(){
  activateView("cekView");
  const form = $("#orderCheckForm");
  const result = $("#orderResult");
  if(form) form.onsubmit = (e)=>{ e.preventDefault(); const id = ($("#orderId")||{}).value ? ($("#orderId").value||"").trim() : ""; const phone = ($("#whatsapp")||{}).value ? ($("#whatsapp").value||"").trim() : ""; const found = findOrder(id, phone); const box = $("#orderResult"); if(!box) return; box.innerHTML = found ? orderResultHTML(found) : `<div class="panel-empty">Order ID atau nomor WhatsApp tidak cocok. Pastikan data yang kamu masukkan benar.</div>`; };
  if(result) result.innerHTML = `<div class="panel-empty">Masukkan Order ID dan nomor WhatsApp untuk melihat status pesanan.</div>`;
}
function orderResultHTML(o){
  const steps = ["Pesanan Dibuat","Pembayaran Terkonfirmasi","Produk Dikirim","Selesai"];
  let statusIdx = 0;
  if(o.status && o.status.includes("Pembayaran")) statusIdx = 1;
  if(o.status && o.status.includes("Dikirim")) statusIdx = 2;
  if(o.status && o.status.includes("Selesai")) statusIdx = 3;
  return `<div class="order-card">
    <div class="order-card-head"><span class="order-id">${o.id}</span><span class="status-pill ok">● ${o.status}</span></div>
    <ul class="timeline">
      ${steps.map((s,i)=>`<li class="${i<statusIdx?"done":i===statusIdx?"active":""}">
        <span class="timeline-dot">${i<statusIdx?"✓":i+1}</span>
        <div><b>${s}</b><p>${i<statusIdx?"Selesai":i===statusIdx?"Sedang berjalan":"Menunggu"}</p></div>
      </li>`).join("")}
    </ul>
    ${o.items.map(i=>`<div class="summary-row"><span>${i.name} × ${i.qty}</span><b>${fmtPrice(i.price*i.qty)}</b></div>`).join("")}
    <div class="summary-row total"><span>Total</span><span>${fmtPrice(o.total)}</span></div>
  </div>`;
}

/* ================= Render: Kontak & Info ================= */
function renderKontakView(){
  activateView("kontakView");
  const body = $("#kontakBody");
  if(body) body.innerHTML = `
    <div class="panel-card"><h2>Bantuan Pesanan</h2><p class="muted small">Cek status pembayaran dan produk terkirim terlebih dahulu melalui halaman Cek Pesanan. Kamu membutuhkan Order ID dan nomor WhatsApp yang sama dengan data checkout.</p><a class="btn mt-16" href="#/cek">Cek Pesanan <span>→</span></a></div>
    <div class="panel-card"><h2>Hubungi ${BRAND}</h2><p class="muted small">Tim bantuan resmi tersedia untuk pertanyaan produk, pembayaran, pengiriman, akun member, atau kendala pesanan. Siapkan Order ID jika berkaitan dengan transaksi.</p><div class="mt-16 row wrap"><a class="btn btn-outline" href="https://wa.me/6280000000000" target="_blank" rel="noopener">💬 WhatsApp</a><a class="btn btn-outline" href="mailto:support@jajananku.web.id">✉️ Email</a></div></div>
    <div class="panel-card"><h2>Sebelum Menghubungi Bantuan</h2><ul class="pd-features"><li>✓ Pastikan Order ID ditulis lengkap dan benar.</li><li>✓ Gunakan nomor WhatsApp yang sama seperti saat checkout.</li><li>✓ Jelaskan nama produk dan kendala secara singkat.</li><li>✓ Untuk masalah pembayaran, siapkan bukti transaksi.</li></ul></div>`;
}
function renderInfo(key){
  activateView("infoView");
  const info = INFO_CONTENT[key];
  const root = $("#infoBody");
  const title = $("#infoTitle");
  if(title && info) title.textContent = info.title;
  if(root && info) root.innerHTML = info.html;
}

/* ================= Init ================= */
function init(){
  renderExploreTabs();
  renderExplore();
  renderRecommendedView();
  renderMemberMenu();
  renderAccountView();
  renderCart();
  renderPaymentMethods();
  maybeOpenPromo();
  updateBadges();
  const homeSearch = $("#searchInput");
  if(homeSearch) homeSearch.addEventListener("keydown", e=>{ if(e.key==="Enter"){ state.exploreQuery = e.target.value.trim(); goExplore(); } });
  const exploreSearch = $("#exploreSearch");
  if(exploreSearch) exploreSearch.addEventListener("input", e=>{ state.exploreQuery = e.target.value.trim(); renderExplore(); });
}
function maybeOpenPromo(){ if(sessionStorage.getItem("jajananku_promo")==="1") return; sessionStorage.setItem("jajananku_promo","1"); openModal("promoModal"); }

function getApiKey2(){ return getApiKey(); }

window.JAJANANKU = { BRAND, BRAND_TAGLINE, PRODUCTS, CATEGORIES, fmtPrice, navigate, goHome, goExplore, openCart, openAuth, closeModal, openModal, submitAuth, openRecovery, closeRecovery, submitRecovery, openPromo, closePromo, toast, getMember, loginMember, logoutMember, getOrders, createOrder, findOrder, getRecommended, getRelated, productById, addToCart, setCartQty, clearCart, cartDetailed, cartSubtotal, applyCoupon, setCheckoutStep, renderCart, renderCheckoutView, renderPaymentMethods, showMemberPanel, openMember, showAccount:()=>navigate("/akun"), renderCekView, renderKontakView, renderInfo, getWishlist, toggleWishlist, getApiKey, fmtDateTime };
window.addEventListener("load", ()=>setTimeout(init, 30));
route();


