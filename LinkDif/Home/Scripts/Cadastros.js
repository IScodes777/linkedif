document.addEventListener('DOMContentLoaded', () => {
    // --- 0. VERIFICAR STATUS DE LOGIN ---
    // Se o usuário já estiver logado (sessão ativa), redireciona para a página principal
    if (sessionStorage.getItem('user_logged_in') === 'true') {
        window.location.href = '/LinkDif/Home/index.html'; 
        return; // Para a execução do script
    }

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toggleAuthMode = document.getElementById('toggle-auth-mode');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const toggleMessage = document.getElementById('toggle-message');
    const googleLoginBtn = document.getElementById('google-login-btn');
    
    // --- LÓGICA DE TEMA ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light'; 
    document.body.setAttribute('data-theme', savedTheme);
    const updateThemeIcon = (theme) => {
            themeToggleBtn.querySelector('i').className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    };
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'ligth' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    updateThemeIcon(savedTheme);
    
    // --- LÓGICA DE MOSTRAR/ESCONDER SENHA ---
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', () => {
            const targetId = icon.dataset.target;
            const targetInput = document.getElementById(targetId);
            
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                targetInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    let isLoginMode = true;

    // --- LÓGICA DE ALTERNÂNCIA (Login <-> Cadastro) ---
    toggleAuthMode.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;

        [loginForm, registerForm].forEach(form => {
            form.reset();
            form.querySelectorAll('.form-group.invalid').forEach(group => group.classList.remove('invalid'));
            form.querySelectorAll('.toggle-password').forEach(icon => {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                document.getElementById(icon.dataset.target).type = 'password';
            });
        });
        document.getElementById('login-submit-btn').disabled = true;
        document.getElementById('register-submit-btn').disabled = true;

        if (isLoginMode) {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            authTitle.textContent = 'Faça Login';
            authSubtitle.textContent = 'Acesse o ambiente de projetos e rede institucional.';
            toggleMessage.textContent = 'Novo no Linkedif?';
            toggleAuthMode.textContent = 'Crie sua conta';
        } else {
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
            authTitle.textContent = 'Crie sua Conta';
            authSubtitle.textContent = 'Junte-se à nossa rede de pesquisa e projetos.';
            toggleMessage.textContent = 'Já tem uma conta?';
            toggleAuthMode.textContent = 'Faça login';
        }
    });
    
    // --- SIMULAÇÃO DE LOGIN COM GOOGLE ---
    googleLoginBtn.addEventListener('click', () => {
        googleLoginBtn.disabled = true;
        googleLoginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conectando ao Google...';

        setTimeout(() => {
            // Armazena o login na sessão
            sessionStorage.setItem('user_logged_in', 'true');
            alert("Autenticação com Google bem-sucedida! Redirecionando...");
            window.location.href = '/LinkDif/Home/index.html'; 
        }, 1500); 
    });
    
    // --- LÓGICA DE VALIDAÇÃO E SUBMISSÃO DE LOGIN ---
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginSubmitBtn = document.getElementById('login-submit-btn');

    const checkLoginFields = () => {
        const emailValid = loginEmailInput.value.length > 0 && loginEmailInput.checkValidity();
        const passwordValid = loginPasswordInput.value.length >= 6;
        
        loginSubmitBtn.disabled = !(emailValid && passwordValid);
    };
    
    [loginEmailInput, loginPasswordInput].forEach(input => {
        input.addEventListener('input', checkLoginFields);
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('login-password-group').classList.remove('invalid'); // Limpa erro anterior
        
        // Simulação: Apenas o login 'teste@exemplo.com' com senha '123456' funciona
        if (loginPasswordInput.value !== '123456' || loginEmailInput.value.toLowerCase() !== 'teste@exemplo.com') { 
            document.getElementById('login-password-error').textContent = 'E-mail ou senha incorretos.';
            document.getElementById('login-password-group').classList.add('invalid');
            return;
        }
        
        // Login bem-sucedido
        sessionStorage.setItem('user_logged_in', 'true');
        alert("Login simulado bem-sucedido! Redirecionando para o Feed.");
        window.location.href = '/LinkDif/Home/index.html'; 
    });


    // --- LÓGICA DE VALIDAÇÃO E SUBMISSÃO DE CADASTRO (COMPLETO) ---
    const registerNameInput = document.getElementById('register-name');
    const registerEmailInput = document.getElementById('register-email');
    const registerPasswordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const acceptTermsCheckbox = document.getElementById('accept-terms');
    const registerSubmitBtn = document.getElementById('register-submit-btn');

    const checkRegisterFields = () => {
        // Validação de nome
        const nameValid = registerNameInput.value.trim().length > 0;
        registerNameInput.parentElement.classList.toggle('invalid', !nameValid && registerNameInput.value.length > 0);

        // Validação de e-mail
        const emailValid = registerEmailInput.checkValidity();
        registerEmailInput.parentElement.classList.toggle('invalid', !emailValid && registerEmailInput.value.length > 0);

        // Validação de senhas e confirmação
        const passwordValid = registerPasswordInput.value.length >= 6;
        const passwordsMatch = registerPasswordInput.value === confirmPasswordInput.value;

        registerPasswordInput.parentElement.classList.toggle('invalid', !passwordValid && registerPasswordInput.value.length > 0);
        confirmPasswordInput.parentElement.classList.toggle('invalid', !passwordsMatch && confirmPasswordInput.value.length > 0);

        // Habilita/Desabilita o botão
        registerSubmitBtn.disabled = !(
            nameValid && 
            emailValid && 
            passwordValid && 
            passwordsMatch && 
            acceptTermsCheckbox.checked
        );
    };

    // Adiciona listeners para todos os campos do cadastro
    [registerNameInput, registerEmailInput, registerPasswordInput, confirmPasswordInput, acceptTermsCheckbox].forEach(input => {
        input.addEventListener('input', checkRegisterFields);
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Revalida a confirmação final
        if (registerPasswordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.parentElement.classList.add('invalid');
            return;
        }

        alert("Cadastro simulado bem-sucedido! Redirecionando para o Feed.");
        
        // Login automático após o cadastro
        sessionStorage.setItem('user_logged_in', 'true');
        window.location.href = '/LinkDif/Home/index.html'; 
    });
    
});