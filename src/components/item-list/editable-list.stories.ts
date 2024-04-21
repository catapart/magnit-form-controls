import type { Meta, StoryObj } from '@storybook/web-components';
import { fn } from '@storybook/test';
import { EditableListComponent, EditableListProperties } from './editable-list.component';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Editable List',
  tags: ['autodocs'],
  argTypes: {
    remove: { defaultValue: true },
    edit: { defaultValue: false }
  },
  args: { 
    onAdd: fn(),
    onRemove: fn(),
    onEdit: fn()
 },
} satisfies Meta<EditableListProperties>;

export default meta;
type Story = StoryObj<EditableListProperties>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Styled: Story = {
  args:
  {
    edit: false,
    remove: true,
  },
  render: (args) => 
  {
    const component = EditableListComponent.create(args);
    component.innerHTML = `
    <li><span class="label">A</span></li>
    <li><span class="label">B</span></li>
    <li><span class="label">C</span></li>
    <li><span class="label">D</span></li>
`;
    const style = document.createElement('style');
    style.innerHTML = `
    editable-list
    {
      width: 500px;
    }
    editable-list::part(items)
    {
      margin-bottom: 10px;
    }
    editable-list::part(add-button)
    {
      display: block;
      margin-left: auto;
    }
    li
    {
      display: flex;
      align-items: center;
      gap: 5px;
      margin: 5px 0;
    }
    li span
    {
      flex: 1;
    }
`
    const fragment = document.createDocumentFragment();
    fragment.append(style, component);
    return fragment;
  },
};
export const ListItems: Story = {
  args:
  {
    edit: false,
    remove: true,
  },
  render: (args) => 
  {
    const component = EditableListComponent.create(args);
    component.innerHTML = `
    <li>A</li>
    <li>B</li>
    <li>C</li>
    <li>D</li>
`
    return component;
  },
};
export const Divs: Story = {
  args:
  {
    edit: false,
    remove: true,
  },
  render: (args) => 
  {
    const component = EditableListComponent.create(args);
    component.innerHTML = `
    <div>A</div>
    <div>B</div>
    <div>C</div>
    <div>D</div>
`
    return component;
  },
};

// export const Secondary: Story = {
//   args: {
//     label: 'Button',
//   },
// };

// export const Large: Story = {
//   args: {
//     size: 'large',
//     label: 'Button',
//   },
// };

// export const Small: Story = {
//   args: {
//     size: 'small',
//     label: 'Button',
//   },
// };
