const themeToggle = document.getElementById('theme-toggle');
const themeText = document.getElementById('theme-text');
const body = document.body;
const icon = themeToggle.querySelector('i');

// 1. Função para aplicar o tema e salvar a preferência
function applyTheme(theme) {
    if (theme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        themeText.textContent = 'Escuro'; // Atualiza o texto para "Escuro"
        localStorage.setItem('theme', 'dark');
    } else {
        body.removeAttribute('data-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        themeText.textContent = 'Claro'; // Atualiza o texto para "Claro"
        localStorage.setItem('theme', 'light');
    }
}

// 2. Lógica para carregar o tema salvo ou usar a preferência do sistema
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    // Verifica se o sistema operacional prefere o modo escuro
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        // Usa o tema salvo (preferência do usuário)
        applyTheme(savedTheme);
    } else if (prefersDark) {
        // Aplica modo escuro se for a primeira visita E o sistema preferir escuro
        applyTheme('dark');
    } else {
        // Padrão: modo claro
        applyTheme('light');
    }

    // Inicialização da funcionalidade do Mini-Chat
    const chatHeader = document.querySelector('.chat-header');
    if (chatHeader) {
        chatHeader.addEventListener('click', function() {
            const chatIcon = this.querySelector('.fa-chevron-up, .fa-chevron-down');
            const chatBody = document.querySelector('.chat-body');
            
            chatBody.classList.toggle('open');
            
            if (chatBody.classList.contains('open')) {
                chatIcon.classList.remove('fa-chevron-up');
                chatIcon.classList.add('fa-chevron-down');
            } else {
                chatIcon.classList.remove('fa-chevron-down');
                chatIcon.classList.add('fa-chevron-up');
            }
        });
    }
});

// 3. Listener para o botão de alternância de tema
themeToggle.addEventListener('click', (e) => {
    // Previne a navegação padrão
    e.preventDefault(); 
    
    const currentTheme = body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});

// Listener para o link pai (para aumentar a área de clique)
document.querySelector('.theme-toggle-link').addEventListener('click', (e) => {
     // Garante que o clique no link pai acione o botão (a menos que já tenha clicado no botão)
    if(e.target.id !== 'theme-toggle' && !e.target.closest('#theme-toggle')) {
         themeToggle.click();
    }
    e.preventDefault(); // Necessário para evitar que a página tente navegar para '#'
});