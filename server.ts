import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  validateBookingStep,
  validateContactForm,
  validateReviewSubmission,
  type BookingFormData,
  type ContactFormPayload,
  type ReviewSubmissionPayload,
} from './src/utils/validation.ts';
import {
  INITIAL_REVIEWS,
  type CustomerReview,
} from './src/data/siteContent.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'booking_enquiries.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contact_enquiries.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'customer_reviews.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function appendJsonRecord(filePath: string, record: unknown) {
  ensureDataDir();
  let existing: unknown[] = [];
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        existing = parsed;
      }
    } catch {
      existing = [];
    }
  }
  existing.push(record);
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
}

function readStoredReviews(): CustomerReview[] {
  if (!fs.existsSync(REVIEWS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(REVIEWS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CustomerReview[]) : [];
  } catch {
    return [];
  }
}

function generateReference(prefix: string): string {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${datePart}-${randomPart}`;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Support optional base64 photo attachments up to 8 MB securely
  app.use(express.json({ limit: '8mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'MK Vane Enquiries Backend' });
  });

  app.post('/api/book-move', (req, res) => {
    try {
      const body = req.body as BookingFormData;
      if (!body || typeof body !== 'object') {
        res.status(400).json({
          ok: false,
          message: 'Invalid request payload received.',
        });
        return;
      }

      // Enforce safe attachment limits
      if (Array.isArray(body.photoAttachments)) {
        if (body.photoAttachments.length > 4) {
          res.status(400).json({
            ok: false,
            message: 'A maximum of 4 photographs can be attached to an enquiry.',
          });
          return;
        }
        for (const photo of body.photoAttachments) {
          if (
            !photo.type ||
            !['image/jpeg', 'image/png', 'image/webp'].includes(photo.type)
          ) {
            res.status(400).json({
              ok: false,
              message: 'Only JPEG, PNG, or WebP image files are supported.',
            });
            return;
          }
        }
      }

      const validationErrors = validateBookingStep(6, body);
      if (Object.keys(validationErrors).length > 0) {
        res.status(400).json({
          ok: false,
          message: 'Please review the highlighted fields before submitting your move enquiry.',
          errors: validationErrors,
        });
        return;
      }

      const reference = generateReference('MKV');
      const storedRecord = {
        reference,
        receivedAt: new Date().toISOString(),
        intendedRecipientEmail: 'mkvane@gmail.com',
        status: 'pending_business_review',
        collection: {
          address: body.collectionAddress.trim(),
          postcode: body.collectionPostcode.trim().toUpperCase(),
          propertyType: body.collectionPropertyType,
          accessInstructions: body.collectionAccessInstructions?.trim() || '',
        },
        destination: {
          address: body.destinationAddress.trim(),
          postcode: body.destinationPostcode.trim().toUpperCase(),
          propertyType: body.destinationPropertyType,
          accessInstructions: body.destinationAccessInstructions?.trim() || '',
          hasAdditionalStops: Boolean(body.hasAdditionalStops),
          additionalStopsDetails: body.additionalStopsDetails?.trim() || '',
        },
        moveDetails: {
          serviceType: body.serviceType,
          numberOfItems: body.numberOfItems?.trim() || '',
          itemDescription: body.itemDescription.trim(),
          approximateDimensions: body.approximateDimensions?.trim() || '',
          propertySize: body.propertySize?.trim() || '',
          floorsOrStairs: body.floorsOrStairs || '',
          liftAvailability: body.liftAvailability || '',
          largeOrHeavyItems: body.largeOrHeavyItems?.trim() || '',
          fragileItems: body.fragileItems?.trim() || '',
          additionalRequirements: body.additionalRequirements?.trim() || '',
          photoAttachmentCount: Array.isArray(body.photoAttachments)
            ? body.photoAttachments.length
            : 0,
          // Keep private attachment metadata securely stored on server disk only
          photoAttachments: Array.isArray(body.photoAttachments)
            ? body.photoAttachments.map((p) => ({
                name: p.name,
                type: p.type,
                size: p.size,
              }))
            : [],
        },
        schedulePreference: {
          preferredDate: body.preferredDate,
          alternativeDate: body.alternativeDate || '',
          preferredTimeRange: body.preferredTimeRange,
          flexibilityNotes: body.flexibilityNotes?.trim() || '',
        },
        contact: {
          fullName: body.fullName.trim(),
          phoneNumber: body.phoneNumber.trim(),
          emailAddress: body.emailAddress?.trim() || '',
          additionalContactInstructions: body.additionalContactInstructions?.trim() || '',
        },
      };

      appendJsonRecord(BOOKINGS_FILE, storedRecord);

      res.status(201).json({
        ok: true,
        reference,
        receivedAt: storedRecord.receivedAt,
        message:
          'Thank you for contacting MK Vane. Your enquiry has been submitted successfully. The details you provided will be reviewed, and the business can contact you using your supplied contact information.',
      });
    } catch (err) {
      console.error('Error handling /api/book-move:', err);
      res.status(500).json({
        ok: false,
        message:
          'We were unable to record your enquiry right now. Your entered details have been retained on screen—please try again or call MK Vane on +44 7708 632170.',
      });
    }
  });

  app.post('/api/contact', (req, res) => {
    try {
      const body = req.body as ContactFormPayload;
      if (!body || typeof body !== 'object') {
        res.status(400).json({
          ok: false,
          message: 'Invalid contact form submission.',
        });
        return;
      }

      const validationErrors = validateContactForm(body);
      if (Object.keys(validationErrors).length > 0) {
        res.status(400).json({
          ok: false,
          message: 'Please complete all required fields accurately.',
          errors: validationErrors,
        });
        return;
      }

      const reference = generateReference('ENQ');
      const storedRecord = {
        reference,
        receivedAt: new Date().toISOString(),
        intendedRecipientEmail: 'mkvane@gmail.com',
        status: 'unread_enquiry',
        fullName: body.fullName.trim(),
        phoneNumber: body.phoneNumber.trim(),
        emailAddress: body.emailAddress.trim(),
        enquiryType: body.enquiryType.trim(),
        collectionPostcode: body.collectionPostcode?.trim().toUpperCase() || '',
        destinationPostcode: body.destinationPostcode?.trim().toUpperCase() || '',
        message: body.message.trim(),
      };

      appendJsonRecord(CONTACTS_FILE, storedRecord);

      res.status(201).json({
        ok: true,
        reference,
        receivedAt: storedRecord.receivedAt,
        message:
          'Thank you for contacting MK Vane. Your enquiry has been submitted successfully. The details you provided will be reviewed, and the business can contact you using your supplied contact information.',
      });
    } catch (err) {
      console.error('Error handling /api/contact:', err);
      res.status(500).json({
        ok: false,
        message:
          'We were unable to submit your message right now. Please retry or contact MK Vane directly on +44 7708 632170.',
      });
    }
  });

  app.get('/api/reviews', (_req, res) => {
    const stored = readStoredReviews();
    const combined = [...stored.slice().reverse(), ...INITIAL_REVIEWS];
    res.json({ ok: true, reviews: combined });
  });

  app.post('/api/reviews', (req, res) => {
    try {
      const body = req.body as ReviewSubmissionPayload;
      if (!body || typeof body !== 'object') {
        res.status(400).json({
          ok: false,
          message: 'Invalid review submission.',
        });
        return;
      }

      const validationErrors = validateReviewSubmission(body);
      if (Object.keys(validationErrors).length > 0) {
        res.status(400).json({
          ok: false,
          message: 'Please complete all required review fields before submitting.',
          errors: validationErrors,
        });
        return;
      }

      const now = new Date();
      const monthYear = now.toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric',
      });

      const createdReview: CustomerReview = {
        id: generateReference('REV'),
        authorName: body.authorName.trim(),
        locationOrRoute: body.locationOrRoute.trim(),
        serviceType: body.serviceType.trim(),
        rating: Number(body.rating),
        title: body.title.trim(),
        comment: body.comment.trim(),
        dateDisplay: monthYear,
      };

      appendJsonRecord(REVIEWS_FILE, createdReview);

      res.status(201).json({
        ok: true,
        review: createdReview,
        message: 'Thank you for sharing your moving experience with MK Vane.',
      });
    } catch (err) {
      console.error('Error handling /api/reviews:', err);
      res.status(500).json({
        ok: false,
        message:
          'We were unable to publish your review right now. Please try again shortly.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MK Vane server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
