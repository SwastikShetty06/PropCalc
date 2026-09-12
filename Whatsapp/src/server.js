require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const { whatsappManager, ClientStatus } = require('./whatsappClient');
const { executeSequence } = require('./sequenceRunner');
const { templateManager, TEMPLATES_UPLOAD_DIR } = require('./templateManager');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// Ensure uploads directories exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(TEMPLATES_UPLOAD_DIR)) {
  fs.mkdirSync(TEMPLATES_UPLOAD_DIR, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // If it's a template upload, save to templates dir
    if (req.path.includes('/templates')) {
      cb(null, TEMPLATES_UPLOAD_DIR);
    } else {
      cb(null, UPLOAD_DIR);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${Date.now()}-${uuidv4()}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max per file
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// In-memory job registry for tracking execution and real-time logs
const jobs = new Map();
const jobSubscribers = new Map(); // jobId -> Set<res> for SSE

function broadcastJobEvent(jobId, eventData) {
  const subscribers = jobSubscribers.get(jobId);
  if (subscribers && subscribers.size > 0) {
    const message = `data: ${JSON.stringify(eventData)}\n\n`;
    for (const clientRes of subscribers) {
      try {
        clientRes.write(message);
      } catch (err) {
        subscribers.delete(clientRes);
      }
    }
  }
}

// -------------------------------------------------------------
// 1. WHATSAPP CLIENT CONTROLS & STATUS
// -------------------------------------------------------------

/**
 * GET /api/status
 */
app.get('/api/status', (req, res) => {
  const status = whatsappManager.getStatus();
  res.json({
    success: true,
    ...status,
  });
});

/**
 * GET /api/qr
 */
app.get('/api/qr', (req, res) => {
  const qrData = whatsappManager.getQR();
  res.json({
    success: true,
    ...qrData,
  });
});

/**
 * POST /api/restart
 */
app.post('/api/restart', async (req, res) => {
  try {
    whatsappManager.restartClient();
    res.json({
      success: true,
      message: 'WhatsApp client restart initiated.',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * POST /api/clear-session
 * Clears multi-device session files and creates fresh QR code
 */
app.post('/api/clear-session', async (req, res) => {
  try {
    whatsappManager.clearSession();
    res.json({
      success: true,
      message: 'Session cleared. Fresh QR code generation in progress.',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * POST /api/validate-number
 */
app.post('/api/validate-number', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: 'Phone number is required.' });
  }

  try {
    const result = await whatsappManager.validateNumber(phone);
    res.json({
      success: true,
      result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

// -------------------------------------------------------------
// 2. TEMPLATES REST API
// -------------------------------------------------------------

/**
 * GET /api/templates
 * List all saved templates
 */
app.get('/api/templates', (req, res) => {
  try {
    const templates = templateManager.getAll();
    res.json({
      success: true,
      templates,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/templates/:id
 */
app.get('/api/templates/:id', (req, res) => {
  const template = templateManager.getById(req.params.id);
  if (!template) {
    return res.status(404).json({ success: false, error: 'Template not found' });
  }
  res.json({ success: true, template });
});

/**
 * POST /api/templates
 * Create or save a new template (supports attached files)
 */
app.post('/api/templates', upload.any(), (req, res) => {
  try {
    let { name, description, category, steps } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Template name is required.' });
    }

    if (typeof steps === 'string') {
      try {
        steps = JSON.parse(steps);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid JSON in steps.' });
      }
    }

    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({ success: false, error: 'Template must contain at least one step.' });
    }

    // Map uploaded files to steps
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const match = file.fieldname.match(/file_(\d+)/);
        if (match) {
          const index = parseInt(match[1], 10);
          if (steps[index]) {
            steps[index].filePath = file.path;
            steps[index].fileName = file.originalname;
            steps[index].mimetype = file.mimetype;
          }
        }
      });
    }

    const created = templateManager.create({
      name: name.trim(),
      description: (description || '').trim(),
      category: (category || 'Custom').trim(),
      steps,
    });

    res.status(201).json({
      success: true,
      message: 'Template saved successfully.',
      template: created,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/templates/:id
 */
app.delete('/api/templates/:id', (req, res) => {
  const deleted = templateManager.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Template not found or could not be deleted.' });
  }
  res.json({ success: true, message: 'Template deleted successfully.' });
});

// -------------------------------------------------------------
// 3. SEQUENCE DISPATCH API
// -------------------------------------------------------------

/**
 * POST /api/send-sequence
 */
app.post('/api/send-sequence', upload.any(), async (req, res) => {
  try {
    let recipient = req.body.recipient;
    let steps = [];

    if (typeof req.body.steps === 'string') {
      try {
        steps = JSON.parse(req.body.steps);
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'Invalid JSON format in "steps" field.',
        });
      }
    } else if (Array.isArray(req.body.steps)) {
      steps = req.body.steps;
    }

    if (!recipient) {
      return res.status(400).json({
        success: false,
        error: 'Recipient phone number is required.',
      });
    }

    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Steps array is required and must contain at least one step.',
      });
    }

    // Map any uploaded files to corresponding file steps
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const match = file.fieldname.match(/file_(\d+)/);
        if (match) {
          const index = parseInt(match[1], 10);
          if (steps[index]) {
            steps[index].filePath = file.path;
            steps[index].filename = file.originalname;
            steps[index].mimetype = file.mimetype;
          }
        } else {
          const targetStep = steps.find((s) => (s.type === 'file' || s.type === 'pdf' || s.type === 'image' || s.type === 'video') && !s.filePath);
          if (targetStep) {
            targetStep.filePath = file.path;
            targetStep.filename = file.originalname;
            targetStep.mimetype = file.mimetype;
          }
        }
      });
    }

    // Ensure WhatsApp client is ready
    const status = whatsappManager.getStatus();
    if (!status.isReady) {
      return res.status(503).json({
        success: false,
        error: `WhatsApp client is not ready (Current status: ${status.status}). Scan QR code to connect first.`,
      });
    }

    const jobId = uuidv4();
    const jobRecord = {
      id: jobId,
      recipient,
      totalSteps: steps.length,
      status: 'running',
      createdAt: new Date().toISOString(),
      logs: [],
      stepResults: [],
      summary: null,
    };

    jobs.set(jobId, jobRecord);

    // Run sequence asynchronously
    executeSequence(recipient, steps, {
      onProgress: (event) => {
        if (event.type === 'log') {
          jobRecord.logs.push(event.log);
        }
        broadcastJobEvent(jobId, event);
      },
    })
      .then((summary) => {
        jobRecord.status = summary.success ? 'completed' : 'partial_failure';
        jobRecord.summary = summary;
        jobRecord.completedAt = new Date().toISOString();
        broadcastJobEvent(jobId, { type: 'finished', summary });
      })
      .catch((err) => {
        jobRecord.status = 'failed';
        jobRecord.error = err.message;
        jobRecord.completedAt = new Date().toISOString();
        broadcastJobEvent(jobId, { type: 'failed', error: err.message });
      });

    res.status(202).json({
      success: true,
      message: 'Sequence execution started.',
      jobId,
      totalSteps: steps.length,
      recipient,
    });
  } catch (error) {
    console.error('[API /send-sequence Error]:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/jobs
 */
app.get('/api/jobs', (req, res) => {
  const jobList = Array.from(jobs.values())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 20);
  res.json({ success: true, jobs: jobList });
});

/**
 * GET /api/jobs/:id
 */
app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, error: 'Job not found.' });
  }
  res.json({ success: true, job });
});

/**
 * GET /api/jobs/:id/events
 */
app.get('/api/jobs/:id/events', (req, res) => {
  const jobId = req.params.id;
  const job = jobs.get(jobId);

  if (!job) {
    return res.status(404).json({ success: false, error: 'Job not found.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  if (!jobSubscribers.has(jobId)) {
    jobSubscribers.set(jobId, new Set());
  }
  jobSubscribers.get(jobId).add(res);

  res.write(`data: ${JSON.stringify({ type: 'init', job })}\n\n`);

  req.on('close', () => {
    const subs = jobSubscribers.get(jobId);
    if (subs) {
      subs.delete(res);
      if (subs.size === 0) jobSubscribers.delete(jobId);
    }
  });
});

// Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server & Initialize WhatsApp Client
app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🚀 WhatsApp Sequence Sender running on http://localhost:${PORT}`);
  console.log(`======================================================\n`);

  try {
    await whatsappManager.initClient();
  } catch (err) {
    console.error('Failed to initialize WhatsApp client on server start:', err.message);
  }
});
