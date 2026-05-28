/**
 * 🏋️ FitTrack - DOM Helper Module
 * Lightweight DOM manipulation without jQuery
 */

class DOMHelper {
    /**
     * Select single element
     */
    static select(selector) {
        return document.querySelector(selector);
    }

    /**
     * Select multiple elements
     */
    static selectAll(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Get element by ID
     */
    static byId(id) {
        return document.getElementById(id);
    }

    /**
     * Create element
     */
    static create(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'class') {
                element.className = value;
            } else if (key === 'style') {
                Object.assign(element.style, value);
            } else {
                element.setAttribute(key, value);
            }
        });
        if (content) element.innerHTML = content;
        return element;
    }

    /**
     * Add class
     */
    static addClass(element, className) {
        if (element) element.classList.add(className);
        return this;
    }

    /**
     * Remove class
     */
    static removeClass(element, className) {
        if (element) element.classList.remove(className);
        return this;
    }

    /**
     * Toggle class
     */
    static toggleClass(element, className) {
        if (element) element.classList.toggle(className);
        return this;
    }

    /**
     * Has class
     */
    static hasClass(element, className) {
        return element && element.classList.contains(className);
    }

    /**
     * Set text content
     */
    static setText(element, text) {
        if (element) element.textContent = text;
        return this;
    }

    /**
     * Set HTML content
     */
    static setHTML(element, html) {
        if (element) element.innerHTML = html;
        return this;
    }

    /**
     * Set attribute
     */
    static setAttr(element, attr, value) {
        if (element) element.setAttribute(attr, value);
        return this;
    }

    /**
     * Get attribute
     */
    static getAttr(element, attr) {
        return element ? element.getAttribute(attr) : null;
    }

    /**
     * Set style
     */
    static setStyle(element, styles) {
        if (element) Object.assign(element.style, styles);
        return this;
    }

    /**
     * Show element
     */
    static show(element) {
        if (element) element.style.display = '';
        return this;
    }

    /**
     * Hide element
     */
    static hide(element) {
        if (element) element.style.display = 'none';
        return this;
    }

    /**
     * Toggle visibility
     */
    static toggle(element) {
        if (element) element.style.display = element.style.display === 'none' ? '' : 'none';
        return this;
    }

    /**
     * Add event listener
     */
    static on(element, event, handler) {
        if (element) element.addEventListener(event, handler);
        return this;
    }

    /**
     * Remove event listener
     */
    static off(element, event, handler) {
        if (element) element.removeEventListener(event, handler);
        return this;
    }

    /**
     * Delegate event
     */
    static delegate(parent, event, selector, handler) {
        if (parent) {
            parent.addEventListener(event, (e) => {
                if (e.target.matches(selector)) {
                    handler.call(e.target, e);
                }
            });
        }
        return this;
    }

    /**
     * Append element
     */
    static append(parent, child) {
        if (parent && child) parent.appendChild(child);
        return this;
    }

    /**
     * Prepend element
     */
    static prepend(parent, child) {
        if (parent && child) parent.insertBefore(child, parent.firstChild);
        return this;
    }

    /**
     * Remove element
     */
    static remove(element) {
        if (element) element.remove();
        return this;
    }

    /**
     * Clear children
     */
    static clear(element) {
        if (element) element.innerHTML = '';
        return this;
    }

    /**
     * Get form data as object
     */
    static getFormData(formSelector) {
        const form = this.select(formSelector);
        if (!form) return {};
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        return data;
    }

    /**
     * Set form data from object
     */
    static setFormData(formSelector, data) {
        const form = this.select(formSelector);
        if (!form) return;

        Object.entries(data).forEach(([key, value]) => {
            const field = form.elements[key];
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = value;
                } else {
                    field.value = value;
                }
            }
        });
        return this;
    }

    /**
     * Reset form
     */
    static resetForm(formSelector) {
        const form = this.select(formSelector);
        if (form) form.reset();
        return this;
    }

    /**
     * Get value from input
     */
    static getValue(selector) {
        const element = this.select(selector);
        return element ? element.value : '';
    }

    /**
     * Set value to input
     */
    static setValue(selector, value) {
        const element = this.select(selector);
        if (element) element.value = value;
        return this;
    }

    /**
     * Fade in element
     */
    static fadeIn(element, duration = 300) {
        if (!element) return this;
        element.style.opacity = '0';
        element.style.display = '';
        setTimeout(() => {
            element.style.transition = `opacity ${duration}ms`;
            element.style.opacity = '1';
        }, 10);
        return this;
    }

    /**
     * Fade out element
     */
    static fadeOut(element, duration = 300) {
        if (!element) return this;
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
        return this;
    }

    /**
     * Slide down element
     */
    static slideDown(element, duration = 300) {
        if (!element) return this;
        element.style.display = '';
        element.style.overflow = 'hidden';
        element.style.transition = `max-height ${duration}ms`;
        element.style.maxHeight = '0';
        setTimeout(() => {
            element.style.maxHeight = element.scrollHeight + 'px';
        }, 10);
        return this;
    }

    /**
     * Slide up element
     */
    static slideUp(element, duration = 300) {
        if (!element) return this;
        element.style.overflow = 'hidden';
        element.style.transition = `max-height ${duration}ms`;
        element.style.maxHeight = element.scrollHeight + 'px';
        setTimeout(() => {
            element.style.maxHeight = '0';
        }, 10);
        return this;
    }
}

export default DOMHelper;
