document.addEventListener('DOMContentLoaded', function() {
        
        function loadNotes() {
            const savedNotes = localStorage.getItem('notebookProNotes');
            if (savedNotes) {
                const notesGrid = document.querySelector('.notes-grid');
                notesGrid.innerHTML = savedNotes;
                
                
                addButtonsToExistingNotes();
                updateNoteCount();
            }
        }

        
        function saveNotes() {
            const notesGrid = document.querySelector('.notes-grid');
            localStorage.setItem('notebookProNotes', notesGrid.innerHTML);
        }

        
        function updateNoteCount() {
            const totalNotes = document.querySelectorAll('.note-card').length;
            const todayNotes = document.querySelectorAll('.note-card').length; 
            
           
            const todayNoteCount = document.querySelector('.folder-today.note-count');
            if (todayNoteCount) {
                todayNoteCount.textContent = `${totalNotes} notes`;
            }
            const statValues = document.querySelectorAll('.folder-today .stat-value');

            if (statValues.length > 0) {
            statValues[0].textContent = totalNotes; 
            }
        }

        
        const folderCards = document.querySelectorAll('.folder-card');
        folderCards.forEach(card => {
            card.addEventListener('click', function() {
                folderCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                const folderName = this.querySelector('.folder-name').textContent.trim();
                document.querySelector('.notes-title').textContent = `${folderName}'s Notes`;
            });
        });

    
      
        const header = document.querySelector('.header');
        const darkModeBtn = document.createElement('button');
        darkModeBtn.id = 'darkModeToggle';
        darkModeBtn.className = 'dark-mode-toggle';
        darkModeBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        header.appendChild(darkModeBtn);

       
        const body = document.body;
        if (localStorage.getItem('darkMode') === 'enabled') {
            body.classList.add('dark-mode');
            darkModeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }

        darkModeBtn.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                darkModeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            } else {
                localStorage.setItem('darkMode', 'disabled');
                darkModeBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            }
        });

       
        const newNoteBtn = document.querySelector('.new-note-btn');
        newNoteBtn.addEventListener('click', function() {
            const notesGrid = document.querySelector('.notes-grid');
            const newNote = document.createElement('div');
            newNote.className = 'note-card';
            newNote.innerHTML = `
                <div class="note-header">
                    <h3 class="note-title" contenteditable="true">New Note</h3>
                    <span class="note-time">Just now</span>
                </div>
                <div class="note-content" contenteditable="true">
                    Start typing your new note here...
                </div>
                <div class="note-tags">
                    <span class="tag" onclick="deleteNote(this)">Delete</span>
                </div>
                <div class="note-images" style="margin: 10px 0;"></div>
                <div class="note-actions" style="display: flex; gap: 10px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #eef1ff;">
                    <button class="color-btn" style="padding: 5px 12px; border-radius: 6px; border: 1px solid #e0e7ff; background: white; color: #667eea; cursor: pointer;" onclick="openColorPicker(this)">🎨 Color</button>
                    <button class="image-btn" style="padding: 5px 12px; border-radius: 6px; border: 1px solid #e0e7ff; background: white; color: #667eea; cursor: pointer;" onclick="openImageUpload(this)">🖼️ Image</button>
                </div>
            `;
            notesGrid.prepend(newNote);
            
            updateNoteCount();
            saveNotes();
        });

        function addButtonsToExistingNotes() {
            document.querySelectorAll('.note-card').forEach(card => {
            
                if (card.querySelector('.note-actions')) return;
                
   
                const deleteTag = card.querySelector('.tag');
                if (deleteTag && deleteTag.textContent === 'Delete') {
                    deleteTag.setAttribute('onclick', 'deleteNote(this)');
                    deleteTag.style.cursor = 'pointer';
                }
                
                // Make content editable
                const title = card.querySelector('.note-title');
                const content = card.querySelector('.note-content');
                if (title) title.contentEditable = true;
                if (content) content.contentEditable = true;
                
                // Add images container if not exists
                if (!card.querySelector('.note-images')) {
                    const imagesDiv = document.createElement('div');
                    imagesDiv.className = 'note-images';
                    imagesDiv.style.cssText = 'margin: 10px 0;';
                    card.insertBefore(imagesDiv, card.querySelector('.note-tags'));
                }
                
                if (!card.querySelector('.note-actions')) {
                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'note-actions';
                    actionsDiv.style.cssText = 'display: flex; gap: 10px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #eef1ff;';
                    actionsDiv.innerHTML = `
                        <button class="note-action-btn color-btn" style="padding: 5px 12px; border-radius: 6px; border: 1px solid #e0e7ff ;cursor: pointer;" onclick="openColorPicker(this)">🎨 Color</button>
                        <button class="note-action-btn image-btn" style="padding: 5px 12px; border-radius: 6px; border: 1px solid #e0e7ff; background: white; color: #667eea; cursor: pointer;" onclick="openImageUpload(this)">🖼️ Image</button>
                    `;
                    card.appendChild(actionsDiv);
                }
                
               
                title?.addEventListener('input', saveNotes);
                content?.addEventListener('input', saveNotes);
            });
        }

        window.openColorPicker = function(button) {
            const noteCard = button.closest('.note-card');
            const content = noteCard.querySelector('.note-content');
            
           
            document.querySelectorAll('.color-popup').forEach(p => p.remove());
            
            
            const popup = document.createElement('div');
            popup.className = 'color-popup';
            popup.style.cssText = `
                position: absolute;
                background:white ;
                border-radius: 10px;
                padding: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px;
                z-index: 1000;
                width: 220px;
            `;
            
            const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
                           '#00FFFF', '#FFA500', '#800080', '#008000',
                         '#000080', '#A52A2A', '#FFFFFF','#928ab3'];
            
            colors.forEach(color => {
                const colorOption = document.createElement('div');
                colorOption.style.cssText = `
                    width: 30px;
                    height: 30px;
                    border-radius: 6px;
                    background: ${color};
                    cursor: pointer;
                    border: 2px solid transparent;
                `;
                colorOption.onclick = function(e) {
                    e.stopPropagation();
                    content.style.color = color;
                    popup.remove();
                    saveNotes();
                };
                popup.appendChild(colorOption);
            });
            
            const rect = button.getBoundingClientRect();
            popup.style.top = rect.bottom + window.scrollY + 5 + 'px';
            popup.style.left = rect.left + window.scrollX + 'px';
            
            document.body.appendChild(popup);
            
            setTimeout(() => {
                document.addEventListener('click', function closePopup(e) {
                    if (!popup.contains(e.target) && e.target !== button) {
                        popup.remove();
                        document.removeEventListener('click', closePopup);
                    }
                });
            }, 100);
        };

        window.openImageUpload = function(button) {
            const noteCard = button.closest('.note-card');
            let imagesContainer = noteCard.querySelector('.note-images');
            
            if (!imagesContainer) {
                imagesContainer = document.createElement('div');
                imagesContainer.className = 'note-images';
                imagesContainer.style.cssText = 'margin: 10px 0;';
                noteCard.insertBefore(imagesContainer, noteCard.querySelector('.note-tags'));
            }
            
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            
            fileInput.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        img.style.cssText = 'max-width: 100%; max-height: 150px; border-radius: 8px; margin: 5px;';
                        
                        const removeBtn = document.createElement('button');
                        removeBtn.innerHTML = '×';
                        removeBtn.style.cssText = 'position: absolute; top: 0; right: 0; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer;';
                        removeBtn.onclick = function() {
                            imgWrapper.remove();
                            saveNotes();
                        };
                        
                        const imgWrapper = document.createElement('div');
                        imgWrapper.style.cssText = 'position: relative; display: inline-block; margin: 5px;';
                        imgWrapper.appendChild(img);
                        imgWrapper.appendChild(removeBtn);
                        
                        imagesContainer.appendChild(imgWrapper);
                        saveNotes();
                    };
                    reader.readAsDataURL(file);
                }
            };
            
            document.body.appendChild(fileInput);
            fileInput.click();
            fileInput.remove();
        };

        window.deleteNote = function(deleteElement) {
            const noteCard = deleteElement.closest('.note-card');
            if (confirm('Delete this note?')) {
                noteCard.remove();
                updateNoteCount();
                saveNotes();
            }
        };

        const searchBtn = document.querySelector('.action-btn:first-child');
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                const searchTerm = prompt('Search notes:', '');
                if (searchTerm) {
                    document.querySelectorAll('.note-card').forEach(card => {
                        const title = card.querySelector('.note-title').textContent.toLowerCase();
                        const content = card.querySelector('.note-content').textContent.toLowerCase();
                        if (title.includes(searchTerm.toLowerCase()) || content.includes(searchTerm.toLowerCase())) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        }


    const notesGrid = document.querySelector('.notes-grid');
    const shareBtn = document.querySelector('.notes-actions .fa-share').parentElement;

   
    shareBtn.addEventListener('click', function () {
        const notes = [];
        notesGrid.querySelectorAll('.note-card').forEach(card => {
            const title = card.querySelector('.note-title').textContent.trim();
            const content = card.querySelector('.note-content').textContent.trim();
            const time = card.querySelector('.note-time').textContent;
            notes.push(`Title: ${title}\nTime: ${time}\nContent: ${content}`);
        });

        const emailBody = encodeURIComponent(notes.join('\n\n---\n\n'));
        const emailSubject = encodeURIComponent("My Notebook Notes");

        
        window.location.href = `mailto:?subject=${emailSubject}&body=${emailBody}`;
    });


        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('note-title') || e.target.classList.contains('note-content')) {
                saveNotes();
            }
        });


        loadNotes(); 
        addButtonsToExistingNotes(); 
        updateNoteCount(); 
        

        if (document.querySelectorAll('.note-card').length === 0) {
            
            addButtonsToExistingNotes();
            saveNotes();
        }

        function updateTime() {
            document.querySelectorAll('.note-time').forEach((el, i) => {
                if (i === 0) el.textContent = 'Today';
                if (i === 1) el.textContent = 'Today';
                if (i === 2) el.textContent = 'Today';
            });
        }
        updateTime();
    });


