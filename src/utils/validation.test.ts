import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { INITIAL_SERVICES, BUSINESS_INFO } from '../data/siteContent';
import {
  createInitialBookingFormData,
  validateBookingStep,
  validateContactForm,
  validateReviewSubmission,
} from './validation';

test('Step 1 validation rejects empty collection address and postcode', () => {
  const form = createInitialBookingFormData();
  const errors = validateBookingStep(1, form);
  assert.ok(errors.collectionAddress);
  assert.ok(errors.collectionPostcode);
});

test('Step 1 validation passes with valid UK collection address and postcode', () => {
  const form = createInitialBookingFormData({
    collectionAddress: '3 Mersey Road, Ipswich',
    collectionPostcode: 'IP3 0QP',
    collectionPropertyType: 'House',
  });
  const errors = validateBookingStep(1, form);
  assert.deepEqual(errors, {});
});

test('Step 2 validation requires additional stop details when hasAdditionalStops is enabled', () => {
  const form = createInitialBookingFormData({
    destinationAddress: '14 Waterfront Street, Ipswich',
    destinationPostcode: 'IP4 1AS',
    destinationPropertyType: 'Flat or Apartment',
    hasAdditionalStops: true,
    additionalStopsDetails: '',
  });
  const errors = validateBookingStep(2, form);
  assert.ok(errors.additionalStopsDetails);

  form.additionalStopsDetails = 'Collect dining chairs from IP1 2BG en route';
  assert.deepEqual(validateBookingStep(2, form), {});
});

test('Step 5 & Step 6 full booking validation enforces phone format, optional email format, and accuracy confirmation', () => {
  const form = createInitialBookingFormData({
    collectionAddress: '3 Mersey Road, Ipswich',
    collectionPostcode: 'IP3 0QP',
    destinationAddress: '22 High Street, Colchester',
    destinationPostcode: 'CO1 1DB',
    serviceType: 'House Removals',
    itemDescription: 'Two-seater sofa, dining table, 4 chairs, and 12 medium boxes',
    preferredDate: '2026-11-15',
    preferredTimeRange: 'Morning (08:00 – 12:00)',
    fullName: 'Eleanor Vance',
    phoneNumber: '+44 7708 632170',
    emailAddress: 'invalid-email',
    accuracyConfirmed: false,
  });

  const step5Errors = validateBookingStep(5, form);
  assert.ok(step5Errors.emailAddress);

  form.emailAddress = 'eleanor.vance@example.co.uk';
  assert.deepEqual(validateBookingStep(5, form), {});

  const step6Unconfirmed = validateBookingStep(6, form);
  assert.ok(step6Unconfirmed.accuracyConfirmed);

  form.accuracyConfirmed = true;
  assert.deepEqual(validateBookingStep(6, form), {});
});

test('Contact form validation checks required fields, email, phone, and privacy consent', () => {
  const invalidErrors = validateContactForm({
    fullName: 'A',
    phoneNumber: '123',
    emailAddress: 'notanemail',
    enquiryType: '',
    message: 'Too short',
    privacyAccepted: false,
  });

  assert.ok(invalidErrors.fullName);
  assert.ok(invalidErrors.phoneNumber);
  assert.ok(invalidErrors.emailAddress);
  assert.ok(invalidErrors.enquiryType);
  assert.ok(invalidErrors.message);
  assert.ok(invalidErrors.privacyAccepted);

  const validErrors = validateContactForm({
    fullName: 'James Whitman',
    phoneNumber: '07708 632170',
    emailAddress: 'james@example.co.uk',
    enquiryType: 'General Moving Question',
    collectionPostcode: 'IP3 0QP',
    destinationPostcode: 'IP1 3QH',
    message: 'Hello MK Vane, could we discuss a flat move within Ipswich next month?',
    privacyAccepted: true,
  });

  assert.deepEqual(validErrors, {});
});

test('Review submission validation enforces author, route, rating bounds, title, and detailed comment', () => {
  const invalid = validateReviewSubmission({
    authorName: 'J',
    locationOrRoute: 'IP',
    serviceType: '',
    rating: 6,
    title: 'Ok',
    comment: 'Too brief',
  });

  assert.ok(invalid.authorName);
  assert.ok(invalid.locationOrRoute);
  assert.ok(invalid.serviceType);
  assert.ok(invalid.rating);
  assert.ok(invalid.title);
  assert.ok(invalid.comment);

  const valid = validateReviewSubmission({
    authorName: 'Claire Pemberton',
    locationOrRoute: 'Ipswich IP3 to Kesgrave IP5',
    serviceType: 'House Removals',
    rating: 5,
    title: 'Clear communication and careful handling throughout',
    comment:
      'Every detail from parking access to stair clearance was checked before moving day, making the entire household move calm and well organised.',
  });

  assert.deepEqual(valid, {});
});

test('INITIAL_SERVICES uses six distinct local photographs that exist on disk and non-duplicated descriptions', () => {
  assert.equal(INITIAL_SERVICES.length, 6);
  assert.equal(BUSINESS_INFO.email, 'mkvane@gmail.com');

  const seenImages = new Set<string>();
  for (const service of INITIAL_SERVICES) {
    assert.ok(!seenImages.has(service.image), `Duplicate service image: ${service.image}`);
    seenImages.add(service.image);
    assert.notEqual(service.shortDescription.trim(), service.fullDescription.trim());

    const diskPath = path.join(process.cwd(), 'public', service.image);
    assert.ok(fs.existsSync(diskPath), `Missing image file on disk: ${diskPath}`);
  }
});

