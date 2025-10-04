document.addEventListener('DOMContentLoaded', () => {
    //  1. FUNÇÕES GERAIS DE MODAL E POPUP 

    /**
     * Abre um modal.
     * @param {HTMLElement} modalElement O elemento DOM do modal.
     */
    const openModal = (modalElement) => {
        if (modalElement) {
            modalElement.classList.add('show');
            modalElement.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Bloqueia scroll do fundo
        }
    };

    /**
     * Fecha um modal.
     * @param {HTMLElement} modalElement O elemento DOM do modal.
     */
    const closeModal = (modalElement) => {
        if (modalElement) {
            modalElement.classList.remove('show');
            modalElement.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restaura scroll
        }
    };

    /**
     * Alterna a visibilidade dos popups da header.
     * @param {HTMLElement} targetPopup O elemento DOM do popup.
     */
    const togglePopup = (targetPopup) => {
        const isShown = targetPopup.classList.contains('show');
        
        // Fecha todos os popups abertos
        document.querySelectorAll('.popup.show').forEach(popup => {
            popup.classList.remove('show');
            popup.setAttribute('aria-hidden', 'true');
        });

        // Abre o popup se ele estava fechado
        if (!isShown) {
            targetPopup.classList.add('show');
            targetPopup.setAttribute('aria-hidden', 'false');
        }
    };

    //  2. CONFIGURAÇÕES DE TEMA 

    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Aplica o tema salvo
    document.body.setAttribute('data-theme', savedTheme);

    // Adiciona listener para alternar o tema
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    //  GATILHOS DA HEADER 

    // Popups da Header
    document.querySelectorAll('[id$="-toggle"]').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = toggle.id.replace('-toggle', '-popup');
            const targetPopup = document.querySelector(`.${targetId}`);
            if (targetPopup) {
                togglePopup(targetPopup);
            }
        });
    });

    // Fechar popups ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && !e.target.closest('.popup')) {
            document.querySelectorAll('.popup.show').forEach(popup => {
                popup.classList.remove('show');
                popup.setAttribute('aria-hidden', 'true');
            });
        }
    });

    //  4. MODAL DE PUBLICAÇÃO (Com Mídia)

    const postModal = document.getElementById('post-modal');
    const closePostModalBtn = document.getElementById('close-post-modal-btn');
    const openPostModalShortcut = document.getElementById('open-post-modal-shortcut');
    const postTextArea = document.getElementById('post-text-area');
    const submitPostBtn = document.getElementById('submit-post-btn');
    
    // Elementos de Mídia
    const triggerImageUpload = document.getElementById('trigger-image-upload');
    const imageUploadInput = document.getElementById('image-upload-input');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const postImagePreview = document.getElementById('post-image-preview');
    const removeImageBtn = document.getElementById('remove-image-btn');
    const postMediaShortcut = document.getElementById('post-media-shortcut');

    // Abre o modal de postagem
    [openPostModalShortcut, postMediaShortcut].forEach(btn => {
        btn.addEventListener('click', () => openModal(postModal));
    });
    
    // Fecha o modal de postagem
    closePostModalBtn.addEventListener('click', () => {
        closeModal(postModal);
        // Limpa o modal ao fechar
        postTextArea.value = '';
        imageUploadInput.value = '';
        imagePreviewContainer.style.display = 'none';
        postImagePreview.src = '#';
        submitPostBtn.disabled = true;
    });

    // Checa o estado do botão Publicar
    const checkPostValidity = () => {
        const hasText = postTextArea.value.trim().length > 0;
        const hasImage = imageUploadInput.files.length > 0;
        submitPostBtn.disabled = !(hasText || hasImage);
    };

    // Listener para o campo de texto
    postTextArea.addEventListener('input', checkPostValidity);

    // 4.1. Lógica da Imagem
    
    // Clica no input file
    triggerImageUpload.addEventListener('click', () => {
        imageUploadInput.click();
    });

    // Pré-visualiza a imagem
    imageUploadInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                postImagePreview.src = event.target.result;
                imagePreviewContainer.style.display = 'block';
                checkPostValidity();
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Remove a imagem
    removeImageBtn.addEventListener('click', () => {
        imageUploadInput.value = ''; // Limpa o input file
        imagePreviewContainer.style.display = 'none';
        postImagePreview.src = '#';
        checkPostValidity();
    });

    // Simula a publicação
    submitPostBtn.addEventListener('click', () => {
        alert("Publicação enviada! (Simulação)");
        closeModal(postModal);
        // Reset manual
        postTextArea.value = '';
        imageUploadInput.value = '';
        imagePreviewContainer.style.display = 'none';
        postImagePreview.src = '#';
        submitPostBtn.disabled = true;
    });


    //  5. MODAL DE EDIÇÃO DE PERFIL 

    const editProfileModal = document.getElementById('edit-profile-modal');
    const closeEditProfileModalBtn = document.getElementById('close-edit-profile-modal-btn');
    const editProfileBtn = document.getElementById('edit-profile-btn'); 

    // Abre o modal de edição
    editProfileBtn.addEventListener('click', () => openModal(editProfileModal));
    
    // Fecha o modal de edição
    closeEditProfileModalBtn.addEventListener('click', () => closeModal(editProfileModal));

    // Simulação para salvar alterações
    document.getElementById('save-profile-btn').addEventListener('click', () => {
        alert("Perfil salvo com sucesso! (Simulação)");
        closeModal(editProfileModal);
    });

    // 6. MODAL DE PERFIL COMPLETO
    
    const fullProfileModal = document.getElementById('full-profile-modal');
    const closeFullProfileModalBtn = document.getElementById('close-full-profile-modal-btn');
    const viewProfileBtn = document.getElementById('view-profile-btn'); 

    // Abre o modal de perfil completo
    viewProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Fecha o popup do perfil
        document.querySelector('.profile-popup').classList.remove('show');
        openModal(fullProfileModal);
    });
    
    // Fecha o modal de perfil completo
    closeFullProfileModalBtn.addEventListener('click', () => closeModal(fullProfileModal));

    //  7. MODAL DE CONFIGURAÇÕES E PRIVACIDADE

    const settingsModal = document.getElementById('settings-modal');
    const openSettingsModalBtn = document.getElementById('open-settings-modal-btn');
    const closeSettingsModalBtn = document.getElementById('close-settings-modal-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');

    // Abre o modal de configurações
    openSettingsModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Fecha o popup do perfil
        document.querySelector('.profile-popup').classList.remove('show');
        openModal(settingsModal);
    });

    // Fecha o modal de configurações
    closeSettingsModalBtn.addEventListener('click', () => closeModal(settingsModal));

    // Simula o salvamento de configurações
    saveSettingsBtn.addEventListener('click', () => {
        alert('Configurações salvas com sucesso! (Simulação)');
        closeModal(settingsModal);
    });

    // 8. FECHAR MODAIS CLICANDO FORA 

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
});