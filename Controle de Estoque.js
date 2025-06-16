// ===================== ESTOQUE =====================

// Dados iniciais
const estoquePadrao = [];

// Utilitários
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
                    <span class="status ${e.status ? e.status.toLowerCase() : ''}">${statusLabelEstoque(e.status)}</span>
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

function statusLabelEstoque(status) {
    if (!status) return '';
    if (status.toLowerCase() === 'concluido') return 'Em estoque';
    if (status.toLowerCase() === 'pendente') return 'Vendido';
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
        document.getElementById('estoque-status').value = 'concluido';
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

// Atualiza o total em estoque
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

// Inicialização automática na página de estoque
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('estoque-tbody')) {
        renderEstoque();
        setupBuscaFiltroEstoque();
    }
});