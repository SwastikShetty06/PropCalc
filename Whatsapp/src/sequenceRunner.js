const fs = require('fs');
const path = require('path');
const { MessageMedia, whatsappManager } = require('./whatsappClient');

/**
 * Validates a file's existence and creates a MessageMedia instance.
 * Supports absolute paths, relative paths, and memory buffers.
 */
function createMediaFromFile(filePath, customFilename = null) {
  const resolvedPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`File not found at path: ${resolvedPath}`);
  }

  const media = MessageMedia.fromFilePath(resolvedPath);
  if (customFilename) {
    media.filename = customFilename;
  }
  return media;
}

/**
 * Creates MessageMedia from base64 data.
 */
function createMediaFromBase64(base64Data, mimetype, filename = 'attachment') {
  return new MessageMedia(mimetype, base64Data, filename);
}

/**
 * Executes a sequence of WhatsApp messages (text, PDF, images, videos)
 * with precise per-item delays.
 *
 * @param {string} recipientNumber - Target phone number with country code.
 * @param {Array<Object>} steps - Array of message step definitions.
 * @param {Object} options - Optional callbacks and configurations.
 * @param {Function} options.onProgress - Callback triggered at each milestone: (progressData) => void.
 * @returns {Promise<Object>} Execution report summary.
 */
async function executeSequence(recipientNumber, steps, options = {}) {
  const startTime = Date.now();
  const onProgress = options.onProgress || (() => {});
  const logs = [];

  const addLog = (level, message, meta = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, ...meta };
    logs.push(logEntry);
    console.log(`[Sequence Engine] [${level.toUpperCase()}] ${message}`);
    onProgress({ type: 'log', log: logEntry });
  };

  addLog('info', `Starting sequence dispatch to ${recipientNumber} with ${steps.length} step(s).`);

  // Step 1: Validate WhatsApp Client Status
  const statusInfo = whatsappManager.getStatus();
  if (!statusInfo.isReady) {
    const errorMsg = `WhatsApp client is not ready (Current status: ${statusInfo.status}). Scan QR code first.`;
    addLog('error', errorMsg);
    throw new Error(errorMsg);
  }

  const client = whatsappManager.getClient();

  // Step 2: Normalize and Validate Recipient Number
  addLog('info', `Validating recipient number: ${recipientNumber}...`);
  const validation = await whatsappManager.validateNumber(recipientNumber);

  if (!validation.isValid) {
    const errorMsg = validation.error || `Recipient ${recipientNumber} failed validation.`;
    addLog('error', errorMsg);
    throw new Error(errorMsg);
  }

  const recipientId = validation.recipientId;
  addLog('info', `Target verified: ${recipientId} (Registered: ${validation.isRegistered})`);

  onProgress({
    type: 'start',
    recipientId,
    totalSteps: steps.length,
    timestamp: startTime,
  });

  const stepResults = [];
  let successfulSteps = 0;
  let failedSteps = 0;

  // Step 3: Sequential Execution Loop
  for (let i = 0; i < steps.length; i++) {
    const stepNumber = i + 1;
    const step = steps[i];
    const totalSteps = steps.length;
    const delayMs = typeof step.delayMs === 'number' ? Math.max(0, step.delayMs) : 2000;
    const stepStartTime = Date.now();

    addLog('info', `Executing Step ${stepNumber}/${totalSteps}: [${(step.type || 'text').toUpperCase()}]`, {
      stepIndex: i,
      stepNumber,
      totalSteps,
    });

    onProgress({
      type: 'step_start',
      stepIndex: i,
      stepNumber,
      totalSteps,
      stepType: step.type,
    });

    let sentMessage = null;
    let stepError = null;

    try {
      const stepType = (step.type || 'text').toLowerCase();

      switch (stepType) {
        case 'text': {
          if (!step.content || !step.content.trim()) {
            throw new Error(`Step ${stepNumber} text content is empty.`);
          }
          sentMessage = await client.sendMessage(recipientId, step.content.trim());
          addLog('success', `Step ${stepNumber}/${totalSteps} sent: Text message (${step.content.length} chars)`);
          break;
        }

        case 'file':
        case 'pdf':
        case 'image':
        case 'video':
        case 'document': {
          let media;
          if (step.base64Data && step.mimetype) {
            media = createMediaFromBase64(step.base64Data, step.mimetype, step.filename || 'attachment');
          } else if (step.filePath) {
            media = createMediaFromFile(step.filePath, step.filename);
          } else {
            throw new Error(`Step ${stepNumber} (${stepType}) missing filePath or base64Data.`);
          }

          const sendOptions = {};
          if (step.caption && step.caption.trim()) {
            sendOptions.caption = step.caption.trim();
          }

          sentMessage = await client.sendMessage(recipientId, media, sendOptions);
          addLog(
            'success',
            `Step ${stepNumber}/${totalSteps} sent: [${stepType.toUpperCase()}] ${media.filename || 'Media'} ${
              sendOptions.caption ? `with caption "${sendOptions.caption}"` : ''
            }`
          );
          break;
        }

        default:
          throw new Error(`Unsupported step type: "${step.type}" at step ${stepNumber}.`);
      }

      successfulSteps++;
      stepResults.push({
        stepNumber,
        stepIndex: i,
        type: step.type,
        success: true,
        messageId: sentMessage ? sentMessage.id?._serialized : null,
        durationMs: Date.now() - stepStartTime,
      });

      onProgress({
        type: 'step_success',
        stepIndex: i,
        stepNumber,
        totalSteps,
        stepType: step.type,
      });
    } catch (err) {
      failedSteps++;
      stepError = err.message;
      addLog('error', `Step ${stepNumber}/${totalSteps} failed: ${err.message}`, { error: err.stack });

      stepResults.push({
        stepNumber,
        stepIndex: i,
        type: step.type,
        success: false,
        error: err.message,
        durationMs: Date.now() - stepStartTime,
      });

      onProgress({
        type: 'step_error',
        stepIndex: i,
        stepNumber,
        totalSteps,
        error: err.message,
      });

      if (options.stopOnError) {
        addLog('warn', `Stopping sequence execution due to error at step ${stepNumber}.`);
        break;
      }
    }

    // Step 4: Delay Enforcement
    // Apply delay after step if not the last step OR if delay is explicitly specified
    const isLastStep = i === steps.length - 1;
    if (!isLastStep && delayMs > 0) {
      addLog('info', `Waiting ${delayMs}ms before step ${stepNumber + 1}...`, { delayMs });
      onProgress({
        type: 'delay_start',
        delayMs,
        nextStepNumber: stepNumber + 1,
      });
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      onProgress({
        type: 'delay_end',
        delayMs,
      });
    }
  }

  const durationMs = Date.now() - startTime;
  const summary = {
    success: failedSteps === 0,
    recipientId,
    recipientNumber,
    totalSteps: steps.length,
    successfulSteps,
    failedSteps,
    durationMs,
    stepResults,
    logs,
  };

  addLog('info', `Sequence completed in ${(durationMs / 1000).toFixed(2)}s: ${successfulSteps}/${steps.length} succeeded.`);
  onProgress({
    type: 'complete',
    summary,
  });

  return summary;
}

module.exports = {
  executeSequence,
  createMediaFromFile,
  createMediaFromBase64,
};
