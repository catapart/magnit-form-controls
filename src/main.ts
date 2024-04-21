import './style.css'
import './components/item-list/editable-list.component.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <editable-list edit="true">
      <div>A</div>
      <div>B</div>
      <div>C</div>
      <div>D</div>
    </editable-list>
  </div>
`
