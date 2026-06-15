export const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Brazzaville)","Congo (Kinshasa)","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
]

export const HIGH_TARIFF_COUNTRIES = [
  "Australia","Canada","Germany","United Kingdom","France","Japan",
  "United Arab Emirates","Singapore","Switzerland","Norway","Sweden",
  "Denmark","Netherlands","New Zealand"
]

export const WALLETS = {
  BTC: {
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    name: 'Bitcoin',
    network: 'Bitcoin Network',
    rate: 0.0000148,
    decimals: 6,
    color: '#F7931A',
    bg: '#FEF3E2'
  },
  ETH: {
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    name: 'Ethereum',
    network: 'ERC-20 Network',
    rate: 0.000316,
    decimals: 5,
    color: '#627EEA',
    bg: '#EEF0FD'
  },
  USDT: {
    address: 'TN3W4H6rK2ce4vX9YnFQHwKx7ghp8vDT8X',
    name: 'Tether',
    network: 'TRC-20 / ERC-20',
    rate: 1.0,
    decimals: 2,
    color: '#26A17B',
    bg: '#E8F8F4'
  },
  USDC: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    name: 'USD Coin',
    network: 'ERC-20 Network',
    rate: 1.0,
    decimals: 2,
    color: '#2775CA',
    bg: '#EBF3FC'
  }
}

export const SERVICE_TIERS = {
  express: { label: 'Express Overnight', basePrice: 49.99, days: 1 },
  standard: { label: '2-Day Standard', basePrice: 29.99, days: 2 },
  international: { label: 'International Priority', basePrice: 79.99, days: 3 },
  economy: { label: 'Economy Ground', basePrice: 14.99, days: 5 },
  freight: { label: 'Freight / Oversized', basePrice: 149.99, days: 7 },
  vault: { label: 'Vault Secure', basePrice: 199.99, days: 2 },
}

export const TYPE_MULTIPLIERS = {
  physical: 1,
  digital: 3,
  money: 5,
  consignment: 2,
}

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  exception: 'Exception',
  held: 'On Hold',
  returned: 'Returned',
}

export const VIP_PRICE = 500
export const VIP_DURATION_MONTHS = 12
