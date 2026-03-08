if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js'); });
}

// Manual Install Logic
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); deferredPrompt = e;
    document.getElementById('installBtn').style.display = 'block';
});

document.getElementById('installBtn').onclick = () => {
    deferredPrompt.prompt();
    document.getElementById('installBtn').style.display = 'none';
};

// ስፕላሽ ስክሪን - 5 ሰከንድ
setTimeout(() => {
    document.getElementById('splash').style.display = 'none';
    if(localStorage.getItem('logged') === 'true') showDashboard();
    else document.getElementById('reg-page').classList.remove('hidden');
}, 5000);

function checkRole() {
    const role = document.getElementById('role').value;
    document.getElementById('code').classList.toggle('hidden', role === 'student');
}

function login() {
    const phone = document.getElementById('phone').value;
    const role = document.getElementById('role').value;
    const code = document.getElementById('code').value;
    const fname = document.getElementById('fname').value;

    if(!phone.startsWith('09') && !phone.startsWith('07')) { alert("የቴሌ ቁጥር ብቻ ይጠቀሙ!"); return; }
    if(role === 'teacher' && code !== '121619') { alert("የመምህር ኮድ ስህተት!"); return; }
    if(role === 'admin' && code !== '12161921') { alert("የአስተዳዳሪ ኮድ ስህተት!"); return; }

    localStorage.setItem('logged', 'true');
    localStorage.setItem('role', role);
    showDashboard();
}

function showDashboard() {
    document.getElementById('reg-page').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    if(localStorage.getItem('role') === 'admin') document.getElementById('admin-panel').classList.remove('hidden');
    
    const savedNotice = localStorage.getItem('broadcast');
    if(savedNotice) {
        const nb = document.getElementById('notice-board');
        nb.innerHTML = "📢 <b>የአስተዳደር ማስታወቂያ፡</b><br>" + savedNotice;
        nb.classList.remove('hidden');
    }
}

function showSubjects(grade) {
    document.getElementById('grade-view').classList.add('hidden');
    document.getElementById('content-view').classList.remove('hidden');
    document.getElementById('title').innerText = grade + "ኛ ክፍል (2018 Curriculum)";
    let list = document.getElementById('list');
    list.innerHTML = '';
    
    let subs = grade <= 10 ? ['Maths', 'English', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'Amharic', 'Civics', 'Economics'] : ['Natural Stream', 'Social Stream'];
    
    subs.forEach(s => {
        let div = document.createElement('div');
        div.className = "item";
        div.innerHTML = `📚 <span>${s}</span>`;
        div.onclick = () => showMedia(s);
        list.appendChild(div);
    });
}

function showMedia(s) {
    document.getElementById('list').innerHTML = `
        <div class="media-list">
            <div class="item" onclick="alert('PDF Files...')">📄 PDF Files</div>
            <div class="item" onclick="alert('Video Lessons...')">🎬 Video Lessons</div>
            <div class="item">🖼️ Images</div>
            <div class="item">📝 Text Notes</div>
            <div class="item">💬 Discussion Chat</div>
        </div>
    `;
    if(localStorage.getItem('role') !== 'student') document.getElementById('upload-section').classList.remove('hidden');
}

function goBack() {
    if(document.getElementById('list').innerHTML.includes('media-list')) showSubjects(parseInt(document.getElementById('title').innerText));
    else { document.getElementById('content-view').classList.add('hidden'); document.getElementById('grade-view').classList.remove('hidden'); }
}

function sendNotice() {
    localStorage.setItem('broadcast', document.getElementById('global-msg').value);
    alert("ማስታወቂያው ለሁሉም ደርሷል!"); location.reload();
}

function logout() { localStorage.clear(); location.reload(); }
