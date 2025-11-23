// ==================== PRODUTO & HERANÇA ====================

// 7.1 Classes (Métodos e Atributos)
class Produto_base { // Renomeado para usar snake_case e evitar conflito
    constructor(id, nome, preco, imagem) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.imagem = imagem;
    }
}

// 7.3 Uso de Herança: Classe Item_Carrinho herda de Produto
class Item_do_carrinho extends Produto_base { // Renomeado para snake_case
    constructor(produto, quantidade) {
        super(produto.id, produto.nome, produto.preco, produto.imagem);
        this.quantidade = quantidade;
    }

    calcular_subtotal() {
        return this.preco * this.quantidade; // 3.1 Aritméticos
    }
}
// 7.4 Instanciação de Objetos
const lista_de_produtos = [ // Variável renomeada
    new Produto_base(1, "Airpods Pro", 1000, "fone2.png"),
    new Produto_base(2, "Airpods 2ª Geração", 1200, "fone2geração.png"),
    new Produto_base(3, "Airpods Max", 2500, "airpodsmax.png"),
    new Produto_base(4, "Apple Watch", 3000, "apple-watch (1).png"),
    new Produto_base(5, "Ipad", 2500, "ipad (1).png"),
    new Produto_base(6, "MacBook", 8000, "mac.png")
];

// ==================== DOM ====================
const lista_carrinho_html = document.querySelector(".lista_carrinho");
const icone_do_carrinho = document.querySelector(".icon_cart"); // Renomeado
const icone_carrinho_span = document.querySelector(".icon_cart span");
const botao_fechar_carrinho = document.querySelector(".fechar"); // Renomeado
// DOM específico para Index2.html
const resumo_pedido_html = document.querySelector("#resumo_pedido");
const btn_finalizar = document.getElementById("btn_finalizar");

// ==================== CARRINHO ====================
// 4.1 Array
let itens_do_carrinho = []; // Array renomeado

// ------------------ Abrir/Fechar -------------------
function alternar_carrinho(acao = "toggle") {
    const corpo_do_documento = document.body; // Variável renomeada

    // 3.7 / 6.3 Operador Ternário
    acao === "aberto" 
        ? corpo_do_documento.classList.add("show_cart")
        : acao === "fechado" 
            ? corpo_do_documento.classList.remove("show_cart")
            : corpo_do_documento.classList.toggle("show_cart");
}

if (icone_do_carrinho && botao_fechar_carrinho) {
    icone_do_carrinho.addEventListener("click", () => alternar_carrinho());
    botao_fechar_carrinho.addEventListener("click", () => alternar_carrinho("fechado"));
}

// ------------------ Adicionar -------------------
document.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("add_carrinho")) {
        const cartao_do_produto = evento.target.closest(".produto"); // Variável renomeada
        const id_do_produto = cartao_do_produto.dataset.id; // Variável renomeada

        adicionar_ao_carrinho(id_do_produto);
        alternar_carrinho("aberto");
    }
});

function adicionar_ao_carrinho(id_produto) {
    // 8.1 Funções com passagem de parâmetros
    const indice = itens_do_carrinho.findIndex(item => item.id_do_produto == id_produto); // Array e propriedade renomeados

    if (indice < 0) {
        // 9.5 Inserção
        itens_do_carrinho.push({ id_do_produto: id_produto, quantidade: 1 }); // Array e propriedades renomeados
    } else {
        // 3.5 Incremento
        itens_do_carrinho[indice].quantidade++; // Array e propriedade renomeados
    }

    salvar_carrinho();
    if (lista_carrinho_html) renderizar_carrinho();
}

// ------------------ LocalStorage -------------------
// 9.1 Local Storage
function salvar_carrinho() {
    localStorage.setItem("carrinho_de_compras", JSON.stringify(itens_do_carrinho)); // Chave e array renomeados
}

// ------------------ Renderizar Carrinho Lateral (Index.html) -------------------
function renderizar_carrinho() {
    if (!lista_carrinho_html) return; // Evita erro se não estiver na Index.html
    
    lista_carrinho_html.innerHTML = "";
    let total_de_itens = 0; // Variável renomeada

    // 5.1 For (Alternativa para calcular total_itens e satisfazer o requisito)
    for (let i = 0; i < itens_do_carrinho.length; i++) {
        total_de_itens += itens_do_carrinho[i].quantidade; // Array e propriedade renomeados
    }
    
    // 5.2 Foreach
    itens_do_carrinho.forEach(item => { // Array renomeado
        const produto_base = lista_de_produtos.find(p => p.id == item.id_do_produto); // Array e propriedade renomeados
        const item_completo = new Item_do_carrinho(produto_base, item.quantidade); // Classe e propriedade renomeados

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

    if (icone_carrinho_span) icone_carrinho_span.textContent = total_de_itens; // Variável renomeada
}

// ------------------ Renderizar Resumo do Pedido (Index2.html) -------------------
function renderizar_resumo_pedido() {
    if (!resumo_pedido_html) return; // Só executa se o elemento existir
    
    resumo_pedido_html.innerHTML = "";
    let total_da_compra = 0; // Variável renomeada

    if (itens_do_carrinho.length === 0) { // Array renomeado
        resumo_pedido_html.innerHTML = "<p style='text-align: center; margin: 20px 0;'>Seu carrinho está vazio. Volte para a loja para adicionar produtos.</p>";
        return;
    }

    itens_do_carrinho.forEach(item => { // Array renomeado
        const produto_base = lista_de_produtos.find(p => p.id == item.id_do_produto); // Array e propriedade renomeados
        const item_completo = new Item_do_carrinho(produto_base, item.quantidade); // Classe e propriedade renomeados
        const subtotal = item_completo.calcular_subtotal();
        total_da_compra += subtotal; // Variável renomeada

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
            Total do Pedido: R$${total_da_compra.toFixed(2)}
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
    const indice = itens_do_carrinho.findIndex(item => item.id_do_produto == id); // Array e propriedade renomeados

    if (indice < 0) return; // 6.1 If_Else

    // 6.2 Switch: Usado para controlar a atualização de quantidade
    switch (tipo) {
        case "plus":
            // 9.3 Atualização
            itens_do_carrinho[indice].quantidade++; // 3.5 Incremento, Array e propriedade renomeados
            break;
        case "minus":
            itens_do_carrinho[indice].quantidade--; // 3.5 Decremento, Array e propriedade renomeados
            
            // 9.4 Deleção
            if (itens_do_carrinho[indice].quantidade <= 0) itens_do_carrinho.splice(indice, 1); // 3.4 Comparação, Array e propriedade renomeados
            break;
    }

    salvar_carrinho();
    if (lista_carrinho_html) renderizar_carrinho();
}

// ------------------ Carregar carrinho e renderizar na página correta -------------------
if (localStorage.getItem("carrinho_de_compras")) { // Chave renomeada
    itens_do_carrinho = JSON.parse(localStorage.getItem("carrinho_de_compras")); // Array e chave renomeados
}

// Renderiza o carrinho lateral (Index.html)
if (lista_carrinho_html) {
    renderizar_carrinho();
}

// Renderiza o resumo do pedido (Index2.html)
if (resumo_pedido_html) {
    renderizar_resumo_pedido();
}

//// addEventListener espera uma função (callback) como segundo argumento. Se você passar algo como alert("..."), o alert é executado imediatamente e seu retorno (undefined) é registrado — não o comportamento desejado. Para que a mensagem apareça apenas quando o botão for clicado, passe uma função de callback anônima que chama alert quando executada.

//Botao Finalizar Compra - Index2.html



// Exemplo: Loop para validar carrinho antes de finalizar
if (btn_finalizar) {
    btn_finalizar.addEventListener("click", () => {
        let indice = 0;
        
        // 5.3 While: Validar que todos os itens têm quantidade > 0
        while (indice < itens_do_carrinho.length) {
            if (itens_do_carrinho[indice].quantidade <= 0) {
                itens_do_carrinho.splice(indice, 1);
            } else {
                indice++;
            }
        }
        
        if (itens_do_carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }
        
        alert("Compra finalizada com sucesso! Um e-mail de confirmação foi enviado para você."); 
        localStorage.removeItem("carrinho_de_compras");
        window.location.href = "Index.html";
    });
}