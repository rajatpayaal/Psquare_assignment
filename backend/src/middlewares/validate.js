const isEmail = (value) => /.+@.+\..+/.test(String(value || '').toLowerCase());

const validators = {
    required: (v) => v !== undefined && v !== null && String(v).trim() !== '',
    string: (v) => typeof v === 'string',
    number: (v) => typeof v === 'number' && !isNaN(v),
    boolean: (v) => typeof v === 'boolean',
    email: (v) => isEmail(v),
    date: (v) => !isNaN(Date.parse(v)),
    enum: (allowed) => (v) => allowed.includes(v),
    min: (minVal) => (v) => typeof v === 'number' && v >= minVal,
};

const runRules = (value, rules) => {
    for (const rule of rules) {
        if (typeof rule === 'string') {
            if (rule === 'required' && !validators.required(value)) return 'required';
            if (rule === 'string' && value !== undefined && !validators.string(value)) return 'string';
            if (rule === 'number' && value !== undefined && !validators.number(value)) return 'number';
            if (rule === 'boolean' && value !== undefined && !validators.boolean(value)) return 'boolean';
            if (rule === 'email' && value !== undefined && !validators.email(value)) return 'email';
            if (rule === 'date' && value !== undefined && !validators.date(value)) return 'date';
        } else if (typeof rule === 'object') {
            if (rule.enum && value !== undefined && !validators.enum(rule.enum)(value)) return `enum:${rule.enum.join(',')}`;
            if (rule.min !== undefined && value !== undefined && !validators.min(rule.min)(value)) return `min:${rule.min}`;
        }
    }
    return null;
};

// schema: { fieldName: { in: 'body'|'query'|'params', rules: [ 'required', 'email', { enum: [...] }, { min: 1 } ] } }
const validate = (schema) => (req, res, next) => {
    const errors = [];
    Object.entries(schema).forEach(([field, config]) => {
        const location = config.in || 'body';
        const value = req[location][field];
        const err = runRules(value, config.rules || []);
        if (err) errors.push({ field, location, error: err });
    });
    if (errors.length) return res.status(400).json({ success: false, message: 'Validation failed', errors });
    return next();
};

module.exports = { validate };