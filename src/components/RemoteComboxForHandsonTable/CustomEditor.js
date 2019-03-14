import Handsontable from 'handsontable'
class CustomEditor extends Handsontable.editors.TextEditor {
  constructor(props) {
    super(props);
  }

  createElements() {
    super.createElements();

    this.TEXTAREA = document.createElement('input');
    this.TEXTAREA.setAttribute('placeholder', 'Custom placeholder');
    this.TEXTAREA.className = 'handsontableInput';
    // this.textareaStyle = this.TEXTAREA.style;
    this.TEXTAREA.style.background = 'yellow';
    Handsontable.dom.empty(this.TEXTAREA_PARENT);
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
  }
}