// Garante que o script só rode depois que todo o HTML for carregado
// A "GRANDE CAIXA" COMEÇA AQUI
document.addEventListener('DOMContentLoaded', () => {

    console.log("JavaScript carregado com sucesso!");

    // =======================================================
    // LÓGICA COMPARTILHADA DAS PÁGINAS PÚBLICAS (Home, Rotas, etc.)
    // =======================================================
    const publicNavbar = document.querySelector('.navbar');
    if (publicNavbar) {
        const userToken = localStorage.getItem('user_token');
        const gestorToken = localStorage.getItem('gestor_token');
        const loginButton = document.querySelector('.nav-menu a.nav-button');

        if (gestorToken) {
            if (loginButton) {
                loginButton.textContent = 'Painel do Gestor';
                loginButton.href = 'gestor/dashboard.html';
            }
        } else if (userToken) {
            if (loginButton) {
                loginButton.textContent = 'Sair';
                loginButton.href = '#';
                loginButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    localStorage.removeItem('user_token');
                    alert('Você saiu da sua conta.');
                    window.location.reload();
                });
            }
        }
    }

    // =======================================================
    // LÓGICA DA PÁGINA DE ROTAS (rotas.html)
    // =======================================================
    if (document.body.id === 'pagina-rotas') {
        const form = document.getElementById('form-busca-rota');
        const cidadeSelect = document.getElementById('cidade');
        const bairroSelect = document.getElementById('bairro');
        const resultadoContainer = document.getElementById('resultado-rota');
        const bairrosPorCidade = { 'jundiai': ['Centro', 'Eloy Chaves', 'Vila Arens', 'Anhangabaú'], 'cabreuva': ['Centro', 'Jacaré', 'Vilarejo', 'Pinhal'], 'louveira': ['Centro', 'Santo Antônio', 'Bairro da Estiva'], };
        const rotasInfo = { 'centro': { dias: 'Segundas, Quartas e Sextas', horario: 'a partir das 19h', tipo: 'Coleta Comum' }, 'eloy-chaves': { dias: 'Terças, Quintas e Sábados', horario: 'a partir das 08h', tipo: 'Coleta Comum e Seletiva' }, 'vila-arens': { dias: 'Segundas, Quartas e Sextas', horario: 'a partir das 08h', tipo: 'Coleta Comum' }, 'jacare': { dias: 'Terças e Quintas', horario: 'a partir das 18h', tipo: 'Coleta Comum' }, };
        cidadeSelect.addEventListener('change', () => {
            const cidadeSelecionada = cidadeSelect.value;
            bairroSelect.innerHTML = '<option value="">Selecione o seu bairro</option>';
            resultadoContainer.innerHTML = '';
            if (cidadeSelecionada && bairrosPorCidade[cidadeSelecionada]) {
                bairroSelect.disabled = false;
                bairrosPorCidade[cidadeSelecionada].forEach(bairro => { const option = new Option(bairro, bairro.toLowerCase().replace(/\s/g, '-')); bairroSelect.appendChild(option); });
            } else {
                bairroSelect.disabled = true;
            }
        });
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const bairroSelecionado = bairroSelect.value;
            resultadoContainer.innerHTML = '';
            if (bairroSelecionado && rotasInfo[bairroSelecionado]) {
                const rota = rotasInfo[bairroSelecionado];
                const resultadoHTML = `<div class="resultado-card"><h3>Resultado para: ${bairroSelect.options[bairroSelect.selectedIndex].text}</h3><ul><li><strong>Dias da Coleta:</strong> ${rota.dias}</li><li><strong>Horário:</strong> ${rota.horario}</li><li><strong>Tipo de Coleta:</strong> ${rota.tipo}</li></ul></div>`;
                resultadoContainer.innerHTML = resultadoHTML;
            } else if (bairroSelecionado) {
                resultadoContainer.innerHTML = `<div class="resultado-card--erro"><p>Desculpe, ainda não temos informações detalhadas para este bairro.</p></div>`;
            } else {
                alert('Por favor, selecione um bairro para consultar.');
            }
        });
    }

    // =======================================================
    // LÓGICA DA PÁGINA DE LOGIN DE USUÁRIO (loginusuario.html)
    // =======================================================
    if (document.body.id === 'pagina-login-usuario') {
        const loginForm = document.querySelector('.login-card form');
        const emailInput = document.getElementById('email');
        const senhaInput = document.getElementById('senha');
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = emailInput.value.trim();
            const senha = senhaInput.value.trim();
            if (email && senha) {
                const tokenFalso = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1hdGhldXMgVXN1w6FyaW8iLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
                localStorage.setItem('user_token', tokenFalso);
                alert('Login realizado com sucesso! Redirecionando para a página inicial.');
                window.location.href = '../index.html';
            } else {
                alert('Por favor, preencha os campos de e-mail e senha.');
            }
        });
    }

    // =======================================================
    // LÓGICA DA PÁGINA DE LOGIN DE GESTOR (logingestor.html)
    // =======================================================
    if (document.body.id === 'pagina-login-gestor') {
        const total = 50;
        const debounce = (fn, delay = 200) => { let id; return (...args) => { clearTimeout(id); id = setTimeout(() => fn(...args), delay); }; };
        const loginForm = document.querySelector('.login-card form');
        const cnpjInput = document.getElementById('cnpj');
        const emailInput = document.getElementById('email-gestor');
        const senhaInput = document.getElementById('senha-gestor');
        [cnpjInput, emailInput, senhaInput].forEach(input => {
            input.addEventListener("input", debounce((e) => {
                if (e.target.value.length > total) { e.target.value = e.target.value.slice(0, total); }
            }, 150));
        });
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const cnpj = cnpjInput.value.trim();
            const email = emailInput.value.trim();
            const senha = senhaInput.value.trim();
            if (cnpj && email && senha) {
                const tokenFalsoGestor = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NTQzMjEiLCJuYW1lIjoiSm9hbyBHZXN0b3IiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.Qo_s-y28t_mY-Qy-YxVb-wX-YxWb-wX-YxVb-wX-YxW";
                localStorage.setItem('gestor_token', tokenFalsoGestor);
                alert('Login de Gestor realizado com sucesso! Redirecionando...');
                window.location.href = '../gestor/dashboard.html';
            } else {
                alert('Por favor, preencha todos os campos do formulário.');
            }
        });
    }
    
    // =======================================================
    // LÓGICA DA PÁGINA DE RECLAMAÇÕES (reclamacoes.html) - CORRIGIDO
    // =======================================================
    if (document.body.id === 'pagina-reclamacoes') {
        const form = document.getElementById('form-reclamacao');
        const nomeInput = document.getElementById('reclamacao-nome');
        const cidadeInput = document.getElementById('reclamacao-cidade');
        const tituloInput = document.getElementById('reclamacao-titulo');
        const mensagemInput = document.getElementById('reclamacao-mensagem');
        const btnPublicar = document.getElementById('btn-publicar');
        const postsContainer = document.getElementById('posts-container');
        const validarFormulario = () => {
            const nomeValido = nomeInput.value.trim().length >= 3;
            const cidadeValida = cidadeInput.value.trim().length >= 3;
            const tituloValido = tituloInput.value.trim().length >= 5;
            const mensagemValida = mensagemInput.value.trim().length >= 15;
            btnPublicar.disabled = !(nomeValido && cidadeValida && tituloValido && mensagemValida);
        };
        nomeInput.addEventListener('input', validarFormulario);
        cidadeInput.addEventListener('input', validarFormulario);
        tituloInput.addEventListener('input', validarFormulario);
        mensagemInput.addEventListener('input', validarFormulario);
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (btnPublicar.disabled) {
                alert('Por favor, preencha todos os campos corretamente antes de publicar.');
                return;
            }
            const nome = nomeInput.value.trim();
            const cidade = cidadeInput.value.trim();
            const titulo = tituloInput.value.trim();
            const mensagem = mensagemInput.value.trim();
            const novoPost = document.createElement('article');
            novoPost.classList.add('post-item');
            novoPost.innerHTML = `<h4>${titulo}</h4><p class="post-meta"><strong>Autor:</strong> ${nome} | <strong>Cidade:</strong> ${cidade}</p><p>${mensagem}</p>`;
            postsContainer.prepend(novoPost);
            form.reset();
            validarFormulario();
            alert('Sua ocorrência foi publicada com sucesso!');
        });
    }

    // =======================================================
    // LÓGICA COMPARTILHADA DAS PÁGINAS DO GESTOR - 
    // =======================================================
    const gestorLayout = document.querySelector('.dashboard-layout');
    if (gestorLayout) {
        const gestorToken = localStorage.getItem('gestor_token');
        if (!gestorToken) {
            alert('Acesso negado. Por favor, faça o login como gestor.');
            window.location.href = '../login/logingestor.html';
        } else {
            console.log("Acesso à área do gestor permitido.");
            const btnLogout = document.getElementById('btn-logout');
            if (btnLogout) {
                btnLogout.addEventListener('click', (event) => {
                    event.preventDefault();
                    localStorage.removeItem('gestor_token');
                    alert('Você saiu da sua conta de gestor.');
                    window.location.href = '../login/logingestor.html';
                });
            }
            try {
                const payload = JSON.parse(atob(gestorToken.split('.')[1]));
                const nomeGestor = payload.name || 'Gestor';
                const nomeGestorEl = document.getElementById('nome-gestor');
                if (nomeGestorEl) { nomeGestorEl.textContent = `Bem-vindo, ${nomeGestor}!`; }
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
        const currentPage = window.location.pathname.split('/').pop();
        const sidebarLinks = document.querySelectorAll('.dash-sidebar nav a');
        sidebarLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            link.parentElement.classList.remove('active');
            if (currentPage === linkPage) {
                link.parentElement.classList.add('active');
            }
        });
    }

    // =======================================================
    // LÓGICA ESPECÍFICA DO DASHBOARD (pagina-dashboard-gestor)
    // =======================================================
    if (document.body.id === 'pagina-dashboard-gestor') {
        const eficiencia = document.querySelector('.kpi-card:nth-child(1) .kpi-value');
        const avaliacao = document.querySelector('.kpi-card:nth-child(2) .kpi-value');
        const reciclado = document.querySelector('.kpi-card:nth-child(3) .kpi-value');
        function floatToPercent(value) { return (value * 100).toFixed(0) + '%'; }
        function avaliarMedia(value) { if (value < 0.5) return 'Ruim'; if (value < 0.7) return 'Regular'; return 'Bom'; }
        const dados = { eficienciaRotas: 0.97, avaliacoes: [0.85, 0.80, 0.76, 0.70, 0.82, 0.79, 0.75, 0.88, 0.77, 0.71], lixoTotal: 1029384.0, lixoReciclado: 555379.0 };
        let totalLixoReciclado = dados.lixoReciclado / dados.lixoTotal;
        let avaliacaoMedia = dados.avaliacoes.reduce((a, b) => a + b, 0) / dados.avaliacoes.length;
        eficiencia.textContent = floatToPercent(dados.eficienciaRotas);
        avaliacao.textContent = avaliarMedia(avaliacaoMedia);
        reciclado.textContent = floatToPercent(totalLixoReciclado);
        const kpiCards = document.querySelectorAll('.kpi-card');
        const chartPlaceholder = document.querySelector('.chart-placeholder p');
        kpiCards.forEach(card => {
            card.addEventListener('click', () => {
                const kpiTitle = card.querySelector('h3').textContent;
                chartPlaceholder.textContent = `Exibindo detalhes para: ${kpiTitle}...`;
            });
        });
    }

    // =======================================================
    // LÓGICA DA PÁGINA GERENCIAR ROTAS (gerenciar-rotas.html)
    // =======================================================
    if (document.body.id === 'pagina-gerenciar-rotas') {
        const form = document.getElementById('form-add-rota');
        const cidadeInput = document.getElementById('rota-cidade');
        const bairroInput = document.getElementById('rota-bairro');
        const diasInput = document.getElementById('rota-dias');
        const horarioInput = document.getElementById('rota-horario');
        const tabelaBody = document.getElementById('tabela-rotas-body');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const cidade = cidadeInput.value.trim();
            const bairro = bairroInput.value.trim();
            const dias = diasInput.value.trim();
            const horario = horarioInput.value.trim();
            if (!cidade || !bairro || !dias || !horario) {
                alert('Por favor, preencha todos os campos para adicionar a rota.');
                return;
            }
            const novaLinha = document.createElement('tr');
            novaLinha.innerHTML = `<td>${cidade}</td><td>${bairro}</td><td>${dias}</td><td>${horario}</td><td><button class="btn-tabela btn-editar">Editar</button> <button class="btn-tabela btn-excluir">Excluir</button></td>`;
            tabelaBody.appendChild(novaLinha);
            form.reset();
        });
        tabelaBody.addEventListener('click', (event) => {
            if (event.target.matches('.btn-excluir')) {
                const linhaParaExcluir = event.target.closest('tr');
                if (confirm('Você tem certeza que deseja excluir esta rota?')) {
                    linhaParaExcluir.remove();
                    alert('Rota excluída com sucesso.');
                }
            }
            if (event.target.matches('.btn-editar')) {
                const linhaParaEditar = event.target.closest('tr');
                const celulaHorario = linhaParaEditar.children[3];
                const horarioAtual = celulaHorario.textContent;
                const novoHorario = prompt('Digite o novo horário para esta rota:', horarioAtual);
                if (novoHorario && novoHorario.trim() !== '') {
                    celulaHorario.textContent = novoHorario.trim();
                    alert('Horário atualizado com sucesso!');
                }
            }
        });
    }

    // =======================================================
    // LÓGICA DA PÁGINA DE RELATÓRIOS (relatorios.html)
    // =======================================================
    if (document.body.id === 'pagina-relatorios-gestor') {
        const form = document.getElementById('form-gerar-relatorio');
        const tipoRelatorioInput = document.getElementById('tipo-relatorio');
        const periodoInput = document.getElementById('periodo-relatorio');
        const tabelaBody = document.getElementById('tabela-relatorios-body');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const tipoRelatorio = tipoRelatorioInput.options[tipoRelatorioInput.selectedIndex].text;
            const periodo = periodoInput.value;
            if (!tipoRelatorio || tipoRelatorio === 'Selecione' || !periodo) {
                alert('Por favor, selecione o tipo de relatório e o período.');
                return;
            }
            alert(`Gerando relatório de "${tipoRelatorio}" para o período de ${periodo}...`);
            const hoje = new Date();
            const dataFormatada = hoje.toLocaleDateString('pt-BR');
            const [ano, mes] = periodo.split('-');
            const nomeMes = new Date(ano, mes - 1, 1).toLocaleString('pt-BR', { month: 'long' });
            const periodoFormatado = `${nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)}/${ano}`;
            const novaLinha = document.createElement('tr');
            novaLinha.innerHTML = `<td>${dataFormatada}</td><td>${tipoRelatorio}</td><td>${periodoFormatado}</td><td><button class="btn-tabela btn-editar">Baixar Novamente</button></td>`;
            tabelaBody.prepend(novaLinha);
            form.reset();
        });
    }

    // =======================================================
    // LÓGICA DA PÁGINA GERENCIAR RECLAMAÇÕES (reclamacoes-gestor.html)
    // =======================================================
    if (document.body.id === 'pagina-reclamacoes-gestor') {
        const tabelaBody = document.getElementById('tabela-reclamacoes-body');
        tabelaBody.addEventListener('click', (event) => {
            if (event.target.matches('.btn-editar')) {
                const novoStatus = prompt("Digite o novo status (Pendente, Em Análise, Resolvido):");
                if (novoStatus) {
                    const linha = event.target.closest('tr');
                    const statusSpan = linha.querySelector('.status');
                    const novaClasse = `status-${novoStatus.toLowerCase().replace(' ', '-')}`;
                    statusSpan.textContent = novoStatus;
                    statusSpan.className = `status ${novaClasse}`;
                    alert(`Status da ocorrência atualizado para "${novoStatus}".`);
                }
            }
        });
    }

}); // E A "GRANDE CAIXA" FECHA SÓ AQUI, NO FINAL DE TUDO.