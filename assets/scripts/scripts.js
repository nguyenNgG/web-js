class Application {
  static init() {
    const manip = new ManipulationInterface();
    const header = new Header();
    manip.createInterface();
    header.connectInterfaceRender(manip, manip.renderInterface.bind(manip));
  }
}

class DOMHelpers {
  static clearEventListener(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }
}

class Component {}

class Button extends Component {
  _btn;
  constructor(type, value) {
    super();
    this._btn = document.createElement('input');
    this._btn.setAttribute('type', type);
    this._btn.setAttribute('value', value);
  }
}

class Header extends Component {
  _btnAdd;

  constructor() {
    super();
    this._btnAdd = new Button('button', 'Add');
    document.querySelector('#header').append(this._btnAdd._btn);
  }

  connectInterfaceRender(manipInterface, manipInterfaceRenderFunction) {
    this._btnAdd._btn.addEventListener(
      'click',
      manipInterfaceRenderFunction.bind(manipInterface)
    );
  }
}

class ManipulationInterface extends Component {
  createInterface() {
    const container = document.querySelector('.manipCont');
    const btnSubmit = new Button('submit', 'Submit');
    const head = document.createElement('p');
    const ageSelector = document.querySelector('#txtEmpAge');
    const expSelector = document.querySelector('#txtEmpExp');
    for (let i = 18; i <= 60; i++) {
      const ageOption = document.createElement('option');
      ageOption.setAttribute('value', i);
      ageOption.textContent = i;
      ageSelector.append(ageOption);
    }
    for (let i = 0; i <= 2; i = i + 0.5) {
      const expOption = document.createElement('option');
      expOption.setAttribute('value', i);
      expOption.textContent = i;
      expSelector.append(expOption);
    }
    head.textContent = 'Add employee';
    head.classList.toggle('header');
    container.insertAdjacentElement('afterbegin', head);
    container.append(btnSubmit._btn);
    btnSubmit._btn.addEventListener('click', this.checkSubmit.bind(this));
  }

  renderInterface() {
    let backdrop = document.querySelector('.backdrop');
    backdrop = DOMHelpers.clearEventListener(backdrop);
    const container = document.querySelector('.manipCont');
    backdrop.classList.toggle('visible');
    container.classList.toggle('visible');
    backdrop.addEventListener('click', this.closeInterface.bind(this));
    const x = window.innerWidth / 2 - container.clientWidth / 2;
    const y = window.innerHeight / 2 - container.clientHeight / 2;
    container.style.position = 'absolute';
    container.style.left = x + 'px';
    container.style.top = y + 'px';
  }

  closeInterface() {
    const backdrop = document.querySelector('.backdrop');
    const container = document.querySelector('.manipCont');
    backdrop.classList.toggle('visible');
    container.classList.toggle('visible');
  }

  checkSubmit() {
    const container = document.querySelector('.manipCont');
    const userInputs = container.querySelectorAll('input');
    const userSelects = container.querySelectorAll('select');
    const regexList = [
      /^[a-zA-Z]+(\s?[a-zA-Z]+)*\s*$/,
      /^.*$/,
      /^[a-zA-Z0-9,]+(\s?[a-zA-Z0-9,]+)*\s*$/,
      /^.*$/,
      /[0-9]{10,12}/,
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      /^.*$/,
    ];
    const userSubmit = {
      empName: userInputs[0],
      empAge: userSelects[0].options[userSelects[0].selectedIndex],
      empAddr: userInputs[1],
      empExp: userSelects[1].options[userSelects[1].selectedIndex],
      empPhoneNum: userInputs[2],
      empEmail: userInputs[3],
    };
    let i = 0;
    for (const key in userSubmit) {
      if (Object.hasOwnProperty.call(userSubmit, key)) {
        this.checkError(userSubmit[key].value, regexList[i]);
        i++;
      }
    }
  }

  checkError(userInput, regex) {
    const errorCheck = userInput.match(regex) ? true : false;
    return errorCheck;
  }
}

class Table extends Component {}

class EmployeeManager {
  employeeList = [];
}

class Employee {
  _name;
  _age;
  _address;
  _experience;
  _phoneNum;
  _email;
  _empDate;
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get age() {
    return this._age;
  }
  set age(value) {
    this._age = value;
  }
  get address() {
    return this._address;
  }
  set address(value) {
    this._address = value;
  }
  get experience() {
    return this._experience;
  }
  set experience(value) {
    this._experience = value;
  }
  get phoneNum() {
    return this._phoneNum;
  }
  set phoneNum(value) {
    this._phoneNum = value;
  }
  get email() {
    return this._email;
  }
  set email(value) {
    this._email = value;
  }
  get empDate() {
    return this._empDate;
  }
  set empDate(value) {
    this._empDate = value;
  }
}

Application.init();
