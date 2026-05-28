/**
 * 🏋️ FitTrack - Validation Module
 * Input validation and sanitization
 */

class Validator {
    /**
     * Sanitize string input to prevent XSS
     */
    static sanitize(input) {
        if (typeof input !== 'string') return input;
        const element = document.createElement('div');
        element.textContent = input;
        return element.innerHTML;
    }

    /**
     * Validate email format
     */
    static isEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Validate phone number (Vietnam format)
     */
    static isPhoneVN(phone) {
        const regex = /^(0|\+84)(9|8|7|6)\d{8}$/;
        return regex.test(phone);
    }

    /**
     * Validate required fields
     */
    static required(fields) {
        const errors = [];
        for (const [key, value] of Object.entries(fields)) {
            if (!value || String(value).trim() === '') {
                errors.push(`${key} không được để trống`);
            }
        }
        return errors;
    }

    /**
     * Validate number range
     */
    static inRange(value, min, max) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    }

    /**
     * Validate positive number
     */
    static isPositive(value) {
        const num = parseFloat(value);
        return !isNaN(num) && num > 0;
    }

    /**
     * Validate date format
     */
    static isValidDate(dateStr) {
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date);
    }

    /**
     * Batch validate fields
     */
    static validate(schema) {
        const errors = {};
        for (const [field, rules] of Object.entries(schema)) {
            const value = rules.value;
            const validators = rules.validate || [];

            for (const validator of validators) {
                const error = validator(value);
                if (error) {
                    errors[field] = error;
                    break;
                }
            }
        }
        return Object.keys(errors).length === 0 ? { ok: true } : { ok: false, errors };
    }
}

export default Validator;
