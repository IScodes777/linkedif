document.addEventListener('DOMContentLoaded', () => {

    // VARIÁVEIS DE TEMA E POP-UPS
    const themeToggle = document.getElementById('theme-toggle');
    const themeText = document.getElementById('theme-text');
    const body = document.body;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    const messagesToggle = document.getElementById('messages-toggle');
    const notificationsToggle = document.getElementById('notifications-toggle');
    const redeToggle = document.getElementById('rede-toggle');
    const projetosToggle = document.getElementById('projetos-toggle');

    const messagesPopup = document.querySelector('.messages-popup');
    const notificationsPopup = document.querySelector('.notifications-popup');
    const redePopup = document.querySelector('.rede-popup');
    const projetosPopup = document.querySelector('.projetos-popup');
    
    const allPopups = [messagesPopup, notificationsPopup, redePopup, projetosPopup];

    // VARIÁVEIS DO MODAL DE POSTAGEM
    const createPostButton = document.querySelector('.post-input-area button');
    const postModal = document.getElementById('post-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const postTextArea = document.getElementById('post-text-area');
    const postSubmitBtn = document.querySelector('.post-submit-btn');

    // VARIÁVEIS PARA MÍDIA E EVENTO
    const mediaButton = document.getElementById('media-button');
    const mediaInput = document.getElementById('media-input');
    const eventButton = document.getElementById('event-button');
    const dateInput = document.getElementById('date-input');
    
    // VARIÁVEIS PARA EXIBIÇÃO DE DATA NO MODAL
    const dateDisplayContainer = document.getElementById('selected-date-display');
    const displayDateValue = document.getElementById('display-date-value');
    const clearDateBtn = document.getElementById('clear-date-btn');
    
    // VARIÁVEL PARA O CONTAINER DE PRÉ-VISUALIZAÇÃO (NOVO)
    const mediaPreviewContainer = document.getElementById('media-preview-container');


    // --- FUNÇÕES DE TEMA ---
    function applyTheme(theme) {
        if (!icon) return;

        if (theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');       
            themeText.textContent = 'Claro';    
            localStorage.setItem('theme', 'dark');
        } else {
            body.removeAttribute('data-theme');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');      
            themeText.textContent = 'Escuro';   
            localStorage.setItem('theme', 'light');
        }
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }

    // --- FUNÇÕES DE POP-UPS DE NAVEGAÇÃO ---
    function closeAllPopups() {
        allPopups.forEach(popup => {
            if (popup) popup.classList.remove('show');
        });
    }

    function togglePopup(popup, targetElement) {
        if (!popup) return;

        const isShowing = popup.classList.contains('show');
        
        closeAllPopups();

        if (!isShowing) {
            popup.classList.add('show');
            
            if (targetElement) {
                const headerRect = document.querySelector('.top-header').getBoundingClientRect();
                const targetRect = targetElement.getBoundingClientRect();
                
                const rightOffset = headerRect.right - targetRect.right;
                
                popup.style.right = `${rightOffset}px`;
                popup.style.left = 'auto'; 
            }
        }
    }

    if (messagesToggle) messagesToggle.addEventListener('click', (e) => { e.preventDefault(); togglePopup(messagesPopup, messagesToggle); });
    if (notificationsToggle) notificationsToggle.addEventListener('click', (e) => { e.preventDefault(); togglePopup(notificationsPopup, notificationsToggle); });
    if (redeToggle) redeToggle.addEventListener('click', (e) => { e.preventDefault(); togglePopup(redePopup, redeToggle); });
    if (projetosToggle) projetosToggle.addEventListener('click', (e) => { e.preventDefault(); togglePopup(projetosPopup, projetosToggle); });

    document.addEventListener('click', (e) => {
        const isPopupArea = e.target.closest('.nav-item') || e.target.closest('.popup');
        if (!isPopupArea) {
            closeAllPopups();
        }
    });

    // --- FUNÇÕES DO MODAL DE CRIAÇÃO DE POSTAGEM ---

    function openPostModal() {
        if (postModal) {
            postModal.classList.add('show');
            postModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; 
            postTextArea.focus();
            
            // Limpa o display de mídia e data ao abrir
            mediaPreviewContainer.innerHTML = '';
            dateDisplayContainer.style.display = 'none';
            
            validatePostContent();
        }
    }

    function closePostModal() {
        if (postModal) {
            postModal.classList.remove('show');
            postModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
            // Limpa TUDO após fechar
            postTextArea.value = '';
            mediaInput.value = '';
            dateInput.value = '';
            mediaPreviewContainer.innerHTML = ''; // Limpa as pré-visualizações
            dateDisplayContainer.style.display = 'none'; 
            validatePostContent(); 
        }
    }

    function validatePostContent() {
        // Verifica se há data selecionada
        const hasDate = dateInput && dateInput.value.length > 0;
        
        // Verifica se há texto NO CAMPO DE TEXTO
        const hasText = postTextArea && postTextArea.value.trim().length > 0;
        
        // Verifica se há mídia selecionada
        const hasMedia = mediaInput && mediaInput.files && mediaInput.files.length > 0;
        
        // O botão é ativado se qualquer uma das condições for verdadeira
        const isContentValid = hasText || hasMedia || hasDate;
        
        if (postSubmitBtn) {
            postSubmitBtn.disabled = !isContentValid;
        }
        
        // Atualiza a visibilidade do display da data
        if (dateDisplayContainer) {
            dateDisplayContainer.style.display = hasDate ? 'flex' : 'none';
        }
        
        // NOVO: Atualiza a visibilidade do container de mídia
        if (mediaPreviewContainer) {
            mediaPreviewContainer.style.display = hasMedia ? 'flex' : 'none';
        }
    }
    
    // --- LÓGICA DE SELEÇÃO E PRÉ-VISUALIZAÇÃO DE MÍDIA (NOVO) ---
    function handleMediaSelection() {
        const files = mediaInput.files;
        mediaPreviewContainer.innerHTML = ''; // Limpa pré-visualizações anteriores

        if (files.length > 0) {
            
            Array.from(files).forEach((file, index) => {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'media-preview-item';
                    
                    let mediaElement;
                    let fileType = file.type.startsWith('image/') ? 'Imagem' : (file.type.startsWith('video/') ? 'Vídeo' : 'Arquivo');

                    // Cria o elemento de imagem ou vídeo
                    if (fileType === 'Imagem') {
                        mediaElement = document.createElement('img');
                        mediaElement.src = e.target.result;
                    } else if (fileType === 'Vídeo') {
                        mediaElement = document.createElement('video');
                        mediaElement.src = e.target.result;
                        mediaElement.poster = 'https://via.placeholder.com/60x60?text=V'; 
                    } else {
                         // Se não for imagem/vídeo, usa um ícone de arquivo
                        mediaElement = document.createElement('div');
                        mediaElement.style.width = '60px';
                        mediaElement.style.height = '60px';
                        mediaElement.style.display = 'flex';
                        mediaElement.style.alignItems = 'center';
                        mediaElement.style.justifyContent = 'center';
                        mediaElement.style.fontSize = '2rem';
                        mediaElement.innerHTML = '<i class="fas fa-file-alt"></i>';
                    }
                    
                    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);

                    previewItem.appendChild(mediaElement);
                    
                    const details = document.createElement('div');
                    details.className = 'file-details';
                    details.innerHTML = `<strong>${file.name}</strong>
                                         <span>(${fileSizeMB} MB) - ${fileType}</span>`;
                    previewItem.appendChild(details);

                    // Botão de remover individual
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-media-btn';
                    removeBtn.innerHTML = '&times;';
                    removeBtn.title = 'Remover este arquivo';
                    // Passa o índice para a função de remoção
                    removeBtn.addEventListener('click', () => removeMediaFile(index)); 
                    previewItem.appendChild(removeBtn);
                    
                    mediaPreviewContainer.appendChild(previewItem);
                };
                
                reader.readAsDataURL(file);
            });
        }
        validatePostContent();
    }
    
    // Função para remover um arquivo específico
    function removeMediaFile(indexToRemove) {
        const dataTransfer = new DataTransfer();
        const currentFiles = Array.from(mediaInput.files);

        currentFiles.forEach((file, index) => {
            if (index !== indexToRemove) {
                dataTransfer.items.add(file);
            }
        });

        mediaInput.files = dataTransfer.files;
        
        // Re-renderiza a pré-visualização e valida o post
        handleMediaSelection(); 
    }


    // --- LÓGICA DE SELEÇÃO DE EVENTO/DATA (CALENDÁRIO) ---
    function handleDateSelection() {
        const selectedDate = dateInput.value;
        
        if (selectedDate) {
            // dateInput.value está no formato "YYYY-MM-DDTHH:MM"
            const [datePart, timePart] = selectedDate.split('T');
            const [year, month, day] = datePart.split('-');
            const [hour, minute] = timePart.split(':');
            
            // Cria um objeto Date para formatação
            const dateObj = new Date(year, month - 1, day, hour, minute); 

            const formattedDate = dateObj.toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric'
            });
            
            const formattedTime = dateObj.toLocaleTimeString('pt-BR', {
                hour: '2-digit', minute: '2-digit'
            });

            // EXIBE A DATA E HORA SELECIONADA NO MODAL
            displayDateValue.textContent = `${formattedDate} às ${formattedTime}`;
            
        } else {
             displayDateValue.textContent = '';
        }
        validatePostContent(); 
    }
    
    // --- LÓGICA DE LIMPAR DATA ---
    function clearDateSelection(e) {
        if (e) e.preventDefault();
        
        dateInput.value = '';
        validatePostContent(); 
    }


    // --- EVENT LISTENERS ---
    
    if (createPostButton) {
        createPostButton.addEventListener('click', openPostModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closePostModal);
    }
    
    if (postModal) {
        postModal.addEventListener('click', (e) => {
            if (e.target === postModal) {
                closePostModal();
            }
        });
    }

    if (postTextArea) {
        postTextArea.addEventListener('input', validatePostContent);
    }


    // 1. MÍDIA: Clique no botão "Mídia" dispara o input escondido.
    if (mediaButton && mediaInput) {
        mediaButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            mediaInput.click();
        });
        mediaInput.addEventListener('change', handleMediaSelection);
    }
    
    // 2. EVENTO: Clique no botão "Agendar" dispara o input de data/hora escondido (o calendário).
    if (eventButton && dateInput) {
        eventButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            dateInput.click(); 
        });
        dateInput.addEventListener('change', handleDateSelection);
    }
    
    // 3. LIMPAR DATA: Clique no 'x' do display de data
    if (clearDateBtn) {
        clearDateBtn.addEventListener('click', clearDateSelection);
    }
    
    // Simulação do envio 
    if (postSubmitBtn) {
        postSubmitBtn.addEventListener('click', () => {
            console.log("Postagem enviada!");
            closePostModal();
            alert("Sua publicação foi criada com sucesso!");
        });
    }
});