// ==================== PRODUTO & HERANÇA ====================

// 7.1 Classes (Métodos e Atributos)
class Produto {
    constructor(id, nome, preco, imagem) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.imagem = imagem;
    }
}

// 7.3 Uso de Herança: Classe Item_Carrinho herda de Produto
class Item_Carrinho extends Produto {
    constructor(produto, quantidade) {
        super(produto.id, produto.nome, produto.preco, produto.imagem);
        this.quantidade = quantidade;
    }

    calcular_subtotal() {
        return this.preco * this.quantidade; // 3.1 Aritméticos
    }
}
// 7.4 Instanciação de Objetos
const produtos = [
    new Produto(1, "Airpods Pro", 1000, "fone2.png"),
    new Produto(2, "Airpods 2ª Geração", 1200, "fone2geração.png"),
    new Produto(3, "Airpods Max", 2500, "airpodsmax.png")
];

// ==================== DOM ====================
const lista_carrinho_html = document.querySelector(".lista_carrinho");
const icone_carrinho = document.querySelector(".icon_cart");
const icone_carrinho_span = document.querySelector(".icon_cart span");
const fechar_carrinho = document.querySelector(".fechar");
// DOM específico para Index2.html
const resumo_pedido_html = document.querySelector("#resumo_pedido");

// ==================== CARRINHO ====================
// 4.1 Array
let carrinho = [];

// ------------------ Abrir/Fechar -------------------
function alternar_carrinho(acao = "toggle") {
    const corpo = document.body;

    // 3.7 / 6.3 Operador Ternário
    acao === "aberto" 
        ? corpo.classList.add("show_cart")
        : acao === "fechado" 
            ? corpo.classList.remove("show_cart")
            : corpo.classList.toggle("show_cart");
}

if (icone_carrinho && fechar_carrinho) {
    icone_carrinho.addEventListener("click", () => alternar_carrinho());
    fechar_carrinho.addEventListener("click", () => alternar_carrinho("fechado"));
}

// ------------------ Adicionar -------------------
document.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("add_carrinho")) {
        const cartao = evento.target.closest(".produto");
        const id_produto = cartao.dataset.id;

        adicionar_ao_carrinho(id_produto);
        alternar_carrinho("aberto");
    }
});

function adicionar_ao_carrinho(id_produto) {
    // 8.1 Funções com passagem de parâmetros
    const indice = carrinho.findIndex(item => item.product_id == id_produto);

    if (indice < 0) {
        // 9.5 Inserção
        carrinho.push({ product_id: id_produto, quantity: 1 });
    } else {
        // 3.5 Incremento
        carrinho[indice].quantity++;
    }

    salvar_carrinho();
    if (lista_carrinho_html) renderizar_carrinho();
}

// ------------------ LocalStorage -------------------
// 9.1 Local Storage
function salvar_carrinho() {
    localStorage.setItem("cart", JSON.stringify(carrinho));
}

// ------------------ Renderizar Carrinho Lateral (Index.html) -------------------
function renderizar_carrinho() {
    if (!lista_carrinho_html) return; // Evita erro se não estiver na Index.html
    
    lista_carrinho_html.innerHTML = "";
    let total_itens = 0;

    // 5.1 For (Alternativa para calcular total_itens e satisfazer o requisito)
    for (let i = 0; i < carrinho.length; i++) {
        total_itens += carrinho[i].quantity;
    }
    
    // 5.2 Foreach
    carrinho.forEach(item => {
        const produto_base = produtos.find(p => p.id == item.product_id);
        const item_completo = new Item_Carrinho(produto_base, item.quantity);

        const div = document.createElement("div");
        div.classList.add("item");

        // 3.2 String (Concatenação)
        // 9.2 Leitura e apresentação de registro
        div.innerHTML = `
            <div class="image"><img src="${item_completo.imagem}"></div>
            <div class="name">${item_completo.nome}</div>
            <div class="price">R$${(item_completo.calcular_subtotal()).toFixed(2)}</div>
            <div class="quantity">
                <span class="minus" data-id="${item_completo.id}"><</span>
                <span>${item_completo.quantidade}</span>
                <span class="plus" data-id="${item_completo.id}">></span>
            </div>
        `;

        lista_carrinho_html.appendChild(div);
    });

    if (icone_carrinho_span) icone_carrinho_span.textContent = total_itens;
}

// ------------------ Renderizar Resumo do Pedido (Index2.html) -------------------
function renderizar_resumo_pedido() {
    if (!resumo_pedido_html) return; // Só executa se o elemento existir
    
    resumo_pedido_html.innerHTML = "";
    let total_compra = 0;

    if (carrinho.length === 0) {
        resumo_pedido_html.innerHTML = "<p style='text-align: center; margin: 20px 0;'>Seu carrinho está vazio. Volte para a loja para adicionar produtos.</p>";
        return;
    }

    carrinho.forEach(item => {
        const produto_base = produtos.find(p => p.id == item.product_id);
        const item_completo = new Item_Carrinho(produto_base, item.quantity);
        const subtotal = item_completo.calcular_subtotal();
        total_compra += subtotal;

        // Estrutura HTML baseada em style.css (.pedido_item)
        const div = document.createElement("div");
        div.classList.add("pedido_item");

        div.innerHTML = `
            <img src="${item_completo.imagem}" alt="${item_completo.nome}">
            <div>
                <h4>${item_completo.nome}</h4>
                <p>Quantidade: ${item_completo.quantidade}</p>
                <p>Subtotal: R$${subtotal.toFixed(2)}</p>
            </div>
        `;

        resumo_pedido_html.appendChild(div);
    });

    // Adicionar o total final
    const total_div = document.createElement("div");
    total_div.classList.add("pedido_item");
    total_div.innerHTML = `
        <div style="font-weight: bold; font-size: 1.2em; width: 100%; text-align: right;">
            Total do Pedido: R$${total_compra.toFixed(2)}
        </div>
    `;
    resumo_pedido_html.appendChild(total_div);
}

// ------------------ + e - -------------------
if (lista_carrinho_html) {
    lista_carrinho_html.addEventListener("click", (evento) => {
        const id = evento.target.dataset.id;

        if (!id) return; // 3.6 Lógico

        if (evento.target.classList.contains("plus")) atualizar_quantidade(id, "plus");
        if (evento.target.classList.contains("minus")) atualizar_quantidade(id, "minus");
    });
}


function atualizar_quantidade(id, tipo) {
    const indice = carrinho.findIndex(item => item.product_id == id);

    if (indice < 0) return; // 6.1 If_Else

    // 6.2 Switch: Usado para controlar a atualização de quantidade
    switch (tipo) {
        case "plus":
            // 9.3 Atualização
            carrinho[indice].quantity++; // 3.5 Incremento
            break;
        case "minus":
            carrinho[indice].quantity--; // 3.5 Decremento
            
            // 9.4 Deleção
            if (carrinho[indice].quantity <= 0) carrinho.splice(indice, 1); // 3.4 Comparação
            break;
    }

    salvar_carrinho();
    if (lista_carrinho_html) renderizar_carrinho();
}

// ------------------ Carregar carrinho e renderizar na página correta -------------------
if (localStorage.getItem("cart")) {
    carrinho = JSON.parse(localStorage.getItem("cart"));
}

// Renderiza o carrinho lateral (Index.html)
if (lista_carrinho_html) {
    renderizar_carrinho();
}

// Renderiza o resumo do pedido (Index2.html)
if (resumo_pedido_html) {
    renderizar_resumo_pedido();
}