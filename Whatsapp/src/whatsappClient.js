const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

// Connection statuses
const ClientStatus = {
  INITIALIZING: 'INITIALIZING',
  QR_READY: 'QR_READY',
  AUTHENTICATED: 'AUTHENTICATED',
  LOADING_CHATS: 'LOADING_CHATS',
  READY: 'READY',
  AUTH_FAILURE: 'AUTH_FAILURE',
  DISCONNECTED: 'DISCONNECTED',
};

class WhatsAppClientManager {
  constructor() {
    this.client = null;
    this.status = ClientStatus.INITIALIZING;
    this.rawQR = null;
    this.qrDataUrl = null;
    this.lastQrTimestamp = null;
    this.clientInfo = null;
    this.loadingProgress = null;
    this.isInitializing = false;
    this.dataPath = process.env.AUTH_DATA_PATH || './.wwebjs_auth';
  }

  /**
   * Cleans stale Chromium singleton locks if any process exited abruptly.
   */
  _cleanLocks() {
    try {
      const lockFiles = [
        path.join(this.dataPath, 'session', 'SingletonLock'),
        path.join(this.dataPath, 'session', 'SingletonCookie'),
        path.join(this.dataPath, 'session', 'SingletonSocket'),
      ];
      for (const f of lockFiles) {
        if (fs.existsSync(f)) {
          fs.unlinkSync(f);
          console.log('[WhatsApp Manager] Removed stale lock file:', f);
        }
      }
    } catch (e) {
      console.warn('[WhatsApp Manager] Lock cleanup warning:', e.message);
    }
  }

  /**
   * Initializes the WhatsApp Web client with LocalAuth, realistic User-Agent, and headless Puppeteer.
   */
  async initClient() {
    if (this.isInitializing) {
      console.log('[WhatsApp Manager] Client initialization already in progress...');
      return this.client;
    }

    this.isInitializing = true;
    this.status = ClientStatus.INITIALIZING;
    this.rawQR = null;
    this.qrDataUrl = null;
    this.clientInfo = null;
    this.loadingProgress = null;

    console.log('[WhatsApp Manager] Initializing WhatsApp Web Client...');

    try {
      if (!fs.existsSync(this.dataPath)) {
        fs.mkdirSync(this.dataPath, { recursive: true });
      }

      // Clean any stale Chromium singleton locks
      this._cleanLocks();

      this.client = new Client({
        authStrategy: new LocalAuth({
          dataPath: this.dataPath,
        }),
        puppeteer: {
          headless: true,
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
          ],
        },
      });

      this._registerEvents();
      await this.client.initialize();
      this.isInitializing = false;
      return this.client;
    } catch (error) {
      console.error('[WhatsApp Manager] Initialization Error:', error.message);
      this.status = ClientStatus.DISCONNECTED;
      this.isInitializing = false;
      throw error;
    }
  }

  /**
   * Registers lifecycle event listeners on the WhatsApp client.
   */
  _registerEvents() {
    if (!this.client) return;

    // QR Code generation
    this.client.on('qr', async (qr) => {
      this.status = ClientStatus.QR_READY;
      this.rawQR = qr;
      this.lastQrTimestamp = new Date().toISOString();

      console.log('\n========================================');
      console.log('[WhatsApp Manager] Scan this QR Code with WhatsApp:');
      qrcodeTerminal.generate(qr, { small: true });
      console.log('========================================\n');

      try {
        this.qrDataUrl = await QRCode.toDataURL(qr, {
          errorCorrectionLevel: 'M',
          margin: 2,
          width: 360,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        });
      } catch (err) {
        console.error('[WhatsApp Manager] Failed to generate QR data URL:', err.message);
      }
    });

    // Authenticated
    this.client.on('authenticated', () => {
      this.status = ClientStatus.AUTHENTICATED;
      this.rawQR = null;
      this.qrDataUrl = null;
      console.log('🎉 [WhatsApp Manager] Client authenticated successfully!');
    });

    // Loading Screen (Syncing chats & media)
    this.client.on('loading_screen', (percent, message) => {
      this.status = ClientStatus.LOADING_CHATS;
      this.loadingProgress = { percent, message };
      console.log(`[WhatsApp Manager] WhatsApp Web Loading: ${percent}% - ${message}`);
    });

    // Authentication failure
    this.client.on('auth_failure', (msg) => {
      this.status = ClientStatus.AUTH_FAILURE;
      this.rawQR = null;
      this.qrDataUrl = null;
      console.error('❌ [WhatsApp Manager] Authentication failure:', msg);
    });

    // Ready
    this.client.on('ready', () => {
      this.status = ClientStatus.READY;
      this.rawQR = null;
      this.qrDataUrl = null;
      this.loadingProgress = null;
      this.clientInfo = this.client.info ? {
        wid: this.client.info.wid?._serialized,
        pushname: this.client.info.pushname,
        platform: this.client.info.platform,
        phone: this.client.info.wid?.user,
      } : null;

      console.log('\n🚀 [WhatsApp Manager] WhatsApp Client is READY and CONNECTED!');
      if (this.clientInfo) {
        console.log(`📱 Connected Account: ${this.clientInfo.pushname || 'User'} (+${this.clientInfo.phone})`);
      }
    });

    // State changed
    this.client.on('change_state', (state) => {
      console.log(`[WhatsApp Manager] State changed to: ${state}`);
    });

    // Disconnected
    this.client.on('disconnected', (reason) => {
      this.status = ClientStatus.DISCONNECTED;
      this.rawQR = null;
      this.qrDataUrl = null;
      this.clientInfo = null;
      this.loadingProgress = null;
      console.warn('[WhatsApp Manager] Client was disconnected. Reason:', reason);
    });
  }

  /**
   * Get current client status and state details.
   */
  getStatus() {
    return {
      status: this.status,
      isReady: this.status === ClientStatus.READY,
      hasQR: !!this.qrDataUrl,
      lastQrTimestamp: this.lastQrTimestamp,
      loadingProgress: this.loadingProgress,
      info: this.clientInfo || (this.client?.info ? {
        wid: this.client.info.wid?._serialized,
        pushname: this.client.info.pushname,
        platform: this.client.info.platform,
        phone: this.client.info.wid?.user,
      } : null),
    };
  }

  /**
   * Get latest QR code info.
   */
  getQR() {
    return {
      status: this.status,
      rawQR: this.rawQR,
      qrDataUrl: this.qrDataUrl,
      lastQrTimestamp: this.lastQrTimestamp,
    };
  }

  /**
   * Get underlying whatsapp-web.js Client instance.
   */
  getClient() {
    return this.client;
  }

  /**
   * Checks if a phone number is registered on WhatsApp.
   */
  async validateNumber(rawNumber) {
    if (!this.client || this.status !== ClientStatus.READY) {
      throw new Error('WhatsApp client is not ready. Please scan QR and wait for connection.');
    }

    const cleaned = String(rawNumber).replace(/\D/g, '');
    if (!cleaned || cleaned.length < 6) {
      return {
        isValid: false,
        cleanedNumber: cleaned,
        recipientId: null,
        error: 'Phone number must contain at least 6 digits including country code.',
      };
    }

    const recipientId = `${cleaned}@c.us`;

    try {
      const isRegistered = await this.client.isRegisteredUser(recipientId);
      
      if (!isRegistered) {
        const numberId = await this.client.getNumberId(cleaned);
        if (numberId) {
          return {
            isValid: true,
            cleanedNumber: cleaned,
            recipientId: numberId._serialized,
            isRegistered: true,
          };
        }
        return {
          isValid: false,
          cleanedNumber: cleaned,
          recipientId,
          isRegistered: false,
          error: `Phone number +${cleaned} is not registered on WhatsApp.`,
        };
      }

      return {
        isValid: true,
        cleanedNumber: cleaned,
        recipientId,
        isRegistered: true,
      };
    } catch (err) {
      console.warn(`[WhatsApp Manager] Validation check warning for ${cleaned}:`, err.message);
      return {
        isValid: true,
        cleanedNumber: cleaned,
        recipientId,
        isRegistered: 'unknown',
        warning: err.message,
      };
    }
  }

  /**
   * Gracefully restart or reinitialize client.
   */
  async restartClient() {
    console.log('[WhatsApp Manager] Restarting WhatsApp client...');
    try {
      if (this.client) {
        await this.client.destroy();
      }
    } catch (e) {
      console.warn('[WhatsApp Manager] Error during client destruction:', e.message);
    }
    this.client = null;
    this.status = ClientStatus.INITIALIZING;
    return this.initClient();
  }

  /**
   * Clears saved session data and starts a completely fresh QR code session.
   */
  async clearSession() {
    console.log('[WhatsApp Manager] Clearing saved session and resetting...');
    try {
      if (this.client) {
        await this.client.destroy();
      }
    } catch (e) {
      console.warn('[WhatsApp Manager] Error closing client during session clear:', e.message);
    }
    this.client = null;

    // Delete session files
    try {
      if (fs.existsSync(this.dataPath)) {
        fs.rmSync(this.dataPath, { recursive: true, force: true });
        console.log('[WhatsApp Manager] Deleted session directory:', this.dataPath);
      }
    } catch (err) {
      console.warn('[WhatsApp Manager] Could not delete session directory:', err.message);
    }

    this.status = ClientStatus.INITIALIZING;
    return this.initClient();
  }

  /**
   * Graceful shutdown cleanup.
   */
  async destroy() {
    console.log('[WhatsApp Manager] Destroying WhatsApp client...');
    if (this.client) {
      try {
        await this.client.destroy();
      } catch (err) {
        console.warn('[WhatsApp Manager] Error closing client:', err.message);
      }
    }
    this.status = ClientStatus.DISCONNECTED;
  }
}

// Singleton instance
const whatsappManager = new WhatsAppClientManager();

// Process cleanup handlers
process.on('SIGINT', async () => {
  console.log('\n[WhatsApp Manager] Received SIGINT. Shutting down gracefully...');
  await whatsappManager.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n[WhatsApp Manager] Received SIGTERM. Shutting down gracefully...');
  await whatsappManager.destroy();
  process.exit(0);
});

module.exports = {
  whatsappManager,
  ClientStatus,
  MessageMedia,
};
