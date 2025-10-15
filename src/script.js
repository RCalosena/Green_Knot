// Garante que o script só rode depois que todo o HTML for carregado
// A "GRANDE CAIXA" COMEÇA AQUI
document.addEventListener('DOMContentLoaded', () => {
    
    console.log("JavaScript carregado com sucesso!");
    
    // =======================================================
    // LÓGICA DA PÁGINA DE ROTAS (rotas.html)
    // =======================================================
    if (document.body.id === 'pagina-rotas') {
        
        // --- Referências aos Elementos ---
        const form = document.getElementById('form-busca-rota');
        const cidadeSelect = document.getElementById('cidade');
        const bairroSelect = document.getElementById('bairro');
        const resultadoContainer = document.getElementById('resultado-rota');
        
        // --- Fonte de Dados (Exemplo) ---
        const bairrosPorCidade = {
            'jundiai': ['Centro', 'Eloy Chaves', 'Vila Arens', 'Anhangabaú'],
            'cabreuva': ['Centro', 'Jacaré', 'Vilarejo', 'Pinhal'],
            'louveira': ['Centro', 'Santo Antônio', 'Bairro da Estiva'],
        };
        
        // Objeto para simular as informações das rotas
        const rotasInfo = {
            'centro': { dias: 'Segundas, Quartas e Sextas', horario: 'a partir das 19h', tipo: 'Coleta Comum' },
            'eloy-chaves': { dias: 'Terças, Quintas e Sábados', horario: 'a partir das 08h', tipo: 'Coleta Comum e Seletiva' },
            'vila-arens': { dias: 'Segundas, Quartas e Sextas', horario: 'a partir das 08h', tipo: 'Coleta Comum' },
            'jacare': { dias: 'Terças e Quintas', horario: 'a partir das 18h', tipo: 'Coleta Comum' },
        };
        
        
        // --- Evento de Mudança no Select de Cidade (Lógica que já tínhamos) ---
        cidadeSelect.addEventListener('change', () => {
            const cidadeSelecionada = cidadeSelect.value;
            bairroSelect.innerHTML = '<option value="">Selecione o seu bairro</option>';
            resultadoContainer.innerHTML = ''; // Limpa o resultado se trocar de cidade
            
            if (cidadeSelecionada && bairrosPorCidade[cidadeSelecionada]) {
                bairroSelect.disabled = false;
                const bairros = bairrosPorCidade[cidadeSelecionada];
                bairros.forEach(bairro => {
                    const option = new Option(bairro, bairro.toLowerCase().replace(/\s/g, '-'));
                    bairroSelect.appendChild(option);
                });
            } else {
                bairroSelect.disabled = true;
            }
        });
        
        // --- NOVO: Evento de Envio do Formulário ---
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o recarregamento da página
            
            const bairroSelecionado = bairroSelect.value;
            
            // Limpa resultados anteriores
            resultadoContainer.innerHTML = '';
            
            if (bairroSelecionado && rotasInfo[bairroSelecionado]) {
                // Se encontramos informações para o bairro
                const rota = rotasInfo[bairroSelecionado];
                
                // Monta o HTML do resultado
                const resultadoHTML = `
                <div class="resultado-card">
                <h3>Resultado para: ${bairroSelect.options[bairroSelect.selectedIndex].text}</h3>
                <ul>
                <li><strong>Dias da Coleta:</strong> ${rota.dias}</li>
                <li><strong>Horário:</strong> ${rota.horario}</li>
                <li><strong>Tipo de Coleta:</strong> ${rota.tipo}</li>
                </ul>
                </div>
                `;
                resultadoContainer.innerHTML = resultadoHTML;
                
            } else if (bairroSelecionado) {
                // Se o bairro foi selecionado mas não temos dados para ele
                resultadoContainer.innerHTML = `
                <div class="resultado-card--erro">
                <p>Desculpe, ainda não temos informações detalhadas para este bairro.</p>
                </div>
                `;
            } else {
                // Se o usuário não selecionou um bairro
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
                console.log("Login válido. Simulando autenticação...");
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
    // LÓGICA DA PÁGINA INICIAL (index.html)
    // =======================================================
    if (document.body.id === 'pagina-inicial') {
        
        // --- [1] Verifica os dois tipos de token no localStorage ---
        const userToken = localStorage.getItem('user_token');
        const gestorToken = localStorage.getItem('gestor_token');
        
        // Seleciona o botão de Login
        const loginButton = document.querySelector('.nav-menu a.nav-button');
        
        // --- [2] Lógica para GESTOR logado ---
        if (gestorToken) {
            console.log("Gestor está logado.");
            
            if (loginButton) {
                // Altera o botão para o logout do GESTOR
                loginButton.textContent = 'Sair (Gestor)';
                loginButton.href = '#'; 
                
                loginButton.addEventListener('click', (event) => {
                    event.preventDefault(); 
                    localStorage.removeItem('gestor_token'); // Remove o token do gestor
                    alert('Você saiu da sua conta de gestor.');
                    window.location.reload();
                });
            }
            
            // --- [3] Lógica para USUÁRIO COMUM logado ---
        } else if (userToken) {
            console.log("Usuário está logado.");
            
            if (loginButton) {
                // Altera o botão para o logout do USUÁRIO (como já estava antes)
                loginButton.textContent = 'Sair';
                loginButton.href = '#'; 
                
                loginButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    localStorage.removeItem('user_token'); // Remove o token do usuário
                    alert('Você saiu da sua conta.');
                    window.location.reload();
                });
            }
            
            // --- [4] Lógica para quando NINGUÉM está logado ---
        } else {
            console.log("Nenhum usuário logado.");
            // Não fazemos nada, o botão "Fazer Login" continua normal.
        }
    }
    
    // =======================================================
    // LÓGICA DA PÁGINA DE LOGIN DE GESTOR (logingestor.html)
    // =======================================================

    const total = 50; //n máximo de caracteres

    // Debounce do input no login
    function debounce(fn, delay = 200) {
        let id;
        return (...args) => {
            clearTimeout(id);
            id = setTimeout(() => fn(...args), delay);
        };
    }

    if (document.body.id === 'pagina-login-gestor') {
        
        // --- [1] Referências aos Elementos ---
        const loginForm = document.querySelector('.login-card form');
        const cnpjInput = document.getElementById('cnpj');
        const emailInput = document.getElementById('email-gestor');
        const senhaInput = document.getElementById('senha-gestor');

        //debounce
        [cnpjInput, emailInput, senhaInput].forEach(input => {
            input.addEventListener("input", debounce((e) => {
                if (e.target.value.length > total) {
                    e.target.value = e.target.value.slice(0, total);
                }
            }, 150));
        });

        // --- [2] Evento de Envio do Formulário ---
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o recarregamento da página

            // --- [3] Validação ---
            const cnpj = cnpjInput.value.trim();
            const email = emailInput.value.trim();
            const senha = senhaInput.value.trim();

            // Verificamos se TODOS os campos foram preenchidos
            if (cnpj && email && senha) {
            
                console.log("Login de GESTOR válido. Simulando autenticação...");

                // [3.1] Criamos um token falso diferente para o gestor
                const tokenFalsoGestor = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NTQzMjEiLCJuYW1lIjoiSm9hbyBHZXN0b3IiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.Qo_s-y28t_mY-Qy-YxVb-wX-YxWb-wX-YxVb-wX-YxW";

                // [3.2] Armazenamos o token com um nome diferente para não confundir com o do usuário
                localStorage.setItem('gestor_token', tokenFalsoGestor);

                // [3.3] Damos feedback e redirecionamos
                alert('Login de Gestor realizado com sucesso! Redirecionando...');
            
                // Em um projeto real, redirecionaríamos para o dashboard do gestor.
                // Por enquanto, vamos voltar para a home.
                // Redireciona para a nova página de dashboard do gestor
                window.location.href = '../gestor/dashboard.html';

            } else {
                // Se um dos campos estiver vazio, mostramos um erro
                alert('Por favor, preencha todos os campos do formulário.');
            }
    });
}
    // =======================================================
    // LÓGICA DA PÁGINA DE RECLAMAÇÕES (reclamacoes.html)
    // =======================================================
    if (document.body.id === 'pagina-reclamacoes') {
    
        // --- [1] Referências aos Elementos ---
        const form = document.getElementById('form-reclamacao');
        const nomeInput = document.getElementById('reclamacao-nome');
        const cidadeInput = document.getElementById('reclamacao-cidade');
        const tituloInput = document.getElementById('reclamacao-titulo');
        const mensagemInput = document.getElementById('reclamacao-mensagem');
        const btnPublicar = document.getElementById('btn-publicar');
        const postsContainer = document.getElementById('posts-container');

        // --- [2] Função de Validação Geral ---
        const validarFormulario = () => {
            const nomeValido = nomeInput.value.trim().length >= 3;
            const cidadeValida = cidadeInput.value.trim().length >= 3;
            const tituloValido = tituloInput.value.trim().length >= 5;
            const mensagemValida = mensagemInput.value.trim().length >= 15;

            // A linha abaixo é um atalho para o if/else.
            // Se tudo for válido, `disabled` se torna `false`. Se não, se torna `true`.
            btnPublicar.disabled = !(nomeValido && cidadeValida && tituloValido && mensagemValida);
        };

        // --- [3] Eventos de Input em Tempo Real ---
        nomeInput.addEventListener('input', validarFormulario);
        cidadeInput.addEventListener('input', validarFormulario);
        tituloInput.addEventListener('input', validarFormulario);
        mensagemInput.addEventListener('input', validarFormulario);

        // --- [4] Evento de Envio do Formulário ---
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Faz uma última validação antes de publicar
            if (btnPublicar.disabled) {
                alert('Por favor, preencha todos os campos corretamente antes de publicar.');
                return; // Interrompe a função aqui se o formulário for inválido
            }

            const nome = nomeInput.value.trim();
            const cidade = cidadeInput.value.trim();
            const titulo = tituloInput.value.trim();
            const mensagem = mensagemInput.value.trim();

            const novoPost = document.createElement('article');
            novoPost.classList.add('post-item');

            novoPost.innerHTML = `
                <h4>${titulo}</h4>
                <p class="post-meta"><strong>Autor:</strong> ${nome} | <strong>Cidade:</strong> ${cidade}</p>
                <p>${mensagem}</p>
            `;

            postsContainer.prepend(novoPost);

            form.reset();
            validarFormulario(); // Chama a validação para desabilitar o botão novamente

            alert('Sua ocorrência foi publicada com sucesso!');
        });
}

    // =======================================================
    // LÓGICA DO DASHBOARD DO GESTOR (dashboard.html)
    // =======================================================

    // Só executa se estiver na página correta

    // --- [1] Elementos de exibição ---
    
    if (document.body.id === 'pagina-dashboard-gestor') {
        
        
        // --- [1] O "GUARDA" - Proteção da Página ---
        // Esta é a primeira coisa que o script faz ao carregar a página.
        const gestorToken = localStorage.getItem('gestor_token');
        
        if (!gestorToken) {
            // Se NÃO houver token de gestor...
            alert('Acesso negado. Por favor, faça o login como gestor.');
            // Expulsa o usuário, redirecionando-o para a página de login.
            window.location.href = '../login/logingestor.html';
        } else {
            // Se o token existir, o resto do código pode ser executado com segurança.
            console.log("Acesso ao dashboard permitido.");
            
            // --- [2] Funcionalidade de Logout ---
            const btnLogout = document.getElementById('btn-logout');
            
            btnLogout.addEventListener('click', (event) => {
                event.preventDefault(); // Impede que o link '#' cause um pulo na página
                
                // Remove o token do gestor do localStorage
                localStorage.removeItem('gestor_token');
                
                alert('Você saiu da sua conta de gestor.');
                
                // Redireciona de volta para a tela de login
                window.location.href = '../login/logingestor.html';
            });
            
            // --- [BÔNUS] Exibir o Nome do Gestor ---
            // Decodificando o token para pegar o nome (como na Aula 16 de JWT)
            try {
                const payload = JSON.parse(atob(gestorToken.split('.')[1]));
                const nomeGestor = payload.name || 'Gestor'; // Pega o nome do payload
                document.getElementById('nome-gestor').textContent = `Bem-vindo, ${nomeGestor}!`;
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
                // Se der erro, mantém a mensagem padrão.
            }


            // Dados dinâmicos
            const eficiencia = document.querySelector('.kpi-card:nth-child(1) .kpi-value');
            const avaliacao  = document.querySelector('.kpi-card:nth-child(2) .kpi-value');
            const reciclado  = document.querySelector('.kpi-card:nth-child(3) .kpi-value');
        
            //floats pra porcentagem
            function floatToPercent(value) {
                return (value * 100).toFixed(0) + '%';
            }
        
            //Função para converter nota em texto
            // 0.0–0.4 = Ruim | 0.5–0.7 = Regular | 0.7–1.0 = Bom
            function avaliarMedia(value) {
                if (value < 0.5) return 'Ruim';
                if (value < 0.7) return 'Regular';
                return 'Bom';
            }
        
            // esses dados seríam pegados de um API
            const dados = {
                eficienciaRotas: 0.97,

                avaliacoes: [ 
                    0.85, 
                    0.80, 
                    0.76, 
                    0.70, 
                    0.82, 
                    0.79, 
                    0.75, 
                    0.88, 
                    0.77, 
                    0.71
                ],

                lixoTotal: 1029384.0,
                lixoReciclado: 555379.0,
            };
            
            let totalLixoReciclado = dados.lixoReciclado / dados.lixoTotal;
            let avaliacaoMedia = dados.avaliacoes.reduce((a, b) => a + b, 0) / dados.avaliacoes.length;
            
            //Atualiza os elementos
            eficiencia.textContent = floatToPercent(dados.eficienciaRotas);
            avaliacao.textContent  = avaliarMedia(avaliacaoMedia);
            reciclado.textContent  = floatToPercent(totalLixoReciclado);
        }
    }
    
    


}); // E A "GRANDE CAIXA" FECHA SÓ AQUI, NO FINAL DE TUDO.