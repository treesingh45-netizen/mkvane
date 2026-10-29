export interface BookingFormData {
  // Step 1: Collection Location
  collectionAddress: string;
  collectionPostcode: string;
  collectionPropertyType: string;
  collectionAccessInstructions: string;

  // Step 2: Delivery Location
  destinationAddress: string;
  destinationPostcode: string;
  destinationPropertyType: string;
  destinationAccessInstructions: string;
  hasAdditionalStops: boolean;
  additionalStopsDetails: string;

  // Step 3: Moving Details
  serviceType: string;
  numberOfItems: string;
  itemDescription: string;
  approximateDimensions: string;
  propertySize: string;
  floorsOrStairs: string;
  liftAvailability: string;
  largeOrHeavyItems: string;
  fragileItems: string;
  additionalRequirements: string;
  photoAttachments: Array<{
    name: string;
    type: string;
    size: number;
    dataUrl: string;
  }>;

  // Step 4: Date and Time
  preferredDate: string;
  alternativeDate: string;
  preferredTimeRange: string;
  flexibilityNotes: string;

  // Step 5: Contact Information
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  additionalContactInstructions: string;

  // Step 6: Review Confirmation
  accuracyConfirmed: boolean;
}

export interface ContactFormPayload {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  enquiryType: string;
  collectionPostcode?: string;
  destinationPostcode?: string;
  message: string;
  privacyAccepted: boolean;
}

export interface ReviewSubmissionPayload {
  authorName: string;
  locationOrRoute: string;
  serviceType: string;
  rating: number;
  title: string;
  comment: string;
}

export type ValidationErrors = Record<string, string>;

const UK_PHONE_REGEX = /^[+0-9()\s-]{9,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UK_POSTCODE_LOOSE_REGEX = /^[A-Za-z0-9\s]{3,10}$/;

export function createInitialBookingFormData(
  prefill?: Partial<BookingFormData>
): BookingFormData {
  return {
    collectionAddress: '',
    collectionPostcode: '',
    collectionPropertyType: 'House',
    collectionAccessInstructions: '',

    destinationAddress: '',
    destinationPostcode: '',
    destinationPropertyType: 'House',
    destinationAccessInstructions: '',
    hasAdditionalStops: false,
    additionalStopsDetails: '',

    serviceType: 'House Removals',
    numberOfItems: '',
    itemDescription: '',
    approximateDimensions: '',
    propertySize: '',
    floorsOrStairs: 'Ground floor only',
    liftAvailability: 'Not applicable',
    largeOrHeavyItems: '',
    fragileItems: '',
    additionalRequirements: '',
    photoAttachments: [],

    preferredDate: '',
    alternativeDate: '',
    preferredTimeRange: 'Flexible / To be discussed',
    flexibilityNotes: '',

    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    additionalContactInstructions: '',

    accuracyConfirmed: false,
    ...prefill,
  };
}

export function validateBookingStep(
  step: number,
  data: BookingFormData
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (step === 1) {
    if (!data.collectionAddress.trim()) {
      errors.collectionAddress = 'Please enter the collection street address or area.';
    }
    if (!data.collectionPostcode.trim()) {
      errors.collectionPostcode = 'Please enter the collection postcode.';
    } else if (!UK_POSTCODE_LOOSE_REGEX.test(data.collectionPostcode.trim())) {
      errors.collectionPostcode = 'Please enter a valid UK postcode (for example, IP3 0QP).';
    }
    if (!data.collectionPropertyType.trim()) {
      errors.collectionPropertyType = 'Please select the collection property or location type.';
    }
  }

  if (step === 2) {
    if (!data.destinationAddress.trim()) {
      errors.destinationAddress = 'Please enter the destination street address or area.';
    }
    if (!data.destinationPostcode.trim()) {
      errors.destinationPostcode = 'Please enter the destination postcode.';
    } else if (!UK_POSTCODE_LOOSE_REGEX.test(data.destinationPostcode.trim())) {
      errors.destinationPostcode = 'Please enter a valid UK postcode.';
    }
    if (!data.destinationPropertyType.trim()) {
      errors.destinationPropertyType = 'Please select the destination property or location type.';
    }
    if (data.hasAdditionalStops && !data.additionalStopsDetails.trim()) {
      errors.additionalStopsDetails =
        'Please describe the additional collection or delivery stop(s) so MK Vane can review the full route.';
    }
  }

  if (step === 3) {
    if (!data.serviceType.trim()) {
      errors.serviceType = 'Please select the type of moving or transport service.';
    }
    if (!data.itemDescription.trim() || data.itemDescription.trim().length < 5) {
      errors.itemDescription =
        'Please describe the items or belongings that need moving (at least a brief summary).';
    }
  }

  if (step === 4) {
    if (!data.preferredDate.trim()) {
      errors.preferredDate = 'Please select your preferred moving date.';
    }
    if (!data.preferredTimeRange.trim()) {
      errors.preferredTimeRange = 'Please select a preferred time window.';
    }
  }

  if (step === 5) {
    if (!data.fullName.trim() || data.fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name.';
    }
    if (!data.phoneNumber.trim()) {
      errors.phoneNumber = 'Please enter a telephone number so MK Vane can contact you.';
    } else if (!UK_PHONE_REGEX.test(data.phoneNumber.trim())) {
      errors.phoneNumber = 'Please enter a valid telephone number (digits, spaces, or +44).';
    }
    if (data.emailAddress.trim() && !EMAIL_REGEX.test(data.emailAddress.trim())) {
      errors.emailAddress = 'Please enter a valid email address or leave this field blank.';
    }
  }

  if (step === 6) {
    for (let s = 1; s <= 5; s++) {
      const stepErrors = validateBookingStep(s, data);
      Object.assign(errors, stepErrors);
    }
    if (!data.accuracyConfirmed) {
      errors.accuracyConfirmed =
        'Please confirm that the journey and contact details above are accurate before submitting.';
    }
  }

  return errors;
}

export function validateContactForm(payload: ContactFormPayload): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!payload.fullName || payload.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  if (!payload.phoneNumber || !payload.phoneNumber.trim()) {
    errors.phoneNumber = 'Please enter your telephone number.';
  } else if (!UK_PHONE_REGEX.test(payload.phoneNumber.trim())) {
    errors.phoneNumber = 'Please enter a valid UK or international telephone number.';
  }

  if (!payload.emailAddress || !payload.emailAddress.trim()) {
    errors.emailAddress = 'Please enter your email address.';
  } else if (!EMAIL_REGEX.test(payload.emailAddress.trim())) {
    errors.emailAddress = 'Please enter a valid email address.';
  }

  if (!payload.enquiryType || !payload.enquiryType.trim()) {
    errors.enquiryType = 'Please select an enquiry type.';
  }

  if (!payload.message || payload.message.trim().length < 10) {
    errors.message = 'Please enter your message or question (at least 10 characters).';
  }

  if (!payload.privacyAccepted) {
    errors.privacyAccepted =
      'Please confirm that you understand how MK Vane will use your details to respond to this enquiry.';
  }

  return errors;
}

export function validateReviewSubmission(
  payload: ReviewSubmissionPayload
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!payload.authorName || payload.authorName.trim().length < 2) {
    errors.authorName = 'Please enter your full name.';
  }

  if (!payload.locationOrRoute || payload.locationOrRoute.trim().length < 3) {
    errors.locationOrRoute =
      'Please enter your area or route (for example, Ipswich IP3 to IP4).';
  }

  if (!payload.serviceType || !payload.serviceType.trim()) {
    errors.serviceType = 'Please select the service category.';
  }

  const numericRating = Number(payload.rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    errors.rating = 'Please select a rating between 1 and 5.';
  }

  if (!payload.title || payload.title.trim().length < 4) {
    errors.title = 'Please enter a short headline for your review.';
  }

  if (!payload.comment || payload.comment.trim().length < 20) {
    errors.comment =
      'Please share at least 20 characters describing your moving experience.';
  }

  return errors;
}

