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

// Renderização com busca dinâmica
function renderPedidos() {
    const tbody = document.getElementById('pedidos-tbody');
    if (!tbody) return;
    const busca = (document.getElementById('buscaPedido')?.value || '').toLowerCase();
    let pedidos = getPedidos();
    if (busca) {
        pedidos = pedidos.filter(p =>
            Object.values(p).some(val => (val || '').toString().toLowerCase().includes(busca))
        );
    }
    tbody.innerHTML = '';
    pedidos.forEach((p, i) => {
        tbody.innerHTML += `
            <tr>
                <td data-label="ID do Pedido">${p.id || (i + 1)}</td>
                <td data-label="Data">${p.data || ''}</td>
                <td data-label="Cliente">${p.cliente || ''}</td>
                <td data-label="Itens">${p.itens || ''}</td>
                <td data-label="Valor Total">${p.valor || ''}</td>
                <td data-label="Status"><span class="status ${p.status || ''}">${statusLabel(p.status)}</span></td>
                <td data-label="VIA">${p.endereco || ''}</td>
                <td data-label="Forma de Pagamento">${p.pagamento || ''}</td>
                <td data-label="Ações">
                    <a href="#" title="Editar" onclick="editarPedido(${i});return false;">✏️</a>
                    <a href="#" title="Excluir" onclick="excluirPedido(${i});return false;" style="color:#e74c3c;">🗑️</a>
                </td>
            </tr>
        `;
    });
}

// Modal de adicionar pedido
window.abrirAdicionarPedido = function() {
    document.getElementById('add-pedido-data').value = '';
    document.getElementById('add-pedido-cliente').value = '';
    document.getElementById('add-pedido-itens').value = '';
    document.getElementById('add-pedido-valor').value = '';
    document.getElementById('add-pedido-status').value = 'concluido';
    document.getElementById('add-pedido-via').value = '';
    document.getElementById('add-pedido-pagamento').value = '';
    document.getElementById('form-adicionar-pedido').style.display = 'flex';
}
window.fecharAdicionarPedido = function() {
    document.getElementById('form-adicionar-pedido').style.display = 'none';
}
window.salvarAdicionarPedido = function() {
    const data = document.getElementById('add-pedido-data').value.trim();
    const cliente = document.getElementById('add-pedido-cliente').value.trim();
    const status = document.getElementById('add-pedido-status').value;
    const endereco = document.getElementById('add-pedido-via').value.trim();
    const pagamento = document.getElementById('add-pedido-pagamento').value.trim();
    const valor = document.getElementById('add-pedido-valor').value.trim();

    // Coleta itens
    const lista = document.getElementById('pedido-itens-lista');
    const selects = lista.querySelectorAll('.pedido-item-select');
    const qtds = lista.querySelectorAll('.pedido-item-qtd');
    let itensArr = [];
    let erroEstoque = false;
    let estoque = getEstoque();

    selects.forEach((sel, i) => {
        const label = sel.value;
        const qtd = parseInt(qtds[i].value) || 1;
        const option = sel.selectedOptions[0];
        const estoqueDisponivel = option ? parseInt(option.getAttribute('data-estoque')) : 0;
        if (label) {
            if (qtd > estoqueDisponivel) erroEstoque = true;
            itensArr.push({ label, qtd });
        }
    });

    if (!data || !cliente || !status || !endereco || !pagamento || !valor || itensArr.length === 0) {
        alert('Preencha todos os campos e adicione pelo menos um item!');
        return;
    }
    if (erroEstoque) {
        alert('Um ou mais itens estão com estoque insuficiente!');
        return;
    }

    // Atualiza estoque
    itensArr.forEach(item => {
        const idx = estoque.findIndex(e => (e.nome + (e.descricao ? ' - ' + e.descricao : '')) === item.label);
        if (idx >= 0) {
            estoque[idx].estoqueAtual = (parseInt(estoque[idx].estoqueAtual) - item.qtd).toString();
        }
    });
    setEstoque(estoque);
    renderEstoque && renderEstoque();

    // Salva pedido
    const pedidos = getPedidos();
    const novo = {
        id: (pedidos.length + 1).toString().padStart(3, '0'),
        data, cliente,
        itens: itensArr.map(i => `${i.label} (Qtd: ${i.qtd})`).join(', '),
        valor, status, endereco, pagamento
    };
    pedidos.push(novo);
    setPedidos(pedidos);
    fecharAdicionarPedido();
    renderPedidos();
}

// Modal de editar pedido
window.editarPedido = function(idx) {
    const pedidos = getPedidos();
    const p = pedidos[idx];
    document.getElementById('edit-pedido-id').value = idx;
    document.getElementById('edit-pedido-data').value = p.data || '';
    document.getElementById('edit-pedido-cliente').value = p.cliente || '';
    document.getElementById('edit-pedido-itens').value = p.itens || '';
    document.getElementById('edit-pedido-valor').value = p.valor || '';
    document.getElementById('edit-pedido-status').value = p.status || 'concluido';
    document.getElementById('edit-pedido-via').value = p.endereco || '';
    document.getElementById('edit-pedido-pagamento').value = p.pagamento || '';
    document.getElementById('form-editar-pedido').style.display = 'flex';
}
window.cancelarEdicaoPedido = function() {
    document.getElementById('form-editar-pedido').style.display = 'none';
}
window.salvarEdicaoPedido = function() {
    const idx = document.getElementById('edit-pedido-id').value;
    const pedidos = getPedidos();
    pedidos[idx] = {
        id: pedidos[idx].id, // mantém o id original
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

// Excluir pedido
window.excluirPedido = function(idx) {
    if (confirm('Deseja excluir este pedido?')) {
        const pedidos = getPedidos();
        pedidos.splice(idx, 1);
        setPedidos(pedidos);
        renderPedidos();
    }
}

// Busca dinâmica
function setupBuscaPedidos() {
    const busca = document.getElementById('buscaPedido');
    if (busca) {
        busca.addEventListener('input', renderPedidos);
    }
}

// Inicialização automática na página de pedidos
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('pedidos-tbody')) {
        renderPedidos();
        setupBuscaPedidos();
    }
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

const estoquePadrao = [];

function getEstoque() {
    return JSON.parse(localStorage.getItem('estoque')) || estoquePadrao;
}
function setEstoque(estoque) {
    localStorage.setItem('estoque', JSON.stringify(estoque));
}

// Renderização com busca e filtro
function renderEstoque() {
    const tbody = document.getElementById('estoque-tbody');
    if (!tbody) return;
    const busca = (document.getElementById('buscaEstoque')?.value || '').toLowerCase();
    const filtro = document.getElementById('filtroStatusEstoque')?.value || '';
    let estoque = getEstoque();
    if (busca) {
        estoque = estoque.filter(e =>
            Object.values(e).some(val => (val || '').toString().toLowerCase().includes(busca))
        );
    }
    if (filtro) {
        estoque = estoque.filter(e => (e.status || '').toLowerCase() === filtro);
    }
    tbody.innerHTML = '';
    estoque.forEach((e, i) => {
        tbody.innerHTML += `
            <tr>
                <td data-label="SKU">${e.sku || ''}</td>
                <td data-label="Nome do Produto">${e.nome || ''}</td>
                <td data-label="Entrada">${e.entrada || ''}</td>
                <td data-label="Saída">${e.saida || ''}</td>
                <td data-label="Estoque Atual">${e.estoqueAtual || ''}</td>
                <td data-label="Data Catalogada">${e.dataCatalogada || ''}</td>
                <td data-label="Preço de Custo">${e.precoCusto || ''}</td>
                <td data-label="Preço Original">${e.precoOriginal || ''}</td>
                <td data-label="Preço Promocional">${e.precoPromocional || ''}</td>
                <td data-label="Descrição">${e.descricao || ''}</td>
                <td data-label="Status">
                    <span class="status ${e.status ? e.status.toLowerCase() : ''}">${statusLabel(e.status)}</span>
                    <button onclick="mudarStatusEstoque(${i})" class="btn btn-status" title="Mudar Status" style="padding:2px 10px;font-size:0.9em;margin-left:5px;">Mudar</button>
                </td>
                <td data-label="Ações">
                    <button onclick="abrirModalEstoque(${i})" class="btn btn-editar" title="Editar" style="padding:2px 10px;font-size:0.9em;">Editar</button>
                    <button onclick="excluirEstoque(${i})" class="btn btn-cancelar" title="Excluir" style="padding:2px 10px;font-size:0.9em;">Excluir</button>
                </td>
            </tr>
        `;
    });
    atualizarTotalEstoque();
}

function statusLabel(status) {
    if (!status) return '';
    if (status.toLowerCase() === 'concluido') return 'Concluído';
    if (status.toLowerCase() === 'pendente') return 'Pendente';
    return status;
}

// Modal de adicionar/editar
window.abrirModalEstoque = function(idx) {
    document.getElementById('modal-estoque-titulo').textContent = idx !== undefined ? 'Editar Item de Estoque' : 'Novo Item de Estoque';
    document.getElementById('estoque-idx').value = idx !== undefined ? idx : '';
    if (idx !== undefined) {
        const e = getEstoque()[idx];
        document.getElementById('estoque-sku').value = e.sku || '';
        document.getElementById('estoque-nome').value = e.nome || '';
        document.getElementById('estoque-entrada').value = e.entrada || '';
        document.getElementById('estoque-saida').value = e.saida || '';
        document.getElementById('estoque-atual').value = e.estoqueAtual || '';
        document.getElementById('estoque-data').value = e.dataCatalogada || '';
        document.getElementById('estoque-preco-custo').value = e.precoCusto || '';
        document.getElementById('estoque-preco-original').value = e.precoOriginal || '';
        document.getElementById('estoque-preco-promocional').value = e.precoPromocional || '';
        document.getElementById('estoque-descricao').value = e.descricao || '';
        document.getElementById('estoque-status').value = (e.status || 'concluido').toLowerCase();
    } else {
        document.getElementById('estoque-idx').value = '';
        document.getElementById('estoque-sku').value = '';
        document.getElementById('estoque-nome').value = '';
        document.getElementById('estoque-entrada').value = '';
        document.getElementById('estoque-saida').value = '';
        document.getElementById('estoque-atual').value = '';
        document.getElementById('estoque-data').value = '';
        document.getElementById('estoque-preco-custo').value = '';
        document.getElementById('estoque-preco-original').value = '';
        document.getElementById('estoque-preco-promocional').value = '';
        document.getElementById('estoque-descricao').value = '';
        document.getElementById('estoque-status').value = 'concluido'; // padrão agora é "concluido"
    }
    document.getElementById('modal-estoque').style.display = 'flex';
}
window.fecharModalEstoque = function() {
    document.getElementById('modal-estoque').style.display = 'none';
}
window.salvarEstoqueModal = function() {
    const idx = document.getElementById('estoque-idx').value;
    const novo = {
        sku: document.getElementById('estoque-sku').value.trim(),
        nome: document.getElementById('estoque-nome').value.trim(),
        entrada: document.getElementById('estoque-entrada').value.trim(),
        saida: document.getElementById('estoque-saida').value.trim(),
        estoqueAtual: document.getElementById('estoque-atual').value.trim(),
        dataCatalogada: document.getElementById('estoque-data').value.trim(),
        precoCusto: document.getElementById('estoque-preco-custo').value.trim(),
        precoOriginal: document.getElementById('estoque-preco-original').value.trim(),
        precoPromocional: document.getElementById('estoque-preco-promocional').value.trim(),
        descricao: document.getElementById('estoque-descricao').value.trim(),
        status: document.getElementById('estoque-status').value
    };
    // Validação básica de campos obrigatórios
    if (!novo.sku || !novo.nome) {
        alert('SKU e Nome do Produto são obrigatórios!');
        return;
    }
    const estoque = getEstoque();
    if (idx === '') {
        estoque.push(novo);
    } else {
        estoque[idx] = novo;
    }
    setEstoque(estoque);
    fecharModalEstoque();
    renderEstoque();
}

// Mudar status rapidamente
window.mudarStatusEstoque = function(idx) {
    const estoque = getEstoque();
    const statusAtual = estoque[idx].status ? estoque[idx].status.toLowerCase() : '';
    let novoStatus = '';
    if (statusAtual === 'concluido') novoStatus = 'pendente';
    else novoStatus = 'concluido';
    estoque[idx].status = novoStatus;
    setEstoque(estoque);    
    renderEstoque();
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

// Busca e filtro dinâmicos
function setupBuscaFiltroEstoque() {
    const busca = document.getElementById('buscaEstoque');
    const filtro = document.getElementById('filtroStatusEstoque');
    if (busca) busca.addEventListener('input', renderEstoque);
    if (filtro) filtro.addEventListener('change', renderEstoque);
}

// Inicialização automática na página de estoque
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('estoque-tbody')) {
        renderEstoque();
        setupBuscaFiltroEstoque();
    }
});

// ===================== INVESTIMENTOS =====================

const investimentosPadrao = [];

function getInvestimentos() {
    return JSON.parse(localStorage.getItem('investimentos')) || investimentosPadrao;
}
function setInvestimentos(investimentos) {
    localStorage.setItem('investimentos', JSON.stringify(investimentos));
}

// Renderização com busca e filtro
function renderInvestimentos() {
    const tbody = document.getElementById('investimentos-tbody');
    if (!tbody) return;
    const busca = (document.getElementById('buscaInvestimento')?.value || '').toLowerCase();
    const filtro = document.getElementById('filtroStatusInvestimento')?.value || '';
    let investimentos = getInvestimentos();
    if (busca) {
        investimentos = investimentos.filter(inv =>
            Object.values(inv).some(val => (val || '').toString().toLowerCase().includes(busca))
        );
    }
    if (filtro) {
        investimentos = investimentos.filter(inv => (inv.status || '').toLowerCase() === filtro);
    }
    tbody.innerHTML = '';
    investimentos.forEach((inv, i) => {
        tbody.innerHTML += `
            <tr>
                <td data-label="Data">${inv.data || ''}</td>
                <td data-label="Tipo">${inv.tipo || ''}</td>
                <td data-label="Descrição">${inv.descricao || ''}</td>
                <td data-label="Valor">${inv.valor || ''}</td>
                <td data-label="Status"><span class="status ${inv.status ? inv.status.toLowerCase() : ''}">${statusLabel(inv.status)}</span></td>
                <td data-label="Ações">
                    <button onclick="abrirModalInvestimento(${i})" class="btn btn-editar" title="Editar">Editar</button>
                    <button onclick="excluirInvestimento(${i})" class="btn btn-cancelar" title="Excluir">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function statusLabel(status) {
    if (!status) return '';
    if (status.toLowerCase() === 'concluido') return 'Concluído';
    if (status.toLowerCase() === 'pendente') return 'Pendente';
    return status;
}

// Modal de adicionar/editar
window.abrirModalInvestimento = function(idx) {
    document.getElementById('modal-investimento-titulo').textContent = idx !== undefined ? 'Editar Investimento' : 'Novo Investimento';
    document.getElementById('investimento-idx').value = idx !== undefined ? idx : '';
    if (idx !== undefined) {
        const inv = getInvestimentos()[idx];
        document.getElementById('investimento-data').value = inv.data || '';
        document.getElementById('investimento-tipo').value = inv.tipo || '';
        document.getElementById('investimento-descricao').value = inv.descricao || '';
        document.getElementById('investimento-valor').value = inv.valor || '';
        document.getElementById('investimento-status').value = inv.status || '';
    } else {
        document.getElementById('investimento-idx').value = '';
        document.getElementById('investimento-data').value = '';
        document.getElementById('investimento-tipo').value = '';
        document.getElementById('investimento-descricao').value = '';
        document.getElementById('investimento-valor').value = '';
        document.getElementById('investimento-status').value = '';
    }
    document.getElementById('modal-investimento').style.display = 'flex';
}
window.fecharModalInvestimento = function() {
    document.getElementById('modal-investimento').style.display = 'none';
}
window.salvarInvestimentoModal = function() {
    const idx = document.getElementById('investimento-idx').value;
    const novo = {
        data: document.getElementById('investimento-data').value,
        tipo: document.getElementById('investimento-tipo').value,
        descricao: document.getElementById('investimento-descricao').value,
        valor: document.getElementById('investimento-valor').value,
        status: document.getElementById('investimento-status').value
    };
    if (!novo.data || !novo.tipo || !novo.valor) {
        alert('Data, Tipo e Valor são obrigatórios!');
        return;
    }
    const investimentos = getInvestimentos();
    if (idx === '') {
        investimentos.push(novo);
    } else {
        investimentos[idx] = novo;
    }
    setInvestimentos(investimentos);
    fecharModalInvestimento();
    renderInvestimentos();
}

// Excluir investimento
window.excluirInvestimento = function(idx) {
    if (confirm('Deseja excluir este investimento?')) {
        const investimentos = getInvestimentos();
        investimentos.splice(idx, 1);
        setInvestimentos(investimentos);
        renderInvestimentos();
    }
}

// Busca e filtro dinâmicos
function setupBuscaFiltroInvestimento() {
    const busca = document.getElementById('buscaInvestimento');
    const filtro = document.getElementById('filtroStatusInvestimento');
    if (busca) busca.addEventListener('input', renderInvestimentos);
    if (filtro) filtro.addEventListener('change', renderInvestimentos);
}

// Inicialização automática na página de investimentos
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('investimentos-tbody')) {
        renderInvestimentos();
        setupBuscaFiltroInvestimento();
    }
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

function atualizarTotalEstoque() {
    const estoque = getEstoque();
    let total = 0;
    estoque.forEach(e => {
        const qtd = parseFloat(e.estoqueAtual) || 0;
        total += qtd;
    });
    const el = document.getElementById('estoque-total-produtos');
    if (el) el.textContent = total;
}

// ===================== ADICIONAR CLIENTE =====================

window.abrirAdicionarCliente = function() {
    document.getElementById('add-nome').value = '';
    document.getElementById('add-email').value = '';
    document.getElementById('add-telefone').value = '';
    document.getElementById('form-adicionar').style.display = 'flex';
}
window.fecharAdicionarCliente = function() {
    document.getElementById('form-adicionar').style.display = 'none';
}
window.salvarAdicionarCliente = function() {
    const nome = document.getElementById('add-nome').value.trim();
    const email = document.getElementById('add-email').value.trim();
    const telefone = document.getElementById('add-telefone').value.trim();
    if (!nome || !email || !telefone) {
        alert('Preencha todos os campos!');
        return;
    }
    const clientes = getClientes();
    const novo = {
        id: (clientes.length + 1).toString().padStart(3, '0'),
        nome,
        email,
        telefone
    };
    clientes.push(novo);
    setClientes(clientes);
    fecharAdicionarCliente();
    renderClientes();
}

// ===================== ADICIONAR PEDIDO =====================

function preencherItensEstoqueDatalist() {
    const datalist = document.getElementById('estoque-itens-list');
    if (!datalist) return;
    datalist.innerHTML = '';
    const estoque = getEstoque();
    estoque.forEach(e => {
        // Mostra nome + descrição, se houver
        const label = e.nome ? (e.nome + (e.descricao ? ' - ' + e.descricao : '')) : '';
        if (label) {
            const option = document.createElement('option');
            option.value = label;
            datalist.appendChild(option);
        }
    });
}

// Atualiza o datalist sempre que abrir o modal de novo pedido
const originalAbrirAdicionarPedido = window.abrirAdicionarPedido;
window.abrirAdicionarPedido = function() {
    preencherItensEstoqueDatalist();
    originalAbrirAdicionarPedido();
};

// --- Múltiplos itens no pedido ---

function getEstoqueItensParaSelect() {
    const estoque = getEstoque();
    return estoque
        .filter(e => (parseFloat(e.estoqueAtual) || 0) > 0)
        .map(e => ({
            label: e.nome + (e.descricao ? ' - ' + e.descricao : ''),
            preco: parseFloat(e.precoOriginal) || 0,
            id: e.sku || e.nome,
            estoque: parseFloat(e.estoqueAtual) || 0
        }));
}

window.adicionarLinhaItemPedido = function() {
    const lista = document.getElementById('pedido-itens-lista');
    const itens = getEstoqueItensParaSelect();
    const idx = lista.children.length;
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.gap = '8px';
    div.style.marginBottom = '6px';
    div.innerHTML = `
        <select class="pedido-item-select input-busca" style="min-width:180px;">
            <option value="">Selecione o item</option>
            ${itens.map(i => `<option value="${i.label}" data-preco="${i.preco}" data-estoque="${i.estoque}">${i.label} (Estoque: ${i.estoque})</option>`).join('')}
        </select>
        <input type="number" min="1" value="1" class="pedido-item-qtd input-busca" style="width:60px;" placeholder="Qtd">
        <button type="button" class="btn btn-cancelar" onclick="this.parentElement.remove();atualizarResumoPedido()">Remover</button>
    `;
    lista.appendChild(div);
    div.querySelector('.pedido-item-select').addEventListener('change', atualizarResumoPedido);
    div.querySelector('.pedido-item-qtd').addEventListener('input', atualizarResumoPedido);
    atualizarResumoPedido();
};

function atualizarResumoPedido() {
    const lista = document.getElementById('pedido-itens-lista');
    const selects = lista.querySelectorAll('.pedido-item-select');
    const qtds = lista.querySelectorAll('.pedido-item-qtd');
    const resumoDiv = document.getElementById('pedido-resumo');
    let total = 0;
    let resumo = '';
    let erroEstoque = false;
    selects.forEach((sel, i) => {
        const label = sel.value;
        const qtd = parseInt(qtds[i].value) || 1;
        const option = sel.selectedOptions[0];
        const preco = option ? parseFloat(option.getAttribute('data-preco')) : 0;
        const estoque = option ? parseInt(option.getAttribute('data-estoque')) : 0;
        if (label) {
            if (qtd > estoque) {
                resumo += `<div style="color:#e74c3c;">${label} - Qtd: ${qtd} (Estoque insuficiente!)</div>`;
                erroEstoque = true;
            } else {
                resumo += `<div>${label} - Qtd: ${qtd} x R$ ${preco.toFixed(2)} = <b>R$ ${(preco*qtd).toFixed(2)}</b></div>`;
                total += preco * qtd;
            }
        }
    });
    resumoDiv.innerHTML = resumo || '<span style="color:#888;">Nenhum item selecionado.</span>';
    document.getElementById('add-pedido-valor').value = total ? total.toFixed(2) : '';
    document.getElementById('add-pedido-valor').style.background = erroEstoque ? '#ffe5e5' : '';
    return !erroEstoque;
}

// Ao abrir modal, inicializa área de itens
const originalAbrirAdicionarPedidoMulti = window.abrirAdicionarPedido;
window.abrirAdicionarPedido = function() {
    originalAbrirAdicionarPedido();
    document.getElementById('pedido-itens-lista').innerHTML = '';
    document.getElementById('pedido-resumo').innerHTML = '';
    document.getElementById('add-pedido-valor').value = '';
    adicionarLinhaItemPedido();
};