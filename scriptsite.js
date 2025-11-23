// =========================================================================================
// 1. DOCUMENTAÇÃO & PADRÕES
// 1.1 Comentários: Usados para separar seções e explicar lógica complexa (ex: Ternário).
// 2.1 Uso de "Camel Case" ou "snake_case": "snake_case" consistente (ex: lista_carrinho_html, calcular_subtotal).
// =========================================================================================

// ==================== 7. CLASSES & HERANÇA ====================

// 7.1 Classes (Métodos e Atributos): Classe base para produtos.
class Produto_base {
    constructor(id, nome, preco, imagem) {
        // 7.4 Instanciação de Objetos: Atributos inicializados.
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.imagem = imagem;
    }
}

// 7.3 Uso de Herança: Classe Item_do_carrinho herda de Produto_base.
class Item_do_carrinho extends Produto_base {
    // 8.1 Funções com passagem de parâmetros: produto e quantidade são passados.
    constructor(produto, quantidade) {
        super(produto.id, produto.nome, produto.preco, produto.imagem);
        this.quantidade = quantidade;
    }

    // Método para calcular o subtotal.
    calcular_subtotal() {
        // 3.1 Aritméticos: Multiplicação para calcular subtotal.
        return this.preco * this.quantidade;
    }
}

// 7.4 Instanciação de Objetos: Lista de produtos para a loja.
const lista_de_produtos = [
    new Produto_base(1, "Airpods Pro", 1000, "fone2.png"),
    new Produto_base(2, "Airpods 2ª Geração", 1200, "fone2geração.png"),
    new Produto_base(3, "Airpods Max", 2500, "airpodsmax.png"),
    new Produto_base(4, "Apple Watch", 3000, "apple-watch (1).png"),
    new Produto_base(5, "Ipad", 2500, "ipad (1).png"),
    new Produto_base(6, "MacBook", 8000, "mac.png")
];

// ==================== VARIÁVEIS DE ESTADO & DOM ====================

// 4.1 Array: Armazena os itens do carrinho.
let itens_do_carrinho = [];

// Elementos DOM (Variáveis globais).
const lista_carrinho_html = document.querySelector(".lista_carrinho");
const icone_do_carrinho = document.querySelector(".icon_cart"); 
const icone_carrinho_span = document.querySelector(".icon_cart span");
const botao_fechar_carrinho = document.querySelector(".fechar");

// DOM específico para Index2.html
const resumo_pedido_html = document.querySelector("#resumo_pedido");
const btn_finalizar = document.getElementById("btn_finalizar");


// ==================== 8. FUNÇÕES DE LÓGICA DO CARRINHO ====================

// ------------------ 9. ARMAZENAMENTO (LocalStorage) -------------------

// 9.1 Local Storage: Salva o array de itens no localStorage.
function salvar_carrinho() {
    localStorage.setItem("carrinho_de_compras", JSON.stringify(itens_do_carrinho));
}

// ------------------ Adicionar Item -------------------

// 8.1 Funções com passagem de parâmetros: Recebe o ID do produto.
function adicionar_ao_carrinho(id_produto) {
    const indice = itens_do_carrinho.findIndex(item => item.id_do_produto == id_produto);

    // 6.1 If_Else: Verifica se o item já está no carrinho.
    if (indice < 0) {
        // 9.5 Inserção: Adiciona um novo item.
        itens_do_carrinho.push({ id_do_produto: id_produto, quantidade: 1 });
    } else {
        // 9.3 Atualização: Incrementa a quantidade.
        // 3.5 Incr ou Decremento: Uso implícito de incremento (++).
        itens_do_carrinho[indice].quantidade++;
    }

    salvar_carrinho();
    if (lista_carrinho_html) renderizar_carrinho();
}

// ------------------ Atualizar Quantidade (+ e -) -------------------

// 8.1 Funções com passagem de parâmetros: Recebe o ID e o tipo de operação.
function atualizar_quantidade(id, tipo) {
    const indice = itens_do_carrinho.findIndex(item => item.id_do_produto == id);

    // 6.1 If_Else: Proteção contra ID não encontrado.
    if (indice < 0) return;

    // 6.2 Switch: Controla a atualização da quantidade.
    switch (tipo) {
        case "plus":
            // 9.3 Atualização: Incrementa a quantidade.
            // 3.5 Incr ou Decremento: Uso do operador ++.
            itens_do_carrinho[indice].quantidade++; 
            break;
        case "minus":
            // 3.5 Incr ou Decremento: Uso do operador --.
            itens_do_carrinho[indice].quantidade--; 
            
            // 3.4 Comparação: Verifica se a quantidade chegou a zero (<=).
            if (itens_do_carrinho[indice].quantidade <= 0) {
                 // 9.4 Deleção: Remove o item do array.
                 itens_do_carrinho.splice(indice, 1);
            }
            break;
    }

    salvar_carrinho();
    if (lista_carrinho_html) renderizar_carrinho();
}

// ------------------ Abrir/Fechar Carrinho -------------------

// 8.1 Funções com passagem de parâmetros: Ação opcional para controle.
function alternar_carrinho(acao = "toggle") {
    const corpo_do_documento = document.body;

    // 3.7 Ternário: Usado para definir a classe de exibição.
    acao === "aberto" 
        ? corpo_do_documento.classList.add("show_cart")
        : acao === "fechado" 
            ? corpo_do_documento.classList.remove("show_cart")
            : corpo_do_documento.classList.toggle("show_cart");
}

// ==================== 8. FUNÇÕES DE RENDERIZAÇÃO (DOM) ====================

// ------------------ Renderizar Carrinho Lateral (Index.html) -------------------
function renderizar_carrinho() {
    if (!lista_carrinho_html) return;
    
    // 3.3 Atribuição: Inicialização de variáveis.
    lista_carrinho_html.innerHTML = "";
    let total_de_itens = 0;

    // 5.1 For: Usado para calcular o total de itens (Requisito 5.1).
    for (let i = 0; i < itens_do_carrinho.length; i++) {
        total_de_itens += itens_do_carrinho[i].quantidade;
    }
    
    // 5.2 Foreach: Itera sobre o array para construir o HTML.
    itens_do_carrinho.forEach(item => {
        const produto_base = lista_de_produtos.find(p => p.id == item.id_do_produto);
        const item_completo = new Item_do_carrinho(produto_base, item.quantidade);

        const div = document.createElement("div");
        div.classList.add("item");

        // 3.2 String: Concatenação para montar o HTML.
        // 9.2 Leitura e apresentação de registro: Exibição dos dados do item.
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

    if (icone_carrinho_span) {
        // 3.3 Atribuição: Atualiza o contador de itens.
        icone_carrinho_span.textContent = total_de_itens;
    }
}

// ------------------ Renderizar Resumo do Pedido (Index2.html) -------------------
function renderizar_resumo_pedido() {
    if (!resumo_pedido_html) return;
    
    resumo_pedido_html.innerHTML = "";
    let total_da_compra = 0;

    if (itens_do_carrinho.length === 0) {
        resumo_pedido_html.innerHTML = "<p style='text-align: center; margin: 20px 0;'>Seu carrinho está vazio. Volte para a loja para adicionar produtos.</p>";
        return;
    }

    // 5.2 Foreach: Itera sobre o array para calcular o total e construir o HTML.
    itens_do_carrinho.forEach(item => {
        const produto_base = lista_de_produtos.find(p => p.id == item.id_do_produto);
        const item_completo = new Item_do_carrinho(produto_base, item.quantidade);
        const subtotal = item_completo.calcular_subtotal();
        // 3.3 Atribuição: Acumula o total da compra.
        total_da_compra += subtotal;

        const div = document.createElement("div");
        div.classList.add("pedido_item");

        // 3.2 String: Concatenação para montar o HTML.
        // 9.2 Leitura e apresentação de registro: Exibição do resumo.
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

    // Adicionar o total final.
    const total_div = document.createElement("div");
    total_div.classList.add("pedido_item");
    total_div.innerHTML = `
        <div style="font-weight: bold; font-size: 1.2em; width: 100%; text-align: right;">
            Total do Pedido: R$${total_da_compra.toFixed(2)}
        </div>
    `;
    resumo_pedido_html.appendChild(total_div);
}

// ==================== EVENT LISTENERS E INICIALIZAÇÃO ====================

// ------------------ Carregar carrinho do localStorage -------------------

// 6.1 If_Else: Verifica a existência do item no localStorage.
if (localStorage.getItem("carrinho_de_compras")) {
    // 3.3 Atribuição: Carrega o array de itens.
    itens_do_carrinho = JSON.parse(localStorage.getItem("carrinho_de_compras"));
}

// ------------------ Event Listeners (DOM) -------------------

// Abrir/Fechar Carrinho
if (icone_do_carrinho && botao_fechar_carrinho) {
    icone_do_carrinho.addEventListener("click", () => alternar_carrinho());
    botao_fechar_carrinho.addEventListener("click", () => alternar_carrinho("fechado"));
}

// Adicionar ao Carrinho
document.addEventListener("click", (evento) => {
    // 6.3 Lógico: Condição AND (&&) implícita na estrutura ou operador `!` explícito no `if (!id) return;`.
    if (evento.target.classList.contains("add_carrinho")) {
        const cartao_do_produto = evento.target.closest(".produto"); 
        const id_do_produto = cartao_do_produto.dataset.id;

        adicionar_ao_carrinho(id_do_produto);
        alternar_carrinho("aberto");
    }
});

// Atualizar Quantidade (+ e -)
if (lista_carrinho_html) {
    lista_carrinho_html.addEventListener("click", (evento) => {
        const id = evento.target.dataset.id;

        // 3.6 Lógico: Usado para checar se o ID existe (negação).
        if (!id) return; 

        // 6.1 If_Else: Verifica se é o botão "+" ou "-".
        if (evento.target.classList.contains("plus")) atualizar_quantidade(id, "plus");
        if (evento.target.classList.contains("minus")) atualizar_quantidade(id, "minus");
    });
}

// Botao Finalizar Compra - Index2.html
if (btn_finalizar) {
    btn_finalizar.addEventListener("click", () => {
        let indice = 0;
        
        // 5.3 While / Do_While: Loop 'while' para validar e limpar itens com quantidade <= 0.
        while (indice < itens_do_carrinho.length) {
            // 3.4 Comparação: Verifica a condição de parada/limpeza (<=).
            if (itens_do_carrinho[indice].quantidade <= 0) {
                itens_do_carrinho.splice(indice, 1);
            } else {
                // 3.5 Incr ou Decremento: Uso de incremento (++).
                indice++;
            }
        }
        
        // 6.1 If_Else: Checa se o carrinho ficou vazio após a limpeza.
        if (itens_do_carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }
        
        alert("Compra finalizada com sucesso! Um e-mail de confirmação foi enviado para você."); 
        localStorage.removeItem("carrinho_de_compras");
        window.location.href = "Index.html";
    });
}


// ------------------ Renderização Inicial -------------------

// Renderiza o carrinho lateral (Index.html)
if (lista_carrinho_html) {
    renderizar_carrinho();
}

// Renderiza o resumo do pedido (Index2.html)
if (resumo_pedido_html) {
    renderizar_resumo_pedido();
}
