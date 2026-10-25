
import './style.css';
import Tesseract from 'tesseract.js';

const app = document.querySelector('#app');

app.innerHTML = `
<div class="app-shell">
  <header class="topbar">
    <a class="brand" href="#" id="brandHome">
      <span class="brand-mark">C</span>
      <span><strong>ClaimBack AI</strong><small>Smart Bill Verification</small></span>
    </a>
    <nav class="nav-links">
      <button data-page="home" class="nav-btn active">Overview</button>
      <button data-page="analyze" class="nav-btn">Check a bill</button>
      <button data-page="opportunities" class="nav-btn">Opportunities</button>
      <button data-page="history" class="nav-btn">History</button>
    </nav>
    <span class="ready-pill"><i></i> AI tools ready</span>
  </header>

  <main class="main-content">
    <section class="page active" id="page-home">
      <div class="hero">
        <div class="hero-copy">
          <span class="eyebrow">YOUR PERSONAL BILL ASSISTANT</span>
          <h1>Your bill is more than a total. <span>Know what to do next.</span></h1>
          <p>Read bill details, review possible billing issues, discover assistance routes and prepare the documents you may need.</p>
          <button class="btn btn-primary" id="startCheck">＋ Check my bill</button>
          <div class="trust-points"><span>✓ Browser-based OCR</span><span>✓ Practical next steps</span><span>✓ Local history</span></div>
        </div>
        <div class="hero-art">
          <div class="hero-orb"></div>
          <div class="mock-receipt">
            <div class="receipt-head"><span>CLAIMBACK AI</span><span>✓</span></div>
            <div class="receipt-icon">▤</div>
            <h3>Bill review</h3>
            <div class="mock-line"><span>Bill details</span><b>Extract</b></div>
            <div class="mock-line"><span>Charge review</span><b>Check</b></div>
            <div class="mock-line"><span>Next action</span><b>Prepare</b></div>
            <div class="mock-progress"><i></i></div>
            <small>Understand your next step</small>
          </div>
          <div class="float-note">✦ Clear next steps</div>
        </div>
      </div>

      <div class="section-title"><div><span class="eyebrow">YOUR WORKSPACE</span><h2>Everything in one place</h2></div></div>
      <div class="stat-grid">
        <article class="stat-card"><span class="stat-icon purple">▤</span><span>Bills checked</span><strong id="statBills">0</strong><small>Your saved analyses</small></article>
        <article class="stat-card"><span class="stat-icon teal">✓</span><span>Need review</span><strong id="statReview">0</strong><small>Items flagged for review</small></article>
        <article class="stat-card"><span class="stat-icon amber">↗</span><span>Action routes</span><strong id="statRoutes">0</strong><small>Possible next steps found</small></article>
      </div>

      <div class="feature-grid">
        <article class="feature-card"><span class="feature-icon">▧</span><h3>Read a bill</h3><p>Extract visible text from a bill image using OCR.</p><button class="text-btn" data-go="analyze">Start checking →</button></article>
        <article class="feature-card"><span class="feature-icon">⌕</span><h3>Review charges</h3><p>Spot amounts and possible inconsistencies worth checking.</p><button class="text-btn" data-go="analyze">Review a bill →</button></article>
        <article class="feature-card"><span class="feature-icon">♧</span><h3>Prepare documents</h3><p>Build a checklist before contacting an insurer or authority.</p><button class="text-btn" data-go="documents">Open checklist →</button></article>
      </div>
      <div class="privacy-banner"><span>🔒</span><div><strong>Privacy-first prototype</strong><p>Your selected image is processed in this browser. Saved history stays in this browser's local storage. Avoid uploading sensitive documents on a shared device.</p></div></div>
    </section>

    <section class="page" id="page-analyze">
      <div class="page-heading"><span class="eyebrow">STEP 01 · BILL REVIEW</span><h1>Check your bill</h1><p>Upload a clear image of a bill. Review the extracted information before using it.</p></div>
      <div class="upload-grid">
        <div class="upload-panel">
          <div class="upload-symbol">↥</div><h3>Upload a bill image</h3><p>Choose a JPG, PNG, WEBP or another browser-readable image.</p>
          <input type="file" id="billInput" accept="image/*" hidden>
          <button class="btn btn-primary" id="chooseFile">Choose image</button>
          <p class="muted small-text">For this version, PDF files are not processed directly. Take a screenshot or export the bill page as an image.</p>
        </div>
        <div class="upload-tips"><h3>For a better result</h3><ul><li>Keep the full bill inside the frame.</li><li>Use bright, even lighting.</li><li>Make sure totals and dates are readable.</li><li>Check every extracted value yourself.</li></ul><div class="tip-note">OCR can misread digits, symbols and decimal points. Treat all results as preliminary.</div></div>
      </div>

      <div id="previewPanel" class="panel hidden">
        <div class="panel-heading"><div><span class="eyebrow">SELECTED FILE</span><h2>Preview your bill</h2></div><button class="btn btn-quiet" id="removeFile">Remove</button></div>
        <img id="billPreview" class="bill-preview" alt="Selected bill preview">
        <div class="file-meta"><strong id="selectedFileName">Bill image</strong><span id="selectedFileSize"></span></div>
        <button class="btn btn-primary" id="analyzeBtn">✦ Read and review bill</button>
      </div>

      <div id="loadingPanel" class="panel hidden">
        <div class="loading-row"><span class="spinner"></span><div><h3>Reading your bill…</h3><p id="loadingText">Preparing OCR</p></div></div>
        <div class="progress-track"><div id="progressBar" class="progress-bar"></div></div>
        <p class="muted small-text">Keep this page open while the image is being processed.</p>
      </div>

      <div id="resultPanel" class="panel hidden">
        <div class="panel-heading"><div><span class="eyebrow">PRELIMINARY ANALYSIS</span><h2>Review the extracted details</h2></div><span id="reviewBadge" class="status-badge">Needs review</span></div>
        <div class="result-grid">
          <label class="field"><span>Detected bill type</span><input id="billType" value="General bill"></label>
          <label class="field"><span>Hospital / business name</span><input id="businessName" placeholder="Not detected"></label>
          <label class="field"><span>Total amount (₹)</span><input id="billAmount" placeholder="Not detected" inputmode="decimal"></label>
          <label class="field"><span>Bill date</span><input id="billDate" placeholder="Not detected"></label>
          <label class="field"><span>Invoice / bill number</span><input id="billNumber" placeholder="Not detected"></label>
          <label class="field"><span>OCR confidence</span><input id="ocrConfidence" readonly></label>
        </div>
        <div class="section-title compact"><div><h3>Possible items to review</h3><p>These are flags for manual checking, not confirmed billing errors.</p></div></div>
        <div id="reviewFlags" class="flag-list"></div>
        <div class="section-title compact"><div><h3>Detected amount-like lines</h3><p>Compare these with the original bill. OCR may have read them incorrectly.</p></div></div>
        <div id="chargeList" class="charge-list"></div>
        <div class="field full-field"><label for="notesInput">Your notes</label><textarea id="notesInput" rows="3" placeholder="Add a note about a charge, insurer or question to ask…"></textarea></div>
        <div class="button-row">
          <button class="btn btn-primary" id="saveReport">Save analysis</button>
          <button class="btn btn-secondary" id="findRoutes">Find possible next steps</button>
          <button class="btn btn-secondary" id="downloadReport">Download report</button>
        </div>
        <p class="muted small-text">Please verify the details above before saving or sharing this report.</p>
      </div>
    </section>

    <section class="page" id="page-opportunities">
      <div class="page-heading"><span class="eyebrow">STEP 02 · NEXT ACTION</span><h1>Possible assistance routes</h1><p>Use the bill type to explore sensible next steps. These are suggestions, not an eligibility decision.</p></div>
      <div id="routeSummary" class="route-summary"></div>
      <div id="routeList" class="route-grid"></div>
      <div class="privacy-banner"><span>ⓘ</span><div><strong>No guaranteed refunds or approvals</strong><p>Coverage depends on the policy, scheme rules, treatment, deadlines and official review. Confirm current requirements directly with the relevant provider.</p></div></div>
    </section>

    <section class="page" id="page-documents">
      <div class="page-heading"><span class="eyebrow">STEP 03 · PREPARATION</span><h1>Document checklist</h1><p>Tick off the documents you have. Requirements differ by insurer, scheme and case.</p></div>
      <div class="checklist-summary"><div><span>Checklist progress</span><strong id="checkProgress">0 of 7 complete</strong></div><div class="progress-track"><div id="checkProgressBar" class="progress-bar"></div></div></div>
      <div id="documentChecklist" class="document-list"></div>
      <div class="button-row"><button class="btn btn-primary" id="downloadChecklist">Download checklist</button><button class="btn btn-secondary" id="resetChecklist">Reset checklist</button></div>
      <p class="muted small-text">Only collect or share documents requested by the official provider. Never send Aadhaar, bank details or medical records to unverified contacts.</p>
    </section>

    <section class="page" id="page-history">
      <div class="page-heading"><span class="eyebrow">YOUR RECORDS</span><h1>Bill history</h1><p>Analyses saved in this browser on this device.</p></div>
      <div class="history-toolbar"><input id="historySearch" placeholder="Search by file, business, type or date…"><button class="btn btn-secondary" id="clearHistory">Clear all</button></div>
      <div id="historyList" class="history-list"></div>
    </section>
  </main>
  <footer><div><strong>ClaimBack AI</strong><p>Smart bill review and assistance guidance.</p></div><p>Informational prototype · Verify details and official requirements independently.</p></footer>
  <div id="toast" class="toast" role="status" aria-live="polite"></div>
</div>
`;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const STORAGE_KEY = 'claimBackHistoryV2';
const CHECK_KEY = 'claimBackChecklistV1';

let selectedFile = null;
let previewUrl = '';
let extractedText = '';
let currentAnalysis = null;
let ocrWorker = null;
let toastTimer;

const defaultChecklist = [
  ['finalBill', 'Final itemised bill', 'Check that charges, taxes and total are visible.'],
  ['receipts', 'Payment receipts', 'Keep receipts or proof of payment if applicable.'],
  ['discharge', 'Discharge summary', 'For hospital claims, when applicable.'],
  ['prescriptions', 'Prescriptions and reports', 'Keep supporting medical records requested by the provider.'],
  ['policy', 'Insurance policy / member details', 'Use only if making an insurance-related enquiry.'],
  ['identity', 'Identity and eligibility documents', 'Provide only what the official process requires.'],
  ['bank', 'Bank details requested by provider', 'Share securely only with a verified official recipient.']
];

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function go(page) {
  $$('.page').forEach(section => section.classList.toggle('active', section.id === `page-${page}`));
  $$('.nav-btn').forEach(button => button.classList.toggle('active', button.dataset.page === page));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'history') renderHistory();
  if (page === 'opportunities') renderRoutes();
  if (page === 'documents') renderChecklist();
  updateStats();
}

$$('[data-page]').forEach(button => button.addEventListener('click', () => go(button.dataset.page)));
$$('[data-go]').forEach(button => button.addEventListener('click', () => go(button.dataset.go)));
$('#brandHome').addEventListener('click', event => { event.preventDefault(); go('home'); });
$('#startCheck').addEventListener('click', () => go('analyze'));

$('#chooseFile').addEventListener('click', () => $('#billInput').click());
$('#billInput').addEventListener('change', event => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Please choose a bill image. PDF processing is not enabled in this version.');
    event.target.value = '';
    return;
  }
  if (file.size > 15 * 1024 * 1024) {
    showToast('Please choose an image smaller than 15 MB.');
    event.target.value = '';
    return;
  }
  setSelectedFile(file);
});

function setSelectedFile(file) {
  selectedFile = file;
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = URL.createObjectURL(file);
  $('#billPreview').src = previewUrl;
  $('#selectedFileName').textContent = file.name;
  $('#selectedFileSize').textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
  $('#previewPanel').classList.remove('hidden');
  $('#resultPanel').classList.add('hidden');
  $('#loadingPanel').classList.add('hidden');
}

$('#removeFile').addEventListener('click', () => {
  selectedFile = null;
  extractedText = '';
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = '';
  $('#billInput').value = '';
  $('#billPreview').removeAttribute('src');
  $('#previewPanel').classList.add('hidden');
  $('#resultPanel').classList.add('hidden');
});

$('#analyzeBtn').addEventListener('click', analyzeBill);

async function analyzeBill() {
  if (!selectedFile) return showToast('Choose a bill image first.');
  $('#loadingPanel').classList.remove('hidden');
  $('#resultPanel').classList.add('hidden');
  $('#progressBar').style.width = '0%';
  $('#loadingText').textContent = 'Loading OCR engine…';
  $('#analyzeBtn').disabled = true;

  try {
    if (!ocrWorker) {
      ocrWorker = await Tesseract.createWorker('eng', 1, {
        logger: message => {
          if (message.status) $('#loadingText').textContent = statusText(message.status);
          if (typeof message.progress === 'number') $('#progressBar').style.width = `${Math.round(message.progress * 100)}%`;
        }
      });
    }
    const result = await ocrWorker.recognize(selectedFile);
    extractedText = result.data.text || '';
    currentAnalysis = extractDetails(extractedText, result.data.confidence, selectedFile.name);
    renderAnalysis(currentAnalysis);
    $('#loadingPanel').classList.add('hidden');
    $('#resultPanel').classList.remove('hidden');
    showToast('Reading complete. Please review every extracted field.');
    $('#resultPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    console.error(error);
    $('#loadingPanel').classList.add('hidden');
    showToast('Could not read this image. Try a clearer, well-lit image.');
  } finally {
    $('#analyzeBtn').disabled = false;
  }
}

function statusText(status) {
  const labels = {
    'loading tesseract core': 'Preparing OCR engine…',
    'initializing tesseract': 'Starting OCR…',
    'loading language traineddata': 'Loading English language data…',
    'initializing api': 'Preparing image analysis…',
    'recognizing text': 'Recognising text on the bill…'
  };
  return labels[status] || status;
}

function extractDetails(text, confidence, fileName) {
  const clean = text.replace(/\r/g, '\n');
  const lower = clean.toLowerCase();
  const type = detectType(lower);
  const amount = detectTotal(clean);
  const date = detectDate(clean);
  const business = detectBusiness(clean);
  const billNumber = detectBillNumber(clean);
  const amounts = extractAmountLines(clean);
  const flags = makeFlags(clean, amount, amounts, confidence);
  return {
    id: Date.now(),
    fileName,
    type,
    amount,
    date,
    business,
    billNumber,
    confidence: Number.isFinite(confidence) ? Math.round(confidence) : null,
    amounts,
    flags,
    text: clean,
    notes: '',
    createdAt: new Date().toLocaleString()
  };
}

function detectType(lower) {
  if (/hospital|patient|diagnosis|discharge|medical|surgery|pharmacy|clinic|doctor|pathology/.test(lower)) return 'Hospital / medical bill';
  if (/restaurant|food bill|table no|dining|cafe|gstin/.test(lower)) return 'Restaurant / invoice';
  if (/hotel|check.in|check.out|room tariff/.test(lower)) return 'Hotel bill';
  if (/repair|service centre|workshop|spare parts/.test(lower)) return 'Repair / service bill';
  if (/invoice|tax invoice|gst/.test(lower)) return 'General invoice';
  return 'General bill';
}

function numberFromString(value) {
  if (!value) return null;
  const normalized = value.replace(/,/g, '').replace(/[^\d.]/g, '');
  const number = Number(normalized);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function detectTotal(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  const preferred = /grand\s*total|net\s*amount|amount\s*payable|total\s*payable|bill\s*total|total\s*amount|invoice\s*total|balance\s*due/i;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (preferred.test(lines[i])) {
      const found = [...lines[i].matchAll(/(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{1,2})?)/gi)];
      const value = found.map(match => numberFromString(match[1])).filter(Boolean).pop();
      if (value) return value;
    }
  }
  const currency = [...text.matchAll(/(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/gi)]
    .map(match => numberFromString(match[1])).filter(Boolean);
  return currency.length ? currency[currency.length - 1] : null;
}

function detectDate(text) {
  const match = text.match(/\b(?:\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\d{4}[\/.-]\d{1,2}[\/.-]\d{1,2})\b/);
  return match ? match[0] : '';
}

function detectBusiness(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 2);
  const candidate = lines.find(line => /hospital|clinic|medical centre|medical center|pharmacy|diagnostic|laborator|restaurant|hotel|services|invoice/i.test(line));
  return candidate ? candidate.slice(0, 100) : '';
}

function detectBillNumber(text) {
  const match = text.match(/(?:invoice|bill|receipt)\s*(?:no\.?|number|#|id)?\s*[:\-]?\s*([A-Z0-9/-]{3,})/i);
  return match ? match[1] : '';
}

function extractAmountLines(text) {
  return text.split('\n').map(line => line.trim()).filter(line => {
    const hasAmount = /(?:₹|rs\.?|inr)\s*[\d,]+|\b\d[\d,]*\.\d{2}\b/.test(line);
    return hasAmount && line.length > 2;
  }).slice(0, 20);
}

function makeFlags(text, amount, amounts, confidence) {
  const flags = [];
  if (confidence !== null && confidence < 65) flags.push('OCR confidence is low. Check the original image and correct any misread values.');
  if (!amount) flags.push('A clear total was not detected. Enter the amount manually after checking the bill.');
  if (!/hospital|patient|diagnosis|medical|clinic|pharmacy/i.test(text)) flags.push('Hospital or medical context was not clearly detected. Confirm the bill type.');
  const repeated = amounts.filter((line, index) => amounts.findIndex(other => other.toLowerCase() === line.toLowerCase()) !== index);
  if (repeated.length) flags.push('Repeated-looking amount lines were found. They may be legitimate; compare them with the original bill.');
  if (!/\b(?:gst|tax|cgst|sgst|igst)\b/i.test(text)) flags.push('Tax details were not clearly detected. This may not apply to every bill.');
  if (!flags.length) flags.push('No automatic review flag was found, but this is not proof that the bill is correct.');
  return flags;
}

function renderAnalysis(data) {
  $('#billType').value = data.type;
  $('#businessName').value = data.business || '';
  $('#billAmount').value = data.amount ?? '';
  $('#billDate').value = data.date || '';
  $('#billNumber').value = data.billNumber || '';
  $('#ocrConfidence').value = data.confidence === null ? 'Not available' : `${data.confidence}% (OCR estimate)`;
  $('#reviewBadge').textContent = data.flags.length ? 'Needs review' : 'Review manually';
  $('#reviewFlags').innerHTML = data.flags.map(flag => `<div class="flag-item"><span>!</span><p>${escapeHTML(flag)}</p></div>`).join('');
  $('#chargeList').innerHTML = data.amounts.length
    ? data.amounts.map(line => `<div class="charge-item"><span>${escapeHTML(line)}</span><button class="text-btn" data-copy-charge="${escapeHTML(line)}">Copy line</button></div>`).join('')
    : '<p class="empty-state">No amount-like lines were detected. Check the original bill manually.</p>';
  $('#notesInput').value = data.notes || '';
  $('#chargeList').querySelectorAll('[data-copy-charge]').forEach(button => button.addEventListener('click', () => {
    $('#notesInput').value += `${$('#notesInput').value ? '\n' : ''}${button.dataset.copyCharge}`;
    showToast('Line added to your notes.');
  }));
}

$('#saveReport').addEventListener('click', () => {
  const data = readForm();
  if (!data) return showToast('Analyze a bill before saving.');
  data.notes = $('#notesInput').value.trim();
  data.updatedAt = new Date().toLocaleString();
  saveHistoryRecord(data);
  currentAnalysis = data;
  showToast('Analysis saved in this browser.');
  updateStats();
});

function readForm() {
  if (!currentAnalysis) return null;
  const amount = numberFromString($('#billAmount').value);
  return {
    ...currentAnalysis,
    type: $('#billType').value.trim() || 'General bill',
    business: $('#businessName').value.trim(),
    amount,
    date: $('#billDate').value.trim(),
    billNumber: $('#billNumber').value.trim(),
    notes: $('#notesInput').value.trim()
  };
}

function saveHistoryRecord(data) {
  const history = getHistory();
  const record = {
    id: data.id || Date.now(),
    fileName: data.fileName || 'Bill image',
    type: data.type || 'General bill',
    business: data.business || '',
    amount: data.amount ?? null,
    date: data.date || '',
    billNumber: data.billNumber || '',
    confidence: data.confidence ?? null,
    flags: data.flags || [],
    amounts: data.amounts || [],
    notes: data.notes || '',
    createdAt: data.createdAt || new Date().toLocaleString(),
    updatedAt: data.updatedAt || ''
  };
  const index = history.findIndex(item => item.id === record.id);
  if (index >= 0) history[index] = record;
  else history.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 100)));
  renderHistory();
}

function getHistory() {
  try {
    const newer = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const older = JSON.parse(localStorage.getItem('claimBackHistory') || '[]');
    return [...newer, ...older.filter(old => !newer.some(item => item.fileName === old.fileName && item.amount === old.amount))]
      .slice(0, 100);
  } catch {
    return [];
  }
}

function formatCurrency(amount) {
  if (amount === null || amount === undefined || amount === '') return 'Not detected';
  const number = Number(amount);
  return Number.isFinite(number) ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(number) : 'Not detected';
}

function escapeHTML(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

$('#findRoutes').addEventListener('click', () => {
  const data = readForm();
  if (!data) return showToast('Analyze a bill first.');
  currentAnalysis = data;
  go('opportunities');
});

function routeData(type) {
  if (/hospital|medical|pharmacy|clinic/i.test(type)) {
    return [
      { icon: '＋', title: 'Ask your health insurer', tag: 'IF INSURED', body: 'Ask whether the treatment and expenses are covered, which deadlines apply and which documents are required.', steps: ['Policy or member details', 'Final itemised bill and payment proof', 'Discharge summary and supporting records if requested'] },
      { icon: '▤', title: 'Check reimbursement rules', tag: 'POLICY DEPENDENT', body: 'If you paid out of pocket, ask the insurer or employer benefits team whether reimbursement is possible for this case.', steps: ['Confirm claim deadline', 'Confirm eligible expense categories', 'Request the official claim form'] },
      { icon: '♧', title: 'Ask about public assistance', tag: 'ELIGIBILITY REQUIRED', body: 'Ask the hospital help desk or relevant government office whether any current public assistance programme applies to your circumstances.', steps: ['Ask for the current scheme name and official rules', 'Confirm whether pre-approval is required', 'Use only verified government contact details'] }
    ];
  }
  if (/hotel/i.test(type)) {
    return [
      { icon: '↺', title: 'Query a billing discrepancy', tag: 'IF APPLICABLE', body: 'Compare room nights, taxes and extras with your booking confirmation. Contact the hotel with the exact line you want reviewed.', steps: ['Booking confirmation', 'Final invoice', 'Payment receipt'] },
      { icon: '▧', title: 'Check payment or booking support', tag: 'PROVIDER RULES', body: 'If the charge differs from the booking, contact the hotel or booking provider and ask about its dispute process.', steps: ['Booking ID', 'Invoice and transaction reference', 'Written explanation of the difference'] }
    ];
  }
  if (/restaurant/i.test(type)) {
    return [
      { icon: '↺', title: 'Request a bill correction', tag: 'IF APPLICABLE', body: 'Compare the receipt with the items ordered and ask the restaurant to explain any unexpected charge.', steps: ['Original receipt', 'Order details if available', 'Specific line to clarify'] },
      { icon: '▤', title: 'Check payment records', tag: 'PAYMENT QUERY', body: 'If the card or UPI amount differs from the receipt, compare the transaction record and contact the payment provider.', steps: ['Receipt', 'Transaction reference', 'Date and amount'] }
    ];
  }
  return [
    { icon: '↺', title: 'Ask the seller for a correction', tag: 'IF APPLICABLE', body: 'Compare the invoice with the agreed price, quote or service order and ask the seller to explain any difference.', steps: ['Original invoice', 'Quote or work order', 'Payment proof'] },
    { icon: '▤', title: 'Check warranty or service terms', tag: 'IF APPLICABLE', body: 'For a repair or product service bill, review the warranty and service terms before requesting support.', steps: ['Invoice', 'Warranty terms', 'Service report'] }
  ];
}

function renderRoutes() {
  const data = readForm() || currentAnalysis;
  const type = data?.type || currentAnalysis?.type || 'General bill';
  const amount = data?.amount ?? currentAnalysis?.amount ?? null;
  $('#routeSummary').innerHTML = `<div><span>Bill type</span><strong>${escapeHTML(type)}</strong></div><div><span>Detected amount</span><strong>${formatCurrency(amount)}</strong></div><div><span>Suggested routes</span><strong>${routeData(type).length}</strong></div>`;
  $('#routeList').innerHTML = routeData(type).map((route, index) => `
    <article class="route-card">
      <div class="route-icon">${route.icon}</div><span class="route-tag">${escapeHTML(route.tag)}</span>
      <h3>${escapeHTML(route.title)}</h3><p>${escapeHTML(route.body)}</p>
      <h4>What to prepare</h4><ul>${route.steps.map(step => `<li>${escapeHTML(step)}</li>`).join('')}</ul>
      <button class="btn btn-secondary" data-route-checklist="${index}">Open document checklist</button>
    </article>
  `).join('');
  $('#routeList').querySelectorAll('[data-route-checklist]').forEach(button => button.addEventListener('click', () => go('documents')));
}

$('#downloadReport').addEventListener('click', () => {
  const data = readForm();
  if (!data) return showToast('Analyze a bill before downloading a report.');
  const report = [
    'CLAIMBACK AI — PRELIMINARY BILL REVIEW',
    `Created: ${new Date().toLocaleString()}`,
    `File: ${data.fileName}`,
    `Bill type: ${data.type}`,
    `Business / hospital: ${data.business || 'Not detected'}`,
    `Amount: ${formatCurrency(data.amount)}`,
    `Date: ${data.date || 'Not detected'}`,
    `Bill number: ${data.billNumber || 'Not detected'}`,
    `OCR confidence: ${data.confidence === null ? 'Not available' : `${data.confidence}% (estimate)`}`,
    '',
    'POSSIBLE REVIEW ITEMS',
    ...(data.flags || []).map(flag => `- ${flag}`),
    '',
    'AMOUNT-LIKE LINES',
    ...(data.amounts || []).map(line => `- ${line}`),
    '',
    `User notes: ${data.notes || 'None'}`,
    '',
    'Important: OCR can make mistakes. This report is informational only and does not confirm billing errors, insurance coverage, eligibility or refund approval. Verify details and official requirements independently.'
  ].join('\n');
  downloadText(`claimback-report-${Date.now()}.txt`, report, 'text/plain;charset=utf-8');
});

function downloadText(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function getChecklist() {
  try {
    return JSON.parse(localStorage.getItem(CHECK_KEY) || '{}');
  } catch {
    return {};
  }
}

function renderChecklist() {
  const checked = getChecklist();
  $('#documentChecklist').innerHTML = defaultChecklist.map(([id, title, description]) => `
    <label class="document-check ${checked[id] ? 'checked' : ''}">
      <input type="checkbox" data-check-id="${id}" ${checked[id] ? 'checked' : ''}>
      <span class="fake-check">${checked[id] ? '✓' : ''}</span>
      <span><strong>${escapeHTML(title)}</strong><small>${escapeHTML(description)}</small></span>
    </label>
  `).join('');
  $('#documentChecklist').querySelectorAll('[data-check-id]').forEach(input => input.addEventListener('change', () => {
    const state = getChecklist();
    state[input.dataset.checkId] = input.checked;
    localStorage.setItem(CHECK_KEY, JSON.stringify(state));
    renderChecklist();
  }));
  const count = defaultChecklist.filter(([id]) => checked[id]).length;
  $('#checkProgress').textContent = `${count} of ${defaultChecklist.length} complete`;
  $('#checkProgressBar').style.width = `${count / defaultChecklist.length * 100}%`;
}

$('#downloadChecklist').addEventListener('click', () => {
  const checked = getChecklist();
  const lines = ['CLAIMBACK AI — DOCUMENT CHECKLIST', '', ...defaultChecklist.map(([id, title, description]) => `${checked[id] ? '[x]' : '[ ]'} ${title} — ${description}`), '', 'Requirements vary by insurer, scheme and case. Confirm the official checklist before submitting documents.'];
  downloadText('claimback-document-checklist.txt', lines.join('\n'), 'text/plain;charset=utf-8');
});
$('#resetChecklist').addEventListener('click', () => {
  if (!confirm('Reset all checklist ticks?')) return;
  localStorage.removeItem(CHECK_KEY);
  renderChecklist();
  showToast('Checklist reset.');
});

function renderHistory() {
  const query = ($('#historySearch')?.value || '').toLowerCase().trim();
  const history = getHistory().filter(item => [item.fileName, item.type, item.business, item.date, item.createdAt, item.amount].join(' ').toLowerCase().includes(query));
  if (!history.length) {
    $('#historyList').innerHTML = `<div class="empty-state large"><span>▤</span><h3>No saved bills found</h3><p>Save an analysis to see it here.</p><button class="btn btn-primary" id="historyStart">Check a bill</button></div>`;
    $('#historyStart').addEventListener('click', () => go('analyze'));
    return;
  }
  $('#historyList').innerHTML = history.map(item => `
    <article class="history-card">
      <div class="history-file-icon">▤</div>
      <div class="history-main"><strong>${escapeHTML(item.fileName)}</strong><span>${escapeHTML(item.type)}${item.business ? ` · ${escapeHTML(item.business)}` : ''}</span><small>${escapeHTML(item.createdAt || '')}</small></div>
      <div class="history-amount"><strong>${formatCurrency(item.amount)}</strong><small>${escapeHTML(item.date || 'Date not detected')}</small></div>
      <button class="btn btn-quiet danger-text" data-delete-id="${item.id}" aria-label="Delete saved analysis">Delete</button>
    </article>
  `).join('');
  $('#historyList').querySelectorAll('[data-delete-id]').forEach(button => button.addEventListener('click', () => {
    if (!confirm('Delete this saved analysis from this browser?')) return;
    const updated = getHistory().filter(item => String(item.id) !== button.dataset.deleteId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    renderHistory();
    updateStats();
    showToast('Saved analysis deleted.');
  }));
}

$('#historySearch').addEventListener('input', renderHistory);
$('#clearHistory').addEventListener('click', () => {
  if (!getHistory().length) return showToast('There is no saved history to clear.');
  if (!confirm('Delete all saved bill history from this browser?')) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('claimBackHistory');
  renderHistory();
  updateStats();
  showToast('History cleared.');
});

function updateStats() {
  const history = getHistory();
  $('#statBills').textContent = history.length;
  $('#statReview').textContent = history.filter(item => (item.flags || []).length > 0).length;
  $('#statRoutes').textContent = history.filter(item => /hospital|medical|hotel|restaurant|repair|invoice/i.test(item.type || '')).length;
}

renderChecklist();
renderHistory();
updateStats();
go('home');

window.addEventListener('beforeunload', () => {
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  if (ocrWorker) ocrWorker.terminate();
});
