
            document.addEventListener('DOMContentLoaded', function() {
            
            // --- REFERÊNCIAS AOS ELEMENTOS DO HTML ---
            const seletorDia = document.getElementById('seletor-dia');
            const tituloDiaAtual = document.getElementById('titulo-dia-atual');
            const inputTarefa = document.getElementById('input-tarefa');
            const btnAdicionarTarefa = document.getElementById('btn-adicionar-tarefa');
            const listaDeTarefas = document.getElementById('lista-de-tarefas');

            // --- DADOS DA APLICAÇÃO ---
            const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
            
            // Tenta carregar as tarefas do armazenamento local do navegador (localStorage).
            let tarefas = JSON.parse(localStorage.getItem('tarefasPlanner')) || {};

            // Garante que cada dia da semana exista como uma chave no nosso objeto `tarefas`.
            diasDaSemana.forEach(dia => {
                if (!tarefas[dia]) {
                    tarefas[dia] = []; // Ex: tarefas['Segunda'] = []
                }
            });

            // Define o dia selecionado inicialmente como o dia atual.
            let diaSelecionado = diasDaSemana[new Date().getDay()];

            // --- FUNÇÕES ---

            // Função para salvar o objeto `tarefas` no localStorage.
            function salvarTarefas() {
                localStorage.setItem('tarefasPlanner', JSON.stringify(tarefas));
            }

            // Função para mostrar as tarefas na tela.
            function renderizarTarefas() {
                listaDeTarefas.innerHTML = '';
                tituloDiaAtual.textContent = `Tarefas de ${diaSelecionado}`;
                const tarefasDoDia = tarefas[diaSelecionado];

                if (tarefasDoDia.length === 0) {
                    listaDeTarefas.innerHTML = '<li>Nenhuma tarefa para este dia.</li>';
                    return;
                }

                tarefasDoDia.forEach(function(objetoTarefa, indice) {
                    const itemLista = document.createElement('li');
                    itemLista.className = 'item-tarefa';
                    
                    if (objetoTarefa.completed) {
                        itemLista.classList.add('concluida');
                    }

                    const textoTarefa = document.createElement('span');
                    textoTarefa.textContent = objetoTarefa.text;
                    
                    textoTarefa.addEventListener('click', function() {
                        alternarConclusaoTarefa(indice);
                    });

                    const btnRemover = document.createElement('button');
                    btnRemover.textContent = 'Remover';
                    btnRemover.className = 'btn-remover';
                    
                    btnRemover.addEventListener('click', function() {
                        removerTarefa(indice);
                    });

                    itemLista.appendChild(textoTarefa);
                    itemLista.appendChild(btnRemover);
                    listaDeTarefas.appendChild(itemLista);
                });
            }
            
            // Função para marcar/desmarcar uma tarefa como concluída
            function alternarConclusaoTarefa(indiceTarefa) {
                tarefas[diaSelecionado][indiceTarefa].completed = !tarefas[diaSelecionado][indiceTarefa].completed;
                salvarTarefas();
                renderizarTarefas();
            }
            
            // Função para remover uma tarefa
            function removerTarefa(indiceTarefa) {
                tarefas[diaSelecionado].splice(indiceTarefa, 1);
                salvarTarefas();
                renderizarTarefas();
            }

            // Função para adicionar uma nova tarefa.
            function adicionarTarefa() {
                const texto = inputTarefa.value.trim();
                if (texto !== "") {
                    tarefas[diaSelecionado].push({ text: texto, completed: false });
                    inputTarefa.value = "";
                    salvarTarefas();
                    renderizarTarefas();
                    inputTarefa.focus();
                }
            }
            
            // Função para criar os botões dos dias da semana.
            function criarBotoesDia() {
                diasDaSemana.forEach(function(dia) {
                    const botao = document.createElement('button');
                    botao.textContent = dia;
                    botao.className = 'botao-dia';

                    if (dia === diaSelecionado) {
                        botao.classList.add('ativo');
                    }
                    
                    botao.addEventListener('click', function() {
                        const ativoAtual = document.querySelector('.botao-dia.ativo');
                        if (ativoAtual) {
                            ativoAtual.classList.remove('ativo');
                        }
                        
                        botao.classList.add('ativo');
                        diaSelecionado = dia;
                        renderizarTarefas();
                    });
                    
                    seletorDia.appendChild(botao);
                });
            }

            // --- INICIALIZAÇÃO DA APLICAÇÃO ---
            btnAdicionarTarefa.addEventListener('click', adicionarTarefa);
            
            inputTarefa.addEventListener('keypress', function(evento) {
                if (evento.key === 'Enter') {
                    adicionarTarefa();
                }
            });

            criarBotoesDia();
            renderizarTarefas();
        });