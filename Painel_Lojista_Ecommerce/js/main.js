document.addEventListener('DOMContentLoaded', function() {
    // Busca dinâmica
    const busca = document.getElementById('buscaCliente');
    if (busca) {
        busca.addEventListener('keyup', function() {
            const termo = busca.value.toLowerCase();
            document.querySelectorAll('table tbody tr').forEach(tr => {
                tr.style.display = Array.from(tr.children).some(td =>
                    td.textContent.toLowerCase().includes(termo)
                ) ? '' : 'none';
            });
        });
    }

    // Inicializa clientes
    renderClientes();
});

// Dados iniciais
const clientesPadrao = [
    {id: '001', nome: 'Maria Silva', email: 'maria@email.com', telefone: '(11) 99999-9999'},
    {id: '002', nome: 'João Souza', email: 'joao@email.com', telefone: '(11) 98888-8888'}
];

// Funções para localStorage
function getClientes() {
    return JSON.parse(localStorage.getItem('clientes')) || clientesPadrao;
}
function setClientes(clientes) {
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

// Renderiza tabela
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
                </td>
            </tr>
        `;
    });
}

// Editar cliente
function editarCliente(idx) {
    const clientes = getClientes();
    document.getElementById('edit-id').value = idx;
    document.getElementById('edit-nome').value = clientes[idx].nome;
    document.getElementById('edit-email').value = clientes[idx].email;
    document.getElementById('edit-telefone').value = clientes[idx].telefone;
    document.getElementById('form-editar').style.display = 'block';
}

// Salvar edição
function salvarEdicao() {
    const idx = document.getElementById('edit-id').value;
    const clientes = getClientes();
    clientes[idx].nome = document.getElementById('edit-nome').value;
    clientes[idx].email = document.getElementById('edit-email').value;
    clientes[idx].telefone = document.getElementById('edit-telefone').value;
    setClientes(clientes);
    document.getElementById('form-editar').style.display = 'none';
    renderClientes();
}

// Cancelar edição
function cancelarEdicao() {
    document.getElementById('form-editar').style.display = 'none';
}