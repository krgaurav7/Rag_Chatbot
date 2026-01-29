document.addEventListener('DOMContentLoaded', () => {
    // State
    const threadId = generateThreadId();
    let selectedFiles = [];

    // DOM Elements
    const threadIdDisplay = document.getElementById('thread-id-display');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const uploadBtn = document.getElementById('upload-btn');
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');

    // Initialize
    threadIdDisplay.textContent = threadId;

    // Helper Functions
    function generateThreadId() {
        return 'thread_' + Math.random().toString(36).substr(2, 9);
    }

    function addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;

        let messageContent = content;
        // Simple markdown parsing for code blocks and bold text could be added here
        // For now, handling newlines
        messageContent = messageContent.replace(/\n/g, '<br>');

        messageDiv.innerHTML = `
            <div class="content">${messageContent}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function updateFileList() {
        fileList.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'file-item';
            item.innerHTML = `
                <span>${file.name}</span>
                <i class="fas fa-times remove-file" data-index="${index}"></i>
            `;
            fileList.appendChild(item);
        });

        uploadBtn.disabled = selectedFiles.length === 0;

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-file').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                selectedFiles.splice(index, 1);
                updateFileList();
            });
        });
    }

    // Event Listeners

    // Drag & Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');

        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFiles(fileInput.files);
        }
    });

    function handleFiles(files) {
        // Convert FileList to Array and filter
        const newFiles = Array.from(files).filter(file =>
            file.type === 'application/pdf' || file.type === 'text/plain' || file.name.endsWith('.pdf') || file.name.endsWith('.txt')
        );

        selectedFiles = [...selectedFiles, ...newFiles];
        updateFileList();
    }

    // Upload
    uploadBtn.addEventListener('click', async () => {
        if (selectedFiles.length === 0) return;

        uploadBtn.classList.add('loading');
        uploadBtn.disabled = true;

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await fetch('/chat/docs', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Upload failed with status ' + response.status);
            }

            const result = await response.json();

            // Show success message
            const btnText = uploadBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            btnText.textContent = 'Uploaded!';
            uploadBtn.classList.remove('loading');

            setTimeout(() => {
                btnText.textContent = originalText;
                // clear files
                selectedFiles = [];
                updateFileList();
            }, 2000);

            addMessage(`Successfully processed ${result.chunks_processed} chunks from uploaded documents.`, 'system');

        } catch (error) {
            console.error('Error:', error);
            uploadBtn.classList.remove('loading');
            uploadBtn.disabled = false;
            // Try to extract detail if it's in the error object (custom error thrown above)
            const errorMsg = error.message || 'Unknown error occurred';
            addMessage('Error uploading documents: ' + errorMsg, 'system');
        }
    });

    // Chat
    messageInput.addEventListener('input', () => {
        sendBtn.disabled = messageInput.value.trim() === '';
        // Auto-resize
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    });

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) sendMessage();
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // UI Updates
        addMessage(message, 'user');
        messageInput.value = '';
        messageInput.style.height = 'auto';
        sendBtn.disabled = true;

        // Show typing indicator? For now just spinner on send btn maybe, or a temp loading message
        const loadingMsgDiv = document.createElement('div');
        loadingMsgDiv.className = 'message assistant loading-msg';
        loadingMsgDiv.innerHTML = '<div class="content"><i class="fas fa-circle-notch fa-spin"></i> Thinking...</div>';
        chatMessages.appendChild(loadingMsgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch(`/chat/${threadId}?message=${encodeURIComponent(message)}`, {
                method: 'POST'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Network response was not ok');
            }

            const data = await response.json();

            // Remove loading message
            chatMessages.removeChild(loadingMsgDiv);

            // Extract the last message content
            // API returns the full state { messages: [...] }
            if (data.messages && data.messages.length > 0) {
                const lastMessage = data.messages[data.messages.length - 1];
                // Check if it's strictly AI message content we want
                // simple heuristic: it's the last one
                if (lastMessage.content) {
                    addMessage(lastMessage.content, 'assistant');
                } else {
                    addMessage("No content in response.", 'system');
                }
            } else {
                addMessage("Empty response from server.", 'system');
            }

        } catch (error) {
            console.error('Error:', error);
            if (loadingMsgDiv.parentNode) chatMessages.removeChild(loadingMsgDiv);
            addMessage("Sorry, something went wrong. " + error.message, 'system');
        } finally {
            sendBtn.disabled = messageInput.value.trim() === '';
        }
    }
});
