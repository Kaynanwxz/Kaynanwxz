/* Kaynan Carvalhães — Pavilhão digital. HTML/CSS/JS sem dependências. */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s);};
var $$=function(s,r){return Array.from((r||document).querySelectorAll(s));};
var escapeHTML=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
var money=function(v){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v);};
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var whatsapp='5512992187750';
var dialog=$('#demo-dialog'), content=$('#dialog-content'), dialogTitle=$('#dialog-title');
var currentDemo=null, lastTrigger=null, timers=[], closing=false, closeTimer=null, toastTimer=null;
var state={category:'Todos',query:'',cart:{},adminTab:'dashboard',adminSearch:'',clientForm:false,service:'Corte de cabelo',professional:'Ana',date:'',slot:'',bookings:[],flowRunning:false,quoteStep:0,quoteType:'Site',quoteName:'',quoteNeed:'',quoteTiming:'Sem urgência'};
var foods=[
{id:'queijos',name:'Quatro queijos',category:'Pizzas',description:'Uma combinação cremosa de queijos e ervas.',price:47,image:'assets/pizza-queijos.webp'},
{id:'marg',name:'Margherita',category:'Pizzas',description:'Molho de tomate, muçarela e manjericão.',price:42,image:'assets/pizza-margherita.webp'},
{id:'pepper',name:'Pepperoni',category:'Pizzas',description:'Molho artesanal, muçarela e pepperoni.',price:49,image:'assets/pizza-pepperoni.webp'},
{id:'coffee',name:'Café especial',category:'Bebidas',description:'Café coado na hora. Uma boa pausa.',price:9,image:'assets/cafe.webp'},
{id:'brownie',name:'Brownie da casa',category:'Doces',description:'Chocolate intenso e casquinha delicada.',price:16,image:'assets/brownie.webp'}
];
var clothes=[
{id:'linen',name:'Camisa Linho',category:'Roupas',description:'Uma peça leve para todos os dias.',price:129,image:'assets/camisa-linho.webp',sizes:['P','M','G','GG'],stock:12},
{id:'blazer',name:'Blazer Areia',category:'Roupas',description:'Linhas simples e tons naturais.',price:289,image:'assets/blazer-areia.webp',sizes:['P','M','G'],stock:8},
{id:'bag',name:'Bolsa Urbana',category:'Acessórios',description:'Espaço para acompanhar sua rotina.',price:179,image:'assets/bolsa-urbana.webp',stock:5},
];
var inventory=[
{id:'i1',name:'Camisa Linho',stock:12,price:129},{id:'i2',name:'Blazer Areia',stock:8,price:289},
{id:'i3',name:'Bolsa Urbana',stock:5,price:179},{id:'i4',name:'Camisa Essencial',stock:14,price:99},
{id:'i5',name:'Calça Alfaiataria',stock:6,price:189},{id:'i6',name:'Cinto Clássico',stock:9,price:69},
{id:'i7',name:'Tênis Casual',stock:4,price:219},{id:'i8',name:'Carteira Compacta',stock:10,price:89}
];
var clients=[{name:'Ana Ribeiro',contact:'ana@exemplo.test'},{name:'Carlos Silva',contact:'carlos@exemplo.test'},{name:'Mariana Costa',contact:'mariana@exemplo.test'}];
var orders=[{id:'#1024',client:'Ana Ribeiro',total:258,status:'Concluído'},{id:'#1025',client:'Carlos Silva',total:179,status:'Em preparo'},{id:'#1026',client:'Mariana Costa',total:289,status:'Recebido'}];
var titles={menu:'Cardápio digital',catalog:'Loja & catálogo',institutional:'Site institucional',quote:'Orçamento guiado',admin:'Sistema de gestão',agenda:'Agendamento online',automation:'Central de automações'};
var cases={
dudu:{title:'Barbearia do Dudu',category:'SISTEMA DE GESTÃO',description:'Uma aplicação para reunir a rotina da barbearia: agenda, clientes, equipe e unidades em uma experiência pensada para o uso diário.',features:['Agenda por unidade','Cadastro de clientes','Equipe e acessos','Visão do negócio'],tags:['Gestão','Agendamentos','Aplicação web'],status:'Projeto em desenvolvimento. A imagem do portfólio é uma prévia ilustrativa; a demonstração abaixo é independente.',demo:'agenda'},
psydia:{title:'Psydia',category:'DIÁRIO DIGITAL',description:'Uma aplicação com acesso autenticado e organização de registros pessoais. O projeto reúne o cuidado com a experiência de uso e a estrutura de back-end.',features:['Cadastro e login','Registros do diário','Histórico organizado','Acesso autenticado'],tags:['Java','Spring Boot','JWT','Banco de dados'],status:'Projeto em desenvolvimento. A interface apresentada no portfólio é ilustrativa.'},
store:{title:'Catálogo e controle de estoque',category:'COMÉRCIO & GESTÃO',description:'Estrutura para cadastrar produtos, imagens e preços, acompanhar estoque e manter o catálogo atualizado sem precisar alterar o código do site.',features:['Produtos e categorias','Entradas e saídas','Preços e disponibilidade','Painel administrativo'],tags:['Catálogo','Estoque','PostgreSQL'],status:'Trabalho apresentado no portfólio anterior. A experiência interativa é uma demonstração fictícia.',demo:'admin'},
finance:{title:'Aplicativo de aportes e metas',category:'FINANÇAS & DASHBOARD',description:'Interface de acompanhamento de aportes e evolução de metas, com foco em clareza, organização e uso em tablet e computador.',features:['Metas e objetivos','Registro de aportes','Evolução visual','Interface responsiva'],tags:['Dashboard','Organização','Interfaces'],status:'Projeto de portfólio. Não oferece recomendações de investimento.'},
patients:{title:'Gestão de pacientes',category:'CADASTRO & AUTENTICAÇÃO',description:'Estrutura com cadastro, login, autenticação e organização de informações para registros e históricos.',features:['Cadastro','Acesso autenticado','Organização de registros','Históricos'],tags:['Back-end','Autenticação','Banco de dados'],status:'Projeto de portfólio. Nenhum dado real de paciente é apresentado.'},
bank:{title:'Sistema bancário de estudo',category:'BACK-END & REGRAS DE NEGÓCIO',description:'Projeto de estudo com autenticação, regras de negócio, banco de dados e APIs. Uma base técnica para construir aplicações organizadas.',features:['Autenticação','Regras de negócio','APIs REST','Persistência de dados'],tags:['Java','Spring Boot','Security','PostgreSQL'],status:'Projeto educacional, sem operações bancárias reais.'}
};
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(function(){$('#toast').classList.remove('show');},3200);}
function clearTimers(){timers.forEach(clearTimeout);timers=[];state.flowRunning=false;}
function menuClose(){var menu=$('#menu');menu.classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','Abrir menu');}
$('.menu-toggle').addEventListener('click',function(){var open=$('#menu').classList.toggle('open');this.setAttribute('aria-expanded',String(open));this.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');});
$$('#menu a').forEach(function(a){a.addEventListener('click',menuClose);});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!dialog.open)menuClose();});
window.addEventListener('resize',function(){if(window.innerWidth>800)menuClose();});
document.addEventListener('click',function(e){if(!e.target.closest('.navigation'))menuClose();});
$('#year').textContent=new Date().getFullYear();
function initReveal(){
 if(!('IntersectionObserver' in window)||reduced)return;
 document.documentElement.classList.add('js');
 var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.08,rootMargin:'0px 0px 20px 0px'});
 $$('.reveal').forEach(function(el){observer.observe(el);});
}
initReveal();
// Only visible rooms animate. No continuous rendering loop.
if('IntersectionObserver' in window){
 var roomObserver=new IntersectionObserver(function(entries){entries.forEach(function(e){e.target.classList.toggle('in-view',e.isIntersecting);});},{rootMargin:'160px'});
 $$('main>section').forEach(function(el){roomObserver.observe(el);});
}
document.addEventListener('visibilitychange',function(){document.body.classList.toggle('motion-paused',document.hidden);});

var scrollQueued=false;
function updateScroll(){scrollQueued=false;$('.navigation').classList[window.scrollY>40?'add':'remove']('is-scrolled');var max=document.documentElement.scrollHeight-window.innerHeight;$('.scroll-progress').style.transform='scaleX('+(max?Math.min(1,Math.max(0,window.scrollY/max)):0)+')';}
window.addEventListener('scroll',function(){if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}},{passive:true});
updateScroll();
if('IntersectionObserver' in window){var navObserver=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){$$('#menu a').forEach(function(a){if(a.getAttribute('href')==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}});},{rootMargin:'-15% 0px -60% 0px'});$$('main>section').forEach(function(s){navObserver.observe(s);});}
var exhibitKeys=['menu','catalog','institutional','quote','admin','agenda','automation'];
function setExhibit(key,focusPreview){
 var cards=$$('#demo-grid [data-exhibit-card]');
 if(!cards.some(function(c){return c.dataset.exhibitCard===key;}))return;
 $$('[data-exhibit]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.exhibit===key));});
 cards.forEach(function(c){c.hidden=c.dataset.exhibitCard!==key;if(!c.hidden)c.classList.add('visible');});
 var active=cards.find(function(c){return !c.hidden;});
 if(active){$('#demo-grid').setAttribute('aria-labelledby','exhibit-'+key);if(focusPreview){var action=active.querySelector('.stone-action');if(action)action.focus({preventScroll:true});}}
 var count=$('.demo-count');if(count)count.textContent='Prévia selecionada: '+(titles[key]||key);
 $('#demo-grid').classList.remove('preview-enter');
 requestAnimationFrame(function(){$('#demo-grid').classList.add('preview-enter');});
}
$$('[data-exhibit]').forEach(function(b){b.addEventListener('click',function(){setExhibit(b.dataset.exhibit,false);});});
function filterDemos(category){
 var key=category==='sistemas'?'admin':category==='automacoes'?'automation':'menu';
 setExhibit(key,false);
}
$$('[data-filter]').forEach(function(b){b.addEventListener('click',function(){filterDemos(b.dataset.filter);});});
$$('[data-filter-link]').forEach(function(a){a.addEventListener('click',function(){filterDemos(a.dataset.filterLink);});});
function disclaimer(text){return '<p class="demo-disclaimer">'+(text||'Demonstração fictícia. Imagens ilustrativas geradas para os exemplos; nomes e preços fictícios. Nada é enviado ou cobrado.')+'</p>';}
function footerCTA(){return '<div class="modal-footer-cta"><p>Uma solução parecida pode fazer sentido para seu negócio.</p><button data-action="contact">Conversar sobre meu projeto ↗</button></div>';}
function modalOpen(title,trigger){
 clearTimeout(closeTimer);closing=false;dialog.classList.remove('is-closing');
 dialogTitle.textContent=title;lastTrigger=trigger||document.activeElement;
 $('#window-location').textContent='Pavilhão / '+(currentDemo==='case'?'Projetos':currentDemo==='contact-review'?'Contato':'Experiências');
 dialog.dataset.windowPattern='pavilion';
 dialog.dataset.experience=currentDemo||'overview';
 document.body.classList.add('modal-open');
 if(!dialog.open)dialog.showModal();
 dialog.scrollTop=0;$('#window-scroll').scrollTop=0;
 $('.close-dialog').focus({preventScroll:true});
}
function closeDialog(immediate){
 if(!dialog.open)return;clearTimers();if(closing&&!immediate)return;closing=true;
 function finish(){dialog.close();dialog.classList.remove('is-closing');document.body.classList.remove('modal-open');closing=false;currentDemo=null;content.innerHTML='';if(lastTrigger&&document.contains(lastTrigger))lastTrigger.focus({preventScroll:true});}
 if(reduced||immediate){finish();return;}dialog.classList.add('is-closing');closeTimer=setTimeout(finish,180);
}
$('.close-dialog').addEventListener('click',function(){closeDialog();});
dialog.addEventListener('cancel',function(e){e.preventDefault();closeDialog();});
dialog.addEventListener('click',function(e){if(e.target===dialog){var box=dialog.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)closeDialog();}});
dialog.addEventListener('close',function(){document.body.classList.remove('modal-open');clearTimers();});
function openDemo(type,trigger){
 clearTimers();state.category='Todos';state.query='';state.cart={};state.adminTab='dashboard';state.adminSearch='';state.clientForm=false;state.slot='';state.quoteStep=0;state.quoteType='Site';state.quoteName='';state.quoteNeed='';state.quoteTiming='Sem urgência';currentDemo=type;
 renderDemo();modalOpen(titles[type]||'Demonstração',trigger);
}
function openCase(key,trigger){
 var c=cases[key];if(!c)return;clearTimers();currentDemo='case';
 content.innerHTML='<article class="case-details"><p class="case-eyebrow">'+c.category+'</p><h3>'+c.title+'</h3><p>'+c.description+'</p><ul class="case-feature-list">'+c.features.map(function(f){return '<li class="pavilion-surface">✓ '+f+'</li>';}).join('')+'</ul><div class="case-tags">'+c.tags.map(function(t){return '<span>'+t+'</span>';}).join('')+'</div><div class="case-status pavilion-surface">'+c.status+'</div>'+(c.demo?'<button class="solid-button" data-open-demo="'+c.demo+'">Experimentar uma demonstração relacionada <span>↗</span></button>':'')+footerCTA()+'</article>';
 modalOpen(c.title,trigger);
}
document.addEventListener('click',function(e){var demo=e.target.closest('[data-demo]');if(demo){openDemo(demo.dataset.demo,demo);return;}var project=e.target.closest('[data-project]');if(project)openCase(project.dataset.project,project);});
function renderDemo(){
 if(currentDemo==='menu'||currentDemo==='catalog'){renderShop();return;}
 if(currentDemo==='admin'){renderAdmin();return;}
 if(currentDemo==='agenda'){renderAgenda();return;}
 if(currentDemo==='automation'){renderAutomation();return;}
 if(currentDemo==='quote'){renderQuote();return;}
 if(currentDemo==='institutional'){renderInstitutional();return;}
}
function renderShop(){
 var menu=currentDemo==='menu',list=menu?foods:clothes,categories=menu?['Todos','Pizzas','Bebidas','Doces']:['Todos','Roupas','Acessórios'];
 content.innerHTML=disclaimer()+'<div class="demo-app shop-app"><div class="shop-header"><div><h3>'+(menu?'Forno 27':'Maison 12')+'</h3><p>'+(menu?'Artesanal, do forno para a sua mesa.':'Essenciais para acompanhar sua rotina.')+'</p></div><span class="status-badge">EXEMPLO CONCEITUAL</span></div><div class="demo-search"><label for="shop-search">Buscar '+(menu?'no cardápio':'na coleção')+'</label><input id="shop-search" type="search" placeholder="'+(menu?'Procure uma pizza, bebida ou doce':'Procure uma peça ou acessório')+'" value="'+escapeHTML(state.query)+'"></div><div class="demo-tabs" role="group" aria-label="Categorias">'+categories.map(function(c){return '<button data-shop-category="'+c+'" class="'+(state.category===c?'active':'')+'" aria-pressed="'+(state.category===c)+'">'+c+'</button>';}).join('')+'</div><div class="shop-layout"><div class="product-grid" id="products"></div><aside class="cart-panel pavilion-surface" aria-label="Carrinho"><h4>Seu carrinho</h4><div id="cart-content"></div></aside></div></div>'+footerCTA();
 renderProducts();renderCart();
 $('#shop-search').addEventListener('input',function(){state.query=this.value;renderProducts();});
}
function renderProducts(){
 var list=currentDemo==='menu'?foods:clothes;
 var filtered=list.filter(function(p){return (state.category==='Todos'||p.category===state.category)&&p.name.toLocaleLowerCase('pt-BR').includes(state.query.trim().toLocaleLowerCase('pt-BR'));});
 $('#products').innerHTML=filtered.length?filtered.map(function(p){return '<article class="product pavilion-surface"><img src="'+p.image+'" alt="'+p.name+'" loading="lazy"><div class="product-body"><h4>'+p.name+'</h4><p class="product-description">'+p.description+'</p><p class="product-price">'+money(p.price)+'</p>'+(p.sizes?'<label for="size-'+p.id+'">Tamanho</label><select class="size-picker" id="size-'+p.id+'" aria-label="Tamanho de '+p.name+'">'+p.sizes.map(function(s){return '<option>'+s+'</option>';}).join('')+'</select>':'')+'<button data-add="'+p.id+'">Adicionar ao carrinho +</button></div></article>';}).join(''):'<p class="empty-state">Nenhum produto encontrado. Experimente outra busca ou categoria.</p>';
}
function renderCart(){
 var entries=Object.entries(state.cart),total=entries.reduce(function(sum,pair){return sum+pair[1].price*pair[1].quantity;},0);
 $('#cart-content').innerHTML=entries.length?entries.map(function(pair){var key=pair[0],p=pair[1];return '<div class="cart-row"><div class="cart-row-top"><span>'+escapeHTML(p.name)+(p.size?' · '+escapeHTML(p.size):'')+'</span><strong>'+money(p.price*p.quantity)+'</strong></div><div class="cart-controls"><button data-qty="'+key+'" data-delta="-1" aria-label="Diminuir quantidade de '+escapeHTML(p.name)+'">−</button><span>'+p.quantity+'</span><button data-qty="'+key+'" data-delta="1" aria-label="Aumentar quantidade de '+escapeHTML(p.name)+'">+</button><button class="remove-cart" data-remove="'+key+'">Remover</button></div></div>';}).join('')+'<div class="cart-total"><span>Total</span><strong>'+money(total)+'</strong></div><button class="solid-button" data-action="checkout">Simular pedido <span>↗</span></button><div id="order-summary" role="status" aria-live="polite"></div>':'<p class="cart-empty">Escolha um produto para começar.<br>Você pode ajustar as quantidades aqui.</p>';
}
function addProduct(id){
 var p=(currentDemo==='menu'?foods:clothes).find(function(x){return x.id===id;});if(!p)return;
 var select=$('#size-'+id),size=select?select.value:'',key=id+(size?'-'+size:'');
 if(!state.cart[key])state.cart[key]={name:p.name,price:p.price,quantity:0,size:size};
 if(state.cart[key].quantity>=20){toast('Limite de 20 unidades por item nesta demonstração.');return;}
 state.cart[key].quantity++;renderCart();toast(p.name+' adicionado ao carrinho.');
}
function tabs(items,active,key){return '<div class="demo-tabs" role="group" aria-label="Áreas do painel">'+items.map(function(it){return '<button data-'+key+'="'+it.id+'" class="'+(active===it.id?'active':'')+'" aria-pressed="'+(active===it.id)+'">'+it.label+'</button>';}).join('')+'</div>';}
function renderAdmin(){
 var sum=inventory.reduce(function(a,p){return a+p.stock;},0),value=inventory.reduce(function(a,p){return a+p.stock*p.price;},0);
 var body='';
 if(state.adminTab==='dashboard'){
 body='<h3>Sua operação, em ordem.</h3><p>Uma visão do negócio com dados fictícios.</p><div class="demo-metric-grid"><div class="demo-metric pavilion-surface"><span>Produtos cadastrados</span><strong>'+inventory.length+'</strong></div><div class="demo-metric pavilion-surface"><span>Unidades em estoque</span><strong>'+sum+'</strong></div><div class="demo-metric pavilion-surface"><span>Valor do estoque</span><strong>'+money(value)+'</strong></div></div><h4>Pedidos da semana</h4><div class="demo-chart" role="img" aria-label="Pedidos fictícios da semana: segunda 4, terça 7, quarta 5, quinta 9, sexta 6.">'+[4,7,5,9,6].map(function(n,i){return '<span style="height:'+n*10+'%"><small>'+['SEG','TER','QUA','QUI','SEX'][i]+'</small></span>';}).join('')+'</div><button class="secondary-button" data-admin-tab="products">Gerenciar produtos e estoque ↗</button>';
 } else if(state.adminTab==='products'){
 body='<h3>Produtos & estoque</h3><p>Use os controles para simular entradas e saídas de estoque.</p><div class="demo-toolbar"><input type="search" id="inventory-search" aria-label="Buscar produto no estoque" placeholder="Buscar produto" value="'+escapeHTML(state.adminSearch)+'"><button class="secondary-button" data-action="reset-stock">Restaurar estoque</button></div><div id="inventory-table"></div>';
 } else if(state.adminTab==='clients'){
 body='<h3>Clientes</h3><p>Cadastre um contato fictício para experimentar.</p><form class="inline-form pavilion-surface" id="client-form"><div class="field"><label for="client-name">Nome fictício</label><input id="client-name" name="name" required maxlength="80" placeholder="Ex.: Cliente de teste"></div><div class="field"><label for="client-contact">Contato fictício</label><input id="client-contact" name="contact" required maxlength="100" placeholder="exemplo@teste.test"></div><button class="solid-button" type="submit">Cadastrar</button></form><div class="table-scroll pavilion-surface"><table class="demo-table"><thead><tr><th>Nome</th><th>Contato</th></tr></thead><tbody>'+clients.map(function(c){return '<tr><td>'+escapeHTML(c.name)+'</td><td>'+escapeHTML(c.contact)+'</td></tr>';}).join('')+'</tbody></table></div>';
 } else {
 body='<h3>Pedidos</h3><p>Altere o andamento para acompanhar a operação.</p><div class="table-scroll pavilion-surface"><table class="demo-table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Total</th><th>Status</th></tr></thead><tbody>'+orders.map(function(o,i){return '<tr><td>'+o.id+'</td><td>'+o.client+'</td><td>'+money(o.total)+'</td><td><select data-order-status="'+i+'" aria-label="Status do pedido '+o.id+'">'+['Recebido','Em preparo','Concluído'].map(function(s){return '<option'+(o.status===s?' selected':'')+'>'+s+'</option>';}).join('')+'</select></td></tr>';}).join('')+'</tbody></table></div>';
 }
 content.innerHTML=disclaimer('Painel demonstrativo com dados fictícios. As alterações ficam apenas nesta sessão e não afetam nenhum negócio real.')+'<div class="demo-app">'+tabs([{id:'dashboard',label:'Visão geral'},{id:'products',label:'Produtos'},{id:'clients',label:'Clientes'},{id:'orders',label:'Pedidos'}],state.adminTab,'admin-tab')+body+'</div>'+footerCTA();
 if(state.adminTab==='products'){renderInventory();$('#inventory-search').addEventListener('input',function(){state.adminSearch=this.value;renderInventory();});}
 if(state.adminTab==='clients')$('#client-form').addEventListener('submit',function(e){e.preventDefault();var name=$('#client-name').value.trim(),contact=$('#client-contact').value.trim();if(!name||!contact){toast('Preencha os dois campos.');return;}clients.push({name:name,contact:contact});renderAdmin();toast('Contato fictício cadastrado.');});
}
function renderInventory(){
 var list=inventory.filter(function(p){return p.name.toLocaleLowerCase('pt-BR').includes(state.adminSearch.toLocaleLowerCase('pt-BR'));});
 $('#inventory-table').innerHTML=list.length?'<div class="table-scroll pavilion-surface"><table class="demo-table"><thead><tr><th>Produto</th><th>Preço</th><th>Estoque</th><th>Situação</th></tr></thead><tbody>'+list.map(function(p){return '<tr><td>'+p.name+'</td><td>'+money(p.price)+'</td><td><span class="stock-control"><button data-stock="'+p.id+'" data-delta="-1" aria-label="Retirar uma unidade de '+p.name+'">−</button><b>'+p.stock+'</b><button data-stock="'+p.id+'" data-delta="1" aria-label="Adicionar uma unidade de '+p.name+'">+</button></span></td><td><span class="status-badge">'+(p.stock===0?'Sem estoque':p.stock<5?'Estoque baixo':'Disponível')+'</span></td></tr>';}).join('')+'</tbody></table></div>':'<p class="empty-state">Nenhum produto encontrado.</p>';
}
function localDate(offset){var d=new Date();d.setDate(d.getDate()+(offset||0));return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function friendlyDate(v){if(!v)return '';var a=v.split('-');return a[2]+'/'+a[1]+'/'+a[0];}
function renderAgenda(){
 if(!state.date||state.date<localDate())state.date=localDate(1);
 content.innerHTML=disclaimer('Agendamento simulado. Nenhum estabelecimento recebe a reserva; não use dados pessoais reais neste exemplo.')+'<div class="demo-app"><div class="agenda-layout"><div class="agenda-panel pavilion-surface"><h3>Reserve um momento.</h3><p>Uma agenda clara do começo à confirmação.</p><form id="booking-form" style="margin-top:22px"><div class="field"><label for="booking-service">Serviço</label><select id="booking-service">'+['Corte de cabelo','Barba','Corte + barba'].map(function(s){return '<option'+(s===state.service?' selected':'')+'>'+s+'</option>';}).join('')+'</select></div><div class="field"><label for="booking-professional">Profissional</label><select id="booking-professional">'+['Ana','Bruno','Camila'].map(function(s){return '<option'+(s===state.professional?' selected':'')+'>'+s+'</option>';}).join('')+'</select></div><div class="field"><label for="booking-date">Data</label><input type="date" id="booking-date" min="'+localDate()+'" value="'+state.date+'" required></div><label>Horários disponíveis</label><div class="slot-grid" id="slot-grid"></div><div class="field"><label for="booking-name">Nome fictício</label><input id="booking-name" placeholder="Cliente de teste" required maxlength="80"></div><button class="solid-button" type="submit">Confirmar simulação <span>↗</span></button><p id="booking-error" role="status" style="font-size:12px;margin-top:12px"></p></form></div><div class="agenda-panel pavilion-surface"><h4>Seu agendamento</h4><div id="booking-result" role="status" aria-live="polite"><p style="font-size:13px">Selecione serviço, profissional e horário para ver a confirmação aqui.</p></div><div class="booking-list"><h4>Simulações desta sessão</h4><div id="booking-list"></div></div></div></div></div>'+footerCTA();
 renderSlots();renderBookingList();
 $('#booking-date').addEventListener('change',function(){state.date=this.value;state.slot='';renderSlots();});
 $('#booking-professional').addEventListener('change',function(){state.professional=this.value;state.slot='';renderSlots();});
 $('#booking-service').addEventListener('change',function(){state.service=this.value;});
 $('#booking-form').addEventListener('submit',function(e){e.preventDefault();var err=$('#booking-error'),name=$('#booking-name').value.trim(),date=$('#booking-date').value;err.textContent='';if(!name){err.textContent='Informe um nome fictício.';return;}if(!date||date<localDate()){err.textContent='Escolha uma data a partir de hoje.';return;}if(!state.slot){err.textContent='Escolha um horário disponível.';return;}if(state.bookings.some(function(b){return b.date===date&&b.professional===state.professional&&b.slot===state.slot;})){err.textContent='Este horário acabou de ser reservado nesta simulação.';return;}var b={name:name,date:date,slot:state.slot,service:state.service,professional:state.professional};state.bookings.push(b);$('#booking-result').innerHTML='<div class="booking-result pavilion-surface"><h4>✓ Horário confirmado</h4><p><strong>'+escapeHTML(name)+'</strong><br>'+escapeHTML(b.service)+' com '+escapeHTML(b.professional)+'<br>'+friendlyDate(date)+' às '+b.slot+'</p><p style="font-size:10px;margin-top:13px">Confirmação de demonstração. Nenhuma reserva real foi criada.</p></div>';state.slot='';renderSlots();renderBookingList();toast('Agendamento simulado com sucesso.');});
}
function renderSlots(){
 var used=state.bookings.filter(function(b){return b.date===state.date&&b.professional===state.professional;}).map(function(b){return b.slot;});
 $('#slot-grid').innerHTML=['09:00','10:00','11:00','13:00','14:00','15:00'].map(function(s){var booked=used.includes(s);return '<button type="button" data-slot="'+s+'" '+(booked?'disabled ':'')+'aria-pressed="'+(state.slot===s)+'" aria-label="'+s+(booked?', indisponível':'')+'">'+s+(booked?' ✓':'')+'</button>';}).join('');
}
function renderBookingList(){$('#booking-list').innerHTML=state.bookings.length?state.bookings.map(function(b){return '<div class="booking-item"><span>'+escapeHTML(b.name)+'<br><small>'+b.professional+' · '+b.service+'</small></span><strong>'+friendlyDate(b.date)+'<br>'+b.slot+'</strong></div>';}).join(''):'<p style="font-size:12px">Nenhuma simulação ainda.</p>';}
function renderAutomation(){
 content.innerHTML=disclaimer('Fluxo simulado: nenhum e-mail, WhatsApp ou relatório é enviado para serviços externos.')+'<div class="demo-app"><h3>Deixe o trabalho fluir.</h3><p>Simule um pedido e acompanhe cada etapa da automação.</p><div class="flow-settings"><label><input type="checkbox" id="flow-email" checked> Preparar confirmação</label><label><input type="checkbox" id="flow-report" checked> Atualizar relatório</label></div><div class="flow-layout"><div class="live-flow">'+[{title:'Pedido recebido',desc:'O cliente conclui uma solicitação.'},{title:'Dados organizados',desc:'As informações entram no painel.'},{title:'Confirmação preparada',desc:'O cliente fica informado.'},{title:'Relatório atualizado',desc:'A equipe acompanha o resultado.'}].map(function(s,i){return '<div class="live-flow-step pavilion-surface" data-flow-step="'+i+'"><span>'+(i+1)+'</span><b>'+s.title+'</b><small>'+s.desc+'</small></div>';}).join('')+'</div><div class="flow-log pavilion-surface" id="flow-log" role="log" aria-live="polite"><strong>REGISTROS DA SIMULAÇÃO</strong><p>Pronto para receber um pedido de teste.</p></div></div><div class="flow-actions"><button class="solid-button" data-action="run-flow" id="run-flow">Simular novo pedido <span>↗</span></button><button class="secondary-button" data-action="reset-flow">Reiniciar</button></div></div>'+footerCTA();
}
function runFlow(){
 if(state.flowRunning)return;clearTimers();state.flowRunning=true;
 var btn=$('#run-flow');btn.disabled=true;btn.textContent='Fluxo em execução…';$('#flow-email').disabled=true;$('#flow-report').disabled=true;
 var email=$('#flow-email').checked,report=$('#flow-report').checked,steps=[0,1];if(email)steps.push(2);if(report)steps.push(3);
 $$('.live-flow-step').forEach(function(s){s.classList.remove('done','running');s.querySelector('span').textContent=String(Number(s.dataset.flowStep)+1);});
 $('#flow-log').innerHTML='<strong>REGISTROS DA SIMULAÇÃO</strong>';
 var messages=['Pedido de teste #1042 recebido.','Cliente e itens organizados no painel.','Confirmação preparada para o cliente (simulação).','Relatório de pedidos atualizado (simulação).'];
 var delay=reduced?40:700;
 steps.forEach(function(i,index){timers.push(setTimeout(function(){
 if(!dialog.open||currentDemo!=='automation')return;
 var el=$('[data-flow-step="'+i+'"]');el.classList.add('running');
 $('#flow-log').insertAdjacentHTML('beforeend','<p>✓ '+messages[i]+'</p>');
 timers.push(setTimeout(function(){if(el.isConnected){el.classList.remove('running');el.classList.add('done');el.querySelector('span').textContent='✓';}},reduced?0:350));
 },index*delay));});
 timers.push(setTimeout(function(){if(!dialog.open||currentDemo!=='automation')return;state.flowRunning=false;btn.disabled=false;btn.innerHTML='Simular outro pedido <span>↗</span>';$('#flow-email').disabled=false;$('#flow-report').disabled=false;$('#flow-log').insertAdjacentHTML('beforeend','<p><strong>Fluxo concluído. '+steps.length+' etapas executadas.</strong></p>');},steps.length*delay));
}
function renderQuote(){
 var body='';
 if(state.quoteStep===0)body='<h3>O que você quer construir?</h3><p>Escolha o caminho mais próximo da sua necessidade.</p><div class="quote-choices">'+['Site','Sistema','Automação'].map(function(t){return '<button data-quote-type="'+t+'" class="'+(state.quoteType===t?'active':'')+'" aria-pressed="'+(state.quoteType===t)+'">'+t+'</button>';}).join('')+'</div><div class="field"><label for="quote-name">Como podemos chamar você? (nome fictício)</label><input id="quote-name" value="'+escapeHTML(state.quoteName)+'" placeholder="Seu nome" maxlength="80"></div>';
 if(state.quoteStep===1)body='<h3>O que precisa funcionar melhor?</h3><p>Uma frase simples já ajuda a organizar a ideia.</p><div class="field" style="margin-top:22px"><label for="quote-need">Sua necessidade</label><textarea id="quote-need" rows="4" maxlength="1200" placeholder="Ex.: Quero apresentar meus serviços e facilitar o contato.">'+escapeHTML(state.quoteNeed)+'</textarea></div><div class="field"><label for="quote-timing">Qual é o seu momento?</label><select id="quote-timing">'+['Sem urgência','Nas próximas semanas','Quero avaliar possibilidades'].map(function(t){return '<option'+(state.quoteTiming===t?' selected':'')+'>'+t+'</option>';}).join('')+'</select></div>';
 if(state.quoteStep===2)body='<h3>Seu briefing ganhou forma.</h3><p>Um ponto de partida para uma conversa. O orçamento depende da definição do escopo.</p><div class="quote-summary pavilion-surface" style="margin-top:22px">'+escapeHTML('Nome: '+state.quoteName+'\nSolução: '+state.quoteType+'\nNecessidade: '+state.quoteNeed+'\nMomento: '+state.quoteTiming)+'</div>';
 content.innerHTML=disclaimer('Formulário demonstrativo. As respostas não são enviadas; o resumo pode ser copiado por você.')+'<div class="demo-app quote-layout pavilion-surface"><div class="quote-progress" aria-label="Etapa '+(state.quoteStep+1)+' de 3">'+[0,1,2].map(function(i){return '<span class="'+(i<=state.quoteStep?'active':'')+'"></span>';}).join('')+'</div>'+body+'<p id="quote-error" role="status" style="font-size:12px;margin-top:12px"></p><div class="quote-actions">'+(state.quoteStep?'<button class="secondary-button" data-action="quote-back">← Voltar</button>':'<span></span>')+'<button class="solid-button" data-action="'+(state.quoteStep===2?'copy-quote':'quote-next')+'">'+(state.quoteStep===2?'Copiar briefing':'Continuar')+' <span>↗</span></button></div></div>'+footerCTA();
}
function quoteSave(){if($('#quote-name'))state.quoteName=$('#quote-name').value.trim();if($('#quote-need'))state.quoteNeed=$('#quote-need').value.trim();if($('#quote-timing'))state.quoteTiming=$('#quote-timing').value;}
function renderInstitutional(){
 content.innerHTML=disclaimer('Vista Mar é um restaurante fictício criado para demonstrar um site institucional. Nenhuma reserva real é feita.')+'<div class="demo-app restaurant-demo"><header class="restaurant-demo-header"><strong>Vista Mar</strong><a href="#demo-services" data-action="restaurant-services">Conheça o espaço ↓</a></header><div class="restaurant-demo-hero"><h3>Boa comida.<br>Boas histórias.</h3><p>Um lugar para desacelerar e compartilhar o que faz bem.</p><button data-action="restaurant-book">Simular uma reserva ↗</button></div><div class="restaurant-demo-body pavilion-surface" id="demo-services"><h4>Feito para receber bem.</h4><p>Uma apresentação clara ajuda o visitante a conhecer o negócio e encontrar o próximo passo.</p><div class="demo-metric-grid"><div class="demo-metric pavilion-surface"><span>Gastronomia</span><strong class="metric-word">Artesanal</strong></div><div class="demo-metric pavilion-surface"><span>Ambiente</span><strong class="metric-word">Acolhedor</strong></div><div class="demo-metric pavilion-surface"><span>Encontros</span><strong class="metric-word">Especiais</strong></div></div><details><summary>Posso conhecer o cardápio?</summary><p>Sim. Um site pode apresentar categorias, produtos com fotos e um caminho fácil para pedidos.</p></details><details><summary>Como funciona o contato?</summary><p>Um botão pode abrir o WhatsApp, preparar uma solicitação ou levar a um formulário de reserva.</p></details><div id="restaurant-reservation"></div></div></div>'+footerCTA();
}
content.addEventListener('click',function(e){
 var b=e.target.closest('button,[data-action]');if(!b)return;
 if(b.dataset.openDemo){openDemo(b.dataset.openDemo,lastTrigger);return;}
 if(b.dataset.shopCategory){state.category=b.dataset.shopCategory;renderShop();return;}
 if(b.dataset.add){addProduct(b.dataset.add);return;}
 if(b.dataset.qty){var p=state.cart[b.dataset.qty];if(p){p.quantity=Math.min(20,p.quantity+Number(b.dataset.delta));if(p.quantity<=0)delete state.cart[b.dataset.qty];renderCart();}return;}
 if(b.dataset.remove){delete state.cart[b.dataset.remove];renderCart();return;}
 if(b.dataset.adminTab){state.adminTab=b.dataset.adminTab;renderAdmin();return;}
 if(b.dataset.stock){var product=inventory.find(function(p){return p.id===b.dataset.stock;});if(product){product.stock=Math.max(0,Math.min(999,product.stock+Number(b.dataset.delta)));renderInventory();}return;}
 if(b.dataset.slot){state.slot=b.dataset.slot;renderSlots();return;}
 if(b.dataset.quoteType){quoteSave();state.quoteType=b.dataset.quoteType;renderQuote();return;}
 var action=b.dataset.action;
 if(action==='edit-contact'){closeDialog(true);setContactStep(1,true);}
 if(action==='contact'){closeDialog(true);setContactStep(1,false);setTimeout(function(){$('#contato').scrollIntoView({behavior:reduced?'auto':'smooth'});$('#name').focus({preventScroll:true});},20);}
 if(action==='checkout'){var summary=Object.values(state.cart).map(function(p){return p.quantity+' × '+p.name+(p.size?' ('+p.size+')':'')+' — '+money(p.quantity*p.price);}).join('\n'),total=Object.values(state.cart).reduce(function(s,p){return s+p.quantity*p.price;},0);$('#order-summary').innerHTML='<div class="cart-summary"><strong>✓ Pedido simulado</strong>\n'+escapeHTML(summary)+'\nTotal: '+money(total)+'\n\nNenhuma cobrança ou envio foi realizado.</div>';toast('Pedido de demonstração preparado.');}
 if(action==='reset-stock'){[12,8,5,14,6,9,4,10].forEach(function(v,i){inventory[i].stock=v;});renderInventory();toast('Estoque de demonstração restaurado.');}
 if(action==='run-flow')runFlow();
 if(action==='reset-flow'){clearTimers();renderAutomation();}
 if(action==='quote-next'){quoteSave();if(state.quoteStep===0&&!state.quoteName){$('#quote-error').textContent='Informe um nome fictício para continuar.';$('#quote-name').focus();return;}if(state.quoteStep===1&&!state.quoteNeed){$('#quote-error').textContent='Conte brevemente o que você precisa.';$('#quote-need').focus();return;}state.quoteStep=Math.min(2,state.quoteStep+1);renderQuote();}
 if(action==='quote-back'){quoteSave();state.quoteStep=Math.max(0,state.quoteStep-1);renderQuote();}
 if(action==='copy-quote'){var text='Briefing de projeto\nNome: '+state.quoteName+'\nSolução: '+state.quoteType+'\nNecessidade: '+state.quoteNeed+'\nMomento: '+state.quoteTiming;if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(text).then(function(){toast('Briefing copiado.');}).catch(function(){$('#quote-error').textContent='Você pode selecionar e copiar o resumo acima.';});else $('#quote-error').textContent='Selecione e copie o resumo acima.';}
 if(action==='restaurant-services'){e.preventDefault();$('#demo-services').scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});}
 if(action==='restaurant-book'){$('#restaurant-reservation').innerHTML='<div class="restaurant-reservation pavilion-surface" role="status"><h4>Uma mesa está quase pronta.</h4><p>Em um site real, este passo abriria a reserva ou o contato do restaurante. Aqui você pode experimentar a agenda sem enviar nada.</p><button class="secondary-button" data-open-demo="agenda" style="margin-top:12px">Experimentar agendamento ↗</button></div>';$('#restaurant-reservation').scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest'});}
});
content.addEventListener('change',function(e){if(e.target.dataset.orderStatus!==undefined){orders[Number(e.target.dataset.orderStatus)].status=e.target.value;toast('Status do pedido atualizado na simulação.');}});
function setContactStep(step,focus){
 var first=$('#contact-identify'),second=$('#contact-idea');
 first.hidden=step!==1;first.disabled=step!==1;second.hidden=step!==2;second.disabled=step!==2;
 $('#contact-step-status').innerHTML=(step===1?'Primeiro, vamos nos conhecer.':'Agora, conte sua ideia.')+'<span class="step-total">0'+step+' / 02</span>';
 if(focus)$(step===1?'#name':'#need').focus({preventScroll:true});
}
$('#contact-next').addEventListener('click',function(){
 var name=$('#name'),reply=$('#reply');
 if(!name.value.trim()){name.reportValidity();name.focus();return;}
 if(!reply.value.trim()){reply.reportValidity();reply.focus();return;}
 if(!name.reportValidity()||!reply.reportValidity())return;
 setContactStep(2,true);
});
$('#contact-back').addEventListener('click',function(){setContactStep(1,true);});
$('#contact-form').addEventListener('submit',function(e){
 e.preventDefault();
 var name=$('#name').value.trim(),reply=$('#reply').value.trim(),need=$('#need').value.trim();
 if(!name||!reply||!need){toast('Preencha seu nome, contato e uma breve descrição.');return;}
 var message='Olá, Kaynan! Vi seu portfólio e gostaria de conversar.\n\nNome: '+name+'\nContato: '+reply+'\nMinha ideia: '+need;
 $('#contact-result').textContent='Mensagem preparada para revisão.';
 clearTimers();currentDemo='contact-review';
 content.innerHTML='<div class="case-details"><p class="case-eyebrow">SUA IDEIA COMEÇA AQUI</p><h3>Sua mensagem está pronta.</h3><p class="review-message pavilion-surface">'+escapeHTML(message)+'</p><a class="solid-button send-message" href="https://wa.me/'+whatsapp+'?text='+encodeURIComponent(message)+'" target="_blank" rel="noopener">Revisar e enviar pelo WhatsApp <span>↗</span></a><button class="secondary-button" data-action="edit-contact" style="margin-top:14px">Voltar para editar</button><p style="font-size:11px">Você escolhe quando enviar. Este site não armazena seus dados.</p></div>';
 modalOpen('Revisar mensagem',document.querySelector('#contact-form button[type="submit"]'));
});
var exhibitNav=$('.exhibition-nav');
if(exhibitNav)exhibitNav.addEventListener('keydown',function(e){
 if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;
 var buttons=$$('button[data-exhibit]',exhibitNav),index=buttons.indexOf(document.activeElement);
 if(index<0)return;e.preventDefault();
 var next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
 buttons[next].focus({preventScroll:true});setExhibit(buttons[next].dataset.exhibit,false);
});
/* Evita imagens quebradas em caso de arquivo ausente: o texto do produto continua acessível. */
document.addEventListener('error',function(e){if(e.target.tagName==='IMG'){e.target.style.background='#e5dac8';e.target.style.color='#304b60';}},true);
})();