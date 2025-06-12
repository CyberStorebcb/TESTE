document.addEventListener('DOMContentLoaded', function() {
    renderClientes();
    const busca = document.getElementById('buscaCliente');
    if (busca) {
        busca.addEventListener('keyup', function() {
            const termo = busca.value.toLowerCase();
            document.querySelectorAll('#clientes-tbody tr').forEach(tr => {
                tr.style.display = Array.from(tr.children).some(td =>
                    td.textContent.toLowerCase().includes(termo)
                ) ? '' : 'none';
            });
        });
    }
});

const clientesPadrao = [
    {id: '001', nome: 'Maria Silva', email: 'maria@email.com', telefone: '(11) 99999-9999'},
    {id: '002', nome: 'João Souza', email: 'joao@email.com', telefone: '(11) 98888-8888'}
];

function getClientes() {
    return JSON.parse(localStorage.getItem('clientes')) || clientesPadrao;
}
function setClientes(clientes) {
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

function renderClientes() {
    const tbody = document.getElementById('clientes-tbody');
    if (!tbody) return;
    const clientes = getClientes();
    tbody.innerHTML = '';
    clientes.forEach((c, i) => {
        tbody.innerHTML += `
            <tr>
                <td data-label="ID">${c.id}</td>
                <td data-label="Nome">${c.nome}</td>
                <td data-label="E-mail">${c.email}</td>
                <td data-label="Telefone">${c.telefone}</td>
                <td data-label="Ações">
                    <a href="#" title="Editar" onclick="editarCliente(${i});return false;">✏️</a>
                    <a href="#" title="Excluir" onclick="excluirCliente(${i});return false;" style="color:#e74c3c;">🗑️</a>
                </td>
            </tr>
        `;
    });
}

window.editarCliente = function(idx) {
    const clientes = getClientes();
    document.getElementById('edit-id').value = idx;
    document.getElementById('edit-nome').value = clientes[idx].nome;
    document.getElementById('edit-email').value = clientes[idx].email;
    document.getElementById('edit-telefone').value = clientes[idx].telefone;
    document.getElementById('form-editar').style.display = 'block';
}

window.salvarEdicao = function() {
    const idx = document.getElementById('edit-id').value;
    const clientes = getClientes();
    clientes[idx].nome = document.getElementById('edit-nome').value;
    clientes[idx].email = document.getElementById('edit-email').value;
    clientes[idx].telefone = document.getElementById('edit-telefone').value;
    setClientes(clientes);
    document.getElementById('form-editar').style.display = 'none';
    renderClientes();
}

window.cancelarEdicao = function() {
    document.getElementById('form-editar').style.display = 'none';
}

window.excluirCliente = function(idx) {
    if (confirm('Deseja excluir este cliente?')) {
        const clientes = getClientes();
        clientes.splice(idx, 1);
        setClientes(clientes);
        renderClientes();
    }
}

// --- PEDIDOS DINÂMICOS ---

const pedidosPadrao = [
    {
        id: '1001',
        data: '10/06/2025',
        cliente: 'Maria Silva',
        itens: '2 Camisetas, 1 Calça',
        valor: 'R$ 250,00',
        status: 'andamento',
        via: 'Site',
        pagamento: 'Cartão de Crédito'
    },
    {
        id: '1002',
        data: '11/06/2025',
        cliente: 'João Souza',
        itens: '1 Boné',
        valor: 'R$ 50,00',
        status: 'concluido',
        via: 'Site',
        pagamento: 'PayPal'
    }
];

function getPedidos() {
    return JSON.parse(localStorage.getItem('pedidos')) || pedidosPadrao;
}
function setPedidos(pedidos) {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

function renderPedidos() {
    const tbody = document.getElementById('pedidos-tbody');
    if (!tbody) return;
    const pedidos = getPedidos();
    tbody.innerHTML = '';
    pedidos.forEach((p, i) => {
        tbody.innerHTML += `
            <tr>
                <td data-label="ID do Pedido">${p.id}</td>
                <td data-label="Data">${p.data}</td>
                <td data-label="Cliente">${p.cliente}</td>
                <td data-label="Itens">${p.itens}</td>
                <td data-label="Valor Total">${p.valor}</td>
                <td data-label="Status"><span class="status ${p.status}">${statusLabel(p.status)}</span></td>
                <td data-label="VIA">${p.via}</td>
                <td data-label="Forma de Pagamento">${p.pagamento}</td>
                <td data-label="Ações">
                    <a href="#" title="Editar" onclick="editarPedido(${i});return false;">✏️</a>
                    <a href="#" title="Excluir" onclick="excluirPedido(${i});return false;" style="color:#e74c3c;">🗑️</a>
                </td>
            </tr>
        `;
    });
}

function statusLabel(status) {
    if (status === 'andamento') return 'Em andamento';
    if (status === 'concluido') return 'Concluído';
    if (status === 'pendente') return 'Pendente';
    return status;
}

window.editarPedido = function(idx) {
    const pedidos = getPedidos();
    const p = pedidos[idx];
    document.getElementById('edit-pedido-id').value = idx;
    document.getElementById('edit-pedido-data').value = p.data;
    document.getElementById('edit-pedido-cliente').value = p.cliente;
    document.getElementById('edit-pedido-itens').value = p.itens;
    document.getElementById('edit-pedido-valor').value = p.valor;
    document.getElementById('edit-pedido-status').value = p.status;
    document.getElementById('edit-pedido-via').value = p.via;
    document.getElementById('edit-pedido-pagamento').value = p.pagamento;
    document.getElementById('form-editar-pedido').style.display = 'block';
}

window.salvarEdicaoPedido = function() {
    const idx = document.getElementById('edit-pedido-id').value;
    const pedidos = getPedidos();
    pedidos[idx].data = document.getElementById('edit-pedido-data').value;
    pedidos[idx].cliente = document.getElementById('edit-pedido-cliente').value;
    pedidos[idx].itens = document.getElementById('edit-pedido-itens').value;
    pedidos[idx].valor = document.getElementById('edit-pedido-valor').value;
    pedidos[idx].status = document.getElementById('edit-pedido-status').value;
    pedidos[idx].via = document.getElementById('edit-pedido-via').value;
    pedidos[idx].pagamento = document.getElementById('edit-pedido-pagamento').value;
    setPedidos(pedidos);
    document.getElementById('form-editar-pedido').style.display = 'none';
    renderPedidos();
}

window.cancelarEdicaoPedido = function() {
    document.getElementById('form-editar-pedido').style.display = 'none';
}

window.excluirPedido = function(idx) {
    if (confirm('Deseja excluir este pedido?')) {
        const pedidos = getPedidos();
        pedidos.splice(idx, 1);
        setPedidos(pedidos);
        renderPedidos();
    }
}

// --- PRODUTOS DINÂMICOS ---

const produtosPadrao = [
    {
        sku: 'BLS-PRT-V-G',
        nome: 'Bolsa Grande',
        categoria: 'Acessórios',
        preco: 'R$ 150,00',
        estoque: 12
    },
    {
        sku: 'CAM-BR-PP',
        nome: 'Camiseta Branca P',
        categoria: 'Roupas',
        preco: 'R$ 49,90',
        estoque: 20
    }
];

function getProdutos() {
    return JSON.parse(localStorage.getItem('produtos')) || produtosPadrao;
}
function setProdutos(produtos) {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

function renderProdutos() {
    const tbody = document.getElementById('produtos-tbody');
    if (!tbody) return;
    const produtos = getProdutos();
    tbody.innerHTML = '';
    produtos.forEach((p, i) => {
        tbody.innerHTML += `
            <tr>
                <td data-label="SKU">${p.sku}</td>
                <td data-label="Nome">${p.nome}</td>
                <td data-label="Categoria">${p.categoria}</td>
                <td data-label="Preço">${p.preco}</td>
                <td data-label="Estoque">${p.estoque}</td>
                <td data-label="Ações">
                    <a href="#" title="Editar" onclick="editarProduto(${i});return false;">✏️</a>
                    <a href="#" title="Excluir" onclick="excluirProduto(${i});return false;" style="color:#e74c3c;">🗑️</a>
                </td>
            </tr>
        `;
    });
}

window.editarProduto = function(idx) {
    const produtos = getProdutos();
    const p = produtos[idx];
    document.getElementById('edit-produto-id').value = idx;
    document.getElementById('edit-produto-sku').value = p.sku;
    document.getElementById('edit-produto-nome').value = p.nome;
    document.getElementById('edit-produto-categoria').value = p.categoria;
    document.getElementById('edit-produto-preco').value = p.preco;
    document.getElementById('edit-produto-estoque').value = p.estoque;
    document.getElementById('form-editar-produto').style.display = 'block';
}

window.salvarEdicaoProduto = function() {
    const idx = document.getElementById('edit-produto-id').value;
    const produtos = getProdutos();
    produtos[idx].sku = document.getElementById('edit-produto-sku').value;
    produtos[idx].nome = document.getElementById('edit-produto-nome').value;
    produtos[idx].categoria = document.getElementById('edit-produto-categoria').value;
    produtos[idx].preco = document.getElementById('edit-produto-preco').value;
    produtos[idx].estoque = document.getElementById('edit-produto-estoque').value;
    setProdutos(produtos);
    document.getElementById('form-editar-produto').style.display = 'none';
    renderProdutos();
}

window.cancelarEdicaoProduto = function() {
    document.getElementById('form-editar-produto').style.display = 'none';
}

window.excluirProduto = function(idx) {
    if (confirm('Deseja excluir este produto?')) {
        const produtos = getProdutos();
        produtos.splice(idx, 1);
        setProdutos(produtos);
        renderProdutos();
    }
}

// Chame renderProdutos() na página de Produtos
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('produtos-tbody')) renderProdutos();
});