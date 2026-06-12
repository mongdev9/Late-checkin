const form = document.getElementById('checkinForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('span');
const spinner = document.getElementById('spinner');
const statusMessage = document.getElementById('statusMessage');
const timeRecorded = document.getElementById('timeRecorded');
const empIdInput = document.getElementById('empId');
const empNameInput = document.getElementById('empName');
const empDivisionInput = document.getElementById('empDivision');
const empDeptInput = document.getElementById('empDept');
const liveClock = document.getElementById('liveClock');

function updateClock() {
    const now = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('th-TH', dateOptions);
    const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    liveClock.innerText = `วันที่ ${dateStr} เวลา ${timeStr} น.`;
}

setInterval(updateClock, 1000);
updateClock();

// Load saved data if available
window.addEventListener('DOMContentLoaded', () => {
    const savedId = localStorage.getItem('empId');
    const savedName = localStorage.getItem('empName');
    const savedDivision = localStorage.getItem('empDivision');
    const savedDept = localStorage.getItem('empDept');
    
    if (savedId) empIdInput.value = savedId;
    if (savedName) empNameInput.value = savedName;
    if (savedDivision) empDivisionInput.value = savedDivision;
    if (savedDept) empDeptInput.value = savedDept;
});

// ==========================================
// IMPORTANT: REPLACE THIS URL WITH YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
// ==========================================

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const empId = empIdInput.value.trim();
    const empName = empNameInput.value.trim();
    const empDivision = empDivisionInput.value.trim();
    const empDept = empDeptInput.value.trim();
    
    if (!empId || !empName || !empDivision || !empDept) return;
    
    // Save to local storage for next time
    localStorage.setItem('empId', empId);
    localStorage.setItem('empName', empName);
    localStorage.setItem('empDivision', empDivision);
    localStorage.setItem('empDept', empDept);
    
    // UI Loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    spinner.style.display = 'block';
    statusMessage.classList.add('hidden');
    
    try {
        if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            throw new Error("โปรดใส่ URL ของ Google Apps Script ในไฟล์ script.js ก่อนใช้งาน");
        }
        
        const formData = new URLSearchParams();
        formData.append('empId', empId);
        formData.append('empName', empName);
        formData.append('empDivision', empDivision);
        formData.append('empDept', empDept);
        
        // Use no-cors mode to bypass CORS issues from Google Apps Script redirect
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
        
        // Show success
        const now = new Date();
        timeRecorded.innerText = `บันทึกเมื่อ: ${now.toLocaleTimeString('th-TH')} น.`;
        
        form.style.display = 'none';
        statusMessage.classList.remove('hidden');
        
    } catch (error) {
        alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
        // Reset UI
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        spinner.style.display = 'none';
    }
});
