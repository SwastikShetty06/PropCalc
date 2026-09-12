const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.resolve(process.cwd(), './data');
const TEMPLATES_FILE = path.join(DATA_DIR, 'templates.json');
const TEMPLATES_UPLOAD_DIR = path.resolve(process.cwd(), './uploads/templates');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(TEMPLATES_UPLOAD_DIR)) {
  fs.mkdirSync(TEMPLATES_UPLOAD_DIR, { recursive: true });
}

// Default initial templates (including Ethnic Wear Catalog, Invoices, Welcome)
const DEFAULT_TEMPLATES = [
  {
    id: 'ethnic-collection',
    name: 'Ethnic Wear Catalog & Price List',
    description: 'Promote new ethnic wear collections with greetings, PDF catalog, and ordering steps.',
    category: 'Ethnic Fashion',
    createdAt: new Date().toISOString(),
    steps: [
      {
        type: 'text',
        content: '✨ Namaste & Welcome to Our Ethnic Wear Collection! ✨\n\nWe are delighted to share our exclusive handcrafted ethnic wear & festive designs with you.',
        delayMs: 2500,
        caption: '',
      },
      {
        type: 'pdf',
        content: '',
        caption: '📖 Exclusive Festive & Ethnic Wear Catalog 2026',
        delayMs: 3000,
        fileName: 'Ethnic_Wear_Catalog_2026.pdf',
        filePath: './uploads/templates/sample_ethnic_catalog.pdf',
      },
      {
        type: 'image',
        content: '',
        caption: '🌟 Top Trending Festive Look of the Month',
        delayMs: 2000,
        fileName: 'trending_ethnic_look.jpg',
        filePath: '',
      },
      {
        type: 'text',
        content: 'To place an order or customize your outfit, simply reply with the Item Code from the catalog. Free shipping across India! 🚚📦',
        delayMs: 0,
        caption: '',
      },
    ],
  },
  {
    id: 'welcome-brochure',
    name: 'Welcome & Corporate Brochure',
    description: 'Send a warm greeting and company overview PDF to new inquiries.',
    category: 'General',
    createdAt: new Date().toISOString(),
    steps: [
      {
        type: 'text',
        content: 'Hello! Thank you for getting in touch with us.\n\nPlease find our company brochure attached below for your review.',
        delayMs: 2500,
        caption: '',
      },
      {
        type: 'pdf',
        content: '',
        caption: 'Company Overview & Services Brochure',
        delayMs: 2000,
        fileName: 'Company_Brochure.pdf',
        filePath: '',
      },
      {
        type: 'text',
        content: 'Feel free to reply if you have any questions or would like to schedule a call!',
        delayMs: 0,
        caption: '',
      },
    ],
  },
  {
    id: 'invoice-receipt',
    name: 'Invoice & Payment Receipt',
    description: 'Deliver billing statements and payment acknowledgment documents.',
    category: 'Billing',
    createdAt: new Date().toISOString(),
    steps: [
      {
        type: 'text',
        content: 'Hi there! Your requested monthly billing statement and invoice are ready.',
        delayMs: 2000,
        caption: '',
      },
      {
        type: 'pdf',
        content: '',
        caption: 'Official Tax Invoice',
        delayMs: 3000,
        fileName: 'Tax_Invoice.pdf',
        filePath: '',
      },
      {
        type: 'text',
        content: 'Thank you for your business! Please reach out if you have any billing inquiries.',
        delayMs: 0,
        caption: '',
      },
    ],
  },
];

class TemplateManager {
  constructor() {
    this._initStorage();
  }

  _initStorage() {
    if (!fs.existsSync(TEMPLATES_FILE)) {
      this._saveTemplates(DEFAULT_TEMPLATES);
    }
  }

  _getTemplates() {
    try {
      if (!fs.existsSync(TEMPLATES_FILE)) {
        return DEFAULT_TEMPLATES;
      }
      const data = fs.readFileSync(TEMPLATES_FILE, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('[TemplateManager] Error reading templates:', err.message);
      return DEFAULT_TEMPLATES;
    }
  }

  _saveTemplates(templates) {
    try {
      fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(templates, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error('[TemplateManager] Error saving templates:', err.message);
      return false;
    }
  }

  getAll() {
    return this._getTemplates();
  }

  getById(id) {
    const templates = this._getTemplates();
    return templates.find((t) => t.id === id) || null;
  }

  create(templateData) {
    const templates = this._getTemplates();
    const id = templateData.id || `tpl-${Date.now()}-${uuidv4().substring(0, 8)}`;
    
    const newTemplate = {
      id,
      name: templateData.name || 'Untitled Template',
      description: templateData.description || '',
      category: templateData.category || 'Custom',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps: templateData.steps || [],
    };

    templates.unshift(newTemplate);
    this._saveTemplates(templates);
    return newTemplate;
  }

  update(id, updateData) {
    const templates = this._getTemplates();
    const index = templates.findIndex((t) => t.id === id);
    if (index === -1) return null;

    templates[index] = {
      ...templates[index],
      ...updateData,
      id, // Preserve ID
      updatedAt: new Date().toISOString(),
    };

    this._saveTemplates(templates);
    return templates[index];
  }

  delete(id) {
    let templates = this._getTemplates();
    const beforeCount = templates.length;
    templates = templates.filter((t) => t.id !== id);
    if (templates.length === beforeCount) return false;

    this._saveTemplates(templates);
    return true;
  }
}

const templateManager = new TemplateManager();

module.exports = {
  templateManager,
  TEMPLATES_UPLOAD_DIR,
};
