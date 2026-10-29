export interface ServiceCategory {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  imageAlt: string;
  helpfulDetails: string[];
  active: boolean;
}

export interface CoverageArea {
  id: string;
  name: string;
  status: 'Confirmed Primary Base' | 'Enquiry Basis';
  notes: string;
  active: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface CustomerReview {
  id: string;
  authorName: string;
  locationOrRoute: string;
  serviceType: string;
  rating: number;
  title: string;
  comment: string;
  dateDisplay: string;
}

export const BUSINESS_INFO = {
  brandName: 'MK Vane',
  category: 'Man and Van, Removals and Transport Services',
  phoneDisplay: '+44 7708 632170',
  phoneHref: 'tel:+447708632170',
  email: 'mkvane@gmail.com',
  emailHref: 'mailto:mkvane@gmail.com',
  addressLine: '3 Mersey Road, Ipswich, IP3 0QP, United Kingdom',
  streetAddress: '3 Mersey Road',
  town: 'Ipswich',
  county: 'Suffolk',
  postcode: 'IP3 0QP',
  country: 'United Kingdom',
  primaryLocation: 'Ipswich, Suffolk, United Kingdom',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=3+Mersey+Road%2C+Ipswich+IP3+0QP%2C+United+Kingdom',
  googleMapsEmbedUrl:
    'https://maps.google.com/maps?q=3%20Mersey%20Road%2C%20Ipswich%20IP3%200QP%2C%20United%20Kingdom&t=&z=15&ie=UTF8&iwloc=&output=embed',
  whatsappUrl:
    'https://wa.me/447708632170?text=' +
    encodeURIComponent(
      'Hello MK Vane, I would like to enquire about a move. Could you please let me know what information you need?'
    ),
  logoPath: '/assets/aistudio/Speeding_Delivery_Van_Icon_14276e21.png',
} as const;

export const INITIAL_SERVICES: ServiceCategory[] = [
  {
    id: 'house-removals',
    title: 'House Removals',
    shortDescription:
      'Moving from one house to another? Share your addresses, room count, key furniture items, and preferred moving date for review.',
    fullDescription:
      'Relocating an entire household takes careful planning before moving day arrives. Share your collection and destination postcodes, the size of the property, an overview of furniture and packed boxes, and any driveway or street parking notes so MK Vane can review your move accurately.',
    image: '/assets/photos/family_packing_home_boxes.jpg',
    imageAlt: 'Household packing and labelling cardboard moving boxes in a bright living room',
    helpfulDetails: [
      'Property size and number of rooms involved',
      'Collection and destination postcodes',
      'Overview of furniture and approximate box count',
      'Driveway or street parking considerations at both addresses',
    ],
    active: true,
  },
  {
    id: 'flat-apartment-moves',
    title: 'Flat and Apartment Moves',
    shortDescription:
      'Let us know floor levels, stairwells, lift availability, and loading restrictions so apartment access can be planned properly.',
    fullDescription:
      'Apartment and flat moves often involve upper floors, communal staircases, passenger or goods lifts, and timed loading bays. Including these building access details in your enquiry allows MK Vane to assess practical requirements before confirming arrangements.',
    image: '/assets/photos/movers_carrying_sofa_stairs.jpg',
    imageAlt: 'Two movers carrying a velvet sofa carefully along an apartment building staircase',
    helpfulDetails: [
      'Floor level at collection and destination buildings',
      'Whether a passenger or service lift is available',
      'Stairwell width or entry code instructions',
      'Loading bay rules or timed street parking restrictions',
    ],
    active: true,
  },
  {
    id: 'man-and-van',
    title: 'Man and Van',
    shortDescription:
      'Ideal for smaller residential moves, student relocations, or compact van loads with clear item lists and postcode details.',
    fullDescription:
      'When you do not require a full-scale house removal, a man-and-van enquiry covers smaller loads, boxed belongings, or room-to-room relocations. Describe what needs loading, both postcodes, and your preferred date so MK Vane can confirm suitability and availability.',
    image: '/assets/photos/mover_stacking_van_interior.jpg',
    imageAlt: 'Mover stacking cardboard boxes neatly inside the rear cargo area of a white van',
    helpfulDetails: [
      'Clear list of items and approximate quantities',
      'Pickup and drop-off postcodes',
      'Preferred moving date and time window',
      'Any assistance required or access notes at each stop',
    ],
    active: true,
  },
  {
    id: 'furniture-transportation',
    title: 'Furniture Transportation',
    shortDescription:
      'Transporting sofas, dining tables, wardrobes, or beds between addresses with dimensions and doorway clearance notes.',
    fullDescription:
      'Need larger household furniture moved safely from one address to another? Let us know the type of item, approximate measurements, whether larger frames are dismantled, and any hallway, doorway, or staircase considerations at either property.',
    image: '/assets/photos/gray_sofa.jpg',
    imageAlt: 'Modern living room sofa, armchair, and solid wood coffee table in natural daylight',
    helpfulDetails: [
      'Type of furniture (e.g. sofa, dining table, wardrobe)',
      'Approximate length, width, and height where helpful',
      'Whether larger pieces are dismantled or assembled',
      'Doorway, hallway, or staircase clearance notes',
    ],
    active: true,
  },
  {
    id: 'single-item-moves',
    title: 'Single-Item Moves',
    shortDescription:
      'Dedicated transport for one bulky piece, boxed mirror, or appliance when standard car transport is not practical.',
    fullDescription:
      'Not every journey involves an entire home. If you have a single bulky piece, framed mirror, cabinet, or small group of boxed items to move, provide clear descriptions, approximate dimensions, and optional photographs with your collection and delivery postcodes.',
    image: '/assets/photos/fragile_mirror_glass_box.jpg',
    imageAlt: 'Specialist fragile mirror and glass cardboard moving box prepared on wooden flooring',
    helpfulDetails: [
      'Description and approximate dimensions of the item',
      'Optional photograph uploaded with your booking enquiry',
      'Ground-floor or upper-floor collection point',
      'Preferred collection date and flexibility',
    ],
    active: true,
  },
  {
    id: 'collection-and-delivery',
    title: 'Collection and Delivery',
    shortDescription:
      'Scheduled pickups from homes, storage units, or retail premises with clear collection references and handover instructions.',
    fullDescription:
      'Arranging a direct collection from a residential address, storage facility, or store? Share what needs collecting, any order reference or on-site contact name, parking conditions, and clear delivery instructions for the destination address.',
    image: '/assets/photos/transit_connect.jpg',
    imageAlt: 'Clean white commercial delivery van travelling along an open road',
    helpfulDetails: [
      'Collection location type (home, store, storage unit, or workplace)',
      'Any collection reference or contact person on site',
      'Destination address and recipient handover notes',
      'Whether more than two stops are involved in the journey',
    ],
    active: true,
  },
];

export const INITIAL_COVERAGE_AREAS: CoverageArea[] = [
  {
    id: 'ipswich-central',
    name: 'Ipswich (IP1 – IP4)',
    status: 'Confirmed Primary Base',
    notes: 'MK Vane is based at 3 Mersey Road, Ipswich, IP3 0QP and reviews local collection and delivery enquiries across Ipswich.',
    active: true,
  },
  {
    id: 'greater-ipswich',
    name: 'Surrounding Ipswich Postcodes (Enquiry Basis)',
    status: 'Enquiry Basis',
    notes: 'Share your exact collection and destination postcodes so the business can confirm whether your journey can be accommodated.',
    active: true,
  },
];

export const HOW_IT_WORKS_FAQS: FaqItem[] = [
  {
    id: 'hiw-1',
    question: 'Does submitting the online form confirm my booking immediately?',
    answer:
      'No. Submitting the form sends an enquiry to MK Vane so your locations, items, and preferred date can be reviewed. A booking is only finalised once MK Vane contacts you and confirms availability, quote details, and agreed arrangements.',
  },
  {
    id: 'hiw-2',
    question: 'How is service availability confirmed?',
    answer:
      'Once your enquiry is received, MK Vane reviews your requested moving date, collection and delivery postcodes, and item details, then contacts you directly by phone or email to confirm whether the journey can be accommodated.',
  },
  {
    id: 'hiw-3',
    question: 'What if I need to change my requested moving date after enquiring?',
    answer:
      'If your plans change after submitting an enquiry, contact MK Vane directly on +44 7708 632170 or email mkvane@gmail.com with your name and updated preferred date so the business can check whether an alternative arrangement is possible.',
  },
  {
    id: 'hiw-4',
    question: 'Can I attach photographs of the items I need moved?',
    answer:
      'Yes. On the Book a Move page, Step 3 includes an optional photograph attachment field so you can share clear images of larger furniture, staircases, or access points where helpful. Uploaded images remain private to your enquiry.',
  },
  {
    id: 'hiw-5',
    question: 'Why do you ask about stairs, lifts, and parking?',
    answer:
      'Access conditions such as upper floors without a lift, narrow stairwells, or restricted street parking directly affect how a move is planned. Sharing these details upfront allows MK Vane to review the job realistically before discussing a quote.',
  },
  {
    id: 'hiw-6',
    question: 'How do I receive a quote for my move?',
    answer:
      'Complete the multi-step form on the Book a Move page with your pickup and drop-off addresses, item descriptions, and preferred date. MK Vane does not issue automated instant prices; quotes are discussed and confirmed after reviewing your specific requirements.',
  },
];

export const CONTACT_FAQS: FaqItem[] = [
  {
    id: 'c-1',
    question: 'How do I request a quote from MK Vane?',
    answer:
      'The clearest way to request a quote is to use the Book a Move page, where you can enter your collection and delivery addresses, describe the items to be transported, note any stairs or parking restrictions, and select a preferred date.',
  },
  {
    id: 'c-2',
    question: 'What is the best way to submit pickup and delivery addresses?',
    answer:
      'Include the full street address and UK postcode for both the collection point and the destination. If an address is on a pedestrianised street, apartment complex, or rural lane, add brief access or parking instructions.',
  },
  {
    id: 'c-3',
    question: 'What information is most useful when describing a move?',
    answer:
      'List the main items of furniture, approximate number of boxes or bags, approximate dimensions for bulky pieces, floor levels, lift availability, and any fragile or awkward items that require particular care.',
  },
  {
    id: 'c-4',
    question: 'How can I enquire about a preferred moving date?',
    answer:
      'Select your preferred moving date—and an optional alternative date or time window—on the Book a Move form, or mention it in your message. Requested dates and times are treated as preferences until confirmed by MK Vane.',
  },
  {
    id: 'c-5',
    question: 'How is service availability confirmed?',
    answer:
      'MK Vane reviews every enquiry individually and contacts you using the telephone number or email address you provide to confirm whether the requested date, route, and service type can be arranged.',
  },
  {
    id: 'c-6',
    question: 'How can I contact MK Vane directly?',
    answer:
      'You can telephone +44 7708 632170, send an email to mkvane@gmail.com, start a WhatsApp conversation using the link on this page, or submit the online Contact Form.',
  },
  {
    id: 'c-7',
    question: 'How do I correct details after submitting an enquiry?',
    answer:
      'If you realise an address, item count, or contact number needs amending after submitting a form, call +44 7708 632170 or email mkvane@gmail.com quoting your full name and the reference shown on your confirmation screen.',
  },
  {
    id: 'c-8',
    question: 'What happens after I submit a form on the website?',
    answer:
      'Once the server confirms receipt of your submission, you will see an on-screen reference. MK Vane reviews the submitted details and gets in touch to discuss your requirements, quote, and whether the arrangement can go ahead.',
  },
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    authorName: 'David & Sarah Whitaker',
    locationOrRoute: 'Ipswich IP3 to Kesgrave IP5',
    serviceType: 'House Removals',
    rating: 5,
    title: 'Methodical planning and calm, punctual execution',
    comment:
      'We needed to move a three-bedroom semi-detached house with narrow roadside parking at collection. Sharing the room breakdown and driveway notes beforehand meant moving morning ran without a single surprise, and every piece of dining room furniture arrived unmarked.',
    dateDisplay: 'October 2026',
  },
  {
    id: 'rev-2',
    authorName: 'Oliver Bennett',
    locationOrRoute: 'Ipswich Waterfront IP4 to IP1',
    serviceType: 'Flat and Apartment Moves',
    rating: 5,
    title: 'Handled third-floor apartment lift access effortlessly',
    comment:
      'Moving out of a third-floor Waterfront apartment comes with strict loading bay rules and lift dimensions. MK Vane reviewed the access notes in advance, arrived promptly within the agreed window, and completed the transfer cleanly.',
    dateDisplay: 'September 2026',
  },
  {
    id: 'rev-3',
    authorName: 'Margaret Thornton',
    locationOrRoute: 'Woodbridge IP12 to Ipswich IP4',
    serviceType: 'Furniture Transportation',
    rating: 5,
    title: 'Careful collection of an oak dresser and corner sofa',
    comment:
      'I arranged collection of a heavy solid-oak sideboard and a two-part sofa between family addresses. Sending dimensions and doorway measurements with the initial enquiry made the quote discussion straightforward, and both items were positioned carefully inside the hallway.',
    dateDisplay: 'September 2026',
  },
  {
    id: 'rev-4',
    authorName: 'Callum Fraser',
    locationOrRoute: 'Martlesham IP5 to Colchester CO3',
    serviceType: 'Collection and Delivery',
    rating: 5,
    title: 'Direct communication from first enquiry to drop-off',
    comment:
      'Used MK Vane for a scheduled storage unit collection with an onward delivery across the county border. Having a clear point of contact by telephone and knowing exact handover instructions were noted ahead of time made the whole arrangement dependable.',
    dateDisplay: 'August 2026',
  },
];

