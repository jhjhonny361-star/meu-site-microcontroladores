document.addEventListener("DOMContentLoaded", function() {
    let currentStep = 1;
    const totalSteps = 6;
    
    // Contadores de pontuação de decisão
    let score = {
        arduino: 0,
        esp32: 0,
        mega: 0
    };

    const btnProximo = document.getElementById("btn-proximo");
    const btnVoltar = document.getElementById("btn-voltar");
    const progresso = document.getElementById("progresso");

    function updateQuizView() {
        // Atualiza a barra de progresso visual
        const percent = ((currentStep - 1) / totalSteps) * 100;
        progresso.style.width = percent + "%";

        // Gerencia visibilidade das perguntas
        document.querySelectorAll(".question-step").forEach(step => {
            step.classList.remove("active");
        });
        document.querySelector(`[data-step="${currentStep}"]`).classList.add("active");

        // Gerencia estado do botão Voltar
        if (currentStep === 1) {
            btnVoltar.disabled = true;
        } else {
            btnVoltar.disabled = false;
        }

        // Altera texto do botão na última etapa
        if (currentStep === totalSteps) {
            btnProximo.innerText = "Finalizar Respostas";
        } else {
            btnProximo.innerText = "Avançar";
        }
    }

    btnProximo.addEventListener("click", function() {
        // Validação: Verificar se alguma opção foi marcada na pergunta corrente
        const currentSelected = document.querySelector(`[data-step="${currentStep}"] input[type="radio"]:checked`);
        
        if (!currentSelected) {
            alert("Por favor, selecione uma das opções antes de prosseguir com o teste.");
            return;
        }

        // Se estiver na última pergunta, processa a decisão final
        if (currentStep === totalSteps) {
            computarResultado();
            return;
        }

        currentStep++;
        updateQuizView();
    });

    btnVoltar.addEventListener("click", function() {
        if (currentStep > 1) {
            currentStep--;
            updateQuizView();
        }
    });

    function computarResultado() {
        // Coleta todos os inputs checados
        const answers = document.querySelectorAll('input[type="radio"]:checked');
        
        // Zera o score antes de recalcular
        score.arduino = 0;
        score.esp32 = 0;
        score.mega = 0;

        answers.forEach(ans => {
            if (ans.value === "ard") score.arduino++;
            if (ans.value === "esp") score.esp32++;
            if (ans.value === "ard_mega") score.mega++;
        });

        // Oculta formulário e exibe tela de resultado
        document.getElementById("quiz-form").style.display = "none";
        progresso.style.width = "100%";
        
        const resBox = document.getElementById("resultado-box");
        const resTitle = document.getElementById("resultado-mcu");
        const resDesc = document.getElementById("resultado-desc");
        resBox.style.display = "block";

        // Lógica algorítmica de recomendação baseada em pesos
        if (score.mega > 0) {
            resTitle.innerText = "Arduino Mega 2560";
            resTitle.style.color = "#22c55e";
            resDesc.innerText = "Seu projeto exige controle em massa de hardware e muitas fiações diretas sem foco massivo em redes de internet. O Arduino Mega dará a estabilidade elétrica de 5V necessária com portas sobressalentes.";
        } else if (score.esp32 >= score.arduino) {
            resTitle.innerText = "Linha ESP32 (Dev Module / S3)";
            resTitle.style.color = "#06b6d4";
            resDesc.innerText = "Como seu projeto demanda processamento rápido, conectividade sem fio nativa (Wi-Fi/Bluetooth) ou gerenciamento otimizado de energia por baterias, o ecossistema ESP32 é sem dúvidas a escolha ideal.";
        } else {
            resTitle.innerText = "Arduino Uno R4 (WiFi)";
            resTitle.style.color = "#22c55e";
            resDesc.innerText = "A simplicidade e facilidade de depuração são ideais para o escopo do seu projeto. O Uno R4 fornecerá bibliotecas consolidadas e proteção estável para a execução do circuito.";
        }
    }
});