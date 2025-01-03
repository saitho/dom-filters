
/**
 * This callback is displayed as part of the Requester class.
 * @callback evaluateAttribute-callback
 * @param {string} attrName
 * @param {string} attrValue
 * @param {HTMLElement} e
 * @return {void}
 */

/**
 *
 * @param {HTMLElement} context
 * @param {string} attributeName
 * @param {evaluateAttribute-callback} callback
 */
function evaluateAttribute(context, attributeName, callback) {
    context.querySelectorAll('[data-' + attributeName + ']').forEach((e) => {
        callback(attributeName, e.getAttribute('data-' +attributeName), e)
        e.removeAttribute('data-' +attributeName)
    })
}

function trimHtml(text) {
    const el = document.createElement('div')
    el.innerHTML = text
    return el.innerText
}

class FilterOption extends HTMLElement {
    connectedCallback() {
        const type = this.getAttribute('fieldtype') || 'text'
        const key = this.getAttribute('key')
        const labelRendering = this.getAttribute('label-rendering') || ''

        const optionTemplate = document.querySelector('template#domfilters-template-' + type)

        let contentNode, targetField;
        if (optionTemplate) {
            contentNode = optionTemplate.content.cloneNode(true)
            targetField = contentNode.querySelector('[data-target-field]')
            if (!targetField) {
                throw new Error('Missing target field. Please add a "data-target-field" attribute to your template.')
            }
        } else {
            contentNode = document.createElement('div')
            contentNode.className = 'flex flex-col lg:flex-row w-full mb-1'
            const legend = document.createElement('legend')
            legend.innerHTML = this.getAttribute('title')
            contentNode.appendChild(legend)
            targetField = contentNode
        }
        evaluateAttribute(contentNode, 'set-data-text', (k, v, e) => {
            e.innerText = this.getAttribute(v)
        })
        evaluateAttribute(contentNode, 'set-data-title', (k, v, e) => {
            e.title = this.getAttribute(v)
        })
        evaluateAttribute(contentNode, 'set-data-aria-label', (k, v, e) => {
            e.ariaLabel = this.getAttribute(v)
        })

        let contentElement
        if (['checkbox', 'radio'].includes(type)) {
            // Checkbox or radio
            contentElement = document.createElement('div')
            const values = JSON.parse(this.getAttribute('values'))
            const isArray = Array.isArray(values)
            for (const optionKey in values) {
                const value = isArray ? values[optionKey] : optionKey
                let userLabel = values[optionKey]
                if (labelRendering.length) {
                    userLabel = labelRendering
                        .replaceAll('%key%', value)
                        .replaceAll('%key_upper%', value.toUpperCase())
                        .replaceAll('%key_lower%', value.toLowerCase())
                        .replaceAll('%label%', userLabel)
                }

                let innerContent
                if (targetField.tagName === 'TEMPLATE') {
                    // target field is template -> clone it and base content off it
                    innerContent = targetField.content.cloneNode(true)
                    targetField.setAttribute('data-target-field', 'replace')
                    evaluateAttribute(innerContent, 'setup-input', (k, v, e) => {
                        e.setAttribute('type', type)
                        e.setAttribute('name', key)
                        e.setAttribute('data-filter-key', key)
                        e.setAttribute('value', value)
                    })
                    evaluateAttribute(innerContent, 'set-text-value', (k, v, e) => {
                        e.innerHTML = userLabel
                    })
                } else {
                    innerContent = document.createElement('label')
                    innerContent.title = trimHtml(userLabel)
                    innerContent.innerHTML = `<input type="${type}" name="${key}" value="${value}" data-filter-key="${key}" /><span>${userLabel}</span>`
                }
                contentElement.appendChild(innerContent)
            }
        } else if (['select'].includes(type)) {
            // Select
            /** @var {HTMLSelectElement} selectNode */
            contentElement = document.createElement('select')
            contentElement.setAttribute('name', key)
            contentElement.setAttribute('data-filter-key', key)

            if (this.hasAttribute('noneValue')) {
                /** @var {HTMLOptionElement} option */
                let option = document.createElement('option')
                option.value = ''
                option.innerText = this.getAttribute('noneValue')
                if (labelRendering.length) {
                    option.innerText = labelRendering.replaceAll('%label%', option.innerText)
                }
                contentElement.add(option)
            }
            const values = JSON.parse(this.getAttribute('values'))
            for (const value of values) {
                /** @var {HTMLOptionElement} option */
                let option = document.createElement('option')
                option.value = value
                option.innerText = value
                if (labelRendering.length) {
                    option.innerText = labelRendering.replaceAll('%label%', option.innerText)
                }
                contentElement.add(option)
            }
        } else {
            contentElement = document.createElement('input')
            contentElement.type = 'text'
            contentElement.name = key
            contentElement.setAttribute('data-filter-key', key)
        }

        this.appendChild(contentNode)
        if ((targetField.getAttribute('data-target-field') || 'append') === 'replace') {
            if (targetField.classList.length) {
                contentElement.classList.add(...targetField.classList)
            }
            targetField.parentElement.replaceChild(contentElement, targetField)
        } else {
            targetField.appendChild(contentElement)
        }
    }
}
customElements.define('domfilters-option', FilterOption);
