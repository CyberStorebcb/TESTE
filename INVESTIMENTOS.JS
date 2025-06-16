// ===================== INVESTIMENTOS =====================

// Dados iniciais
const investimentosPadrao = [];

// Utilitários
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
                <td data-label="Status"><span class="status ${inv.status ? inv.status.toLowerCase() : ''}">${statusLabelInvestimento(inv.status)}</span></td>
                <td data-label="Ações">
                    <button onclick="abrirModalInvestimento(${i})" class="btn btn-editar" title="Editar">Editar</button>
                    <button onclick="excluirInvestimento(${i})" class="btn btn-cancelar" title="Excluir">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function statusLabelInvestimento(status) {
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