// Utility to convert old zone-based templates to Fabric.js format

/**
 * Convert old template format (zones) to Fabric.js objects
 * @param {Object} oldTemplate - Template with zones array
 * @returns {Object} - Fabric.js compatible template
 */
export const migrateTemplate = (oldTemplate) => {
  const objects = oldTemplate.zones?.map((zone, index) => ({
    type: 'text',
    id: zone.id || `text-${index}`,
    text: zone.text,
    left: zone.x,
    top: zone.y,
    originX: 'center',
    originY: 'center',
    fontFamily: zone.fontFamily || 'Poppins',
    fontSize: zone.fontSize || 24,
    fontWeight: zone.fontWeight || 'normal',
    fill: zone.color || '#000000',
    textAlign: zone.textAlign || 'center',
    letterSpacing: zone.letterSpacing || 0,
    backgroundColor: zone.backgroundColor,
    padding: zone.padding ? parseInt(zone.padding) : 0,
    borderRadius: zone.borderRadius ? parseInt(zone.borderRadius) : 0,
    shadow: zone.dropShadow ? {
      color: 'rgba(0,0,0,0.5)',
      blur: 10,
      offsetX: 2,
      offsetY: 2,
    } : null,
  })) || [];

  return {
    templateId: oldTemplate.id,
    name: oldTemplate.name,
    category: oldTemplate.category,
    subcategory: oldTemplate.category, // Use category as subcategory
    canvas: {
      width: oldTemplate.width || 400,
      height: oldTemplate.height || 500,
      backgroundColor: oldTemplate.backgroundColor || oldTemplate.backgroundStyle?.replace('linear-gradient', '').split(' ')[0] || '#1e3a8a',
    },
    objects,
  };
};

/**
 * Convert old templates array to Fabric.js format
 * @param {Array} oldTemplates - Array of old format templates
 * @returns {Array} - Array of Fabric.js compatible templates
 */
export const migrateTemplates = (oldTemplates) => {
  return oldTemplates.map(migrateTemplate);
};

/**
 * Check if template is in Fabric.js format
 * @param {Object} template - Template to check
 * @returns {boolean} - True if Fabric.js format
 */
export const isFabricTemplate = (template) => {
  return template && template.objects && Array.isArray(template.objects);
};

/**
 * Get template in Fabric.js format, converting if necessary
 * @param {Object} template - Template (any format)
 * @returns {Object} - Template in Fabric.js format
 */
export const ensureFabricTemplate = (template) => {
  if (isFabricTemplate(template)) {
    return template;
  }
  return migrateTemplate(template);
};

/**
 * Map old categories to new categories
 */
export const categoryMapping = {
  'Birthday': ['Birthday'],
  'Business': ['Business', 'Resume', 'Presentation'],
  'Sale': ['Sale', 'Marketing'],
  'Wedding': ['Wedding', 'Invitations'],
  'Festivals': ['Festivals', 'Diwali', 'Holi', 'Christmas', 'New Year'],
  'Diwali': ['Diwali'],
  'Holi': ['Holi'],
  'Ganesh Chaturthi': ['Ganesh Chaturthi'],
  'Kitty Party': ['Kitty Party'],
  'Cricket': ['Cricket'],
  'Independence Day': ['Independence Day'],
  'Haldi': ['Haldi'],
  'Sangeet': ['Sangeet'],
  'Annaprashan': ['Annaprashan'],
  'Half Saree': ['Half Saree'],
  'Eid': ['Eid'],
  'Christmas': ['Christmas'],
  'New Year': ['New Year'],
};

/**
 * Map category to new format
 */
export const normalizeCategory = (category) => {
  const mapping = {
    'Birthday': 'Personal',
    'Business': 'Business',
    'Sale': 'Marketing',
    'Wedding': 'Personal',
    'Festivals': 'Personal',
    'Diwali': 'Festivals',
    'Holi': 'Festivals',
    'Ganesh Chaturthi': 'Festivals',
    'Kitty Party': 'Personal',
    'Cricket': 'Social Media',
    'Independence Day': 'Social Media',
    'Haldi': 'Personal',
    'Sangeet': 'Personal',
    'Annaprashan': 'Personal',
    'Half Saree': 'Personal',
    'Eid': 'Festivals',
    'Christmas': 'Festivals',
    'New Year': 'Festivals',
  };
  return mapping[category] || 'Business';
};

/**
 * Map subcategory to new format
 */
export const normalizeSubcategory = (category) => {
  const mapping = {
    'Birthday': 'Birthday Card',
    'Business': 'Flyer',
    'Sale': 'Social Media',
    'Wedding': 'Invitation',
    'Festivals': 'Greeting Card',
    'Diwali': 'Greeting Card',
    'Holi': 'Greeting Card',
    'Ganesh Chaturthi': 'Greeting Card',
    'Kitty Party': 'Invitation',
    'Cricket': 'Social Media',
    'Independence Day': 'Social Media',
    'Haldi': 'Invitation',
    'Sangeet': 'Invitation',
    'Annaprashan': 'Invitation',
    'Half Saree': 'Invitation',
    'Eid': 'Greeting Card',
    'Christmas': 'Greeting Card',
    'New Year': 'Greeting Card',
  };
  return mapping[category] || 'Flyer';
};