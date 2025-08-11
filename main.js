/* main.js - zentrale Logik für alle Seiten
   - Produkte / Posts / Rezepte: default-Daten (werden in localStorage gehalten)
   - Warenkorb: in localStorage
   - Rendering: wenn entsprechende DOM-Elemente existieren, werden sie befüllt
*/

/* ===== Defaults (Einfach anpassen wenn nötig) ===== */
const DEFAULT_PRODUCTS = [
    { id:'p1', title:'Nimbus Handmühle', price:69.00, img:'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=1200&q=80', desc:'Kompakte Handmühle mit gleichmäßigem Mahlgrad.' },
    { id:'p2', title:'Espresso Bohnen – Blend 250g', price:12.50, img:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80', desc:'Dunkel gerösteter Espresso mit Schoko-Noten.' },
    { id:'p3', title:'Reusable Filter Set', price:19.00, img:'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=80', desc:'Mehrwegfilter für Handfilter.' },
    { id:'p4', title:'Tamper Pro', price:29.00, img:'https://images.unsplash.com/photo-1543449657-7d7a8b6e9b8b?auto=format&fit=crop&w=1200&q=80', desc:'Stabiler Tamper für exakten Druck.' },
    { id:'p5', title:'Cold Brew Set', price:24.50, img:'https://images.unsplash.com/photo-1506243361269-9f17f8b9b2f7?auto=format&fit=crop&w=1200&q=80', desc:'Alles für Cold Brew: Behälter, Filter & Anleitung.' },
    { id:'p6', title:'Barista Messlöffel', price:9.90, img:'https://images.unsplash.com/photo-1523301343968-9f8a6f8c3a2b?auto=format&fit=crop&w=1200&q=80', desc:'Präzises Messlöffel-Set.' }
  ];
  
  const DEFAULT_POSTS = [
    { id:'b1', slug:'post-perfekter-espresso', title:'Perfekter Espresso zuhause', date:'12.07.2025', excerpt:'Ein kompakter Leitfaden: Bohne, Mahlgrad, Dosierung, Tamper und Extraktionszeit.', img:'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=1200&q=80', content:`<h3>Zusammenfassung</h3><p>Wichtige Stellschrauben: Bohne, Mahlgrad, Dosierung, Tampen und Extraktionszeit.</p>` },
    { id:'b2', slug:'post-cold-brew', title:'Cold Brew: Sanft & aromatisch', date:'02.06.2025', excerpt:'Cold Brew selber machen — das Rezept für eine milde, vollmundige Kaffeebasis.', img:'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=80', content:`<h3>Rezept</h3><p>100 g grob gemahlener Kaffee, 1 L Wasser, 12–18 Stunden ziehen lassen.</p>` },
    { id:'b3', slug:'post-roesterei', title:'Innovative Rösterei: CoffeeCircle (Beispiel)', date:'11.04.2025', excerpt:'Röster mit Fokus auf Direktimport & sozialem Impact.', img:'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1200&q=80', content:`<p>CoffeeCircle steht beispielhaft für Direktimporte und soziale Projekte.</p>` },
    { id:'b4', slug:'post-brew-ratio', title:'Optimales Kaffee-Wasser-Verhältnis', date:'01.03.2025', excerpt:'Brew Ratio: 1:16–1:18 für Filter, 1:2 für Espresso.', img:'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80', content:`<p>Für Filter: 1:16–1:18. Für Espresso: ca. 1:2).</p>` }
  ];
  
  const DEFAULT_RECIPES = [
    { id:'r1', slug:'recipe-coldbrew', title:'Cold Brew (Basis)', img:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80', excerpt:'Grobes Mahlen + 12–18 Stunden ziehen lassen.', steps:['100 g grob gemahlener Kaffee','1 L kaltes Wasser','12–18 Stunden ziehen lassen','Filtern & servieren'] },
    { id:'r2', slug:'recipe-espresso-brownie', title:'Espresso Brownie', img:'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=1200&q=80', excerpt:'Schokoladiger Brownie mit Espresso Shot.', steps:['Teig anrühren','Shot Espresso in Teig','Backen 25–30 min'] }
  ];
  
  /* ===== storage helpers ===== */
  function load(key, def){
    try{
      const raw = localStorage.getItem(key);
      if(raw) return JSON.parse(raw);
      localStorage.setItem(key, JSON.stringify(def));
      return def;
    }catch(e){ console.error(e); return def; }
  }
  function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
  
  /* ===== state ===== */
  let products = load('kk_products', DEFAULT_PRODUCTS);
  let posts = load('kk_posts', DEFAULT_POSTS);
  let recipes = load('kk_recipes', DEFAULT_RECIPES);
  let cart = load('kk_cart', []);
  
  /* ===== utils ===== */
  function formatEUR(n){ return '€' + Number(n).toFixed(2); }
  function updateCartCountElements(){
    const total = cart.reduce((s,i)=>s+i.qty,0);
    const els = document.querySelectorAll('.cart-link span');
    els.forEach(e=>e.textContent = total);
  }
  
  /* ===== rendering ===== */
  function renderProductGrid(){
    const grid = document.getElementById('productGrid');
    if(!grid) return;
    grid.innerHTML = '';
    products.forEach(p=>{
      const card = document.createElement('div'); card.className = 'prod-card';
      card.innerHTML = `<img src="${p.img}" alt="${p.title}"><div class="body"><strong>${p.title}</strong><div class="muted">${p.desc}</div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px"><div class="price">${formatEUR(p.price)}</div><div><button class="btn outline" onclick="viewProduct('${p.id}')">Details</button> <button class="btn" onclick="addToCart('${p.id}',1)">In den Warenkorb</button></div></div></div>`;
      grid.appendChild(card);
    });
  }
  
  function renderPostsList(){
    const list = document.getElementById('postsList');
    if(!list) return;
    list.innerHTML = '';
    posts.slice().reverse().forEach(p=>{
      const el = document.createElement('article'); el.className = 'teaser';
      el.innerHTML = `<img src="${p.img}" alt="${p.title}"><h3><a href="blog.html#${p.slug}" onclick="openPost('${p.id}')">${p.title}</a></h3><p class="muted">${p.excerpt}</p>`;
      list.appendChild(el);
    });
  }
  
  function renderRecipesList(){
    const list = document.getElementById('recipesList');
    if(!list) return;
    list.innerHTML = '';
    recipes.slice().reverse().forEach(r=>{
      const el = document.createElement('article'); el.className = 'teaser';
      el.innerHTML = `<img src="${r.img}" alt="${r.title}"><h3><a href="rezepte.html#${r.slug}" onclick="openRecipe('${r.id}')">${r.title}</a></h3><p class="muted">${r.excerpt}</p>`;
      list.appendChild(el);
    });
  }
  
  /* ===== cart behavior ===== */
  function saveCart(){ save('kk_cart', cart); updateCartCountElements(); renderCartPanel(); }
  function addToCart(pid, qty=1){
    const p = products.find(x=>x.id===pid);
    if(!p) return alert('Produkt nicht gefunden');
    const e = cart.find(c=>c.id===pid);
    if(e) e.qty += qty; else cart.push({ id:p.id, title:p.title, price:p.price, qty:qty, img:p.img });
    saveCart();
    alert(`${p.title} zum Warenkorb hinzugefügt.`);
  }
  function removeFromCart(pid){
    cart = cart.filter(c=>c.id!==pid); saveCart();
  }
  function changeQty(pid, val){
    const q = Math.max(1, parseInt(val) || 1);
    const it = cart.find(c=>c.id===pid); if(!it) return;
    it.qty = q; saveCart();
  }
  function calculateSubtotal(){ return cart.reduce((s,i)=>s + i.price*i.qty, 0); }
  
  /* render cart panel (shared HTML id names) */
  function renderCartPanel(){
    const panel = document.getElementById('cartPanel');
    const list = document.getElementById('cartList');
    if(!panel || !list) return;
    if(cart.length===0){ list.innerHTML = '<div class="muted">Dein Warenkorb ist leer.</div>'; }
    else{
      list.innerHTML = '';
      cart.forEach(item=>{
        const row = document.createElement('div'); row.className = 'cart-row';
        row.innerHTML = `<img src="${item.img}" alt="${item.title}"><div style="flex:1"><div style="font-weight:700">${item.title}</div><div class="muted">${formatEUR(item.price)} · Menge: <input type="number" min="1" value="${item.qty}" style="width:64px" onchange="changeQty('${item.id}', this.value)"></div></div><div style="font-weight:800">${formatEUR(item.price * item.qty)}</div><div style="margin-left:8px"><button class="btn outline" onclick="removeFromCart('${item.id}')">✕</button></div>`;
        list.appendChild(row);
      });
    }
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 50 ? 0 : 3.90;
    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingEl = document.getElementById('cartShipping');
    const totalEl = document.getElementById('cartTotal');
    if(subtotalEl) subtotalEl.textContent = formatEUR(subtotal);
    if(shippingEl) shippingEl.textContent = formatEUR(shipping);
    if(totalEl) totalEl.textContent = formatEUR(subtotal + shipping);
  }
  
  /* simulate checkout */
  function simulateCheckout(){
    if(cart.length === 0) return alert('Warenkorb ist leer.');
    const order = { id: 'ORD' + Date.now(), date: new Date().toISOString(), items: cart, total: calculateSubtotal() };
    const orders = load('kk_orders', []);
    orders.push(order);
    save('kk_orders', orders);
    cart = []; saveCart();
    alert('Bestellung (Simulation) erstellt: ' + order.id + '\n(Diese Demo speichert alles lokal, keine Zahlung.)');
    // optional redirect:
    // window.location.href = 'index.html';
  }
  
  /* product modal / open post / recipe (new window) */
  function viewProduct(id){
    const p = products.find(x=>x.id===id); if(!p) return alert('Nicht gefunden');
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>${p.title}</title><link rel="stylesheet" href="assets/css/styles.css"></head><body><div class="wrap"><a href="shop.html">← zurück</a><h1>${p.title}</h1><img src="${p.img}" style="width:100%;border-radius:10px;margin-top:10px"><p class="muted">${p.desc}</p><div style="font-weight:800">${formatEUR(p.price)}</div><div style="margin-top:10px"><button onclick="window.opener.addToCart('${p.id}',1);alert('Zum Warenkorb hinzugefügt');" class="btn">In den Warenkorb</button></div></div></body></html>`);
  }
  function openPost(id){
    const p = posts.find(x=>x.id===id); if(!p) return alert('Beitrag nicht gefunden');
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>${p.title}</title><link rel="stylesheet" href="assets/css/styles.css"></head><body><div class="wrap"><a href="blog.html">← zurück</a><h1>${p.title}</h1><div class="muted">${p.date}</div><img src="${p.img}" style="width:100%;border-radius:10px;margin-top:10px">${p.content}</div></body></html>`);
  }
  function openRecipe(id){
    const r = recipes.find(x=>x.id===id); if(!r) return alert('Rezept nicht gefunden');
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>${r.title}</title><link rel="stylesheet" href="assets/css/styles.css"></head><body><div class="wrap"><a href="recipes.html">← zurück</a><h1>${r.title}</h1><img src="${r.img}" style="width:100%;border-radius:10px;margin-top:10px"><h3>Schritte</h3><ol>${r.steps.map(s=>'<li>'+s+'</li>').join('')}</ol></div></body></html>`);
  }
  
  /* ===== Admin (einfach, lokal) ===== */
  const ADMIN_PW = 'kaffeepj';
  function openAdminWindow(){
    const pw = prompt('Admin Passwort:');
    if(!pw) return;
    if(pw !== ADMIN_PW) return alert('Falsches Passwort');
    const w = window.open('', '_blank');
    const html = `<html><head><title>Admin</title><link rel="stylesheet" href="assets/css/styles.css"></head><body><div class="wrap"><h1>Admin (lokal)</h1>
      <h3>Beitrag anlegen</h3><input id="adm_title" placeholder="Titel" style="width:100%;padding:8px"><br><input id="adm_date" placeholder="Datum" style="width:100%;padding:8px"><br><input id="adm_img" placeholder="Bild-URL" style="width:100%;padding:8px"><br><textarea id="adm_excerpt" placeholder="Kurztext" style="width:100%;height:80px"></textarea><br><textarea id="adm_content" placeholder="HTML Inhalt" style="width:100%;height:120px"></textarea><br><button id="savePost" class="btn">Speichern</button>
      <h3 style="margin-top:16px">Produkt anlegen</h3><input id="p_title" placeholder="Produkt" style="width:100%;padding:8px"><br><input id="p_price" placeholder="Preis" style="width:100%;padding:8px"><br><input id="p_img" placeholder="Bild-URL" style="width:100%;padding:8px"><br><textarea id="p_desc" placeholder="Beschreibung" style="width:100%;height:80px"></textarea><br><button id="saveProd" class="btn">Speichern</button>
      <h3 style="margin-top:16px">Export / Clear</h3><button id="exportBtn" class="btn outline">Export JSON</button> <button id="clearBtn" class="btn outline">Local löschen</button>
      <div id="msg" style="margin-top:8px;color:var(--muted)"></div>
      </div><script>
      function q(id){return document.getElementById(id)}
      q('savePost').addEventListener('click', ()=>{ const title = q('adm_title').value.trim(); if(!title){alert('Titel');return;} const post = { id:'b'+Date.now(), slug: title.toLowerCase().replace(/[^a-z0-9]+/g,'-'), title, date: q('adm_date').value||new Date().toLocaleDateString(), excerpt: q('adm_excerpt').value, img: q('adm_img').value||'', content: q('adm_content').value||'' }; const posts = JSON.parse(localStorage.getItem('kk_posts')||'[]'); posts.push(post); localStorage.setItem('kk_posts', JSON.stringify(posts)); q('msg').innerText='Beitrag gespeichert. (Seite neu laden)'; });
      q('saveProd').addEventListener('click', ()=>{ const title = q('p_title').value.trim(); const price = parseFloat(q('p_price').value)||0; if(!title||!price){alert('Titel & Preis');return;} const prod = { id:'p'+Date.now(), title, price, img: q('p_img').value||'', desc: q('p_desc').value||'' }; const prods = JSON.parse(localStorage.getItem('kk_products')||'[]'); prods.push(prod); localStorage.setItem('kk_products', JSON.stringify(prods)); q('msg').innerText='Produkt gespeichert. (Seite neu laden)'; });
      q('exportBtn').addEventListener('click', ()=>{ const data = { products: JSON.parse(localStorage.getItem('kk_products')||'[]'), posts: JSON.parse(localStorage.getItem('kk_posts')||'[]'), recipes: JSON.parse(localStorage.getItem('kk_recipes')||'[]') }; const w2 = window.open(); w2.document.write('<pre>'+JSON.stringify(data,null,2).replace(/</g,'&lt;')+'</pre>'); });
      q('clearBtn').addEventListener('click', ()=>{ if(confirm('Alles löschen?')){ localStorage.removeItem('kk_products'); localStorage.removeItem('kk_posts'); localStorage.removeItem('kk_recipes'); localStorage.removeItem('kk_cart'); alert('gelöscht'); }});
      </script></body></html>`;
    w.document.write(html);
  }
  
  /* ===== Initialization ===== */
  document.addEventListener('DOMContentLoaded', ()=>{
    // initialize storage if empty
    if(!localStorage.getItem('kk_products')) save('kk_products', DEFAULT_PRODUCTS);
    if(!localStorage.getItem('kk_posts')) save('kk_posts', DEFAULT_POSTS);
    if(!localStorage.getItem('kk_recipes')) save('kk_recipes', DEFAULT_RECIPES);
    products = load('kk_products', DEFAULT_PRODUCTS);
    posts = load('kk_posts', DEFAULT_POSTS);
    recipes = load('kk_recipes', DEFAULT_RECIPES);
    cart = load('kk_cart', []);
  
    // render where needed
    renderProductGrid();
    renderPostsList();
    renderRecipesList();
    renderCartPanel();
    updateCartCountElements();
  
    // wire cart open/close buttons (if present)
    const openCartBtns = document.querySelectorAll('#openCartBtn, #openCartShop');
    openCartBtns.forEach(b=> b.addEventListener('click', (e)=>{ e.preventDefault(); const panel = document.getElementById('cartPanel'); if(panel) panel.style.display = 'block'; }));
    const closeBtns = document.querySelectorAll('#closeCart, #closeCart2');
    closeBtns.forEach(b=> b.addEventListener('click', ()=>{ const panel = document.getElementById('cartPanel'); if(panel) panel.style.display='none'; }));
    const clearBtns = document.querySelectorAll('#clearCart, #clearCartInline');
    clearBtns.forEach(b=> b.addEventListener('click', ()=>{ if(confirm('Warenkorb leeren?')){ cart=[]; saveCart(); renderCartPanel(); } }));
    const checkoutBtns = document.querySelectorAll('#checkoutBtn');
    checkoutBtns.forEach(b=> b.addEventListener('click', ()=>{ if(confirm('Checkout-Simulation durchführen?')) simulateCheckout(); }));
  
    // bind admin key (optional)
    const adminLink = document.querySelector('a[href="admin.html"]');
    if(adminLink) adminLink.addEventListener('click', (e)=>{ e.preventDefault(); openAdminWindow(); });
  });
  