//Este listener só ocorre caso o documento seja carregado primeiro 
document.addEventListener('DOMContentLoaded', () => {

    console.log("JavaScript carregado com sucesso!");

    //Lógica das páginas públicas com relação ao token armazendo no localstorage do usuário
    const publicNavbar = document.querySelector('.navbar'); // pega objeto atravez do css
    if (publicNavbar) {
        // constantes tokens
        const userToken = localStorage.getItem('user_token');
        const gestorToken = localStorage.getItem('gestor_token');
        // constante representando botão do login
        const loginButton = document.querySelector('.nav-menu a.nav-button');

        if (gestorToken) {
            if (loginButton) {
                // muda o texto de "login" para "painel do gestor"
                // ou seja, o botão de login vira botão que redireciona para pagina do gestor
                loginButton.textContent = 'Painel do Gestor';
                loginButton.href = 'gestor/dashboard.html';
            }
        } else if (userToken) {
            if (loginButton) {
                // muda texto de "login" para "sair"
                // em vez de redirecionar para o login, remove o token do usuario 
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
//Lógica da página de rotas 
if (document.body.id === 'pagina-rotas') {

    // Referências aos Elementos do forms da pagina
    const form = document.getElementById('form-busca-rota');
    const cidadeSelect = document.getElementById('cidade');
    const bairroSelect = document.getElementById('bairro');
    const resultadoContainer = document.getElementById('resultado-rota');
    const rastreamentoContainer = document.getElementById('rastreamento-container');

    // variaveis para o tracker de localização
    let liveUpdateInterval = null;
    let localizacaoIndex = 0;

    // Fontes de Dados (Simulação de Back-end)
    const bairrosPorCidade = { 'jundiai': ['Centro', 'Eloy Chaves', 'Vila Arens', 'Anhangabaú'], 'cabreuva': ['Centro', 'Jacaré', 'Vilarejo', 'Pinhal'], 'louveira': ['Centro', 'Santo Antônio', 'Bairro da Estiva'], };
    const rotasInfo = { 'centro': { dias: 'Segundas, Quartas e Sextas', horario: 'a partir das 19h', tipo: 'Coleta Comum' }, 'eloy-chaves': { dias: 'Terças, Quintas e Sábados', horario: 'a partir das 08h', tipo: 'Coleta Comum e Seletiva' }, 'vila-arens': { dias: 'Segundas, Quartas e Sextas', horario: 'a partir das 08h', tipo: 'Coleta Comum' }, 'jacare': { dias: 'Terças e Quintas', horario: 'a partir das 18h', tipo: 'Coleta Comum' }, };

    // LÓGICA DA API EM TEMPO REAL

    async function buscarLocalizacaoAtual(bairroId) {
        try {
            const response = await fetch('assets/api-caminhoes.json');

            // Se o arquivo não for encontrado (404), o fetch() não dispara um erro,
            // mas response.ok será 'false'. Precisamos checar isso.
            if (!response.ok) {
                throw new Error('Erro de rede: ' + response.statusText);
            }

            // dados no promise
            const data = await response.json();

            // dados das rotas
            const rota = data.rotas.find(r => r.id === bairroId) || { localizacoes: data.default }; 
            
            // armazenamento locais e status do caminhão
            const localizacoes = rota.localizacoes;
            const statusAtual = localizacoes[localizacaoIndex];
            
            // atualize a localização
            localizacaoIndex = (localizacaoIndex + 1) % localizacoes.length; 
            
            // muda o status do caminhão
            const statusEl = document.getElementById('status-caminhao-texto');
            if (statusEl) {
                statusEl.textContent = statusAtual;
            }

        // tratamento de erros
        } catch (error) {
            console.error('Falha ao buscar dados da API:', error);
            const statusEl = document.getElementById('status-caminhao-texto');
            if (statusEl) {
                // Mensagem de erro
                statusEl.textContent = "Não foi possível obter a localização.";
            }
        }
    }

    // Eventos do Formulário

    // ao mudar o conteudo do seletor de cidade...
    cidadeSelect.addEventListener('change', () => {
        // cidade selecionada
        const cidadeSelecionada = cidadeSelect.value;

        // crie um bloco para selecionar o bairro
        bairroSelect.innerHTML = '<option value="">Selecione o seu bairro</option>';

        // limpa elemento do resultado e rastreamento
        resultadoContainer.innerHTML = '';
        rastreamentoContainer.innerHTML = ''; 

        // se liveUpdateInterval não eh null
        if (liveUpdateInterval) {
            clearInterval(liveUpdateInterval);
        }

        // se a cidade foi selecionada e existem bairros na cidade
        if (cidadeSelecionada && bairrosPorCidade[cidadeSelecionada]) {
            // habilita a interação com o bloco de bairros
            bairroSelect.disabled = false;
            bairrosPorCidade[cidadeSelecionada].forEach(bairro => { const option = new Option(bairro, bairro.toLowerCase().replace(/\s/g, '-')); bairroSelect.appendChild(option); });
        } else {
            // deshabilita a interação com o bloco de bairros
            bairroSelect.disabled = true;
        }
    });

    // ao fazer submit do form de rotas
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // pega bairro selecionado e limpa resultado e rastreamento
        const bairroSelecionado = bairroSelect.value;
        resultadoContainer.innerHTML = '';
        rastreamentoContainer.innerHTML = ''; 

        // se o intervalo de rastreamento não eh null, limpa
        if (liveUpdateInterval) {
            clearInterval(liveUpdateInterval);
        }

        // se o bairro foi selecionado e existem rotas
        if (bairroSelecionado && rotasInfo[bairroSelecionado]) {

            // pega rota
            const rota = rotasInfo[bairroSelecionado];

            // crie um texto html com uma mensagem mostrando o resultado
            const resultadoHTML = `<div class="resultado-card"><h3>Resultado para: ${bairroSelect.options[bairroSelect.selectedIndex].text}</h3><ul><li><strong>Dias da Coleta:</strong> ${rota.dias}</li><li><strong>Horário:</strong> ${rota.horario}</li><li><strong>Tipo de Coleta:</strong> ${rota.tipo}</li></ul></div>`;
            resultadoContainer.innerHTML = resultadoHTML;
            
            // crie outro html mostrando o status do caminhao
            const rastreamentoHTML = `<div class="rastreamento-card"><h3>Status em Tempo Real</h3><p id="status-caminhao-texto">Buscando localização...</p></div>`;
            rastreamentoContainer.innerHTML = rastreamentoHTML;

            // zera o index de localização
            localizacaoIndex = 0; 

            // pega a localização atual do bairro selecionado
            buscarLocalizacaoAtual(bairroSelecionado); 

            // atualize o tracker em base ao resultado de buscarlocalização
            liveUpdateInterval = setInterval(() => buscarLocalizacaoAtual(bairroSelecionado), 5000); 

        // se tem bairro mas não tem rotas...
        } else if (bairroSelecionado) {
            resultadoContainer.innerHTML = `<div class="resultado-card--erro"><p>Desculpe, ainda não temos informações detalhadas para este bairro.</p></div>`;
        // se não tem bairro nem rotas
        } else {
            alert('Por favor, selecione um bairro para consultar.');
        }
    });
}
//Lógica da página de login
    if (document.body.id === 'pagina-login-usuario') {

        // pega o form geral
        const loginForm = document.querySelector('.login-card form');

        // pega os inputs do form
        const emailInput = document.getElementById('email');
        const senhaInput = document.getElementById('senha');

        // ao fazer submit...
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // pega valores dos inputs sem espaços
            const email = emailInput.value.trim();
            const senha = senhaInput.value.trim();

            // se campos preenchidos
            if (email && senha) {
                // crie token e salva no localstorage
                const tokenFalso = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1hdGhldXMgVXN1w6FyaW8iLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
                localStorage.setItem('user_token', tokenFalso);
                // avisa o usuario e redireciona para a pag principal
                alert('Login realizado com sucesso! Redirecionando para a página inicial.');
                window.location.href = '../index.html';
            } else {
                // avisa usuario para prencher os campos se algum estiver vazio
                alert('Por favor, preencha os campos de e-mail e senha.');
            }
        });
    }

//Lógica da página de login do gestor
    if (document.body.id === 'pagina-login-gestor') {

        // limite de caracteres
        const totalchar = 50;

        // função debounce para evitar acumulação grande de letras no campo
        const debounce = (fn, delay = 200) => { let id; return (...args) => { clearTimeout(id); id = setTimeout(() => fn(...args), delay); }; };
        
        // pega form
        const loginForm = document.querySelector('.login-card form');

        // pega inputs
        const cnpjInput = document.getElementById('cnpj');
        const emailInput = document.getElementById('email-gestor');
        const senhaInput = document.getElementById('senha-gestor');

        // para cada um dos inputs aplica o debounce 150ms delay
        [cnpjInput, emailInput, senhaInput].forEach(input => {
            input.addEventListener("input", debounce((e) => {
                if (e.target.value.length > totalchar) { e.target.value = e.target.value.slice(0, totalchar); }
            }, 150));
        });

        // ao fazer submit...
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // pega valores dos campos sem espaços
            const cnpj = cnpjInput.value.trim();
            const email = emailInput.value.trim();
            const senha = senhaInput.value.trim();

            // se não estão vazios...
            if (cnpj && email && senha) {

                // gere token falso, avisa usuario do sucesso de login, redireciona para o dashboard de gestor
                const tokenFalsoGestor = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NTQzMjEiLCJuYW1lIjoiSm9hbyBHZXN0b3IiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.Qo_s-y28t_mY-Qy-YxVb-wX-YxWb-wX-YxVb-wX-YxW";
                localStorage.setItem('gestor_token', tokenFalsoGestor);
                alert('Login de Gestor realizado com sucesso! Redirecionando...');
                window.location.href = '../gestor/dashboard.html';
            } else {
                // se estão vazios alguns dos campos avisa para prencher o form
                alert('Por favor, preencha todos os campos do formulário.');
            }
        });
    }
    
//Lógica da página de reclamações
    if (document.body.id === 'pagina-reclamacoes') {

        // pega formulario
        const form = document.getElementById('form-reclamacao');

        // inputs
        const nomeInput = document.getElementById('reclamacao-nome');
        const cidadeInput = document.getElementById('reclamacao-cidade');
        const tituloInput = document.getElementById('reclamacao-titulo');
        const mensagemInput = document.getElementById('reclamacao-mensagem');
        const btnPublicar = document.getElementById('btn-publicar');

        // pega todos os posts
        const postsContainer = document.getElementById('posts-container');

        // função validar formulario
        const validarFormulario = () => {
            // estabelece limite inferior de caracteres
            const nomeValido = nomeInput.value.trim().length >= 3;
            const cidadeValida = cidadeInput.value.trim().length >= 3;
            const tituloValido = tituloInput.value.trim().length >= 5;
            const mensagemValida = mensagemInput.value.trim().length >= 15;

            // se algumas ou todas as constantes serem falsas, o botão de publicar deve ser deshabilitado
            btnPublicar.disabled = !(nomeValido && cidadeValida && tituloValido && mensagemValida);
        };

        // em cada input, valida o formulario
        nomeInput.addEventListener('input', validarFormulario);
        cidadeInput.addEventListener('input', validarFormulario);
        tituloInput.addEventListener('input', validarFormulario);
        mensagemInput.addEventListener('input', validarFormulario);

        // ao fazer submit...
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // não faz nada se o botão estiver desabilitado
            if (btnPublicar.disabled) {
                alert('Por favor, preencha todos os campos corretamente antes de publicar.');
                return;
            }

            // pega inputs sem espaços
            const nome = nomeInput.value.trim();
            const cidade = cidadeInput.value.trim();
            const titulo = tituloInput.value.trim();
            const mensagem = mensagemInput.value.trim();
            const novoPost = document.createElement('article');

            // adicione o post no site
            novoPost.classList.add('post-item');
            novoPost.innerHTML = `<h4>${titulo}</h4><p class="post-meta"><strong>Autor:</strong> ${nome} | <strong>Cidade:</strong> ${cidade}</p><p>${mensagem}</p>`;
            postsContainer.prepend(novoPost);
            form.reset();
            validarFormulario();
            alert('Sua ocorrência foi publicada com sucesso!');
        });
    }

//Lógica das páginas do gestor
    const gestorLayout = document.querySelector('.dashboard-layout');
    if (gestorLayout) {
        const gestorToken = localStorage.getItem('gestor_token');
        // sempre valida se o token existe
        if (!gestorToken) {
            alert('Acesso negado. Por favor, faça o login como gestor.');
            window.location.href = '../login/logingestor.html';
        } else {
            console.log("Acesso à área do gestor permitido.");
            const btnLogout = document.getElementById('btn-logout');
            if (btnLogout) {
                // se aperta o botão de logout, remove o token
                btnLogout.addEventListener('click', (event) => {
                    event.preventDefault();
                    localStorage.removeItem('gestor_token');
                    alert('Você saiu da sua conta de gestor.');
                    window.location.href = '../login/logingestor.html';
                });
            }
            try {
                // tenta pegar o nome do gestor (decodifica token)
                const payload = JSON.parse(atob(gestorToken.split('.')[1]));
                const nomeGestor = payload.name || 'Gestor';
                const nomeGestorEl = document.getElementById('nome-gestor');
                if (nomeGestorEl) { nomeGestorEl.textContent = `Bem-vindo, ${nomeGestor}!`; }
            } catch (error) {
                // trata erro
                console.error("Erro ao decodificar o token:", error);
            }
        }

        // para cada link do sidebar, verifica se está na pagina do link. se tá, desabilita o botão dessa janela no sidebar
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

//Lógica do dashboard do gestor
if (document.body.id === 'pagina-dashboard-gestor') {

    // LÓGICA DOS KPIs
    const eficiencia = document.querySelector('.kpi-card:nth-child(1) .kpi-value');
    const avaliacao = document.querySelector('.kpi-card:nth-child(2) .kpi-value');
    const reciclado = document.querySelector('.kpi-card:nth-child(3) .kpi-value');
    
    // funções: transfome pontos flutuantes em porcentagem, asigna nomes para a media de avaliações dos clientes
    function floatToPercent(value) { return (value * 100).toFixed(0) + '%'; }
    function avaliarMedia(value) { if (value < 0.5) return 'Ruim'; if (value < 0.7) return 'Regular'; return 'Bom'; }
    
    // banco de dados artificial
    const dados = { eficienciaRotas: 0.97, avaliacoes: [0.85, 0.80, 0.76, 0.70, 0.82, 0.79, 0.75, 0.88, 0.77, 0.71], lixoTotal: 1029384.0, lixoReciclado: 555379.0 };
    
    // calcula total de lixo reciclado
    let totalLixoReciclado = dados.lixoReciclado / dados.lixoTotal;

    // calcula a media de avaliações
    let avaliacaoMedia = dados.avaliacoes.reduce((a, b) => a + b, 0) / dados.avaliacoes.length;
    
    // atualize o conteudo do site em acordo com os dados
    eficiencia.textContent = floatToPercent(dados.eficienciaRotas);
    avaliacao.textContent = avaliarMedia(avaliacaoMedia);
    reciclado.textContent = floatToPercent(totalLixoReciclado);

    //graficos interativos
    const kpiCards = document.querySelectorAll('.kpi-card');
    const chartContainers = document.querySelectorAll('.chart-container');

    // Mapeia os cards
    const kpiMap = {
        'Eficiência das Rotas': 'chart-eficiencia',
        'Avaliação Média': 'chart-avaliacao',
        'Lixo Reciclado': 'chart-reciclado'
    };

    kpiCards.forEach(card => {
        card.addEventListener('click', () => {
            const kpiTitle = card.querySelector('h3').textContent;
            const targetChartId = kpiMap[kpiTitle];

            // 1. Remove a classe 'active' de todos os cards e gráficos
            kpiCards.forEach(c => c.classList.remove('active'));
            chartContainers.forEach(chart => chart.classList.remove('active'));

            // 2. Adiciona a classe 'active' apenas no card clicado
            card.classList.add('active');
            
            // 3. Adiciona a classe 'active' apenas no gráfico correspondente
            const targetChart = document.getElementById(targetChartId);
            if (targetChart) {
                targetChart.classList.add('active');
            }
        });
    });
}

//Lógica da página de gerenciamento de rotas - gestor
    if (document.body.id === 'pagina-gerenciar-rotas') {

        // pega form
        const form = document.getElementById('form-add-rota');

        // inputs do form
        const cidadeInput = document.getElementById('rota-cidade');
        const bairroInput = document.getElementById('rota-bairro');
        const diasInput = document.getElementById('rota-dias');
        const horarioInput = document.getElementById('rota-horario');

        // tabela
        const tabelaBody = document.getElementById('tabela-rotas-body');

        //
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

//Lógica da formação de relatórios - Gestor
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

//Lógica da página de gerenciamento de reclamações - Gestor
    if (document.body.id === 'pagina-reclamacoes-gestor') {

        //Referências aos Elementos 
        const filtroStatus = document.getElementById('filtro-status');
        const filtroCidade = document.getElementById('filtro-cidade');
        const tabelaBody = document.getElementById('tabela-reclamacoes-body');
        const todasAsLinhas = tabelaBody.querySelectorAll('tr'); // Pega todas as linhas da tabela

        // Função Principal para Aplicar os Filtros 
        function aplicarFiltros() {
            // Pega o TEXTO da opção selecionada (ex: "Pendente", "Jundiaí", "Todos")
            const statusSelecionado = filtroStatus.options[filtroStatus.selectedIndex].text;
            const cidadeSelecionada = filtroCidade.options[filtroCidade.selectedIndex].text;

            // Percorre cada linha da tabela
            todasAsLinhas.forEach(linha => {
            
                // Pega o texto da célula de Cidade (coluna 3) e Status (coluna 5)
                const cidadeDaLinha = linha.children[2].textContent;
                const statusDaLinha = linha.children[4].textContent;

                // Verifica se a linha bate com os filtros
                // A linha só é válida se a cidade bater OU se o filtro for "Todas"
                const matchCidade = (cidadeSelecionada === 'Todas') || (cidadeSelecionada === cidadeDaLinha);
                // A linha só é válida se o status bater OU se o filtro for "Todos"
                const matchStatus = (statusSelecionado === 'Todos') || (statusSelecionado === statusDaLinha);

                // Mostra ou esconde a linha
                if (matchCidade && matchStatus) {
                linha.style.display = ''; // 'display = ""' volta ao padrão (visível)
                } else {
                linha.style.display = 'none'; // Esconde a linha
                }
            });
        }

        // Eventos de "escuta" nos filtros
        // Adiciona a função aplicarFiltros para rodar toda vez que um filtro mudar
        filtroStatus.addEventListener('change', aplicarFiltros);
        filtroCidade.addEventListener('change', aplicarFiltros);

        // Lógica de Alterar Status
        tabelaBody.addEventListener('click', (event) => {
            if (event.target.matches('.btn-editar')) {
                const novoStatus = prompt("Digite o novo status (Pendente, Em Análise, Resolvido):");
                if (novoStatus) {
                    const linha = event.target.closest('tr');
                    const statusSpan = linha.querySelector('.status');
                
                    // Normaliza o status digitado para o formato da classe CSS
                    let novaClasse = `status-${novoStatus.toLowerCase().replace(/ /g, '-').replace('á', 'a')}`;

                    // Garante que o texto e a classe fiquem corretos
                    statusSpan.textContent = novoStatus;
                    statusSpan.className = `status ${novaClasse}`;
                    alert(`Status da ocorrência atualizado para "${novoStatus}".`);
                
                    // Re-aplica os filtros, pois o status da linha mudou
                    aplicarFiltros(); 
                }
            }
        });
    }

//Lógica da criação de conta - Usuário
    if (document.body.id === 'pagina-criar-conta') {

        // Referências aos Elementos 
        const form = document.getElementById('form-criar-conta');
        const nomeInput = document.getElementById('novo-nome');
        const emailInput = document.getElementById('novo-email');
        const senhaInput = document.getElementById('nova-senha');
        const confirmarSenhaInput = document.getElementById('confirmar-senha');
        const feedbackSenha = document.getElementById('feedback-senha');
        const btnCriarConta = document.getElementById('btn-criar-conta');
    
        // Função de Validação Geral
        const validarFormulario = () => {
            const nomeValido = nomeInput.value.trim().length >= 3;
            const emailValido = emailInput.value.includes('@') && emailInput.value.includes('.');
            const senhaValida = senhaInput.value.length >= 6;
            const senhasCoincidem = senhaInput.value === confirmarSenhaInput.value && senhaInput.value !== '';

            // Feedback visual para a confirmação de senha
            if (confirmarSenhaInput.value) {
                if (senhasCoincidem) {
                    feedbackSenha.textContent = 'Senhas coincidem!';
                    feedbackSenha.className = 'feedback-senha valido';
                } else {
                    feedbackSenha.textContent = 'As senhas não coincidem.';
                    feedbackSenha.className = 'feedback-senha invalido';
                }
            } else {
                feedbackSenha.textContent = '';
            }

            // Habilita o botão apenas se tudo estiver válido
            btnCriarConta.disabled = !(nomeValido && emailValido && senhaValida && senhasCoincidem);
        };

        // Adiciona "escutas" em todos os campos para validar em tempo real
        form.addEventListener('input', validarFormulario);

        // Evento de Envio do Formulário
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Faz uma última checagem antes de "criar"
            if (btnCriarConta.disabled) {
                alert('Por favor, preencha todos os campos corretamente.');
                return;
            }
        
            // Simulação de criação de conta
            alert('Conta criada com sucesso! Você será redirecionado para a página de login.');
        
            // Redireciona para o login para que o usuário possa entrar
            window.location.href = 'loginusuario.html';
        });
    }
});