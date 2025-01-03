class FilterOption extends HTMLElement {
    connectedCallback() {
        const type = this.getAttribute('fieldtype') || 'text'
        const key = this.getAttribute('key')
        let content = `<input type="text" name="${key}" data-filter-key="${key}">`
        if (['checkbox', 'radio'].includes(type)) {
            // Checkbox or radio
            content = '<div class="bg-white">';
            const values = JSON.parse(this.getAttribute('values'))
            for (const value of values) {
                content += `<label>
<input type="${type}" name="${key}" value="${value}" data-filter-key="${key}" class="hidden" />
<span class="px-4 p-1 bg-white cursor-pointer" style="border: 1px solid black;">${value}</span>
</label>`;
            }
            content += `</div>`;
        }
        if (['select'].includes(type)) {
            // Select
            content = `<select name="${key}" data-filter-key="${key}">`;
            if (this.hasAttribute('noneValue')) {
                content += `<option value="">${this.getAttribute('noneValue')}</option>`
            }
            const values = JSON.parse(this.getAttribute('values'))
            for (const value of values) {
                content += `<option value="${value}">${value}</option>`;
            }
            content += `</select>`;
        }

        const fieldset = document.createElement('div')
        fieldset.className = 'flex flex-col lg:flex-row w-full mb-1'
        fieldset.innerHTML = `<legend>${this.getAttribute('title')}</legend>${content}`
        this.appendChild(fieldset)
    }
}
customElements.define('domfilters-option', FilterOption);
