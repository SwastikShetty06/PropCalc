// State Management
let clientStatus = 'INITIALIZING';
let isClientReady = false;
let sequenceSteps = [];
let savedTemplates = [];
let activeTemplateId = null;
let activeEventSource = null;
let delayIntervalTimer = null;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initStatusPolling();
  loadSavedTemplates();
  loadRecentJobs();

  // Attach button events
  document.getElementById('btnRestartClient').addEventListener('click', restartClient);
  document.getElementById('btnClearSession').addEventListener('click', clearSessionAndReset);
  document.getElementById('btnVerifyRecipient').addEventListener('click', verifyRecipientNumber);
});

// -------------------------------------------------------------
// 1. WhatsApp Client Status & QR Polling
// -------------------------------------------------------------

function initStatusPolling() {
  checkStatus();
  setInterval(checkStatus, 3000);
}

async function checkStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();

    if (!data.success) return;

    clientStatus = data.status;
    isClientReady = data.isReady;

    updateStatusUI(data);

    if (clientStatus === 'QR_READY' || data.hasQR) {
      fetchQRCode();
    } else {
      hideQR();
    }
  } catch (err) {
    console.error('Status check error:', err);
  }
}

async function fetchQRCode(manual = false) {
  const qrLoading = document.getElementById('qrLoadingOverlay');
  if (manual && qrLoading) qrLoading.classList.remove('hidden');

  try {
    const res = await fetch('/api/qr');
    const data = await res.json();

    const qrContainer = document.getElementById('qrContainer');
    const qrImage = document.getElementById('qrCodeImage');

    if (data.qrDataUrl) {
      qrImage.src = data.qrDataUrl;
      qrContainer.classList.remove('hidden');
    }
  } catch (e) {
    console.error('Failed to load QR code:', e);
  } finally {
    if (qrLoading) qrLoading.classList.add('hidden');
  }
}

function hideQR() {
  const qrContainer = document.getElementById('qrContainer');
  if (qrContainer) qrContainer.classList.add('hidden');
}

function updateStatusUI(data) {
  const headerBadge = document.getElementById('headerStatusBadge');
  const headerText = document.getElementById('headerStatusText');
  const statusIconBox = document.getElementById('statusIconBox');
  const statusTitle = document.getElementById('statusTitle');
  const statusPill = document.getElementById('statusPill');
  const statusDesc = document.getElementById('statusDescription');
  const accountInfo = document.getElementById('connectedAccountInfo');
  const sendBtn = document.getElementById('btnSendSequence');

  statusPill.className = 'text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ';

  if (data.isReady) {
    headerBadge.className = 'flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-400';
    headerText.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400"></span> Connected';

    statusIconBox.className = 'w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-xl text-emerald-400 shrink-0';
    statusIconBox.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

    statusTitle.textContent = 'WhatsApp Web Connected';
    statusPill.textContent = 'READY';
    statusPill.classList.add('bg-emerald-500/10', 'text-emerald-400', 'border-emerald-500/20');
    statusDesc.textContent = 'Ready to execute automated message sequences.';

    if (data.info) {
      accountInfo.classList.remove('hidden');
      document.getElementById('accountPushName').textContent = data.info.pushname || 'WhatsApp User';
      document.getElementById('accountPhoneNumber').textContent = data.info.phone || '--';
    }

    sendBtn.disabled = false;
  } else if (data.status === 'QR_READY') {
    headerBadge.className = 'flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-medium text-amber-300';
    headerText.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span> Scan QR Code';

    statusIconBox.className = 'w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-xl text-amber-400 shrink-0';
    statusIconBox.innerHTML = '<i class="fa-solid fa-qrcode"></i>';

    statusTitle.textContent = 'Scan QR Code with WhatsApp';
    statusPill.textContent = 'QR READY';
    statusPill.classList.add('bg-amber-500/10', 'text-amber-300', 'border-amber-500/20');
    statusDesc.textContent = 'Open WhatsApp on your phone & scan the QR code on the right.';

    accountInfo.classList.add('hidden');
    sendBtn.disabled = true;
  } else if (data.status === 'LOADING_CHATS' || data.status === 'AUTHENTICATED') {
    headerBadge.className = 'flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs font-medium text-blue-300';
    headerText.innerHTML = '<span class="w-2 h-2 rounded-full bg-blue-400 animate-spin"></span> Syncing Chats...';

    statusIconBox.className = 'w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-xl text-blue-400 shrink-0';
    statusIconBox.innerHTML = '<i class="fa-solid fa-arrows-spin fa-spin"></i>';

    const prog = data.loadingProgress;
    statusTitle.textContent = prog ? `Syncing Chats (${prog.percent}%)...` : 'Authenticated, Finalizing Session...';
    statusPill.textContent = 'SYNCING';
    statusPill.classList.add('bg-blue-500/10', 'text-blue-300', 'border-blue-500/20');
    statusDesc.textContent = prog ? `WhatsApp Web is loading: ${prog.message}` : 'Multi-device pairing successful. Waiting for ready state...';
    sendBtn.disabled = true;
  } else {
    headerBadge.className = 'flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-400';
    headerText.innerHTML = '<span class="w-2 h-2 rounded-full bg-slate-500"></span> ' + (data.status || 'Offline');

    statusIconBox.className = 'w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl text-yellow-400 shrink-0';
    statusIconBox.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

    statusTitle.textContent = 'Starting WhatsApp Session...';
    statusPill.textContent = data.status || 'INITIALIZING';
    statusPill.classList.add('bg-yellow-500/10', 'text-yellow-400', 'border-yellow-500/20');
    statusDesc.textContent = 'Initializing Chromium instance and local session...';

    accountInfo.classList.add('hidden');
    sendBtn.disabled = true;
  }
}

async function restartClient() {
  if (!confirm('Restart WhatsApp client session?')) return;
  logToConsole('warn', 'Restarting WhatsApp client session...');
  try {
    const res = await fetch('/api/restart', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      logToConsole('info', 'Client restart triggered.');
      checkStatus();
    }
  } catch (err) {
    logToConsole('error', 'Restart failed: ' + err.message);
  }
}

async function clearSessionAndReset() {
  if (!confirm('Clear saved session files and generate a brand new QR Code? Use this if your phone is stuck connecting.')) return;
  logToConsole('warn', 'Clearing session and resetting WhatsApp client...');
  try {
    const res = await fetch('/api/clear-session', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      logToConsole('info', 'Session cleared! Awaiting fresh QR code...');
      fetchQRCode(true);
      checkStatus();
    }
  } catch (err) {
    logToConsole('error', 'Session reset failed: ' + err.message);
  }
}

// -------------------------------------------------------------
// 2. Recipient Validation
// -------------------------------------------------------------

async function verifyRecipientNumber() {
  const input = document.getElementById('recipientNumber');
  const msg = document.getElementById('recipientValidationMsg');
  const phone = input.value.trim();

  if (!phone) {
    msg.innerHTML = '<span class="text-red-400">Please enter a phone number first.</span>';
    return;
  }

  if (!isClientReady) {
    msg.innerHTML = '<span class="text-amber-400">Cannot verify: WhatsApp client is not connected yet.</span>';
    return;
  }

  msg.innerHTML = '<span class="text-slate-400"><i class="fa-solid fa-spinner fa-spin mr-1"></i> Verifying with WhatsApp...</span>';

  try {
    const res = await fetch('/api/validate-number', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();

    if (data.success && data.result.isValid) {
      if (data.result.isRegistered === true) {
        msg.innerHTML = `<span class="text-emerald-400"><i class="fa-solid fa-circle-check mr-1"></i> Valid recipient registered on WhatsApp: <b>${data.result.recipientId}</b></span>`;
      } else if (data.result.isRegistered === 'unknown') {
        msg.innerHTML = `<span class="text-amber-400"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Formatted as <b>${data.result.recipientId}</b></span>`;
      } else {
        msg.innerHTML = `<span class="text-red-400"><i class="fa-solid fa-circle-xmark mr-1"></i> Number +${data.result.cleanedNumber} is NOT registered on WhatsApp.</span>`;
      }
    } else {
      msg.innerHTML = `<span class="text-red-400"><i class="fa-solid fa-circle-xmark mr-1"></i> ${data.result?.error || data.error}</span>`;
    }
  } catch (err) {
    msg.innerHTML = `<span class="text-red-400">Validation request error: ${err.message}</span>`;
  }
}

// -------------------------------------------------------------
// 3. Saved Templates Management
// -------------------------------------------------------------

async function loadSavedTemplates() {
  try {
    const res = await fetch('/api/templates');
    const data = await res.json();

    if (data.success && Array.isArray(data.templates)) {
      savedTemplates = data.templates;
      renderTemplateChips();

      // If no steps are loaded yet, load the first template (Ethnic Wear Catalog) by default
      if (sequenceSteps.length === 0 && savedTemplates.length > 0) {
        selectTemplate(savedTemplates[0].id);
      }
    }
  } catch (err) {
    console.error('Failed to load templates:', err);
  }
}

function renderTemplateChips() {
  const container = document.getElementById('templatesChipsContainer');
  if (!container) return;

  if (savedTemplates.length === 0) {
    container.innerHTML = '<span class="text-xs text-slate-500">No saved templates found.</span>';
    return;
  }

  container.innerHTML = savedTemplates
    .map((tpl) => {
      const isSelected = activeTemplateId === tpl.id;
      const isBuiltIn = ['ethnic-collection', 'welcome-brochure', 'invoice-receipt'].includes(tpl.id);
      
      const badgeIcon = tpl.id === 'ethnic-collection' ? 'fa-sparkles text-amber-400' : 'fa-file-lines text-purple-400';

      return `
      <div class="inline-flex items-center rounded-lg border transition ${
        isSelected
          ? 'bg-purple-600/30 border-purple-400 text-white shadow-sm'
          : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
      }">
        <button
          type="button"
          onclick="selectTemplate('${tpl.id}')"
          class="px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
        >
          <i class="fa-solid ${badgeIcon}"></i>
          <span>${escapeHtml(tpl.name)}</span>
          <span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-normal">
            ${tpl.steps?.length || 0} items
          </span>
        </button>
        ${
          !isBuiltIn
            ? `
          <button
            type="button"
            onclick="deleteTemplate('${tpl.id}')"
            class="px-2 py-1.5 text-slate-500 hover:text-red-400 border-l border-slate-700 text-xs transition"
            title="Delete Template"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        `
            : ''
        }
      </div>
    `;
    })
    .join('');
}

function selectTemplate(templateId) {
  const tpl = savedTemplates.find((t) => t.id === templateId);
  if (!tpl) return;

  activeTemplateId = templateId;
  // Deep clone steps
  sequenceSteps = JSON.parse(JSON.stringify(tpl.steps || []));

  // Show active template banner
  const banner = document.getElementById('activeTemplateBanner');
  const nameSpan = document.getElementById('activeTemplateName');
  if (banner && nameSpan) {
    nameSpan.textContent = tpl.name;
    banner.classList.remove('hidden');
  }

  renderTemplateChips();
  renderSteps();
  logToConsole('info', `Loaded saved template: "${tpl.name}" with ${sequenceSteps.length} pre-configured item(s).`);
}

function unloadActiveTemplate() {
  activeTemplateId = null;
  const banner = document.getElementById('activeTemplateBanner');
  if (banner) banner.classList.add('hidden');
  renderTemplateChips();
}

function openSaveTemplateModal() {
  if (sequenceSteps.length === 0) {
    alert('Please add at least one step to the sequence before saving as a template.');
    return;
  }
  document.getElementById('tplModalName').value = activeTemplateId ? `Copy of ${document.getElementById('activeTemplateName')?.textContent || 'Template'}` : '';
  document.getElementById('tplModalCategory').value = 'Custom';
  document.getElementById('tplModalDesc').value = '';
  document.getElementById('saveTemplateModal').classList.remove('hidden');
  document.getElementById('tplModalName').focus();
}

function closeSaveTemplateModal() {
  document.getElementById('saveTemplateModal').classList.add('hidden');
}

async function saveCurrentTemplate() {
  const nameInput = document.getElementById('tplModalName');
  const catInput = document.getElementById('tplModalCategory');
  const descInput = document.getElementById('tplModalDesc');

  const name = nameInput.value.trim();
  if (!name) {
    alert('Please enter a name for your template.');
    nameInput.focus();
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('category', catInput.value.trim() || 'Custom');
  formData.append('description', descInput.value.trim());

  const cleanSteps = sequenceSteps.map((step) => {
    const s = {
      type: step.type,
      caption: step.caption || '',
      delayMs: step.delayMs ?? 2000,
      fileName: step.fileName || '',
      filePath: step.filePath || '',
    };
    if (step.type === 'text') {
      s.content = step.content || '';
    }
    return s;
  });

  formData.append('steps', JSON.stringify(cleanSteps));

  // Attach any uploaded file blobs
  sequenceSteps.forEach((step, index) => {
    if (step.file) {
      formData.append(`file_${index}`, step.file, step.file.name);
    }
  });

  try {
    const res = await fetch('/api/templates', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to save template');
    }

    closeSaveTemplateModal();
    logToConsole('success', `🎉 Saved new reusable template: "${data.template.name}"`);
    await loadSavedTemplates();
    selectTemplate(data.template.id);
  } catch (err) {
    alert('Failed to save template: ' + err.message);
  }
}

async function deleteTemplate(templateId) {
  const tpl = savedTemplates.find((t) => t.id === templateId);
  if (!confirm(`Are you sure you want to delete the template "${tpl?.name || templateId}"?`)) return;

  try {
    const res = await fetch(`/api/templates/${templateId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      if (activeTemplateId === templateId) {
        unloadActiveTemplate();
      }
      logToConsole('info', `Deleted template: ${tpl?.name}`);
      await loadSavedTemplates();
    }
  } catch (err) {
    alert('Failed to delete template: ' + err.message);
  }
}

// -------------------------------------------------------------
// 4. Dynamic Sequence Steps Builder
// -------------------------------------------------------------

function renderSteps() {
  const container = document.getElementById('stepsList');
  const placeholder = document.getElementById('emptyStepsPlaceholder');
  const countBadge = document.getElementById('stepCountBadge');

  countBadge.textContent = `${sequenceSteps.length} Step${sequenceSteps.length === 1 ? '' : 's'}`;

  if (sequenceSteps.length === 0) {
    container.innerHTML = '';
    placeholder.classList.remove('hidden');
    return;
  }

  placeholder.classList.add('hidden');
  container.innerHTML = '';

  sequenceSteps.forEach((step, index) => {
    const stepCard = createStepCardElement(step, index);
    container.appendChild(stepCard);
  });
}

function createStepCardElement(step, index) {
  const card = document.createElement('div');
  card.id = `step-card-${index}`;
  card.className = 'group relative rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3 transition duration-150 hover:border-slate-700';

  const typeConfig = {
    text: { label: 'Text Message', icon: 'fa-comment-dots', color: 'emerald' },
    pdf: { label: 'PDF Document', icon: 'fa-file-pdf', color: 'red' },
    image: { label: 'Image', icon: 'fa-image', color: 'blue' },
    video: { label: 'Video', icon: 'fa-video', color: 'purple' },
  }[step.type || 'text'];

  card.innerHTML = `
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono font-bold flex items-center justify-center text-slate-300">
          ${index + 1}
        </span>
        <span class="text-xs font-semibold px-2 py-0.5 rounded bg-${typeConfig.color}-500/10 text-${typeConfig.color}-400 border border-${typeConfig.color}-500/20 flex items-center gap-1.5">
          <i class="fa-solid ${typeConfig.icon}"></i>
          ${typeConfig.label}
        </span>
      </div>

      <div class="flex items-center gap-1">
        <button type="button" onclick="moveStep(${index}, -1)" ${index === 0 ? 'disabled' : ''} class="p-1 rounded text-slate-500 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-500 transition" title="Move Up">
          <i class="fa-solid fa-chevron-up text-xs"></i>
        </button>
        <button type="button" onclick="moveStep(${index}, 1)" ${index === sequenceSteps.length - 1 ? 'disabled' : ''} class="p-1 rounded text-slate-500 hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-500 transition" title="Move Down">
          <i class="fa-solid fa-chevron-down text-xs"></i>
        </button>
        <button type="button" onclick="removeStep(${index})" class="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition" title="Delete Step">
          <i class="fa-solid fa-trash-can text-xs"></i>
        </button>
      </div>
    </div>

    <!-- Step Type Selector -->
    <div class="grid grid-cols-4 gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-[11px]">
      <button type="button" onclick="changeStepType(${index}, 'text')" class="py-1 rounded font-medium transition ${step.type === 'text' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}">Text</button>
      <button type="button" onclick="changeStepType(${index}, 'pdf')" class="py-1 rounded font-medium transition ${step.type === 'pdf' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}">PDF</button>
      <button type="button" onclick="changeStepType(${index}, 'image')" class="py-1 rounded font-medium transition ${step.type === 'image' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}">Image</button>
      <button type="button" onclick="changeStepType(${index}, 'video')" class="py-1 rounded font-medium transition ${step.type === 'video' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}">Video</button>
    </div>

    <!-- Step Dynamic Content Fields -->
    <div class="space-y-2.5">
      ${
        step.type === 'text'
          ? `
        <div>
          <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Message Content</label>
          <textarea
            rows="3"
            placeholder="Type your WhatsApp message here..."
            oninput="updateStepContent(${index}, this.value)"
            class="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none resize-y"
          >${escapeHtml(step.content || '')}</textarea>
        </div>
      `
          : `
        <div>
          <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Attached ${typeConfig.label} File</label>
          
          ${
            step.filePath
              ? `
            <div class="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between mb-2">
              <div class="flex items-center gap-2 text-xs text-emerald-300">
                <i class="fa-solid fa-file-circle-check text-base text-emerald-400"></i>
                <div>
                  <div class="font-semibold">${escapeHtml(step.fileName || 'Pre-stored File')}</div>
                  <div class="text-[10px] text-emerald-500/80 font-mono">Server stored: ${escapeHtml(step.filePath)}</div>
                </div>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Saved in Template</span>
            </div>
          `
              : ''
          }

          <div class="relative flex items-center gap-2">
            <input
              type="file"
              id="file-input-${index}"
              accept="${getFileAccept(step.type)}"
              onchange="handleStepFileChange(${index}, this)"
              class="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
            />
          </div>
          ${
            step.file
              ? `<div class="mt-1 text-[11px] text-brand-400 flex items-center gap-1"><i class="fa-solid fa-paperclip"></i> Selected file: <b>${escapeHtml(step.fileName)}</b> (${formatBytes(step.fileSize)})</div>`
              : !step.filePath
              ? `<div class="mt-1 text-[10px] text-slate-500">Pick a ${step.type.toUpperCase()} file from your device.</div>`
              : ''
          }
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Caption (Optional)</label>
          <input
            type="text"
            placeholder="Add an optional caption for this media..."
            value="${escapeHtml(step.caption || '')}"
            oninput="updateStepCaption(${index}, this.value)"
            class="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
          />
        </div>
      `
      }
    </div>

    <!-- Per-Step Configurable Delay Control -->
    <div class="pt-2 border-t border-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
      <div class="flex items-center gap-1.5 text-slate-400">
        <i class="fa-solid fa-hourglass-half text-amber-400/80"></i>
        <span>Delay after step:</span>
      </div>
      <div class="flex items-center gap-3">
        <input
          type="range"
          min="0"
          max="10000"
          step="500"
          value="${step.delayMs ?? 2000}"
          oninput="updateStepDelay(${index}, this.value)"
          class="w-28 accent-brand-500 cursor-pointer"
        />
        <div class="flex items-center gap-1">
          <input
            type="number"
            min="0"
            max="60000"
            step="100"
            value="${step.delayMs ?? 2000}"
            onchange="updateStepDelay(${index}, this.value)"
            class="w-16 px-1.5 py-0.5 text-xs bg-slate-900 border border-slate-800 rounded text-center text-white font-mono"
          />
          <span class="text-[11px] text-slate-500">ms</span>
        </div>
      </div>
    </div>
  `;

  return card;
}

function getFileAccept(type) {
  if (type === 'pdf') return '.pdf,application/pdf';
  if (type === 'image') return 'image/*';
  if (type === 'video') return 'video/*';
  return '*/*';
}

function addStep(type = 'text') {
  sequenceSteps.push({
    type,
    content: type === 'text' ? '' : undefined,
    caption: '',
    delayMs: 2000,
    file: null,
    fileName: '',
    filePath: '',
    fileSize: 0,
  });
  renderSteps();
}

function removeStep(index) {
  sequenceSteps.splice(index, 1);
  renderSteps();
}

function moveStep(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= sequenceSteps.length) return;
  const temp = sequenceSteps[index];
  sequenceSteps[index] = sequenceSteps[newIndex];
  sequenceSteps[newIndex] = temp;
  renderSteps();
}

function changeStepType(index, newType) {
  sequenceSteps[index].type = newType;
  renderSteps();
}

function updateStepContent(index, content) {
  sequenceSteps[index].content = content;
}

function updateStepCaption(index, caption) {
  sequenceSteps[index].caption = caption;
}

function updateStepDelay(index, delayVal) {
  const val = parseInt(delayVal, 10) || 0;
  sequenceSteps[index].delayMs = Math.max(0, val);
  renderSteps();
}

function handleStepFileChange(index, inputElement) {
  if (inputElement.files && inputElement.files[0]) {
    const file = inputElement.files[0];
    sequenceSteps[index].file = file;
    sequenceSteps[index].fileName = file.name;
    sequenceSteps[index].fileSize = file.size;
    renderSteps();
  }
}

function clearAllSteps() {
  if (sequenceSteps.length > 0 && !confirm('Are you sure you want to clear all steps?')) return;
  sequenceSteps = [];
  unloadActiveTemplate();
  renderSteps();
}

// -------------------------------------------------------------
// 5. Sequence Submission & Real-Time Monitoring
// -------------------------------------------------------------

async function submitSequence() {
  const recipientInput = document.getElementById('recipientNumber');
  const recipient = recipientInput.value.trim();
  const sendBtn = document.getElementById('btnSendSequence');
  const sendText = document.getElementById('btnSendText');

  if (!recipient) {
    alert('Please enter a recipient phone number (with country code).');
    recipientInput.focus();
    return;
  }

  if (sequenceSteps.length === 0) {
    alert('Please add at least one step to the sequence.');
    return;
  }

  // Validate step contents
  for (let i = 0; i < sequenceSteps.length; i++) {
    const step = sequenceSteps[i];
    if (step.type === 'text' && (!step.content || !step.content.trim())) {
      alert(`Step ${i + 1} (Text Message) is empty. Please enter text or remove the step.`);
      return;
    }
  }

  sendBtn.disabled = true;
  sendText.textContent = 'Sending Sequence...';

  const formData = new FormData();
  formData.append('recipient', recipient);

  const cleanStepsMeta = sequenceSteps.map((step) => {
    const meta = {
      type: step.type,
      delayMs: step.delayMs ?? 2000,
      caption: step.caption || '',
    };
    if (step.type === 'text') {
      meta.content = step.content;
    } else if (step.filePath) {
      meta.filePath = step.filePath;
      meta.filename = step.fileName;
    }
    return meta;
  });

  formData.append('steps', JSON.stringify(cleanStepsMeta));

  sequenceSteps.forEach((step, index) => {
    if (step.file) {
      formData.append(`file_${index}`, step.file, step.file.name);
    }
  });

  logToConsole('info', `Dispatching sequence with ${sequenceSteps.length} step(s) to ${recipient}...`);
  updateJobCard('Starting dispatch...', 0, true);

  try {
    const res = await fetch('/api/send-sequence', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to start sequence.');
    }

    logToConsole('success', `Sequence queued successfully! Job ID: ${data.jobId}`);
    listenToJobEvents(data.jobId);
  } catch (err) {
    logToConsole('error', `Dispatch failed: ${err.message}`);
    updateJobCard(`Error: ${err.message}`, 0, false);
    sendBtn.disabled = !isClientReady;
    sendText.textContent = 'Send Sequence Now';
  }
}

// -------------------------------------------------------------
// 6. SSE Real-Time Event Listener
// -------------------------------------------------------------

function listenToJobEvents(jobId) {
  if (activeEventSource) {
    activeEventSource.close();
  }

  const sendBtn = document.getElementById('btnSendSequence');
  const sendText = document.getElementById('btnSendText');

  activeEventSource = new EventSource(`/api/jobs/${jobId}/events`);

  activeEventSource.onmessage = (e) => {
    try {
      const event = JSON.parse(e.data);
      handleJobEvent(event);
    } catch (err) {
      console.error('SSE JSON error:', err);
    }
  };

  activeEventSource.onerror = () => {
    activeEventSource.close();
    activeEventSource = null;
    sendBtn.disabled = !isClientReady;
    sendText.textContent = 'Send Sequence Now';
    loadRecentJobs();
  };
}

function handleJobEvent(event) {
  const sendBtn = document.getElementById('btnSendSequence');
  const sendText = document.getElementById('btnSendText');

  switch (event.type) {
    case 'init':
      logToConsole('info', `Job connected: ${event.job.id}`);
      break;

    case 'start':
      logToConsole('info', `Target recipient verified: ${event.recipientId}`);
      updateJobCard(`Sending 0/${event.totalSteps} steps...`, 5, true);
      break;

    case 'step_start':
      highlightActiveStep(event.stepIndex);
      logToConsole('info', `▶ Step ${event.stepNumber}/${event.totalSteps} starting: [${event.stepType.toUpperCase()}]`);
      const pctStart = Math.round(((event.stepNumber - 0.5) / event.totalSteps) * 100);
      updateJobCard(`Executing Step ${event.stepNumber} of ${event.totalSteps}...`, pctStart, true);
      break;

    case 'step_success':
      logToConsole('success', `✓ Step ${event.stepNumber}/${event.totalSteps} dispatched successfully!`);
      const pctEnd = Math.round((event.stepNumber / event.totalSteps) * 100);
      updateJobCard(`Step ${event.stepNumber} sent!`, pctEnd, true);
      break;

    case 'step_error':
      logToConsole('error', `✗ Step ${event.stepNumber}/${event.totalSteps} error: ${event.error}`);
      break;

    case 'delay_start':
      startDelayCountdown(event.delayMs, event.nextStepNumber);
      break;

    case 'delay_end':
      stopDelayCountdown();
      break;

    case 'log':
      if (event.log) {
        logToConsole(event.log.level, event.log.message);
      }
      break;

    case 'finished':
      stopDelayCountdown();
      clearStepHighlights();
      const s = event.summary;
      logToConsole('success', `🎉 Sequence completed! ${s.successfulSteps}/${s.totalSteps} sent in ${(s.durationMs / 1000).toFixed(2)}s`);
      updateJobCard(`Completed (${s.successfulSteps}/${s.totalSteps} sent)`, 100, false);
      sendBtn.disabled = !isClientReady;
      sendText.textContent = 'Send Sequence Now';
      loadRecentJobs();
      if (activeEventSource) {
        activeEventSource.close();
        activeEventSource = null;
      }
      break;

    case 'failed':
      stopDelayCountdown();
      clearStepHighlights();
      logToConsole('error', `❌ Sequence failed: ${event.error}`);
      updateJobCard(`Failed: ${event.error}`, 100, false);
      sendBtn.disabled = !isClientReady;
      sendText.textContent = 'Send Sequence Now';
      loadRecentJobs();
      if (activeEventSource) {
        activeEventSource.close();
        activeEventSource = null;
      }
      break;
  }
}

// -------------------------------------------------------------
// 7. UI Helpers: Progress, Delay Countdown & Logs
// -------------------------------------------------------------

function updateJobCard(statusText, progressPercent, isRunning) {
  const pulse = document.getElementById('jobPulse');
  const text = document.getElementById('jobStatusText');
  const pct = document.getElementById('jobProgressText');
  const bar = document.getElementById('jobProgressBar');

  text.textContent = statusText;
  pct.textContent = `${progressPercent}%`;
  bar.style.width = `${progressPercent}%`;

  if (isRunning) {
    pulse.className = 'w-2 h-2 rounded-full bg-brand-400 animate-ping';
  } else {
    pulse.className = 'w-2 h-2 rounded-full bg-slate-600';
  }
}

function startDelayCountdown(delayMs, nextStepNumber) {
  const box = document.getElementById('delayCountdownBox');
  const val = document.getElementById('delayCountdownVal');
  box.classList.remove('hidden');

  let remaining = delayMs;
  val.textContent = `${(remaining / 1000).toFixed(1)}s (next: Step ${nextStepNumber})`;

  clearInterval(delayIntervalTimer);
  const start = Date.now();

  delayIntervalTimer = setInterval(() => {
    const elapsed = Date.now() - start;
    remaining = Math.max(0, delayMs - elapsed);
    val.textContent = `${(remaining / 1000).toFixed(1)}s (next: Step ${nextStepNumber})`;
    if (remaining <= 0) {
      clearInterval(delayIntervalTimer);
    }
  }, 100);
}

function stopDelayCountdown() {
  clearInterval(delayIntervalTimer);
  const box = document.getElementById('delayCountdownBox');
  if (box) box.classList.add('hidden');
}

function highlightActiveStep(index) {
  clearStepHighlights();
  const card = document.getElementById(`step-card-${index}`);
  if (card) {
    card.classList.add('border-brand-500', 'bg-brand-950/20', 'pulse-glow');
  }
}

function clearStepHighlights() {
  document.querySelectorAll('[id^="step-card-"]').forEach((el) => {
    el.classList.remove('border-brand-500', 'bg-brand-950/20', 'pulse-glow');
  });
}

function logToConsole(level, message) {
  const consoleEl = document.getElementById('logConsole');
  const countEl = document.getElementById('logEntryCount');

  const timeStr = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = 'flex items-start gap-2 text-[11px] leading-relaxed';

  const colorMap = {
    info: 'text-slate-300',
    success: 'text-emerald-400 font-semibold',
    warn: 'text-amber-300',
    error: 'text-red-400 font-semibold',
  };

  const iconMap = {
    info: 'fa-circle-info text-blue-400',
    success: 'fa-circle-check text-emerald-400',
    warn: 'fa-triangle-exclamation text-amber-400',
    error: 'fa-circle-xmark text-red-400',
  };

  entry.innerHTML = `
    <span class="text-slate-600 font-mono shrink-0">[${timeStr}]</span>
    <span class="shrink-0 mt-0.5"><i class="fa-solid ${iconMap[level] || iconMap.info}"></i></span>
    <span class="${colorMap[level] || 'text-slate-300'} break-all">${escapeHtml(message)}</span>
  `;

  if (consoleEl.children.length === 1 && consoleEl.children[0].classList.contains('italic')) {
    consoleEl.innerHTML = '';
  }

  consoleEl.appendChild(entry);
  consoleEl.scrollTop = consoleEl.scrollHeight;

  countEl.textContent = `${consoleEl.children.length} events`;
}

function clearLogs() {
  const consoleEl = document.getElementById('logConsole');
  const countEl = document.getElementById('logEntryCount');
  consoleEl.innerHTML = '<div class="text-slate-600 italic text-[11px]">Console cleared.</div>';
  countEl.textContent = '0 events';
}

async function loadRecentJobs() {
  try {
    const res = await fetch('/api/jobs');
    const data = await res.json();
    const listEl = document.getElementById('recentJobsList');

    if (!data.success || data.jobs.length === 0) {
      listEl.innerHTML = '<div class="text-[11px] text-slate-600 italic">No previous jobs recorded this session.</div>';
      return;
    }

    listEl.innerHTML = data.jobs
      .map((job) => {
        const time = new Date(job.createdAt).toLocaleTimeString();
        const badgeColor =
          job.status === 'completed'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : job.status === 'running'
            ? 'bg-brand-500/10 text-brand-400 border-brand-500/20'
            : 'bg-red-500/10 text-red-400 border-red-500/20';

        return `
        <div class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
          <div class="flex items-center gap-2">
            <span class="text-[10px] px-1.5 py-0.5 rounded border uppercase font-mono font-bold ${badgeColor}">${job.status}</span>
            <span class="text-slate-300 font-mono">+${job.recipient}</span>
            <span class="text-slate-500 text-[11px]">(${job.totalSteps} steps)</span>
          </div>
          <span class="text-[10px] text-slate-500 font-mono">${time}</span>
        </div>
      `;
      })
      .join('');
  } catch (err) {
    console.error('Failed to load recent jobs:', err);
  }
}

// -------------------------------------------------------------
// 8. Utilities
// -------------------------------------------------------------

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatBytes(bytes, decimals = 1) {
  if (!bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
