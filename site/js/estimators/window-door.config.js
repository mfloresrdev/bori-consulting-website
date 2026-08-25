/**
 * Pricing-rules config for the Window & Door Estimator.
 * Adding a new trade (e.g. general estimator) means writing a sibling config
 * file like this one, not editing js/estimator-engine.js or estimator-ui.js.
 * Numbers are starter planning estimates, not confirmed vendor/material costs —
 * update them as real project data comes in.
 */
window.WINDOW_DOOR_ESTIMATOR_CONFIG = {
  id: 'window-door',
  label: 'Window & Door Estimator',
  uncertainty: 0.15,
  quantity: { min: 1, max: 30 },
  itemTypes: [
    { id: 'window', label: 'Window', basePrice: 450, removalFee: 50 },
    { id: 'door', label: 'Door', basePrice: 650, removalFee: 75 }
  ],
  materials: [
    { id: 'vinyl', label: 'Vinyl', multiplier: 1.0 },
    { id: 'fiberglass', label: 'Fiberglass', multiplier: 1.3 },
    { id: 'wood', label: 'Wood', multiplier: 1.6 }
  ],
  sizes: [
    { id: 'standard', label: 'Standard', multiplier: 1.0 },
    { id: 'large', label: 'Large / picture window', multiplier: 1.25 },
    { id: 'custom', label: 'Custom shape or size', multiplier: 1.5 }
  ]
};
