// ===================== CLIENTES =====================

// Dados iniciais
const clientesPadrao = []; // Agora começa vazio

// Utilitários
function getClientes() {
    return JSON.parse(localStorage.getItem('clientes')) || clientesPadrao;
}
function setClientes(clientes) {
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

// Renderização
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

// Edição
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

// Adicionar novo cliente
window.adicionarCliente = function() {
    const clientes = getClientes();
    const novo = {
        id: (clientes.length + 1).toString().padStart(3, '0'),
        nome: prompt('Nome do cliente:'),
        email: prompt('E-mail:'),
        telefone: prompt('Telefone:')
    };
    if (novo.nome && novo.email && novo.telefone) {
        clientes.push(novo);
        setClientes(clientes);
        renderClientes();
    }
}

// Busca dinâmica
function setupBuscaClientes() {
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
}

// ===================== PEDIDOS =====================

// Agora começa vazio para cadastro manual
const pedidosPadrao = [];

// Utilitários
function getPedidos() {
    return JSON.parse(localStorage.getItem('pedidos')) || pedidosPadrao;
}
function setPedidos(pedidos) {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// Renderização
function renderPedidos() {
    const tbody = document.getElementById('pedidos-tbody');
    if (!tbody) return;
    const pedidos = getPedidos();
    tbody.innerHTML = '';
    pedidos.forEach((p, i) => {
        tbody.innerHTML += `
            <tr>
                <td data-label="Data">${p.data || ''}</td>
                <td data-label="Cliente">${p.cliente || ''}</td>
                <td data-label="Item">${p.itens || ''}</td>
                <td data-label="Valor Total">${p.valor || ''}</td>
                <td data-label="Status"><span class="status ${p.status || ''}">${statusLabel(p.status)}</span></td>
                <td data-label="Endereço">${p.endereco || ''}</td>
                <td data-label="Forma de Pagamento">${p.pagamento || ''}</td>
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
    return status || '';
}

window.editarPedido = function(idx) {
    const pedidos = getPedidos();
    const p = pedidos[idx];
    document.getElementById('edit-pedido-id').value = idx;
    document.getElementById('edit-pedido-data').value = p.data || '';
    document.getElementById('edit-pedido-cliente').value = p.cliente || '';
    document.getElementById('edit-pedido-itens').value = p.itens || '';
    document.getElementById('edit-pedido-valor').value = p.valor || '';
    document.getElementById('edit-pedido-status').value = p.status || '';
    document.getElementById('edit-pedido-via').value = p.endereco || '';
    document.getElementById('edit-pedido-pagamento').value = p.pagamento || '';
    document.getElementById('form-editar-pedido').style.display = 'block';
}

window.salvarEdicaoPedido = function() {
    const idx = document.getElementById('edit-pedido-id').value;
    const pedidos = getPedidos();
    pedidos[idx] = {
        data: document.getElementById('edit-pedido-data').value,
        cliente: document.getElementById('edit-pedido-cliente').value,
        itens: document.getElementById('edit-pedido-itens').value,
        valor: document.getElementById('edit-pedido-valor').value,
        status: document.getElementById('edit-pedido-status').value,
        endereco: document.getElementById('edit-pedido-via').value,
        pagamento: document.getElementById('edit-pedido-pagamento').value
    };
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

// Adicionar novo pedido
window.adicionarPedido = function() {
    const pedidos = getPedidos();
    const novo = {
        data: prompt('Data:'),
        cliente: prompt('Cliente:'),
        itens: prompt('Item:'),
        valor: prompt('Valor Total:'),
        status: prompt('Status (andamento/concluido/pendente):'),
        endereco: prompt('Endereço:'),
        pagamento: prompt('Forma de Pagamento:')
    };
    if (novo.data && novo.cliente && novo.itens && novo.valor && novo.status && novo.endereco && novo.pagamento) {
        pedidos.push(novo);
        setPedidos(pedidos);
        renderPedidos();
    }
}

// Inicialização automática na página de pedidos
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('pedidos-tbody')) renderPedidos();
});

// ===================== PRODUTOS =====================

// Dados iniciais
const produtosPadrao = [
    {
        nome: 'Camiseta Básica',
        categoria: 'Roupas',
        descCurta: 'Camiseta confortável de algodão',
        marca: 'Marca X',
        precoOriginal: 'R$ 59,90',
        precoPromocional: 'R$ 49,90',
        dimensoes: '30x20x2',
        status: 'Ativo',
    }
];

// Utilitários
function getProdutos() {
    return JSON.parse(localStorage.getItem('produtos')) || produtosPadrao;
}
function setProdutos(produtos) {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Renderização
function renderProdutos() {
    const tbody = document.getElementById('produtos-tbody');
    if (!tbody) return;
    const produtos = getProdutos();
    tbody.innerHTML = '';
    produtos.forEach((p, i) => {
        tbody.innerHTML += `
            <tr>
                <td data-label="Nome">${p.nome || ''}</td>
                <td data-label="Categoria">${p.categoria || ''}</td>
                <td data-label="Descrição">${p.descCurta || ''}</td>
                <td data-label="Marca">${p.marca || ''}</td>
                <td data-label="Preço Original">${p.precoOriginal || ''}</td>
                <td data-label="Preço Promocional">${p.precoPromocional || ''}</td>
                <td data-label="Dimensões (cm)">${p.dimensoes || ''}</td>
                <td data-label="Status">${p.status || ''}</td>
                <td data-label="Ações">
                    <a href="#" title="Editar" onclick="editarProduto(${i});return false;">✏️</a>
                    <a href="#" title="Excluir" onclick="excluirProduto(${i});return false;" style="color:#e74c3c;">🗑️</a>
                </td>
            </tr>
        `;
    });
}

// Edição
window.editarProduto = function(idx) {
    const produtos = getProdutos();
    const p = produtos[idx];
    document.getElementById('edit-produto-id').value = idx;
    document.getElementById('edit-produto-nome').value = p.nome || '';
    document.getElementById('edit-produto-categoria').value = p.categoria || '';
    document.getElementById('edit-produto-desc-curta').value = p.descCurta || '';
    document.getElementById('edit-produto-marca').value = p.marca || '';
    document.getElementById('edit-produto-preco-original').value = p.precoOriginal || '';
    document.getElementById('edit-produto-preco-promocional').value = p.precoPromocional || '';
    document.getElementById('edit-produto-dimensoes').value = p.dimensoes || '';
    document.getElementById('edit-produto-status').value = p.status || '';
    document.getElementById('form-editar-produto').style.display = 'block';
}

window.salvarEdicaoProduto = function() {
    const idx = document.getElementById('edit-produto-id').value;
    const produtos = getProdutos();
    produtos[idx] = {
        nome: document.getElementById('edit-produto-nome').value,
        categoria: document.getElementById('edit-produto-categoria').value,
        descCurta: document.getElementById('edit-produto-desc-curta').value,
        marca: document.getElementById('edit-produto-marca').value,
        precoOriginal: document.getElementById('edit-produto-preco-original').value,
        precoPromocional: document.getElementById('edit-produto-preco-promocional').value,
        dimensoes: document.getElementById('edit-produto-dimensoes').value,
        status: document.getElementById('edit-produto-status').value,
    };
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

// Adicionar novo produto
window.adicionarProduto = function() {
    const produtos = getProdutos();
    const novo = {
        nome: prompt('Nome do Produto:'),
        categoria: prompt('Categoria:'),
        descCurta: prompt('Descrição:'),
        marca: prompt('Marca:'),
        precoOriginal: prompt('Preço Original:'),
        precoPromocional: prompt('Preço Promocional:'),
        dimensoes: prompt('Dimensões (cm):'),
        status: prompt('Status:'),
    };
    if (novo.nome && novo.categoria) {
        produtos.push(novo);
        setProdutos(produtos);
        renderProdutos();
    }
}

// Inicialização automática na página de produtos
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('produtos-tbody')) renderProdutos();
});

// ===================== ESTOQUE =====================

// Dados iniciais
const estoquePadrao = []; // Começa vazio

// Utilitários
function getEstoque() {
    return JSON.parse(localStorage.getItem('estoque')) || estoquePadrao;
}
function setEstoque(estoque) {
    localStorage.setItem('estoque', JSON.stringify(estoque));
}

// Renderização
function renderEstoque() {
    const tbody = document.getElementById('estoque-tbody');
    if (!tbody) return;
    const estoque = getEstoque();
    tbody.innerHTML = '';
    estoque.forEach((e, i) => {
        tbody.innerHTML += `
            <tr>
                <td data-label="SKU">${e.sku || ''}</td>
                <td data-label="Nome do Produto">${e.nome || ''}</td>
                <td data-label="Entrada">${e.entrada || ''}</td>
                <td data-label="Saída">${e.saida || ''}</td>
                <td data-label="Estoque Atual">${e.estoqueAtual || ''}</td>
                <td data-label="Data">${e.data || ''}</td>
                <td data-label="Observações">${e.observacoes || ''}</td>
                <td data-label="Status">${e.status || ''}</td>
                <td data-label="Ações">
                    <a href="#" title="Editar" onclick="editarEstoque(${i});return false;">✏️</a>
                    <a href="#" title="Excluir" onclick="excluirEstoque(${i});return false;" style="color:#e74c3c;">🗑️</a>
                </td>
            </tr>
        `;
    });
}

// Adicionar novo item de estoque
window.adicionarEstoque = function() {
    const estoque = getEstoque();
    const novo = {
        sku: prompt('SKU:'),
        nome: prompt('Nome do Produto:'),
        entrada: prompt('Entrada:'),
        saida: prompt('Saída:'),
        estoqueAtual: prompt('Estoque Atual:'),
        data: prompt('Data:'),
        observacoes: prompt('Observações:'),
        status: prompt('Status:')
    };
    if (novo.sku && novo.nome) {
        estoque.push(novo);
        setEstoque(estoque);
        renderEstoque();
    }
}

// Editar item de estoque
window.editarEstoque = function(idx) {
    const estoque = getEstoque();
    const e = estoque[idx];
    const sku = prompt('SKU:', e.sku || '');
    const nome = prompt('Nome do Produto:', e.nome || '');
    const entrada = prompt('Entrada:', e.entrada || '');
    const saida = prompt('Saída:', e.saida || '');
    const estoqueAtual = prompt('Estoque Atual:', e.estoqueAtual || '');
    const data = prompt('Data:', e.data || '');
    const observacoes = prompt('Observações:', e.observacoes || '');
    const status = prompt('Status:', e.status || '');
    if (sku && nome) {
        estoque[idx] = { sku, nome, entrada, saida, estoqueAtual, data, observacoes, status };
        setEstoque(estoque);
        renderEstoque();
    }
}

// Excluir item de estoque
window.excluirEstoque = function(idx) {
    if (confirm('Deseja excluir este item do estoque?')) {
        const estoque = getEstoque();
        estoque.splice(idx, 1);
        setEstoque(estoque);
        renderEstoque();
    }
}

// Inicialização automática na página de estoque
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('estoque-tbody')) renderEstoque();
});

// Dashboard cards (index.html)
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('card-clientes')) {
        document.getElementById('card-clientes').textContent = getClientes().length;
    }
    if (document.getElementById('card-pedidos')) {
        document.getElementById('card-pedidos').textContent = getPedidos().length;
    }
    if (document.getElementById('card-produtos')) {
        document.getElementById('card-produtos').textContent = getProdutos().length;
    }
    // Estoque: exemplo fictício
    if (document.getElementById('card-estoque')) {
        document.getElementById('card-estoque').textContent = getProdutos().reduce((soma, p) => soma + (parseInt(p.estoque) || 0), 0);
    }
});