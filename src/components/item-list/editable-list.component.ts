import style from './editable-list.component.css?raw';
import html from './editable-list.component.html?raw';

export type EditableListProperties = 
{
    remove?: boolean,
    edit?: boolean,
    onAdd?: (event?: Event) => void|Promise<void>,
    onRemove?: (event?: Event) => void|Promise<void>,
    onEdit?: (event?: Event) => void|Promise<void>,
};


const componentTemplate = `<style>${style}</style>${html}`;

const COMPONENT_TAG_NAME = 'editable-list';
export class EditableListComponent extends HTMLElement
{
    static observedAttributes = [
        'remove',
        'edit',
    ];

    itemsSlot: HTMLSlotElement;

    canRemove: boolean = true;
    canEdit: boolean = false;

    componentAccessories: Map<string, HTMLElement> = new Map();

    hasButtonsWithoutHandlers: boolean = false;

    buttonReferences: HTMLButtonElement[] = [];

    #boundEventHandlers: Map<string, (event?:Event) => void> = new Map([
        ['add', this.addButton_onClick.bind(this)]
    ]);

    componentParts: Map<string, HTMLElement> = new Map();
    getPart<T extends HTMLElement = HTMLElement>(key: string)
    {
        if(this.componentParts.get(key) == null)
        {
            const part = this.shadowRoot!.querySelector(`[part="${key}"]`) as HTMLElement;
            if(part != null) { this.componentParts.set(key, part); }
        }

        return this.componentParts.get(key) as T;
    }
    findPart<T extends HTMLElement = HTMLElement>(key: string) { return this.shadowRoot!.querySelector(`[part="${key}"]`) as T; }

    constructor()
    {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = componentTemplate;

        this.componentAccessories.set('items', this.shadowRoot!.querySelector('[part="items"]')!);

        this.shadowRoot!.querySelector('[part="add-button"]')?.addEventListener('click', this.#boundEventHandlers.get('add')!);

        this.itemsSlot = this.shadowRoot!.querySelector('slot:not([name])')! as HTMLSlotElement;
        this.itemsSlot.addEventListener('slotchange', () =>
        {
            this.updateItemButtons();
        })
        
    }
    static create(props: EditableListProperties)
    {
        const element = document.createElement(COMPONENT_TAG_NAME) as EditableListComponent;
        for(const [key, value] of Object.entries(props))
        {
            if(key == 'remove' && value == false)
            {
                element.setAttribute(key, "false");
            }
            else if(key == 'edit' && value == true)
            {
                element.setAttribute(key, "true");
            }
            else if(key.startsWith('on'))
            {
                const eventName = key.substring(2).toLowerCase();
                element.addEventListener(eventName, value as any);
            }
        }
        return element;
    }

    addButton_onClick()
    {
        this.dispatchEvent(new CustomEvent('add'));
    }

    getAccessory<T extends HTMLElement>(key: string)
    {
        return this.componentAccessories.get(key) as T;
    }

    updateItemButtons()
    {
        const children = this.itemsSlot.assignedElements();
        for(let i = 0; i < children.length; i++)
        {
            const target = children[i];
            if(target.tagName.toLowerCase() == 'slot')
            {
                children.push(...(target as HTMLSlotElement).assignedElements());
                continue;
            }

            const item = children[i];

            const existingEditButton = children[i].querySelector('button[part="edit"]');
            if(this.canEdit)
            {
                if(existingEditButton == null)
                {
                    const editButton = document.createElement('button');
                    editButton.type = 'button';
                    editButton.setAttribute('part', 'edit');
                    const template = this.querySelector('template[part="edit-button"]') as HTMLTemplateElement;
                    if(template != null)
                    {
                        editButton.append(template.content.cloneNode(true));
                    }
                    else
                    {
                        editButton.textContent = '…';
                    }
                    editButton.addEventListener('click', () => { this.dispatchEvent(new CustomEvent('edit', { detail: item })); });
                    item.appendChild(editButton);
                }
                else if(this.hasButtonsWithoutHandlers)
                {
                    existingEditButton.addEventListener('click', () => { this.dispatchEvent(new CustomEvent('edit', { detail: item })); });
                }
            }
            else if(existingEditButton != null)
            {
                existingEditButton.remove();
            }

            const existingRemoveButton = children[i].querySelector('button[part="remove"]');
            if(this.canRemove)
            {
                if(existingRemoveButton == null)
                {
                    const removeButton = document.createElement('button');
                    removeButton.type = 'button';
                    removeButton.setAttribute('part', 'remove');
                    const template = this.querySelector('template[part="remove-button"]') as HTMLTemplateElement;
                    if(template != null)
                    {
                        removeButton.append(template.content.cloneNode(true));
                    }
                    else
                    {
                        removeButton.textContent = '×';
                    }
                    removeButton.addEventListener('click', () => { item.remove(); this.dispatchEvent(new CustomEvent('remove', { detail: item })); });
                    item.appendChild(removeButton);
                }
                else if(this.hasButtonsWithoutHandlers)
                {
                    existingRemoveButton.addEventListener('click', () => { item.remove(); this.dispatchEvent(new CustomEvent('remove', { detail: item })); });
                }
            }
            else if(existingRemoveButton != null)
            {
                existingRemoveButton.remove();
            }
        }

    }

    attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string) 
    {
        if(attributeName == "remove")
        {
            if(newValue == null || newValue.trim() == "true")
            {
                this.canRemove = true;
            }
            else
            {
                this.canRemove = false;
            }
            this.updateItemButtons();
        }
        else if(attributeName == "edit")
        {
            if(newValue == null || newValue.trim() != "true")
            {
                this.canEdit = false;
            }
            else
            {
                this.canEdit = true;
            }
            this.updateItemButtons();
        }
    }

    

}

if(!customElements.get(COMPONENT_TAG_NAME) != null)
{
    customElements.define(COMPONENT_TAG_NAME, EditableListComponent);
}