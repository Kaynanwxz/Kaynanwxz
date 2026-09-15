const params = new URLSearchParams(location.search);
const demo = params.get("demo") || "menu";
const app = document.getElementById("app");
const toast = document.getElementById("toast");

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>toast.classList.remove("show"),2200);
}

document.getElementById("resetDemo").addEventListener("click",()=>location.reload());

const money = value => new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(value);

const datasets = {
  menu:[
    {id:1,name:"Margherita",cat:"Pizzas",price:42,desc:"Molho artesanal, muçarela, tomate, manjericão e azeite.",image:"assets/pizza-margherita.svg"},
    {id:2,name:"Calabresa da casa",cat:"Pizzas",price:45,desc:"Calabresa artesanal, cebola roxa e queijo gratinado.",image:"assets/pizza-calabresa.svg"},
    {id:3,name:"Quatro queijos",cat:"Pizzas",price:49,desc:"Muçarela, parmesão, gorgonzola e catupiry.",image:"assets/pizza-quatro-queijos.svg"},
    {id:4,name:"Pepperoni",cat:"Pizzas",price:52,desc:"Pepperoni, muçarela e molho da casa.",image:"assets/pizza-pepperoni.svg"},
    {id:5,name:"Limonada siciliana",cat:"Bebidas",price:12,desc:"Limão siciliano, água com gás e hortelã.",image:"assets/limonada.svg"},
    {id:6,name:"Soda italiana",cat:"Bebidas",price:14,desc:"Frutas vermelhas e água gaseificada.",image:"assets/soda.svg"},
    {id:7,name:"Tiramisù",cat:"Doces",price:22,desc:"Café, mascarpone e cacau.",image:"assets/tiramisu.svg"},
    {id:8,name:"Brownie quente",cat:"Doces",price:24,desc:"Brownie, sorvete de baunilha e calda.",image:"assets/brownie.svg"}
  ],
  catalog:[
    {id:1,name:"Camisa Linho Natural",cat:"Roupas",price:189,desc:"Caimento leve, textura natural e visual elegante para o dia a dia.",sizes:["P","M","G"],image:"assets/camisa-linho.svg"},
    {id:2,name:"Bolsa Urbana Couro",cat:"Acessórios",price:329,desc:"Estrutura firme, alça confortável e acabamento sofisticado.",sizes:["Único"],image:"assets/bolsa-urbana.svg"},
    {id:3,name:"Blazer Areia",cat:"Roupas",price:389,desc:"Alfaiataria clean com corte reto e tom neutro versátil.",sizes:["P","M","G"],image:"assets/blazer-areia.svg"},
    {id:4,name:"Calça Alfaiataria",cat:"Roupas",price:239,desc:"Modelagem reta com cintura média e tecido encorpado.",sizes:["36","38","40","42"],image:"assets/calca-alfaiataria.svg"},
    {id:5,name:"Óculos Frame 02",cat:"Acessórios",price:169,desc:"Armação moderna com linhas leves e acabamento premium.",sizes:["Único"],image:"assets/oculos.svg"},
    {id:6,name:"Tênis Casual Canvas",cat:"Calçados",price:279,desc:"Sola confortável, visual minimalista e uso versátil.",sizes:["38","39","40","41","42"],image:"assets/tenis.svg"},
    {id:7,name:"Mocassim Couro",cat:"Calçados",price:349,desc:"Modelo clássico repaginado com detalhe frontal em destaque.",sizes:["38","39","40","41"],image:"assets/mocassim.svg"},
    {id:8,name:"Carteira Compact",cat:"Acessórios",price:119,desc:"Compacta, prática e com acabamento elegante para uso diário.",sizes:["Único"],image:"assets/carteira.svg"}
  ]
};

function renderMenu(){
  app.innerHTML = `
  <div class="shell restaurant">
    <header>
      <div class="brand">Forno 27</div>
      <nav><a href="#menu">Cardápio</a><a href="#sobre">Sobre</a><a href="#contato">Contato</a></nav>
      <button class="cart-button" id="cartBtn">Carrinho <b id="cartCount">0</b></button>
    </header>
    <section class="restaurant-hero">
      <div><small>PIZZARIA ARTESANAL</small><h1>Uma experiência que começa antes da primeira fatia.</h1><p>Cardápio digital completo, feito para o cliente encontrar rápido o que quer e finalizar um pedido sem confusão.</p></div>
      <div class="pizza-art"></div>
    </section>
    <section class="menu-area" id="menu">
      <div class="menu-toolbar">
        <input class="demo-input menu-search" id="foodSearch" placeholder="Buscar no cardápio...">
        <div class="category-tabs" id="foodCats">
          <button class="active" data-cat="Todos">Todos</button><button data-cat="Pizzas">Pizzas</button><button data-cat="Bebidas">Bebidas</button><button data-cat="Doces">Doces</button>
        </div>
      </div>
      <div class="food-grid" id="foodGrid"></div>
    </section>
    <aside class="cart-drawer" id="cartDrawer">
      <div class="cart-head"><h2>Seu pedido</h2><button id="cartClose">×</button></div>
      <div class="cart-list" id="cartList"></div>
      <div class="cart-total"><span>Total</span><strong id="cartTotal">R$ 0,00</strong></div>
      <button class="demo-btn checkout" id="checkout">Finalizar pedido</button>
    </aside>
  </div>`;
  let cat="Todos", cart=[];
  const grid=document.getElementById("foodGrid"), search=document.getElementById("foodSearch");
  const render=()=>{
    const q=search.value.toLowerCase();
    const list=datasets.menu.filter(x=>(cat==="Todos"||x.cat===cat)&&x.name.toLowerCase().includes(q));
    grid.innerHTML=list.length?list.map((x,i)=>`<article class="food-card"><div class="food-image-frame"><img class="food-photo" src="${x.image}" alt="${x.name}"></div><h3>${x.name}</h3><p>${x.desc}</p><footer><strong>${money(x.price)}</strong><button data-add="${x.id}">Adicionar</button></footer></article>`).join(""):`<div class="empty">Nenhum item encontrado.</div>`;
    grid.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>{const item=datasets.menu.find(x=>x.id==b.dataset.add);cart.push(item);renderCart();showToast(item.name+" adicionado ao pedido");});
  };
  const renderCart=()=>{
    document.getElementById("cartCount").textContent=cart.length;
    document.getElementById("cartList").innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-item"><div><strong>${x.name}</strong><span>${money(x.price)}</span></div><button data-remove="${i}">×</button></div>`).join(""):`<div class="empty">Seu carrinho está vazio.</div>`;
    document.getElementById("cartTotal").textContent=money(cart.reduce((a,b)=>a+b.price,0));
    document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.remove,1);renderCart();});
  };
  document.getElementById("foodCats").onclick=e=>{if(e.target.dataset.cat){cat=e.target.dataset.cat;document.querySelectorAll("#foodCats button").forEach(b=>b.classList.toggle("active",b===e.target));render();}};
  search.oninput=render;
  document.getElementById("cartBtn").onclick=()=>document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartClose").onclick=()=>document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("checkout").onclick=()=>cart.length?showToast("Pedido simulado enviado para o restaurante ✓"):showToast("Adicione itens primeiro.");
  render();renderCart();
}

function renderCatalog(){
  app.innerHTML=`
  <div class="shell shop">
    <header><nav><span>Novidades</span><span>Feminino</span><span>Acessórios</span></nav><strong>MAISON 12</strong><div class="shop-actions"><span id="shopCount">0 itens</span><button id="shopCartBtn">Sacola</button></div></header>
    <section class="shop-hero"><div><small>NOVA COLEÇÃO</small><h1>Essenciais.</h1></div><p>Catálogo com imagens reais de produto, busca, filtros e carrinho — tudo nesta demonstração.</p></section>
    <section class="shop-toolbar"><input class="demo-input shop-search" id="shopSearch" placeholder="Buscar produtos..."><div class="shop-filters" id="shopFilters"><button class="active" data-cat="Todos">Todos</button><button data-cat="Roupas">Roupas</button><button data-cat="Acessórios">Acessórios</button><button data-cat="Calçados">Calçados</button></div></section>
    <section class="product-grid" id="productGrid"></section>
    <aside class="shop-cart" id="shopCart"><h3>Sua sacola</h3><div id="shopCartList"></div><footer><span>Total</span><strong id="shopTotal"></strong></footer></aside>
  </div>`;
  let cat="Todos",cart=[];
  const grid=document.getElementById("productGrid"),search=document.getElementById("shopSearch");
  const render=()=>{
    const q=search.value.toLowerCase();
    const list=datasets.catalog.filter(x=>(cat==="Todos"||x.cat===cat)&&x.name.toLowerCase().includes(q));
    grid.innerHTML=list.map(x=>`<article class="product-card">
      <div class="product-image-frame">
        <img class="product-photo" src="${x.image}" alt="${x.name}">
        <span class="product-badge">${x.cat}</span>
      </div>
      <h3>${x.name}</h3>
      <p class="product-desc">${x.desc}</p>
      <div class="meta"><span>${x.cat}</span><strong>${money(x.price)}</strong></div>
      <div class="product-sizes">${x.sizes.map(size=>`<span>${size}</span>`).join("")}</div>
      <button class="add" data-add="${x.id}">Adicionar à sacola</button>
    </article>`).join("");
    grid.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>{cart.push(datasets.catalog.find(x=>x.id==b.dataset.add));renderCart();showToast("Produto adicionado à sacola");});
  };
  const renderCart=()=>{
    document.getElementById("shopCount").textContent=`${cart.length} ${cart.length===1?"item":"itens"}`;
    document.getElementById("shopCartList").innerHTML=cart.length?cart.map(x=>`<div class="shop-cart-row"><span>${x.name}</span><strong>${money(x.price)}</strong></div>`).join(""):`<div class="shop-cart-row"><span>Sacola vazia</span><span></span></div>`;
    document.getElementById("shopTotal").textContent=money(cart.reduce((a,b)=>a+b.price,0));
  };
  document.getElementById("shopFilters").onclick=e=>{if(e.target.dataset.cat){cat=e.target.dataset.cat;document.querySelectorAll("#shopFilters button").forEach(b=>b.classList.toggle("active",b===e.target));render();}};
  search.oninput=render;document.getElementById("shopCartBtn").onclick=()=>document.getElementById("shopCart").classList.toggle("open");render();renderCart();
}

function renderInstitutional(){
  app.innerHTML=`
  <div class="shell institutional">
    <header class="inst-header"><div class="inst-brand"><i>M</i> MACEDO ELÉTRICA</div><nav><a href="#servicos">Serviços</a><a href="#sobre">Sobre</a><a href="#contato">Contato</a></nav><button onclick="document.getElementById('contato').scrollIntoView()">Pedir orçamento</button></header>
    <section class="inst-hero"><div><small>ATENDIMENTO RESIDENCIAL E COMERCIAL</small><h1>Segurança elétrica começa com um serviço bem feito.</h1><p>Site institucional pensado para transformar presença digital em confiança, orçamento e novos contatos.</p><button class="demo-btn cta" onclick="document.getElementById('contato').scrollIntoView()">Solicitar orçamento</button></div><div class="inst-visual"></div></section>
    <section class="inst-stats"><article><strong>24h</strong><span>Atendimento emergencial</span></article><article><strong>+10</strong><span>Tipos de serviço</span></article><article><strong>100%</strong><span>Orçamento sem compromisso</span></article></section>
    <section class="inst-services" id="servicos"><h2>Serviços apresentados de forma clara para o cliente.</h2><div class="inst-service-grid"><article><span>01</span><h3>Instalação</h3><p>Quadros, tomadas, iluminação e novos circuitos.</p></article><article><span>02</span><h3>Manutenção</h3><p>Diagnóstico, correção de falhas e segurança preventiva.</p></article><article><span>03</span><h3>Emergência</h3><p>Atendimento rápido para problemas urgentes.</p></article></div></section>
    <section class="inst-contact" id="contato"><div><h2>Conte rapidamente o que você precisa.</h2></div><form class="inst-form" id="instForm"><input class="demo-input" required placeholder="Seu nome"><input class="demo-input" required placeholder="Telefone"><input class="demo-input" required placeholder="Cidade"><input class="demo-input" required placeholder="Tipo de serviço"><textarea class="demo-input" required placeholder="Descreva o problema"></textarea><button class="demo-btn">Enviar pedido de orçamento</button></form></section>
  </div>`;
  document.getElementById("instForm").onsubmit=e=>{e.preventDefault();showToast("Pedido de orçamento enviado ✓");e.target.reset();};
}

function renderQuote(){
  app.innerHTML=`
  <div class="shell quote"><div class="quote-wrap">
    <aside class="quote-info"><small>ORÇAMENTO GUIADO</small><h1>Um formulário que já qualifica o cliente.</h1><p>O visitante responde poucas perguntas e o negócio recebe um pedido organizado com informações úteis para preparar a proposta.</p><div class="quote-progress" id="quoteProgress"><span class="active"><i>1</i> Serviço</span><span><i>2</i> Detalhes</span><span><i>3</i> Contato</span><span><i>4</i> Resumo</span></div></aside>
    <section class="quote-card">
      <div class="quote-step active" data-step="1"><small>ETAPA 1 DE 4</small><h2>Qual serviço você procura?</h2><div class="quote-options" id="serviceOptions">${["Reforma completa","Pintura","Elétrica","Hidráulica"].map(x=>`<button class="quote-option" data-value="${x}"><strong>${x}</strong><span>Selecione para continuar</span></button>`).join("")}</div></div>
      <div class="quote-step" data-step="2"><small>ETAPA 2 DE 4</small><h2>Alguns detalhes do projeto.</h2><div class="quote-fields"><label>Área aproximada <input id="area" class="quote-range" type="range" min="10" max="300" value="80"><span><b id="areaValue">80</b> m²</span></label><label>Urgência<select id="urgency" class="demo-input"><option>Sem urgência</option><option>Próximos 30 dias</option><option>Próximas 2 semanas</option><option>Urgente</option></select></label><label>Observação<textarea id="details" class="demo-input" rows="4" placeholder="Ex.: apartamento vazio, materiais já comprados..."></textarea></label></div></div>
      <div class="quote-step" data-step="3"><small>ETAPA 3 DE 4</small><h2>Como podemos falar com você?</h2><div class="quote-fields"><label>Nome<input id="qName" class="demo-input" placeholder="Seu nome"></label><label>WhatsApp<input id="qPhone" class="demo-input" placeholder="(12) 99999-9999"></label><label>Cidade<input id="qCity" class="demo-input" placeholder="Sua cidade"></label></div></div>
      <div class="quote-step" data-step="4"><small>ETAPA 4 DE 4</small><h2>Resumo do pedido.</h2><div class="quote-summary" id="quoteSummary"></div></div>
      <div class="quote-nav"><button id="quoteBack" class="demo-btn quote-back">Voltar</button><button id="quoteNext" class="demo-btn quote-next">Continuar</button></div>
    </section>
  </div></div>`;
  let step=1, service="";
  const update=()=>{
    document.querySelectorAll(".quote-step").forEach(x=>x.classList.toggle("active",+x.dataset.step===step));
    document.querySelectorAll("#quoteProgress span").forEach((x,i)=>x.classList.toggle("active",i<step));
    document.getElementById("quoteBack").style.visibility=step===1?"hidden":"visible";
    document.getElementById("quoteNext").textContent=step===4?"Enviar pedido":"Continuar";
    if(step===4){
      const area=+document.getElementById("area").value;
      const base={ "Reforma completa":1150,"Pintura":55,"Elétrica":95,"Hidráulica":90 }[service]||80;
      const min=Math.round(area*base*.8/100)*100,max=Math.round(area*base*1.2/100)*100;
      document.getElementById("quoteSummary").innerHTML=`<strong>${service}</strong><span>${area} m² • ${document.getElementById("urgency").value}</span><span>${document.getElementById("qName").value||"Cliente"} • ${document.getElementById("qCity").value||"Cidade não informada"}</span><span style="margin-top:12px">Estimativa inicial simulada: <b>${money(min)} — ${money(max)}</b></span>`;
    }
  };
  document.getElementById("serviceOptions").onclick=e=>{const b=e.target.closest("[data-value]");if(!b)return;service=b.dataset.value;document.querySelectorAll(".quote-option").forEach(x=>x.classList.toggle("selected",x===b));};
  document.getElementById("area").oninput=e=>document.getElementById("areaValue").textContent=e.target.value;
  document.getElementById("quoteBack").onclick=()=>{if(step>1){step--;update();}};
  document.getElementById("quoteNext").onclick=()=>{if(step===1&&!service)return showToast("Escolha um serviço.");if(step===3&&!document.getElementById("qName").value)return showToast("Informe seu nome.");if(step<4){step++;update();}else showToast("Pedido simulado enviado com sucesso ✓");};
  update();
}

function renderAdmin(){
  const products=[
    ["Camisa Linho","R$ 189,00","18","Roupas","Ativo","assets/camisa-linho.svg"],
    ["Bolsa Urbana","R$ 329,00","4","Acessórios","Baixo","assets/bolsa-urbana.svg"],
    ["Blazer Areia","R$ 389,00","12","Roupas","Ativo","assets/blazer-areia.svg"],
    ["Tênis Canvas","R$ 279,00","22","Calçados","Ativo","assets/tenis.svg"],
    ["Carteira Compact","R$ 119,00","6","Acessórios","Baixo","assets/carteira.svg"]
  ];
  const customers=[["Ana Martins","ana@email.com","São Sebastião","3 pedidos","Ativo"],["Carlos Lima","carlos@email.com","Caraguatatuba","1 pedido","Novo"],["Julia Melo","julia@email.com","Ilhabela","7 pedidos","Ativo"]];
  const orders=[["#1042","Ana Martins","R$ 518,00","Hoje 14:20","Pago"],["#1041","Carlos Lima","R$ 279,00","Hoje 12:10","Separando"],["#1040","Julia Melo","R$ 687,00","Ontem","Enviado"]];
  app.innerHTML=`
  <div class="shell admin">
    <aside class="admin-side"><div class="admin-logo">K.</div><div class="admin-nav"><button class="active" data-view="dash">Visão geral</button><button data-view="products">Produtos</button><button data-view="customers">Clientes</button><button data-view="orders">Pedidos</button></div></aside>
    <main class="admin-main"><div class="admin-top"><div><small>SISTEMA INTERNO</small><h1 id="adminTitle">Visão geral</h1></div><button id="newProduct" class="demo-btn">+ Novo produto</button></div>
      <section class="admin-view active" data-view="dash"><div class="admin-stats"><article><span>Produtos</span><strong id="productStat">128</strong></article><article><span>Baixo estoque</span><strong>7</strong></article><article><span>Pedidos hoje</span><strong>14</strong></article><article><span>Clientes</span><strong>83</strong></article></div><div class="chart-card"><h3>Pedidos nos últimos 7 dias</h3><div class="bars">${[40,55,35,80,65,92,74].map(x=>`<i style="height:${x}%"></i>`).join("")}</div></div></section>
      <section class="admin-view" data-view="products"><div class="table-toolbar"><input id="productSearch" class="demo-input" placeholder="Buscar produto..."></div><div class="data-table"><div class="data-head"><span>Produto</span><span>Preço</span><span>Estoque</span><span>Categoria</span><span>Status</span></div><div id="productRows"></div></div></section>
      <section class="admin-view" data-view="customers"><div class="data-table"><div class="data-head customer-row"><span>Cliente</span><span>E-mail</span><span>Cidade</span><span>Histórico</span><span>Status</span></div>${customers.map(x=>`<div class="data-row customer-row"><strong>${x[0]}</strong><span>${x[1]}</span><span>${x[2]}</span><span>${x[3]}</span><span class="badge status-ok">${x[4]}</span></div>`).join("")}</div></section>
      <section class="admin-view" data-view="orders"><div class="data-table"><div class="data-head order-row"><span>Pedido</span><span>Cliente</span><span>Total</span><span>Data</span><span>Status</span></div>${orders.map(x=>`<div class="data-row order-row"><strong>${x[0]}</strong><span>${x[1]}</span><span>${x[2]}</span><span>${x[3]}</span><span class="badge status-new">${x[4]}</span></div>`).join("")}</div></section>
    </main>
    <div class="modal" id="productModal"><div class="modal-card"><h2>Novo produto</h2><div class="modal-fields"><label>Nome<input id="pName" class="demo-input"></label><label>Preço<input id="pPrice" class="demo-input" value="99,90"></label><label>Estoque<input id="pStock" class="demo-input" type="number" value="10"></label><label>Categoria<input id="pCat" class="demo-input" value="Outro"></label></div><div class="modal-actions"><button id="modalCancel" class="demo-btn">Cancelar</button><button id="modalSave" class="demo-btn">Salvar produto</button></div></div></div>
  </div>`;
  let list=[...products];
  const renderProducts=()=>{
    const q=(document.getElementById("productSearch")?.value||"").toLowerCase();
    document.getElementById("productRows").innerHTML=list.filter(x=>x[0].toLowerCase().includes(q)).map(x=>`<div class="data-row"><div class="admin-product-name"><img class="admin-thumb" src="${x[5]}" alt="${x[0]}"><strong>${x[0]}</strong></div><span>${x[1]}</span><span>${x[2]}</span><span>${x[3]}</span><span class="badge ${+x[2]<=6?"status-low":"status-ok"}">${x[4]}</span></div>`).join("");
  };
  document.querySelector(".admin-nav").onclick=e=>{const b=e.target.closest("[data-view]");if(!b)return;document.querySelectorAll(".admin-nav button").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".admin-view").forEach(x=>x.classList.toggle("active",x.dataset.view===b.dataset.view));document.getElementById("adminTitle").textContent={dash:"Visão geral",products:"Produtos",customers:"Clientes",orders:"Pedidos"}[b.dataset.view];};
  document.getElementById("productSearch").oninput=renderProducts;
  const modal=document.getElementById("productModal");document.getElementById("newProduct").onclick=()=>modal.classList.add("open");document.getElementById("modalCancel").onclick=()=>modal.classList.remove("open");
  document.getElementById("modalSave").onclick=()=>{const name=document.getElementById("pName").value;if(!name)return showToast("Informe o nome do produto.");list.unshift([name,"R$ "+document.getElementById("pPrice").value,document.getElementById("pStock").value,document.getElementById("pCat").value,"Ativo","assets/camisa-linho.svg"]);modal.classList.remove("open");renderProducts();showToast("Produto criado na demonstração ✓");};
  renderProducts();
}

function renderAgenda(){
  app.innerHTML=`
  <div class="shell agenda"><header class="agenda-header"><strong>Estúdio Aurora</strong><span>Agendamento online</span></header><div class="booking">
    <aside class="booking-side"><small>ESCOLHA O PROFISSIONAL</small><h1>Reserve seu horário em poucos cliques.</h1><p>Exemplo de agenda para clínica, salão, barbearia ou qualquer negócio com atendimento marcado.</p><div class="prof-list" id="profList"><button class="prof active" data-prof="Marina">Marina • Corte e estilo</button><button class="prof" data-prof="Lucas">Lucas • Barba e corte</button><button class="prof" data-prof="Amanda">Amanda • Coloração</button></div></aside>
    <section class="booking-card"><h2>Escolha uma data e horário</h2><div class="day-list" id="dayList">${[["SEG",14],["TER",15],["QUA",16],["QUI",17],["SEX",18]].map((x,i)=>`<button class="day ${i===0?"active":""}" data-day="${x[0]} ${x[1]}">${x[0]}<b>${x[1]}</b></button>`).join("")}</div><div class="time-grid" id="timeGrid">${["09:00","10:30","11:30","14:00","15:30","16:30","18:00","19:00"].map(x=>`<button class="time" data-time="${x}">${x}</button>`).join("")}</div><form class="booking-form" id="bookingForm"><input id="bookName" class="demo-input" required placeholder="Seu nome"><input id="bookPhone" class="demo-input" required placeholder="WhatsApp"><button class="demo-btn">Confirmar agendamento</button></form><div class="booking-confirm" id="bookingConfirm"></div></section>
  </div></div>`;
  let prof="Marina",day="SEG 14",time="";
  document.getElementById("profList").onclick=e=>{const b=e.target.closest("[data-prof]");if(!b)return;prof=b.dataset.prof;document.querySelectorAll(".prof").forEach(x=>x.classList.toggle("active",x===b));};
  document.getElementById("dayList").onclick=e=>{const b=e.target.closest("[data-day]");if(!b)return;day=b.dataset.day;document.querySelectorAll(".day").forEach(x=>x.classList.toggle("active",x===b));};
  document.getElementById("timeGrid").onclick=e=>{const b=e.target.closest("[data-time]");if(!b)return;time=b.dataset.time;document.querySelectorAll(".time").forEach(x=>x.classList.toggle("active",x===b));};
  document.getElementById("bookingForm").onsubmit=e=>{e.preventDefault();if(!time)return showToast("Escolha um horário.");const name=document.getElementById("bookName").value;const box=document.getElementById("bookingConfirm");box.innerHTML=`✓ <strong>${name}</strong>, horário reservado com <strong>${prof}</strong> em <strong>${day}</strong>, às <strong>${time}</strong>.`;box.classList.add("show");showToast("Agendamento confirmado na demonstração ✓");};
}

function renderAutomation(){
  app.innerHTML=`
  <div class="shell automation"><aside class="auto-side"><b>Automação Hub</b><span class="active">Visão geral</span><span>Fluxos</span><span>Relatórios</span><span>Integrações</span><span>Logs</span></aside><main class="auto-main">
    <div class="auto-top"><div><small>AUTOMAÇÕES DO NEGÓCIO</small><h1>Fluxos ativos</h1></div><button id="runAll" class="demo-btn">Executar agora</button></div>
    <section class="auto-grid" id="flowGrid">
      ${[
        ["Pedido → Planilha","Novo pedido recebido","Pedido","Planilha"],
        ["Estoque baixo → Alerta","Produto abaixo do mínimo","Estoque","WhatsApp"],
        ["Fechamento → Relatório","Resumo diário automático","Vendas","PDF"]
      ].map((x,i)=>`<article class="flow-card"><div class="flow-top"><div><h3>${x[0]}</h3><p>${x[1]}</p></div><button class="toggle ${i<2?"on":""}" data-toggle><i></i></button></div><div class="flow-path"><span>${x[2]}</span><i>→</i><span>${x[3]}</span></div></article>`).join("")}
    </section>
    <section class="log-card"><header><h3>Atividade recente</h3><span class="badge status-ok">online</span></header><div class="log-list" id="logList"><div class="log-row"><span>14:22</span><strong>Pedido #1042 salvo na planilha</strong><em>sucesso</em></div><div class="log-row"><span>14:05</span><strong>Alerta de estoque enviado</strong><em>sucesso</em></div><div class="log-row"><span>13:00</span><strong>Relatório parcial atualizado</strong><em>sucesso</em></div></div></section>
    <section class="report-panel"><article class="report-card"><h3>Relatório diário sem trabalho manual.</h3><p>O sistema coleta dados, organiza e prepara o resumo automaticamente.</p><button id="reportBtn" class="demo-btn">Gerar relatório agora</button></article><article class="metric-card"><span>Execuções este mês</span><strong id="runMetric">1.284</strong><span>98,7% concluídas com sucesso</span></article></section>
  </main></div>`;
  document.getElementById("flowGrid").onclick=e=>{const b=e.target.closest("[data-toggle]");if(!b)return;b.classList.toggle("on");showToast(b.classList.contains("on")?"Automação ativada":"Automação pausada");};
  const addLog=text=>{const row=document.createElement("div");row.className="log-row";row.innerHTML=`<span>${new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</span><strong>${text}</strong><em>sucesso</em>`;document.getElementById("logList").prepend(row);};
  document.getElementById("runAll").onclick=()=>{addLog("Fluxos executados manualmente");document.getElementById("runMetric").textContent="1.287";showToast("3 automações executadas ✓");};
  document.getElementById("reportBtn").onclick=()=>{addLog("Relatório diário gerado");showToast("Relatório fictício gerado ✓");};
}

const renderers={menu:renderMenu,catalog:renderCatalog,institutional:renderInstitutional,quote:renderQuote,admin:renderAdmin,agenda:renderAgenda,automation:renderAutomation};
(renderers[demo]||renderMenu)();
