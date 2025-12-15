
document.addEventListener('DOMContentLoaded', () => {
    initializeDummyData();
    checkAuth();
    
   
    if(document.getElementById('welcomeUser')) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if(user) document.getElementById('welcomeUser').innerText = user.name.split('@')[0]; // Use part of email as name
    }
    

    if(document.getElementById('notesContainer')) {
        loadNotes();
    }
});

function initializeDummyData() {

    if (!localStorage.getItem('notes')) {
        const dummyNotes = [
            { id: 1, title: "Calculus I - Limits", subject: "Maths", semester: "1", filename: "calc_limits.pdf", uploader: "Prof. Smith", date: "10/10/2023" },
            { id: 2, title: "Data Structures Intro", subject: "CS", semester: "3", filename: "ds_intro.ppt", uploader: "Alice Dev", date: "12/10/2023" },
            { id: 3, title: "Thermodynamics Notes", subject: "Physics", semester: "2", filename: "thermo_chap1.pdf", uploader: "PhysicsLab", date: "15/10/2023" },
            { id: 4, title: "Database Management", subject: "CS", semester: "4", filename: "sql_basics.docx", uploader: "DbAdmin", date: "20/10/2023" },
            { id: 5, title: "Linear Algebra", subject: "Maths", semester: "1", filename: "matrices.pdf", uploader: "MathWhiz", date: "22/10/2023" },
            { id: 6, title: "Digital Electronics", subject: "Electronics", semester: "3", filename: "logic_gates.pdf", uploader: "Circuits_X", date: "25/10/2023" }
        ];
        localStorage.setItem('notes', JSON.stringify(dummyNotes));
    }
}



function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user && !window.location.href.includes('index.html')) {
        window.location.href = 'index.html';
    }
    if (user && window.location.href.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
}

function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    
    
    if (email.includes('@')) {
       
        const user = { name: email, email: email }; 
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        alert("Please enter a valid email address containing '@'");
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function toggleForms() {
    
    alert("Just use the Login form with any email containing '@'!");
}



function uploadNote(event) {
    event.preventDefault();
    const title = document.getElementById('noteTitle').value;
    const subject = document.getElementById('noteSubject').value;
    const semester = document.getElementById('noteSemester').value;
    
    const newNote = {
        id: Date.now(),
        title,
        subject,
        semester,
        filename: "uploaded_file.pdf", 
        uploader: "You",
        date: new Date().toLocaleDateString()
    };

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.unshift(newNote); 
    localStorage.setItem('notes', JSON.stringify(notes));

    alert("Note Uploaded Successfully!");
    window.location.href = 'browse.html';
}

function loadNotes() {
    const container = document.getElementById('notesContainer');
    const search = document.getElementById('searchInput').value.toLowerCase();
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    
    container.innerHTML = '';

    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(search) || 
        note.subject.toLowerCase().includes(search)
    );

    if(filteredNotes.length === 0) {
        container.innerHTML = '<p style="color:#888; text-align:center; width:100%;">No notes found matching your search.</p>';
        return;
    }

    filteredNotes.forEach((note, index) => {
        
        const colorClass = `tag-${(index % 4) + 1}`;
        
        const card = `
            <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:start;">
                    <span class="tag ${colorClass}">${note.subject}</span>
                    <small style="color:#aaa;">Sem ${note.semester}</small>
                </div>
                <h3 style="margin-top:15px;">${note.title}</h3>
                <small style="color:#888;">By ${note.uploader} • ${note.date}</small>
                
                <div class="card-footer">
                    <span style="font-size:0.8rem; color:#ccc;">${note.filename}</span>
                    <a href="#" class="download-btn" onclick="alert('Downloading ${note.filename}...')">Download ↓</a>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}