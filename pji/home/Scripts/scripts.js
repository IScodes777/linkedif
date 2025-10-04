// Verificação de senha
document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("Email");
    const passwordInput = document.getElementById("Password");
    const confirmPasswordInput = document.getElementById("Password-Confirm");
    const confirmButton = document.querySelector(".Prox");
    
    // Mensagem de erro do email e da senha
    const errorMessage = document.createElement("p");
    errorMessage.style.color = "red";
    errorMessage.style.fontSize = "0.9em";
    errorMessage.style.marginTop = "5px";
    confirmPasswordInput.insertAdjacentElement("afterend", errorMessage);

    confirmButton.addEventListener("click", function () {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        errorMessage.textContent = ""; // Limpa mensagem anterior

        // Validação do email institucional
        if (
            !email.endsWith("@aluno.if.edu.br") &&
            !email.endsWith("@professor.if.edu.br")
            ) {
            errorMessage.textContent = "Por favor, insira um email institucional válido (@aluno.if.edu.br ou @professor.if.edu.br).";
            return;
        }
    
        // Validação da senha
        if (password.length < 8 || password.length > 16) {
            errorMessage.textContent = "A senha deve ter entre 8 e 16 caracteres.";
            return;
        }


        // Verificação de confirmação de senha
        if (password !== confirmPassword) {
            errorMessage.textContent = "As senhas não coincidem.";
            return;
        }

        alert("Cadastro realizado com sucesso!");
    });
});
