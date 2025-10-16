window.addEventListener('DOMContentLoaded', () => {
        const botoes = document.querySelectorAll('.opcao');
        const indicador = document.getElementById('indicador');
        const selecionado = document.querySelector('.opcao.selecionado');

        if (selecionado) {
            const index = Array.from(botoes).indexOf(selecionado);
            indicador.style.left = `${index * 50}%`;
        }
    });

    function moverBarra(botao) {
        const botoes = document.querySelectorAll('.opcao');
        botoes.forEach(b => b.classList.remove('selecionado'));
        botao.classList.add('selecionado');

        const indicador = document.getElementById('indicador');
        const index = Array.from(botoes).indexOf(botao);
        indicador.style.left = `${index * 50}%`;

        console.log("Selecionado:", botao.textContent.trim());

        if (botao.textContent.trim().toLowerCase() === 'professor') {
            window.location.href = '/LinkDif/Home/Cadastro_Prof.html';
        } else {
            window.location.href = '/LinkDif/Home/Cadastro.html'
        }
    }
