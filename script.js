// Declaração das variáveis que armazenam os elementos do HTML
let questoes = []; // Array para armazenar as questões do quiz
const elementoPergunta = document.getElementById("pergunta"); // Elemento que exibe a pergunta
const botoesRespostas = document.getElementById("botoes-respostas"); // Contêiner para as opções de respostas
const botaoProximo = document.getElementById("botao-proximo"); // Botão para avançar para a próxima questão
const botaoIniciar = document.getElementById("botao-iniciar"); // Botão para iniciar o quiz
const telaInicial = document.getElementById("tela-inicial"); // Tela inicial do quiz
const quizDiv = document.querySelector(".quiz"); // Div que contém o quiz
const reiniciarQuizDiv = document.getElementById("reiniciar-quiz"); // Div com o botão de reiniciar
const botaoReiniciar = document.getElementById("botao-reiniciar"); // Botão de reiniciar o quiz

let indiceQuestaoAtual = 0; // Índice da questão atual
let pontuacao = 0; // Pontuação do jogador

// Função para carregar as questões de um arquivo JSON
async function carregarQuestoes() {
    try {
        const resposta = await fetch("perguntas.json"); // Carrega as questões do arquivo JSON
        questoes = await resposta.json(); // Converte a resposta para JSON
        iniciarQuiz(); // Inicia o quiz depois de carregar as questões
    } catch (erro) {
        console.error("Erro ao carregar as questões:", erro); // Se houver erro ao carregar, exibe no console
        elementoPergunta.innerHTML = "Erro ao carregar as perguntas. Tente novamente."; // Exibe mensagem de erro
    }
}

// Função para mostrar a tela do quiz, escondendo a tela inicial
function mostrarTelaQuiz() {
    telaInicial.style.display = "none"; // Esconde a tela inicial
    quizDiv.style.display = "block"; // Exibe a tela do quiz
    reiniciarQuizDiv.style.display = "none"; // Esconde o botão de reiniciar no início
    iniciarQuiz(); // Inicia o quiz
}

// Função para iniciar o quiz, reiniciando o índice e a pontuação
function iniciarQuiz() {
    indiceQuestaoAtual = 0; // Reseta o índice da questão
    pontuacao = 0; // Reseta a pontuação
    botaoProximo.innerHTML = "Próxima"; // Altera o texto do botão de próximo
    mostrarPergunta(); // Mostra a primeira pergunta
}

// Função para mostrar uma nova pergunta
function mostrarPergunta() {
    resetarEstado(); // Reseta os botões de resposta
    const questaoAtual = questoes[indiceQuestaoAtual]; // Obtém a questão atual
    const numeroPergunta = indiceQuestaoAtual + 1; // Exibe o número da pergunta
    elementoPergunta.innerHTML = numeroPergunta + ". " + questaoAtual.pergunta; // Exibe a pergunta

    // Cria um botão para cada resposta
    questaoAtual.respostas.forEach((resposta) => {
        const botao = document.createElement("button"); // Cria o botão de resposta
        botao.innerHTML = resposta.texto; // Define o texto do botão como a resposta
        botao.classList.add("botao"); // Adiciona a classe 'botao' ao botão
        botoesRespostas.appendChild(botao); // Adiciona o botão ao contêiner de respostas

        // Marca o botão como correto caso a resposta seja correta
        if (resposta.correta) {
            botao.dataset.correta = resposta.correta; // Armazena a informação se a resposta está correta
        }

        // Adiciona um evento de clique ao botão
        botao.addEventListener("click", selecionarResposta);
    });
}

// Função para resetar o estado entre as perguntas
function resetarEstado() {
    botaoProximo.style.display = "none"; // Esconde o botão de próximo até que o usuário escolha uma resposta
    // Remove todos os botões de resposta antigos
    while (botoesRespostas.firstChild) {
        botoesRespostas.removeChild(botoesRespostas.firstChild);
    }
}

// Função para lidar com a seleção de uma resposta
function selecionarResposta(e) {
    const botaoSelecionado = e.target; // Obtém o botão clicado
    const estaCorreta = botaoSelecionado.dataset.correta === "true"; // Verifica se a resposta está correta
    
    // Se a resposta estiver correta, marca a resposta como correta e aumenta a pontuação
    if (estaCorreta) {
        botaoSelecionado.classList.add("correta");
        pontuacao++;
    } else {
        botaoSelecionado.classList.add("incorreta"); // Marca a resposta como incorreta
    }
     // Encontra a resposta correta e a marca
     Array.from(botoesRespostas.children).forEach(botao => {
        if (botao.dataset.correta === "true") {
            botao.classList.add("correta"); // Marca a resposta correta
        }
    });
    
    // Desabilita todos os botões de resposta após uma escolha
    Array.from(botoesRespostas.children).forEach(botao => botao.disabled = true);
    botaoProximo.style.display = "block"; // Exibe o botão de próximo
}

// Função para avançar para a próxima questão
function avancarQuestao() {
    indiceQuestaoAtual++; // Avança para a próxima questão
    if (indiceQuestaoAtual < questoes.length) {
        mostrarPergunta(); // Se houver mais questões, exibe a próxima
    } else {
        mostrarResultado(); // Caso contrário, exibe o resultado
    }
}

// Função para mostrar o resultado final
function mostrarResultado() {
    quizDiv.innerHTML = `
        <h2>Você finalizou o quiz!</h2>
        <p>Sua pontuação foi: ${pontuacao} de ${questoes.length}</p>
    `;
    reiniciarQuizDiv.style.display = "block"; // Exibe o botão de reiniciar
}

// Função para reiniciar o quiz recarregando a página
function reiniciarQuiz() {
    location.reload(); // Isso recarrega a página e reinicia todo o estado
}

// Adiciona os eventos aos botões
botaoIniciar.addEventListener("click", mostrarTelaQuiz); // Inicia o quiz ao clicar em "Iniciar"
botaoProximo.addEventListener("click", avancarQuestao); // Avança para a próxima questão ao clicar em "Próxima"
botaoReiniciar.addEventListener("click", reiniciarQuiz); // Reinicia o quiz ao clicar em "Reiniciar"

// Carrega as questões ao carregar a página
carregarQuestoes();
