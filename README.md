# DOM Filters

## Features

* Supported fieldtypes
  * text (renders input[type=text])
  * checkbox
  * radio
  * select

## Example

```html
<domfilters-option
        title="Name" 
        key="textExample" 
        fieldtype="text"
>
</domfilters-option>

<domfilters-option
        title="Type" 
        key="checkboxExample"
        fieldtype="checkbox" 
        values="['Option A', 'Option B', 'Option C']"
></domfilters-option>

<domfilters-option
        title="Type Radio" 
        key="radioExample"
        fieldtype="radio" 
        values="['Radio A', 'Radio B', 'Radio C']"
></domfilters-option>

<domfilters-option
        title="Select" 
        key="selectExample"
        fieldtype="select" 
        values="['Select A', 'Select B', 'Select C']"
></domfilters-option>
```

## Customization

You can customize the HTML rendering by using `<template>` tags with an ID.

| ID                           | Effect                            |
|------------------------------|-----------------------------------|
| domfilters-template-text     | Rendering of text type filter     |
| domfilters-template-select   | Rendering of select type filter   |
| domfilters-template-radio    | Rendering of radio type filter    |
| domfilters-template-checkbox | Rendering of checkbox type filter |

Inside those templates you are free to define any structure you need.
If you need to access data, you can do so by adding the following data attributes to a HTML element:

| Data Attribute     | Description                                                                                                                              | Example                                                                                                                                                                                              |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| data-set-data-text | Grab attribute from filter element and set it as innerText                                                                               | `<span data-set-data-text="title"></span>` -> `<span>Name</span>`                                                                                                                                    |
| data-target-field  | The inner content (select, checkboxes etc) will be appended inside this element. Set value to "replace" in order to replace it instead.  | `<span data-target-field></span>` -> `<span><input type="text" name="textExample" /></span>`<br/>`<span data-target-field="replace"></span>` -> `<input type="text" name="textExample" />`           |

### Radio & Checkbox

Inside radio and checkbox the are additional data attributes available:

* `data-setup-input` – Sets all required attributes to input field (Example: `<input data-setup-input class="hidden" />`)
* `data-set-text-value` - Set current value as innerText (Example: `<span data-set-text-value></span>`)

### Examples

```html

<template id="domfilters-template-select">
    <div class="flex flex-col lg:flex-row w-full mb-1">
        <legend data-set-data-text="title"></legend>
        <div data-target-field data-target-field-mode="replace"></div>
    </div>
</template>
<template id="domfilters-template-text">
    <div class="flex flex-col lg:flex-row w-full mb-1">
        <legend data-set-data-text="title"></legend>
        <div data-target-field data-target-field-mode="replace"></div>
    </div>
</template>
<template id="domfilters-template-checkbox">
    <div class="flex flex-col lg:flex-row w-full mb-1">
        <legend data-set-data-text="title"></legend>
        <div class="bg-white">
            <!-- Define an inner template with "data-target-field" attribute inside to style checkbox/radio items -->
            <template data-target-field>
                <label>
                    <input data-set-attr-type data-set-attr-name data-set-attr-value class="hidden" />
                    <span class="px-4 p-1 bg-white cursor-pointer" style="border: 1px solid black;" data-set-text-value></span>
                </label>
            </template>
        </div>
    </div>
</template>

```